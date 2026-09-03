import { createClient } from '@supabase/supabase-js';
import { Course, getStoredCourses, saveCourse as saveLocalCourse } from './coursesStore';
import { PreorderCampaign, getStoredPreorders, savePreorder as saveLocalPreorder, incrementPreorderEnrollment as incrementLocalPreorderEnrollment, deletePreorder as deleteLocalPreorder } from './preordersStore';

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

    const filteredCourses = (courses || []).filter((c: any) => {
      const titleLower = (c.title || '').toLowerCase().trim();
      const legacyIds = ['f36a0e1e-e959-4d75-bf4e-e162acdfcf70', 'f36d5622-0c07-431c-b22c-ded3af68f64f', 'a2c58a82-0857-4f45-b57d-2ae65f4fc935'];
      if (legacyIds.includes(c.id)) return false;
      if (titleLower.includes('bundle') || titleLower.includes('pas à pas') || (titleLower.includes('lancer sa boutique') && titleLower.includes('&'))) return false;
      return true;
    });

    return filteredCourses.map((c: any) => {
      const localMatch = getStoredCourses().find((sc: any) => sc.id === c.id);
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        duration: c.duration || '3h30',
        level: c.level || 'Débutant',
        prerequisites: c.prerequisites || '',
        price: c.price || 99,
        image: c.image || c.image_url || localMatch?.image || '/images/products/coaching-site.webp',
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
        modules: (c.modules && c.modules.length > 0)
          ? c.modules.map((m: any) => {
              const localMod = localMatch?.modules?.find((lm: any) => lm.id === m.id || lm.title === m.title);
              return {
                id: m.id,
                title: m.title,
                lessons: (m.lessons || []).map((l: any) => {
                  const localLes = localMod?.lessons?.find((ll: any) => ll.id === l.id || ll.title === l.title);
                  const effectiveFiles = l.files || (Array.isArray(localLes?.files) && localLes.files.length > 0 ? localLes.files : (l.pdf_url ? [{ id: `file-${l.id}`, name: 'Support de cours PDF', url: l.pdf_url }] : []));
                  const effectiveLinks = l.links || (Array.isArray(localLes?.links) && localLes.links.length > 0 ? localLes.links : (l.external_link ? [{ id: `link-${l.id}`, title: 'Ressource utile', url: l.external_link }] : []));
                  return {
                    id: l.id,
                    title: l.title,
                    videoUrl: l.video_url || localLes?.videoUrl || 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
                    notes: l.notes || localLes?.notes || '',
                    pdfUrl: l.pdf_url || localLes?.pdfUrl || '',
                    externalLink: l.external_link || localLes?.externalLink || '',
                    duration: l.duration || localLes?.duration || '10:00',
                    files: effectiveFiles,
                    links: effectiveLinks
                  };
                })
              };
            })
          : (localMatch?.modules || [])
      };
    });

  } catch (err) {
    console.warn('Using local fallback storage for courses', err);
    return getStoredCourses();
  }
}

export function toUuid(id: string): string {
  if (!id) return '00000000-0000-4000-a000-000000000000';
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id;
  
  const numericStr = id.replace(/[^0-9]/g, '') || '123456789';
  const padded = (numericStr + '00000000000000000000000000000000').slice(0, 32);
  return `${padded.slice(0,8)}-${padded.slice(8,12)}-4${padded.slice(13,16)}-a${padded.slice(17,20)}-${padded.slice(20,32)}`;
}

/**
 * 2. Save Course & Modules & Lessons to Supabase DB and localStorage
 */
