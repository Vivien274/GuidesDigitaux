import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyDownloadToken } from '@/lib/downloadSecurity';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const productId = searchParams.get('productId');

    let targetFilePath: string | null = null;
    let customFilename: string = 'guide-digital.pdf';

    // 1. Check encrypted token authentication
    if (token) {
      const payload = verifyDownloadToken(token);
      if (!payload) {
        return new NextResponse('Lien de téléchargement non valide ou expiré.', { 
          status: 403,
          headers: { 'X-Robots-Tag': 'noindex, nofollow' }
        });
      }
      targetFilePath = payload.filePath;
      if (payload.productId) {
        customFilename = `${payload.productId}.pdf`;
      }
    }

    // 2. Check authenticated user session + Supabase user_access if no token or product-based
    if (!targetFilePath && productId) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: 'Connexion requise pour télécharger ce fichier' }, { status: 401 });
      }

      const { data: access, error: accessError } = await supabase
        .from('user_access')
        .select('id, available_from, products(storage_file_path, title)')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (accessError || !access) {
        return NextResponse.json({ error: 'Vous ne possédez pas ce produit' }, { status: 403 });
      }

      if (access.available_from && new Date(access.available_from) > new Date()) {
        const releaseDate = new Date(access.available_from).toLocaleDateString('fr-FR');
        return NextResponse.json(
          { error: `Produit en précommande. Disponible à partir du ${releaseDate}` },
          { status: 403 }
        );
      }

      const dbPath = (access.products as any)?.storage_file_path;
      if (dbPath) {
        targetFilePath = dbPath;
      }
      if ((access.products as any)?.title) {
        customFilename = `${(access.products as any).title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
      }
    }

    if (!targetFilePath) {
      return new NextResponse('Lien ou produit manquant', { status: 400 });
    }

    // 3. Resolve target file & stream response securely

    // Handle Supabase Storage path
    if (targetFilePath.startsWith('http://') || targetFilePath.startsWith('https://')) {
      const externalRes = await fetch(targetFilePath);
      if (!externalRes.ok) {
        return new NextResponse('Fichier introuvable', { status: 404 });
      }
      const buffer = await externalRes.arrayBuffer();
      const fileNameFromUrl = path.basename(new URL(targetFilePath).pathname) || customFilename;

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(fileNameFromUrl)}"`,
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    // Handle local file in public directory (e.g. /downloads/xxx.pdf)
    let cleanRelativePath = targetFilePath.startsWith('/') ? targetFilePath : `/${targetFilePath}`;
    let localFilePath = path.join(process.cwd(), 'public', cleanRelativePath);

    if (!fs.existsSync(localFilePath)) {
      // Smart fuzzy matching in public/downloads
      const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
      if (fs.existsSync(downloadsDir)) {
        const files = fs.readdirSync(downloadsDir);
        const searchBase = path.basename(cleanRelativePath, '.pdf').toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const matchedFile = files.find(f => {
          const cleanF = f.toLowerCase().replace(/[^a-z0-9]/g, '');
          return cleanF.includes(searchBase) || (searchBase.length > 5 && cleanF.replace(/^[0-9]+/, '').includes(searchBase));
        });

        if (matchedFile) {
          localFilePath = path.join(downloadsDir, matchedFile);
        }
      }
    }

    if (!fs.existsSync(localFilePath)) {
      // Fallback: try default fallback PDF if file path doesn't exist on disk
      const fallbackPath = path.join(process.cwd(), 'public', 'downloads', 'mini-guide-ecrire-web-artisan.pdf');
      if (fs.existsSync(fallbackPath)) {
        const fileBuffer = fs.readFileSync(fallbackPath);
        const fileName = path.basename(cleanRelativePath) || customFilename;
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
            'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
            'Cache-Control': 'private, no-cache, no-store, must-revalidate'
          }
        });
      }
      return new NextResponse('Fichier PDF introuvable', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(localFilePath);
    const fileName = path.basename(localFilePath) || customFilename;

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (err: any) {
    console.error('Erreur de téléchargement sécurisé:', err);
    return new NextResponse('Erreur serveur lors du téléchargement', { status: 500 });
  }
}
