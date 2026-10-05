import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/routeAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Course } from '@/lib/coursesStore';

function toUuid(id: string): string {
  if (!id) return '00000000-0000-4000-a000-000000000000';
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id;

  const numericStr = id.replace(/[^0-9]/g, '') || '123456789';
  const padded = (numericStr + '00000000000000000000000000000000').slice(0, 32);
  return `${padded.slice(0,8)}-${padded.slice(8,12)}-4${padded.slice(13,16)}-a${padded.slice(17,20)}-${padded.slice(20,32)}`;
}

export async function POST(request: Request) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 });
  }

  const serviceKey =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceKey) {
    return NextResponse.json(
      {
        error:
          'La clé secrète SUPABASE_SERVICE_ROLE_KEY est manquante dans votre environnement serveur (.env.local). Impossible d’écrire directement en base de données.',
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const course: Course = body.course;

    if (!course || !course.title) {
      return NextResponse.json({ error: 'Données de formation invalides.' }, { status: 400 });
    }

    const courseUuid = toUuid(course.id);

    // 1. Upsert course in Supabase
    const { error: courseErr } = await supabaseAdmin.from('courses').upsert({
      id: courseUuid,
      title: course.title,
      description: course.description || '',
      price: typeof course.price === 'number' ? course.price : 0,
      status: course.status || 'Brouillon',
      duration: course.duration || '',
      level: course.level || 'Tous niveaux',
      prerequisites: course.prerequisites || '',
      congratulations_msg: course.congratulationsMsg || '',
      bonus_doc_title: course.bonusDocTitle || '',
      bonus_doc_url: course.bonusDocUrl || '',
      community_link: course.communityLink || '',
    });

    if (courseErr) {
      console.error('Error upserting course in Supabase:', courseErr);
      return NextResponse.json({ error: `Erreur cours: ${courseErr.message}` }, { status: 500 });
    }

    // 2. Upsert modules & lessons
    if (Array.isArray(course.modules)) {
      const activeModuleIds: string[] = [];

      for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
        const mod = course.modules[mIdx];
        const modUuid = toUuid(mod.id);
        activeModuleIds.push(modUuid);

        const { error: modErr } = await supabaseAdmin.from('modules').upsert({
          id: modUuid,
          course_id: courseUuid,
          title: mod.title,
          order_index: mIdx + 1,
        });

        if (modErr) {
          console.error('Error upserting module in Supabase:', modErr);
          return NextResponse.json({ error: `Erreur module: ${modErr.message}` }, { status: 500 });
        }

        if (Array.isArray(mod.lessons)) {
          const activeLessonIds: string[] = [];

          for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
            const les = mod.lessons[lIdx];
            const lesUuid = toUuid(les.id);
            activeLessonIds.push(lesUuid);

            const lesPayload = {
              id: lesUuid,
              module_id: modUuid,
              title: les.title,
              video_url: les.videoUrl || '',
              notes: les.notes || '',
              pdf_url: les.pdfUrl || (les.files && les.files.length > 0 ? les.files[0].url : ''),
              external_link: les.externalLink || (les.links && les.links.length > 0 ? les.links[0].url : ''),
              duration: les.duration || '10:00',
              order_index: lIdx + 1,
            };

            const { error: lesErr } = await supabaseAdmin.from('lessons').upsert(lesPayload);
            if (lesErr) {
              console.error('Error upserting lesson in Supabase:', lesErr);
              return NextResponse.json({ error: `Erreur leçon: ${lesErr.message}` }, { status: 500 });
            }
          }

          // Clean up any deleted lessons for this module
          if (activeLessonIds.length > 0) {
            const { data: existingLessons } = await supabaseAdmin
              .from('lessons')
              .select('id')
              .eq('module_id', modUuid);

            if (existingLessons) {
              const toDelete = existingLessons
                .map((l: { id: string }) => l.id)
                .filter((id: string) => !activeLessonIds.includes(id));

              if (toDelete.length > 0) {
                await supabaseAdmin.from('lessons').delete().in('id', toDelete);
              }
            }
          }
        }
      }

      // Clean up any deleted modules for this course
      if (activeModuleIds.length > 0) {
        const { data: existingModules } = await supabaseAdmin
          .from('modules')
          .select('id')
          .eq('course_id', courseUuid);

        if (existingModules) {
          const toDeleteMod = existingModules
            .map((m: { id: string }) => m.id)
            .filter((id: string) => !activeModuleIds.includes(id));

          if (toDeleteMod.length > 0) {
            // Foreign key CASCADE will remove lessons associated with these modules
            await supabaseAdmin.from('modules').delete().in('id', toDeleteMod);
          }
        }
      }
    }

    return NextResponse.json({ success: true, courseId: courseUuid });
  } catch (err: any) {
    console.error('Failed to save course to Supabase:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur inconnue.' }, { status: 500 });
  }
}
