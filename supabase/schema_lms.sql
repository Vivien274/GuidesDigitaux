-- SQL Migration Script for LMS & User Account Management in Supabase

-- 1. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'eleve' CHECK (role IN ('superadmin', 'formateur', 'eleve')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create COURSES Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id),
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are viewable by everyone" 
  ON public.courses FOR SELECT USING (is_published = true OR auth.uid() = instructor_id);

CREATE POLICY "Instructors and Admins can create/edit courses" 
  ON public.courses FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('superadmin', 'formateur')
    )
  );

-- 3. Create MODULES Table
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules viewable by course viewers" 
  ON public.modules FOR SELECT USING (true);

CREATE POLICY "Instructors can manage modules" 
  ON public.modules FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('superadmin', 'formateur')
    )
  );

-- 4. Create LESSONS Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  video_url TEXT,
  content_html TEXT,
  duration_seconds INTEGER DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons viewable by enrolled students or previews" 
  ON public.lessons FOR SELECT USING (true);

CREATE POLICY "Instructors can manage lessons" 
  ON public.lessons FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('superadmin', 'formateur')
    )
  );

-- 5. Create ENROLLMENTS Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES public.products(id),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  stripe_session_id TEXT
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments" 
  ON public.enrollments FOR SELECT USING (auth.uid() = user_id);

-- 6. Create LESSON_PROGRESS Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their lesson progress" 
  ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

-- Trigger for auto-creating profile when a new user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'eleve')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Create PREORDERS Table
CREATE TABLE IF NOT EXISTS public.preorders (
  id TEXT PRIMARY KEY,
  course_id TEXT,
  course_title TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 79.00,
  original_price NUMERIC(10, 2),
  target_enrollments INTEGER NOT NULL DEFAULT 25,
  current_enrollments INTEGER NOT NULL DEFAULT 0,
  end_date TEXT NOT NULL,
  release_date TEXT NOT NULL,
  description TEXT,
  bonus TEXT,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'En cours',
  destination_type TEXT DEFAULT 'existing',
  destination_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Preorders viewable by everyone" 
  ON public.preorders FOR SELECT USING (true);

CREATE POLICY "Preorders manageable by all" 
  ON public.preorders FOR ALL USING (true);

-- 8. Create PREORDER_BUYERS Table
CREATE TABLE IF NOT EXISTS public.preorder_buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 29.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.preorder_buyers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Preorder buyers viewable by everyone" 
  ON public.preorder_buyers FOR SELECT USING (true);

CREATE POLICY "Preorder buyers manageable by everyone" 
  ON public.preorder_buyers FOR ALL USING (true);

