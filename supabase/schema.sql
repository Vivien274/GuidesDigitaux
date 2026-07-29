-- =============================================
-- GUIDES DIGITAUX - SCHÉMA SUPABASE & RLS POLICIES
-- URL Project: https://kvnvfsahoblmcpurnmtn.supabase.co
-- =============================================

-- 1. Table Produits (Products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ebook', 'checklist', 'formation')),
  category_label TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  rating NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INT DEFAULT 12,
  badge TEXT,
  image_url TEXT,
  description TEXT,
  long_description TEXT,
  pdf_file_url TEXT, -- Lien du fichier PDF sécurisé dans Supabase Storage
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active RLS sur public.products (lecture publique & insertion)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true);

-- 2. Table Profils Utilisateurs (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- 3. Table Commandes (Orders / Stripe Webhooks)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  product_id TEXT REFERENCES public.products(id),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT NOT NULL DEFAULT 'completed',
  customer_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR customer_email = auth.jwt()->>'email');

-- 4. Table Accès & Téléchargements (Purchased Downloads)
CREATE TABLE IF NOT EXISTS public.purchased_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  product_id TEXT REFERENCES public.products(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.purchased_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can read own downloads" ON public.purchased_products FOR SELECT USING (user_email = auth.jwt()->>'email');
