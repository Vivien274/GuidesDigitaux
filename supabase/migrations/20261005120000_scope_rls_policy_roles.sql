-- Scope private RLS policies to signed-in users only.
-- The previous hardening migration already created these policies.

BEGIN;

ALTER POLICY "Users can view their own profile" ON public.profiles TO authenticated;
ALTER POLICY "Privileged users can insert profiles" ON public.profiles TO authenticated;
ALTER POLICY "Privileged users can update profiles" ON public.profiles TO authenticated;

ALTER POLICY "Published products are publicly readable" ON public.products TO anon, authenticated;
ALTER POLICY "Privileged users can manage products" ON public.products TO authenticated;

ALTER POLICY "Users can view their own orders" ON public.orders TO authenticated;

ALTER POLICY "Course catalog is publicly readable" ON public.courses TO anon, authenticated;
ALTER POLICY "Privileged users can manage courses" ON public.courses TO authenticated;

ALTER POLICY "Enrolled users can view modules" ON public.modules TO authenticated;
ALTER POLICY "Privileged users can manage modules" ON public.modules TO authenticated;

ALTER POLICY "Enrolled users can view lessons" ON public.lessons TO authenticated;
ALTER POLICY "Privileged users can manage lessons" ON public.lessons TO authenticated;

ALTER POLICY "Users can view their own enrollments" ON public.enrollments TO authenticated;
ALTER POLICY "Privileged users can manage enrollments" ON public.enrollments TO authenticated;

ALTER POLICY "Users can manage their own lesson progress" ON public.lesson_progress TO authenticated;

ALTER POLICY "Preorders are publicly readable" ON public.preorders TO anon, authenticated;
ALTER POLICY "Privileged users can manage preorders" ON public.preorders TO authenticated;

ALTER POLICY "Users can view their own preorders" ON public.preorder_buyers TO authenticated;
ALTER POLICY "Privileged users can manage preorder buyers" ON public.preorder_buyers TO authenticated;

DO $$
BEGIN
  IF to_regclass('public.purchased_products') IS NOT NULL THEN
    ALTER TABLE public.purchased_products ENABLE ROW LEVEL SECURITY;

    IF EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'purchased_products'
        AND policyname = 'User can read own downloads'
    ) THEN
      ALTER POLICY "User can read own downloads" ON public.purchased_products TO authenticated;
    END IF;
  END IF;
END;
$$;

COMMIT;
