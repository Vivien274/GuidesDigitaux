const { createClient } = require('@supabase/supabase-js');
const productsData = require('../src/data/products.json');

const supabaseUrl = 'https://kvnvfsahoblmcpurnmtn.supabase.co';
const supabaseKey = 'sb_publishable_KeSeRmMGA6zii9el1d_uBQ_piquLdfi';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding 15 products with gallery images to Supabase...');
  for (const product of productsData) {
    const { data, error } = await supabase.from('products').upsert({
      id: product.id,
      title: product.title,
      slug: product.slug,
      category: product.category,
      category_label: product.categoryLabel,
      price: product.price,
      original_price: product.originalPrice || null,
      rating: product.rating || 5,
      reviews_count: product.reviewsCount || 12,
      badge: product.badge || null,
      image_url: product.image,
      description: product.description,
      long_description: product.longDescription || product.description,
      features: product.features || []
    });

    if (error) {
      console.error(`Error inserting product ${product.id}:`, error.message);
    } else {
      console.log(`✓ Inserted/Updated product with gallery (${product.gallery ? product.gallery.length : 1} imgs): ${product.title}`);
    }
  }
  console.log('Seeding completed!');
}

seed();
