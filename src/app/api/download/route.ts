import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Identifiant produit manquant' }, { status: 400 });
    }

    // 1. Vérification session utilisateur
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Connexion requise pour télécharger ce fichier' }, { status: 401 });
    }

    // 2. Vérification du droit d'accès utilisateur dans la BDD
    const { data: access, error: accessError } = await supabase
      .from('user_access')
      .select('id, available_from, products(storage_file_path)')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (accessError || !access) {
      return NextResponse.json({ error: 'Vous ne possédez pas ce produit' }, { status: 403 });
    }

    // Contrôle précommande (V2)
    if (new Date(access.available_from) > new Date()) {
      const releaseDate = new Date(access.available_from).toLocaleDateString('fr-FR');
      return NextResponse.json(
        { error: `Produit en précommande. Disponible à partir du ${releaseDate}` },
        { status: 403 }
      );
    }

    const filePath = (access.products as any)?.storage_file_path;
    if (!filePath) {
      return NextResponse.json({ error: 'Aucun fichier associé à ce produit' }, { status: 404 });
    }

    // 3. Génération d'une URL signée temporaire (durée: 60 sec)
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
      .storage
      .from('guides-private')
      .createSignedUrl(filePath, 60, { download: true });

    if (signedUrlError || !signedUrlData) {
      console.error('Erreur Supabase Storage SignedUrl:', signedUrlError);
      return NextResponse.json({ error: 'Impossible d’accéder au fichier' }, { status: 500 });
    }

    // 4. Redirection vers l'URL signée de téléchargement sécurisé
    return NextResponse.redirect(signedUrlData.signedUrl);
  } catch (err: any) {
    console.error('Erreur Téléchargement:', err);
    return NextResponse.json({ error: 'Erreur interne serveur' }, { status: 500 });
  }
}
