-- 1. PROFILES (Extension de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  billing_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS (PDFs, Checklists, Formations)
DO $$ BEGIN
    CREATE TYPE product_type AS ENUM ('pdf', 'course', 'pack');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  currency TEXT DEFAULT 'eur',
  type product_type NOT NULL,
  stripe_price_id TEXT,
  storage_file_path TEXT,
  is_published BOOLEAN DEFAULT true,
  
  -- PRÉPARATION V2 : Précommandes
  is_preorder BOOLEAN DEFAULT false,
  release_date TIMESTAMPTZ,
  preorder_limit INT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS (Historique des transactions Stripe)
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  total_amount_cents INT NOT NULL,
  currency TEXT DEFAULT 'eur',
  status order_status DEFAULT 'pending',
  customer_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER_ACCESS (Droits d'accès accordés aux clients)
CREATE TABLE IF NOT EXISTS public.user_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- PRÉPARATION V2 : Déblocage d'accès différé pour précommandes
  available_from TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- Active RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Produits visibles par tous" ON public.products FOR SELECT USING (is_published = true);
CREATE POLICY "Utilisateur voit son profil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Utilisateur voit ses accès" ON public.user_access FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Utilisateur voit ses commandes" ON public.orders FOR SELECT USING (auth.uid() = user_id);
