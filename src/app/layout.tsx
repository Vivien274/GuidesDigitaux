import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";
import MetaPixel from "@/components/MetaPixel";
import { FB_PIXEL_ID_1, FB_PIXEL_ID_2 } from "@/lib/metaPixel";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import AccessibilityWidget from "@/components/AccessibilityWidget";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guides Digitaux | Formations & Guides pour Artisans et Créateurs",
  description: "Formations, ebooks et checklists pour t'aider à booster ta visibilité, gérer ton business en ligne et enfin comprendre le digital à ton rythme.",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon-gd.png" }
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Guides Digitaux | Des guides digitaux pour faire évoluer ton entreprise",
    description: "Spécial artisans, créateurs et indépendants. Guides et formations en ligne 100% adaptés aux débutants.",
    type: "website",
    locale: "fr_FR",
    siteName: "Guides Digitaux",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  } : undefined
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-358P17K5M7';

  return (
    <html lang="fr" suppressHydrationWarning className={`${jakartaSans.variable} h-full antialiased scroll-smooth`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Lcqdp4tAAAAAMtfeNqnAOYwn7nQoTAzX7d-p6H_'}`}
          strategy="afterInteractive"
        />
        <Script
          id="meta-pixel-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID_1}');
              fbq('init', '${FB_PIXEL_ID_2}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID_1}&ev=PageView&noscript=1`}
            alt="Meta Pixel 1"
          />
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID_2}&ev=PageView&noscript=1`}
            alt="Meta Pixel 2"
          />
        </noscript>
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <AnalyticsTracker />
            </Suspense>
            {children}
            <CookieConsentBanner />
            <AccessibilityWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
