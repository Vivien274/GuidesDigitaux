import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAdminSession } from '@/lib/routeAuth';

export async function POST(request: Request) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Seuls les fichiers .pdf sont autorisés' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'Le fichier dépasse la limite de 20 Mo.' }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const sanitizedFilename = file.name
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9.-]+/g, '-');

    const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
    
    // Ensure directory exists
    await mkdir(downloadsDir, { recursive: true });

    const filePath = path.join(downloadsDir, sanitizedFilename);
    await writeFile(filePath, buffer);

    const publicUrl = `/downloads/${sanitizedFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: sanitizedFilename,
      message: 'Fichier PDF téléversé avec succès'
    });

  } catch (err: any) {
    console.error('[Upload PDF API Error]', err);
    return NextResponse.json({ error: err.message || 'Erreur lors du téléversement' }, { status: 500 });
  }
}
