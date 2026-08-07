'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { pageview } from '@/lib/metaPixel';

export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Évite un double évènement PageView au chargement initial (déjà déclenché par le script inline dans <head>)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Suivre les vues de page lors de la navigation SPA Next.js
    pageview();
  }, [pathname, searchParams]);

  return null;
}
