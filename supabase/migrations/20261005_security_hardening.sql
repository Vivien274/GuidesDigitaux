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
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid() OR public.is_privileged_user());
CREATE POLICY "Privileged users can insert profiles" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (public.is_privileged_user());
CREATE POLICY "Privileged users can update profiles" ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published products are publicly readable" ON public.products FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Privileged users can manage products" ON public.products FOR ALL TO authenticated
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR customer_email = (auth.jwt() ->> 'email')
    OR public.is_privileged_user()
  );

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course catalog is publicly readable" ON public.courses FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Privileged users can manage courses" ON public.courses FOR ALL TO authenticated
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled users can view modules" ON public.modules FOR SELECT TO authenticated
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
CREATE POLICY "Privileged users can manage modules" ON public.modules FOR ALL TO authenticated
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled users can view lessons" ON public.lessons FOR SELECT TO authenticated
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
CREATE POLICY "Privileged users can manage lessons" ON public.lessons FOR ALL TO authenticated
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own enrollments" ON public.enrollments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_privileged_user());
CREATE POLICY "Privileged users can manage enrollments" ON public.enrollments FOR ALL TO authenticated
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own lesson progress" ON public.lesson_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_privileged_user())
  WITH CHECK (auth.uid() = user_id OR public.is_privileged_user());

ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Preorders are publicly readable" ON public.preorders FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Privileged users can manage preorders" ON public.preorders FOR ALL TO authenticated
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

ALTER TABLE public.preorder_buyers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own preorders" ON public.preorder_buyers FOR SELECT TO authenticated
  USING (
    customer_email = (auth.jwt() ->> 'email')
    OR public.is_privileged_user()
  );
CREATE POLICY "Privileged users can manage preorder buyers" ON public.preorder_buyers FOR ALL TO authenticated
  USING (public.is_privileged_user())
  WITH CHECK (public.is_privileged_user());

COMMIT;
