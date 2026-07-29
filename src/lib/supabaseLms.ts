import { createClient } from '@supabase/supabase-js';
import { Course, getStoredCourses, saveCourse as saveLocalCourse } from './coursesStore';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kvnvfsahoblmcpurnmtn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_KeSeRmMGA6zii9el1d_uBQ_piquLdfi';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 1. Fetch Courses & Modules & Lessons from Supabase DB (with localStorage fallback)
 */
export async function fetchCoursesFromDb(): Promise<Course[]> {
  try {
    const { data: courses, error } = await supabase
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
          title,
          order_index,
          lessons (
            id,
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

    if (error || !courses || courses.length === 0) {
      return getStoredCourses();
    }

    return courses.map((c: any) => {
      const localMatch = getStoredCourses().find((sc: any) => sc.id === c.id);
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        duration: c.duration || '3h30',
        level: c.level || 'Débutant',
        prerequisites: c.prerequisites || '',
        price: c.price || 99,
        image: c.image || localMatch?.image,
        category: 'Formation Vidéo',
        status: c.status || 'Publié',
        scheduledPublishDate: c.scheduled_publish_date || localMatch?.scheduledPublishDate,
        congratulationsMsg: c.congratulations_msg || localMatch?.congratulationsMsg,
        bonusDocTitle: c.bonus_doc_title || localMatch?.bonusDocTitle,
        bonusDocUrl: c.bonus_doc_url || localMatch?.bonusDocUrl,
        communityLink: (localMatch && localMatch.communityLink !== undefined) ? localMatch.communityLink : (c.community_link ?? ''),
        liveStreamUrl: (localMatch && localMatch.liveStreamUrl !== undefined) ? localMatch.liveStreamUrl : (c.live_stream_url ?? ''),
        liveStreamDate: (localMatch && localMatch.liveStreamDate !== undefined) ? localMatch.liveStreamDate : (c.live_stream_date ?? ''),
        liveStreamTitle: (localMatch && localMatch.liveStreamTitle !== undefined) ? localMatch.liveStreamTitle : (c.live_stream_title ?? ''),
        modules: (c.modules || []).map((m: any) => ({
          id: m.id,
          title: m.title,
          lessons: (m.lessons || []).map((l: any) => ({
            id: l.id,
            title: l.title,
            videoUrl: l.video_url,
            notes: l.notes,
            pdfUrl: l.pdf_url,
            externalLink: l.external_link,
            duration: l.duration || '10:00'
          }))
        }))
      };
    });

  } catch (err) {
    console.warn('Using local fallback storage for courses', err);
    return getStoredCourses();
  }
}

/**
 * 2. Save Course & Modules & Lessons to Supabase DB and localStorage
 */
