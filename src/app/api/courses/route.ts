import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select(`
        id,
        title,
        description,
        price,
        status,
        duration,
        level,
        prerequisites,
        congratulations_msg,
        bonus_doc_title,
        bonus_doc_url,
        community_link,
        modules (
          id,
          course_id,
          title,
          order_index,
          lessons (
            id,
            module_id,
            title,
            video_url,
            notes,
            pdf_url,
            external_link,
            duration,
            order_index
          )
        )
      `);

    if (error) {
      console.error('Error fetching courses from Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Sort modules and lessons by order_index
    const formattedCourses = (courses || []).map((c: any) => {
      const isGoogle = c.id.includes('17873181') || (c.title && c.title.toLowerCase().includes('google'));
      const isWc = c.id.includes('22222222') || (c.title && c.title.toLowerCase().includes('woocommerce'));
      const slug = isGoogle ? 'formation-fiche-google' : (isWc ? 'formation-woocommerce' : 'creer-sa-vitrine-wordpress');

      const sortedModules = (c.modules || [])
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
        .map((m: any) => ({
          id: m.id,
          title: m.title,
          order_index: m.order_index,
          lessons: (m.lessons || [])
            .sort((la: any, lb: any) => (la.order_index || 0) - (lb.order_index || 0))
            .map((les: any) => ({
              id: les.id,
              title: les.title,
              videoUrl: les.video_url || '',
              notes: les.notes || '',
              pdfUrl: les.pdf_url || '',
              externalLink: les.external_link || '',
              duration: les.duration || '10:00',
              order_index: les.order_index,
            })),
        }));

      return {
        id: c.id,
        slug,
        title: c.title,
        description: c.description || '',
        price: c.price || 0,
        status: c.status || 'Publié',
        duration: c.duration || '',
        level: c.level || 'Tous niveaux',
        prerequisites: c.prerequisites || '',
        congratulationsMsg: c.congratulations_msg || '',
        bonusDocTitle: c.bonus_doc_title || '',
        bonusDocUrl: c.bonus_doc_url || '',
        communityLink: c.community_link || '',
        category: 'Formation Vidéo',
        image: isGoogle
          ? '/images/products/formation-fiche-google-mockup.png'
          : '/images/products/coaching-site.webp',
        modules: sortedModules,
      };
    });

    return NextResponse.json({ success: true, courses: formattedCourses });
  } catch (err: any) {
    console.error('Failed to load courses from Supabase:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur.' }, { status: 500 });
  }
}
