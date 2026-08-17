import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const sanitizedFilename = `${Date.now()}-${file.name
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9.-]+/g, '-')}`;

    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const targetSubdir = isPdf ? 'downloads' : 'images/uploads';

    const uploadDir = path.join(process.cwd(), 'public', targetSubdir);
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, sanitizedFilename);
    await writeFile(filePath, buffer);

    const publicUrl = `/${targetSubdir}/${sanitizedFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: sanitizedFilename,
      message: 'Fichier téléversé avec succès'
    });

  } catch (err: any) {
    console.error('[Upload Media API Error]', err);
    return NextResponse.json({ error: err.message || 'Erreur lors du téléversement' }, { status: 500 });
  }
}
