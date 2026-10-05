import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('❌ ERREUR : La variable SUPABASE_SERVICE_ROLE_KEY est vide dans .env.local.');
  console.error('👉 Veuillez copier la clé service_role depuis votre dashboard Supabase (Settings > API > Project API keys) et la coller dans .env.local.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Load coursesStore.ts content to extract INITIAL_COURSES
const storePath = path.resolve(process.cwd(), 'src/lib/coursesStore.ts');
const storeContent = fs.readFileSync(storePath, 'utf8');

// Find JSON array for DEFAULT_COURSES
const match = storeContent.match(/const DEFAULT_COURSES: Course\[\] = (\[[\s\S]*?\n\]);/);
if (!match) {
  console.error('❌ Impossible d’extraire DEFAULT_COURSES de coursesStore.ts');
  process.exit(1);
}

let courses = [];
try {
  courses = JSON.parse(match[1]);
} catch (e) {
  console.error('❌ Erreur de parsing JSON pour DEFAULT_COURSES:', e.message);
  process.exit(1);
}

console.log(`🚀 Début de la synchronisation de ${courses.length} formations vers Supabase...`);

async function run() {
  for (const c of courses) {
    console.log(`\n📚 Traitement de la formation : "${c.title}" (${c.id})`);

    // 1. Course upsert
    const { error: cErr } = await supabase.from('courses').upsert({
      id: c.id,
      title: c.title,
      description: c.description || '',
      price: typeof c.price === 'number' ? c.price : 0,
      status: c.status || 'Publié',
      duration: c.duration || '',
      level: c.level || 'Tous niveaux',
      prerequisites: c.prerequisites || '',
      congratulations_msg: c.congratulationsMsg || '',
      bonus_doc_title: c.bonusDocTitle || '',
      bonus_doc_url: c.bonusDocUrl || '',
      community_link: c.communityLink || '',
    });

    if (cErr) {
      console.error(`❌ Erreur sur la formation ${c.title}:`, cErr.message);
      continue;
    }
    console.log(`  ✅ Formation enregistrée.`);

    // 2. Modules & Lessons
    if (Array.isArray(c.modules)) {
      for (let mIdx = 0; mIdx < c.modules.length; mIdx++) {
        const mod = c.modules[mIdx];
        const { error: mErr } = await supabase.from('modules').upsert({
          id: mod.id,
          course_id: c.id,
          title: mod.title,
          order_index: mod.order_index ?? (mIdx + 1),
        });

        if (mErr) {
          console.error(`    ❌ Erreur module "${mod.title}":`, mErr.message);
          continue;
        }

        if (Array.isArray(mod.lessons)) {
          for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
            const les = mod.lessons[lIdx];
            const { error: lErr } = await supabase.from('lessons').upsert({
              id: les.id,
              module_id: mod.id,
              title: les.title,
              video_url: les.videoUrl || '',
              notes: les.notes || '',
              pdf_url: les.pdfUrl || (les.files?.[0]?.url ?? ''),
              external_link: les.externalLink || (les.links?.[0]?.url ?? ''),
              duration: les.duration || '10:00',
              order_index: les.order_index ?? (lIdx + 1),
            });

            if (lErr) {
              console.error(`      ❌ Erreur leçon "${les.title}":`, lErr.message);
            }
          }
          console.log(`    ✅ Module "${mod.title}" : ${mod.lessons.length} leçons synchronisées.`);
        }
      }
    }
  }

  // Verification counts
  const [{ count: cCount }, { count: mCount }, { count: lCount }] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('modules').select('*', { count: 'exact', head: true }),
    supabase.from('lessons').select('*', { count: 'exact', head: true }),
  ]);

  console.log(`\n🎉 SYNCHRONISATION TERMINÉE AVEC SUCCÈS !`);
  console.log(`📊 Totaux en base Supabase :`);
  console.log(`   - Formations : ${cCount}`);
  console.log(`   - Modules    : ${mCount}`);
  console.log(`   - Leçons     : ${lCount}`);
}

run().catch((err) => {
  console.error('Erreur inattendue:', err);
  process.exit(1);
});