export async function saveCourseToDb(course: Course): Promise<Course[]> {
  const courseUuid = toUuid(course.id);
  const courseWithUuid = { ...course, id: courseUuid };
  const updatedLocal = saveLocalCourse(courseWithUuid);

  try {
    const { error: courseErr } = await supabase.from('courses').upsert({
      id: courseUuid,
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
        id: courseUuid,
        title: course.title,
        description: course.description,
        price: course.price,
        status: course.status,
        duration: course.duration,
        level: course.level,
        prerequisites: course.prerequisites
      });
    }

    if (course.modules) {
      for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
        const mod = course.modules[mIdx];
        const modUuid = toUuid(mod.id);

        const { data: modData, error: modErr } = await supabase.from('modules').upsert({
          id: modUuid,
          course_id: courseUuid,
          title: mod.title,
          order_index: mIdx + 1
        }).select().single();

        const targetModId = modData?.id || modUuid;

        if (mod.lessons) {
          for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
            const les = mod.lessons[lIdx];
            const lesUuid = toUuid(les.id);
            const lesPayload: any = {
              id: lesUuid,
              module_id: targetModId,
              title: les.title,
              video_url: les.videoUrl,
              notes: les.notes,
              pdf_url: les.pdfUrl || (les.files && les.files.length > 0 ? les.files[0].url : ''),
              external_link: les.externalLink || (les.links && les.links.length > 0 ? les.links[0].url : ''),
              duration: les.duration || '10:00',
              order_index: lIdx + 1
            };
            if (les.files) lesPayload.files = les.files;
            if (les.links) lesPayload.links = les.links;

            const { error: lesErr } = await supabase.from('lessons').upsert(lesPayload);
            if (lesErr) {
              delete lesPayload.files;
              delete lesPayload.links;
              await supabase.from('lessons').upsert(lesPayload);
            }
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

export function getKnownRoleForEmail(email: string): 'superadmin' | 'formateur' | 'eleve' {
  const normalized = (email || '').toLowerCase().trim();
  if (['vivien274@gmail.com', 'contact@guides-digitaux.com', 'stephanie@stratec-digital.com'].includes(normalized)) {
    return 'superadmin';
  }
  if (['contact@spoolio.fr'].includes(normalized)) {
    return 'formateur';
  }
  return 'eleve';
}

/**
 * 5. Upsert User Profile to Supabase DB profiles table
 */
export async function upsertUserProfileToDb(email: string, role?: string, fullName?: string) {
  if (!email) return;
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const knownRole = getKnownRoleForEmail(normalizedEmail);
    const effectiveRole = (role && role !== 'eleve') ? role : (knownRole !== 'eleve' ? knownRole : (role || 'eleve'));
    const name = fullName || normalizedEmail.split('@')[0];

    const { data: existing, error: selectErr } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (!selectErr && existing) {
      await supabase.from('profiles').update({
        full_name: name,
        role: effectiveRole,
        updated_at: new Date().toISOString()
      }).eq('id', existing.id);
    } else {
      await supabase.from('profiles').insert({
        id: toUuid(normalizedEmail),
        email: normalizedEmail,
        full_name: name,
        role: effectiveRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  } catch (e) {
    console.warn('Supabase profile upsert error', e);
  }
}


export async function fetchUserProfileFromDb(email: string) {
  if (!email) return null;
  const normalized = email.toLowerCase().trim();
  const knownRole = getKnownRoleForEmail(normalized);

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', normalized)
      .maybeSingle();

    if (!error && data) {
      if (data.role === 'eleve' && knownRole !== 'eleve') {
        data.role = knownRole;
        supabase.from('profiles').update({ role: knownRole }).eq('email', normalized).then();
      }
      return data;
    }
  } catch (e) {
    console.warn('Error fetching profile from Supabase', e);
  }

  const defaultProfile = {
    email: normalized,
    full_name: normalized.split('@')[0],
    role: knownRole
  };
  await upsertUserProfileToDb(normalized, knownRole);
  return defaultProfile;
}

/**
 * 6. Save User Purchase to Supabase DB enrollments table
 */
export async function saveUserPurchaseToDb(email: string, item: any) {
  if (!email || !item) return;
  const normalizedEmail = email.toLowerCase().trim();
  try {
    await upsertUserProfileToDb(normalizedEmail, 'eleve');

    const profile = await fetchUserProfileFromDb(normalizedEmail);
    const userId = profile?.id;

    const isPdf = item.category === 'ebook' || item.category === 'checklist' || item.type === 'ebook' || item.type === 'checklist' || !!item.downloadPdf || (item.slug && item.slug.includes('guide')) || (item.id && item.id.includes('guide'));

    const payload: any = {
      user_email: normalizedEmail,
      email: normalizedEmail,
      customer_email: normalizedEmail,
      product_id: item.id || item.slug || `item-${Date.now()}`,
      course_id: item.id || item.slug || `item-${Date.now()}`,
      item_title: item.title || 'Produit Guides Digitaux',
      item_slug: item.slug || item.id || 'produit',
      item_type: item.type || (isPdf ? 'ebook' : 'formation'),
      download_pdf: item.downloadPdf || (isPdf ? '/downloads/support-formation-woocommerce.pdf' : null),
      price: Number(item.price) || 0,
      purchased_at: new Date().toISOString()
    };

    if (userId) {
      payload.user_id = userId;
    }

    await supabase.from('enrollments').insert(payload);
  } catch (e) {
    console.warn('Supabase DB purchase save fallback', e);
  }
}

/**
 * 7. Fetch User Purchases directly from Supabase DB (enrollments, preorder_buyers & orders tables)
 */
export async function fetchUserPurchasesFromDb(email: string): Promise<any[]> {
  if (!email) return [];
  const normalizedEmail = email.toLowerCase().trim();
  const purchasesMap = new Map<string, any>();

  // 1. Fetch from enrollments table
  try {
    const { data: enrollmentsData } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_email', normalizedEmail);

    if (enrollmentsData && enrollmentsData.length > 0) {
      enrollmentsData.forEach((row: any) => {
        const rowEmail = (row.user_email || row.email || row.customer_email || '').toLowerCase().trim();
        if (rowEmail === normalizedEmail) {
          const itemKey = row.course_id || row.product_id || row.item_slug || row.id;
          const isPdf = row.item_type === 'ebook' || row.item_type === 'checklist' || !!row.download_pdf || itemKey.includes('guide');
          const matchedProd = DEFAULT_PRODUCTS.find(p => p.id === itemKey || p.slug === itemKey);
          purchasesMap.set(itemKey, {
            id: itemKey,
            title: row.item_title || matchedProd?.title || 'Produit Guides Digitaux',
            slug: row.item_slug || itemKey,
            type: row.item_type || (isPdf ? 'ebook' : 'formation'),
            typeLabel: isPdf ? '📄 E-Book / Guide PDF' : 'Formation Vidéo',
            price: Number(row.price) || matchedProd?.price || 0,
            downloadPdf: row.download_pdf || (isPdf ? '/downloads/support-formation-woocommerce.pdf' : undefined),
            purchaseDate: row.purchased_at ? new Date(row.purchased_at).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')
          });
        }
      });
    }
  } catch (err) {
    console.warn('Error fetching enrollments from DB', err);
  }

  // 2. Fetch from preorder_buyers table (for preorders purchased)
  try {
    const { data: preorderBuyersData } = await supabase
      .from('preorder_buyers')
      .select('*')
      .eq('customer_email', normalizedEmail);

    if (preorderBuyersData && preorderBuyersData.length > 0) {
      const allPreorders = await fetchPreordersFromDb();
      preorderBuyersData.forEach((buyer: any) => {
        const campaignId = buyer.campaign_id || 'precommande-fiche-google';
        const campaignMatch = allPreorders.find(p => p.id === campaignId || p.courseId === campaignId) || {
          id: campaignId,
          courseTitle: 'Fais décoller ton activité locale grâce à une Fiche Google parfaite',
          price: Number(buyer.price) || 0,
          releaseDate: '2026-09-15'
        };

        if (!purchasesMap.has(campaignMatch.id)) {
          purchasesMap.set(campaignMatch.id, {
            id: campaignMatch.id,
            title: campaignMatch.courseTitle || 'Précommande Fiche Google',
            slug: campaignMatch.id,
            type: 'formation',
            typeLabel: 'Précommande Enregistrée',
            price: Number(buyer.price) || campaignMatch.price || 0,
            isPreorder: true,
            releaseDate: campaignMatch.releaseDate || '2026-09-15',
            purchaseDate: buyer.created_at ? new Date(buyer.created_at).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')
          });
        }
      });
    }
  } catch (err) {
    console.warn('Error fetching preorder_buyers from DB', err);
  }

  // 3. Fetch from orders table (for checkout orders)
  try {
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', normalizedEmail);

    if (ordersData && ordersData.length > 0) {
      const allProducts = await fetchProductsFromDb();
      ordersData.forEach((order: any) => {
        if (order.product_id) {
          const productMatch = allProducts.find(p => p.id === order.product_id || p.slug === order.product_id);
          const itemKey = order.product_id;
          if (!purchasesMap.has(itemKey)) {
            const isPdf = productMatch?.category === 'ebook' || productMatch?.category === 'checklist' || !!productMatch?.downloadPdf || itemKey.includes('guide');
            const resolvedPrice = Number(order.amount) || (order.total_amount_cents ? order.total_amount_cents / 100 : (productMatch?.price ?? 0));
            purchasesMap.set(itemKey, {
              id: itemKey,
              title: productMatch?.title || (itemKey.includes('fiche-google') ? 'Précommande Fiche Google' : 'Mini-guide / Produit Digital'),
              slug: productMatch?.slug || itemKey,
              type: productMatch?.category || (isPdf ? 'ebook' : 'formation'),
              typeLabel: isPdf ? '📄 E-Book / Guide PDF' : (itemKey.includes('precommande') ? 'Précommande Enregistrée' : 'Formation Vidéo'),
              price: resolvedPrice,
              downloadPdf: productMatch?.downloadPdf || (isPdf ? '/downloads/support-formation-woocommerce.pdf' : undefined),
              purchaseDate: order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')
            });
          }
        }
      });
    }

  } catch (err) {
    console.warn('Error fetching orders from DB', err);
  }

  return Array.from(purchasesMap.values());
}

/**
 * 8. Save Customer Order to Supabase DB orders table
 */
export async function saveOrderToDb(customerEmail: string, productId: string, status: string = 'paid', price: number = 5, sessionId?: string) {
  if (!customerEmail) return;
  const normalizedEmail = customerEmail.toLowerCase().trim();
  try {
    const payload = {
      customer_email: normalizedEmail,
      product_id: productId,
      stripe_session_id: sessionId || `sess_cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: Number(price) || 5,
      currency: 'eur',
      status: status,
      created_at: new Date().toISOString()
    };
    await supabase.from('orders').insert(payload);
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

function mapDbRowToPreorder(po: any): PreorderCampaign {
  return {
    id: po.id,
    courseId: po.course_id,
    courseTitle: po.course_title,
    price: parseFloat(po.price) || 79,
    originalPrice: po.original_price ? parseFloat(po.original_price) : undefined,
    targetEnrollments: parseInt(po.target_enrollments, 10) || 25,
    currentEnrollments: parseInt(po.current_enrollments, 10) || 0,
    endDate: po.end_date,
    releaseDate: po.release_date,
    description: po.description || '',
    bonus: po.bonus || '',
    image: po.image || '',
    status: po.status || 'En cours',
    destinationType: po.destination_type || 'existing',
    destinationUrl: po.destination_url || undefined
  };
}

/**
 * 10. Fetch Preorders from Supabase DB (Supabase DB is single source of truth)
 */
export async function fetchPreordersFromDb(): Promise<PreorderCampaign[]> {
  try {
    const { data: dbData, error } = await supabase
      .from('preorders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && dbData) {
      const mapped = dbData.map(mapDbRowToPreorder);

      // Reconcile current_enrollments count strictly with actual DB preorder_buyers table
      try {
        const { data: preorderBuyers } = await supabase.from('preorder_buyers').select('campaign_id, customer_email');
        
        mapped.forEach(po => {
          const matchingBuyers = (preorderBuyers || []).filter((pb: any) => 
            pb.campaign_id === po.id || pb.campaign_id === po.courseId || po.id === 'precommande-fiche-google'
          );
          const uniqueEmails = new Set(matchingBuyers.map((pb: any) => (pb.customer_email || pb.email || '').toLowerCase().trim()).filter(Boolean));
          po.currentEnrollments = uniqueEmails.size;
          supabase.from('preorders').update({ current_enrollments: uniqueEmails.size }).eq('id', po.id).then();
        });
      } catch (recErr) {
        console.warn('Reconcile notice', recErr);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('gd_custom_preorders', JSON.stringify(mapped));
      }
      return mapped;
    }

    return getStoredPreorders();
  } catch (err) {
    console.warn('Supabase DB fetchPreordersFromDb fallback executed', err);
    return getStoredPreorders();
  }
}

/**
 * 11. Save Preorder to Supabase DB and localStorage
 */
export async function savePreorderToDb(campaign: PreorderCampaign): Promise<PreorderCampaign[]> {
  const updatedLocal = saveLocalPreorder(campaign);

  try {
    const payload = {
      id: campaign.id,
      course_id: campaign.courseId,
      course_title: campaign.courseTitle,
      price: campaign.price,
      original_price: campaign.originalPrice,
      target_enrollments: campaign.targetEnrollments,
      current_enrollments: campaign.currentEnrollments,
      end_date: campaign.endDate,
      release_date: campaign.releaseDate,
      description: campaign.description,
      bonus: campaign.bonus,
      image: campaign.image,
      status: campaign.status,
      destination_type: campaign.destinationType,
      destination_url: campaign.destinationUrl,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('preorders').upsert(payload);
    if (error) {
      console.warn('Supabase preorders upsert notice:', error);
    }
  } catch (err) {
    console.warn('Supabase savePreorderToDb fallback executed', err);
  }

  return updatedLocal;
}

/**
 * 12. Increment Preorder Enrollment in Supabase DB and localStorage
 */
export async function incrementPreorderEnrollmentInDb(campaignId: string): Promise<PreorderCampaign[]> {
  const updatedLocal = incrementLocalPreorderEnrollment(campaignId);

  try {
    let { data: existing } = await supabase
      .from('preorders')
      .select('id, current_enrollments, target_enrollments')
      .eq('id', campaignId)
      .maybeSingle();

    if (!existing) {
      const { data: byCourseId } = await supabase
        .from('preorders')
        .select('id, current_enrollments, target_enrollments')
        .eq('course_id', campaignId)
        .maybeSingle();
      existing = byCourseId;
    }

    if (!existing) {
      const { data: firstPo } = await supabase
        .from('preorders')
        .select('id, current_enrollments, target_enrollments')
        .order('created_at', { ascending: false })
        .limit(1);
      if (firstPo && firstPo.length > 0) {
        existing = firstPo[0];
      }
    }

    if (existing) {
      const newCount = (existing.current_enrollments || 0) + 1;
      const isGoalReached = newCount >= (existing.target_enrollments || 15);
      await supabase
        .from('preorders')
        .update({ 
          current_enrollments: newCount,
          status: isGoalReached ? 'Objectif atteint' : 'En cours',
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    }
  } catch (err) {
    console.warn('Supabase incrementPreorderEnrollmentInDb fallback executed', err);
  }

  return updatedLocal;
}

/**
 * 13. Delete Preorder from Supabase DB and localStorage
 */
export async function deletePreorderFromDb(campaignId: string): Promise<PreorderCampaign[]> {
  const updatedLocal = deleteLocalPreorder(campaignId);

  try {
    const { error } = await supabase
      .from('preorders')
      .delete()
      .eq('id', campaignId);
    
    if (error) {
      console.warn('Supabase preorder delete notice:', error);
    }
  } catch (err) {
    console.warn('Supabase deletePreorderFromDb fallback executed', err);
  }

  return updatedLocal;
}

export interface DBCourse {
  id: string;
  title: string;
  description: string;
  duration?: string;
  level?: string;
  prerequisites?: string;
  price?: number;
  image?: string;
  status?: string;
  scheduledPublishDate?: string;
  modules?: any[];
}

import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';
import { getStoredProducts } from '@/lib/productsStore';

export async function fetchProductsFromDb(): Promise<any[]> {
  try {
    const stored = getStoredProducts();
    const storedMap = new Map(stored.map((p: any) => [p.id, p]));

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const dbProducts = data.map((row: any) => {
        const isBundle = (row.id && row.id.includes('bundle')) || (row.slug && row.slug.includes('bundle'));
        const localMatch = storedMap.get(row.id) || storedMap.get(row.slug) || DEFAULT_PRODUCTS.find(p => 
          p.id === row.id || 
          p.slug === row.slug || 
          p.id === row.slug ||
          p.slug === row.id ||
          p.title?.toLowerCase().trim() === (row.title || '').toLowerCase().trim()
        );

        const isBrokenWpUrl = (url?: string) => !url || url.includes('wp-content') || url.includes('GD-LogoFondTransparent');
        const resolvedImage = localMatch?.image || (!isBrokenWpUrl(row.image) ? row.image : (!isBrokenWpUrl(row.image_url) ? row.image_url : '/images/products/coaching-site.webp'));
        
        const effectiveLongDescription = row.long_description || localMatch?.longDescription || row.description || '';
        const effectiveDescription = row.description || localMatch?.description || '';

        return {
          id: row.id,
          title: row.title || localMatch?.title,
          slug: row.slug || row.id,
          category: row.category || localMatch?.category || 'checklist',
          categoryLabel: row.category_label || row.categoryLabel || localMatch?.categoryLabel || 'Checklist Digital',
          price: isBundle ? 250 : (row.price ? Number(row.price) : (localMatch?.price ?? 0)),
          originalPrice: isBundle ? 298 : (row.original_price ? Number(row.original_price) : localMatch?.originalPrice),
          rating: Number(row.rating) || localMatch?.rating || 5,
          reviewsCount: Number(row.reviews_count) || localMatch?.reviewsCount || 0,
          badge: isBundle ? 'ÉCONOMISE 48€' : (row.badge || localMatch?.badge),
          image: resolvedImage,
          imageAlt: row.image_alt || row.imageAlt || localMatch?.imageAlt || `${row.title} - Guides digitaux - Métropole lilloise`,
          description: effectiveDescription,
          longDescription: effectiveLongDescription,
          htmlContent: row.html_content,
          downloadPdf: row.download_pdf || row.pdf_file_url || localMatch?.downloadPdf,
          features: (Array.isArray(row.features) && row.features.length > 0) ? row.features : (localMatch?.features || []),
          gallery: (Array.isArray(row.gallery) && row.gallery.length > 0) ? row.gallery : (localMatch?.gallery || [resolvedImage])
        };
      });

      const dbIds = new Set(dbProducts.map((p: any) => p.id));
      const dbSlugs = new Set(dbProducts.map((p: any) => p.slug));
      
      const missingStored = stored.filter((sp: any) => !dbIds.has(sp.id) && !dbSlugs.has(sp.id) && !dbIds.has(sp.slug) && !dbSlugs.has(sp.slug));

      return [...dbProducts, ...missingStored];
    }
  } catch (e) {
    console.warn('Error fetching products from Supabase DB', e);
  }
  return getStoredProducts();
}

export interface PreorderBuyer {
  id: string;
  customerEmail: string;
  customerName: string;
  courseId: string;
  courseTitle: string;
  price: number;
  purchasedAt: string;
}

/**
 * 14. Fetch Preorder Buyers strictly from real Supabase DB preorder_buyers table
 */
export async function fetchPreorderBuyersFromDb(): Promise<PreorderBuyer[]> {
  try {
    const buyersMap = new Map<string, PreorderBuyer>();

    // 1. Fetch profiles for name matching
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('email, full_name');

    const profileMap = new Map<string, string>();
    if (profilesData) {
      profilesData.forEach((p: any) => {
        if (p.email && p.full_name) {
          profileMap.set(p.email.toLowerCase().trim(), p.full_name);
        }
      });
    }

    // 2. Fetch strictly from dedicated preorder_buyers table
    const { data: preorderBuyersData } = await supabase
      .from('preorder_buyers')
      .select('*')
      .order('created_at', { ascending: false });

    if (preorderBuyersData && preorderBuyersData.length > 0) {
      preorderBuyersData.forEach((row: any) => {
        const email = row.customer_email || row.email || '';
        if (email) {
          const normalizedEmail = email.toLowerCase().trim();
          const campaignId = row.campaign_id || 'precommande-fiche-google';
          const uniqueKey = `${normalizedEmail}_${campaignId}`;
          const fullName = profileMap.get(normalizedEmail) || row.customer_name || normalizedEmail.split('@')[0];
          
          if (!buyersMap.has(uniqueKey)) {
            buyersMap.set(uniqueKey, {
              id: row.id,
              customerEmail: normalizedEmail,
              customerName: fullName,
              courseId: campaignId,
              courseTitle: 'Précommande',
              price: parseFloat(row.price || 29),
              purchasedAt: row.created_at || new Date().toISOString()
            });
          }
        }
      });
    }

    return Array.from(buyersMap.values());
  } catch (err) {
    console.warn('fetchPreorderBuyersFromDb error fallback', err);
    return [];
  }
}

/**
 * 15. Delete a preorder buyer permanently from Supabase DB (preorder_buyers table row strictly by ID)
 */
export async function deletePreorderBuyerFromDb(buyerId: string, email?: string, campaignId?: string): Promise<void> {
  try {
    if (buyerId) {
      await supabase.from('preorder_buyers').delete().eq('id', buyerId);
    } else if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      await supabase.from('preorder_buyers').delete().eq('customer_email', normalizedEmail);
    }

    // Re-count remaining preorders for campaign and update current_enrollments
    if (campaignId) {
      const { data: remaining } = await supabase
        .from('preorder_buyers')
        .select('id')
        .eq('campaign_id', campaignId);
      const newCount = remaining ? remaining.length : 0;
      await supabase.from('preorders').update({ current_enrollments: newCount }).eq('id', campaignId);
    }
  } catch (err) {
    console.warn('Error deleting preorder buyer from Supabase DB', err);
  }
}

/**
 * 16. Record a Preorder Buyer Purchase directly in Supabase DB
 */
export async function recordPreorderPurchaseInDb(
  campaignId: string,
  customerEmail: string,
  customerName?: string,
  price: number = 29
): Promise<void> {
  if (!customerEmail) return;
  const normalizedEmail = customerEmail.toLowerCase().trim();
  const targetCampaign = campaignId || 'precommande-fiche-google';

  try {
    // Increment preorder enrollments counter in Supabase BDD
    await incrementPreorderEnrollmentInDb(targetCampaign);

    // Call server-side API to record preorder with admin rights and deduplication
    if (typeof window !== 'undefined') {
      await fetch('/api/preorders/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: targetCampaign,
          customerEmail: normalizedEmail,
          customerName: customerName || normalizedEmail.split('@')[0],
          price: price
        })
      });
    }
  } catch (e) {
    console.warn('recordPreorderPurchaseInDb notice:', e);
  }
}
