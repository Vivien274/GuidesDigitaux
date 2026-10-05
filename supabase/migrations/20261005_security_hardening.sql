-- Remove permissive public writes and scope private rows to their owner.
-- Trusted Stripe/admin operations use the service role and continue to bypass RLS.

BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

UPDATE public.profiles profile
SET auth_user_id = auth_user.id
FROM auth.users auth_user
WHERE LOWER(profile.email) = LOWER(auth_user.email)
  AND profile.auth_user_id IS DISTINCT FROM auth_user.id;

CREATE OR REPLACE FUNCTION public.is_privileged_user()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles profile
    WHERE profile.auth_user_id = auth.uid()
      AND profile.role IN ('superadmin', 'formateur')
  );
$$;

REVOKE ALL ON FUNCTION public.is_privileged_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_privileged_user() TO authenticated;

-- Remove every legacy policy, including permissive policies whose names changed
-- between the historical schema files and the deployed database.
DO $$
DECLARE
  existing_policy RECORD;
BEGIN
  FOR existing_policy IN
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'profiles', 'products', 'orders', 'courses', 'modules', 'lessons',
        'enrollments', 'lesson_progress', 'preorders', 'preorder_buyers'
      )
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      existing_policy.policyname,
      existing_policy.tablename
    );
  END LOOP;
END;
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles select policy" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles insert policy" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles update policy" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "User can read own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth_user_id = auth.uid() OR public.is_privileged_user());
CREATE POLICY "Privileged users can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_privileged_user());
CREATE POLICY "Privileged users can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Insert Products" ON public.products;
DROP POLICY IF EXISTS "Public Update Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Produits visibles par tous" ON public.products;
CREATE POLICY "Published products are publicly readable"
  ON public.products FOR SELECT USING (true);
CREATE POLICY "Privileged users can manage products"
  ON public.products FOR ALL
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Orders viewable by everyone" ON public.orders;
DROP POLICY IF EXISTS "Orders manageable by everyone" ON public.orders;
DROP POLICY IF EXISTS "User can read own orders" ON public.orders;
DROP POLICY IF EXISTS "Utilisateur voit ses commandes" ON public.orders;
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR customer_email = (auth.jwt() ->> 'email')
    OR public.is_privileged_user()
  );

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON public.courses;
DROP POLICY IF EXISTS "Instructors and Admins can create/edit courses" ON public.courses;
CREATE POLICY "Course catalog is publicly readable"
  ON public.courses FOR SELECT USING (true);
CREATE POLICY "Privileged users can manage courses"
  ON public.courses FOR ALL
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Modules viewable by course viewers" ON public.modules;
DROP POLICY IF EXISTS "Instructors can manage modules" ON public.modules;
CREATE POLICY "Enrolled users can view modules"
  ON public.modules FOR SELECT
  USING (
    public.is_privileged_user()
    OR EXISTS (
      SELECT 1
      FROM public.courses course
      LEFT JOIN public.enrollments enrollment
        ON enrollment.course_id = course.id AND enrollment.user_id = auth.uid()
      WHERE course.id = modules.course_id
        AND enrollment.user_id IS NOT NULL
    )
  );
CREATE POLICY "Privileged users can manage modules"
  ON public.modules FOR ALL
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lessons viewable by enrolled students or previews" ON public.lessons;
DROP POLICY IF EXISTS "Instructors can manage lessons" ON public.lessons;
CREATE POLICY "Enrolled users can view lessons"
  ON public.lessons FOR SELECT
  USING (
    public.is_privileged_user()
    OR EXISTS (
      SELECT 1
      FROM public.modules module
      JOIN public.courses course ON course.id = module.course_id
      LEFT JOIN public.enrollments enrollment
        ON enrollment.course_id = course.id AND enrollment.user_id = auth.uid()
      WHERE module.id = lessons.module_id
        AND enrollment.user_id IS NOT NULL
    )
  );
CREATE POLICY "Privileged users can manage lessons"
  ON public.lessons FOR ALL
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.enrollments;
CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id OR public.is_privileged_user());
CREATE POLICY "Privileged users can manage enrollments"
  ON public.enrollments FOR ALL
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can manage their own lesson progress"
  ON public.lesson_progress FOR ALL
  USING (auth.uid() = user_id OR public.is_privileged_user())
  WITH CHECK (auth.uid() = user_id OR public.is_privileged_user());

ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Preorders viewable by everyone" ON public.preorders;
DROP POLICY IF EXISTS "Preorders manageable by all" ON public.preorders;
CREATE POLICY "Preorders are publicly readable"
  ON public.preorders FOR SELECT USING (true);
CREATE POLICY "Privileged users can manage preorders"
  ON public.preorders FOR ALL
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.preorder_buyers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Preorder buyers viewable by everyone" ON public.preorder_buyers;
DROP POLICY IF EXISTS "Preorder buyers manageable by everyone" ON public.preorder_buyers;
CREATE POLICY "Users can view their own preorders"
  ON public.preorder_buyers FOR SELECT
  USING (
    customer_email = (auth.jwt() ->> 'email')
    OR public.is_privileged_user()
  );
CREATE POLICY "Privileged users can manage preorder buyers"
  ON public.preorder_buyers FOR ALL
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

COMMIT;
