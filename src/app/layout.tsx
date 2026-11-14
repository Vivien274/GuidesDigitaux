import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import MetaPixel from "@/components/MetaPixel";
import { FB_PIXEL_ID_1, FB_PIXEL_IDS } from "@/lib/metaPixel";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";

const CookieConsentBanner = dynamic(() => import("@/components/CookieConsentBanner"));
const AccessibilityWidget = dynamic(() => import("@/components/AccessibilityWidget"));

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.guides-digitaux.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Guides Digitaux | Formations & Guides pour Artisans et Créateurs",
  description: "Formations, ebooks et checklists pour t'aider à booster ta visibilité, gérer ton business en ligne et enfin comprendre le digital à ton rythme.",
  alternates: {
    canonical: "/",
  },
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
    url: siteUrl,
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-K3GHDVFH';
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Guides Digitaux",
        "url": siteUrl,
        "logo": `${siteUrl}/icon.png`,
        "sameAs": [
          "https://www.instagram.com/guidesdigitaux",
          "https://www.facebook.com/guidesdigitaux",
          "https://stratec-digital.com"
        ],
        "founder": {
          "@type": "Person",
          "name": "Stéphanie Rocq"
        },
        "parentOrganization": {
          "@type": "Organization",
          "name": "Stratec Digital",
          "url": "https://stratec-digital.com"
        }
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Guides Digitaux",
        "inLanguage": "fr-FR",
        "publisher": {
          "@id": `${siteUrl}/#organization`
        }
      }
    ]
  };

  return (
    <html lang="fr" suppressHydrationWarning className={`${jakartaSans.variable} h-full antialiased scroll-smooth`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* CHARGEMENT DIFFÉRÉ ET INTELLIGENT DES SCRIPTS TIERS (GTM, GA4, META PIXEL) */}
        <ThirdPartyScripts gaId={gaId} gtmId={gtmId} />
        <noscript>
          {FB_PIXEL_IDS.map((id) => (
            <img
              key={id}
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
              alt={`Meta Pixel ${id}`}
            />
          ))}
          {gtmId && (
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          )}
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