export async function saveCourseToDb(course: Course): Promise<Course[]> {
  const updatedLocal = saveLocalCourse(course);

  try {
    const { error: courseErr } = await supabase.from('courses').upsert({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      image: course.image,
      status: course.status,
      scheduled_publish_date: course.scheduledPublishDate,
      duration: course.duration,
      level: course.level,
      prerequisites: course.prerequisites,
      congratulations_msg: course.congratulationsMsg,
      bonus_doc_title: course.bonusDocTitle,
      bonus_doc_url: course.bonusDocUrl,
      community_link: course.communityLink,
      live_stream_url: course.liveStreamUrl,
      live_stream_date: course.liveStreamDate,
      live_stream_title: course.liveStreamTitle
    });

    if (courseErr) {
      console.warn('Supabase course upsert failed (schema column missing), basic fallback save:', courseErr);
      await supabase.from('courses').upsert({
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        image: course.image,
        status: course.status,
        duration: course.duration,
        level: course.level,
        prerequisites: course.prerequisites
      });
    }

    if (!courseErr && course.modules) {
      for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
        const mod = course.modules[mIdx];
        const { data: modData } = await supabase.from('modules').upsert({
          id: mod.id,
          course_id: course.id,
          title: mod.title,
          order_index: mIdx + 1
        }).select().single();

        if (modData && mod.lessons) {
          for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
            const les = mod.lessons[lIdx];
            await supabase.from('lessons').upsert({
              id: les.id,
              module_id: modData.id,
              title: les.title,
              video_url: les.videoUrl,
              notes: les.notes,
              pdf_url: les.pdfUrl,
              external_link: les.externalLink,
              order_index: lIdx + 1
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn('Supabase DB save fallback executed', e);
  }

  return updatedLocal;
}

/**
 * 3. Fetch Real Student Enrollments from Supabase
 */
export async function fetchStudentEnrollments(userId: string) {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('user_id', userId);

    if (error || !data) return null;
    return data;
  } catch (e) {
    return null;
  }
}

/**
 * 4. Add Student Enrollment to Supabase DB upon Checkout
 */
export async function addStudentEnrollment(userId: string, courseId: string) {
  try {
    await supabase.from('enrollments').insert({
      user_id: userId,
      course_id: courseId,
      purchased_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Enrollment insert fallback executed', e);
  }
}

/**
 * 5. Upsert User Profile to Supabase DB profiles table
 */
export async function upsertUserProfileToDb(email: string, role: string = 'eleve', fullName?: string) {
  if (!email) return;
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const name = fullName || normalizedEmail.split('@')[0];

    const { error } = await supabase.from('profiles').upsert({
      email: normalizedEmail,
      full_name: name,
      role: role,
      updated_at: new Date().toISOString()
    }, { onConflict: 'email' });

    if (error) {
      await supabase.from('profiles').upsert({
        id: `usr_${Date.now()}`,
        email: normalizedEmail,
        full_name: name,
        role: role,
        updated_at: new Date().toISOString()
      });
    }
  } catch (e) {
    console.warn('Supabase profile upsert fallback executed', e);
  }
}

/**
 * 6. Save User Purchase to Supabase DB enrollments table
 */
export async function saveUserPurchaseToDb(email: string, item: any) {
  if (!email || !item) return;
  const normalizedEmail = email.toLowerCase().trim();
  try {
    await upsertUserProfileToDb(normalizedEmail, 'eleve');

    const payload = {
      user_email: normalizedEmail,
      email: normalizedEmail,
      course_id: item.id || `item-${Date.now()}`,
      item_id: item.id || `item-${Date.now()}`,
      item_title: item.title || 'Produit Guides Digitaux',
      item_data: item,
      purchased_at: new Date().toISOString()
    };

    await supabase.from('enrollments').upsert(payload);
  } catch (e) {
    console.warn('Supabase DB purchase save fallback', e);
  }
}

/**
 * 7. Fetch User Purchases directly from Supabase DB enrollments table
 */
export async function fetchUserPurchasesFromDb(email: string): Promise<any[]> {
  if (!email) return [];
  const normalizedEmail = email.toLowerCase().trim();
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .or(`user_email.eq.${normalizedEmail},email.eq.${normalizedEmail}`);

    if (!error && data && data.length > 0) {
      return data.map((row: any) => {
        if (row.item_data && typeof row.item_data === 'object' && Object.keys(row.item_data).length > 0) {
          return row.item_data;
        }
        return {
          id: row.course_id || row.item_id || row.id,
          title: row.item_title || 'Formation / Produit débloqué',
          slug: row.item_slug || row.course_id,
          type: row.type || 'formation',
          price: row.price || 29,
          purchaseDate: row.purchased_at ? new Date(row.purchased_at).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')
        };
      });
    }
  } catch (e) {
    console.warn('Supabase fetchUserPurchasesFromDb fallback', e);
  }
  return [];
}

/**
 * 8. Save Customer Order to Supabase DB orders table
 */
export async function saveOrderToDb(customerEmail: string, productId: string, status: string = 'paid') {
  if (!customerEmail) return;
  const normalizedEmail = customerEmail.toLowerCase().trim();
  try {
    await supabase.from('orders').insert({
      customer_email: normalizedEmail,
      product_id: productId,
      status: status,
      created_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Supabase DB order insert fallback', e);
  }
}

/**
 * 9. Fetch Customer Orders from Supabase DB orders table
 */
export async function fetchUserOrdersFromDb(customerEmail: string): Promise<any[]> {
  if (!customerEmail) return [];
  const normalizedEmail = customerEmail.toLowerCase().trim();
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', normalizedEmail);

    if (!error && data) return data;
  } catch (e) {
    console.warn('Supabase DB fetchUserOrdersFromDb fallback', e);
  }
  return [];
}
