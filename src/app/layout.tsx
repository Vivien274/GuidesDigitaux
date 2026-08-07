import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";
import MetaPixel from "@/components/MetaPixel";
import { FB_PIXEL_ID } from "@/lib/metaPixel";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guides Digitaux | Formations & Guides pour Artisans et Créateurs",
  description: "Formations, ebooks et checklists pour t'aider à booster ta visibilité, gérer ton business en ligne et enfin comprendre le digital à ton rythme.",
  openGraph: {
    title: "Guides Digitaux | Des guides digitaux pour faire évoluer ton entreprise",
    description: "Spécial artisans, créateurs et indépendants. Guides et formations en ligne 100% adaptés aux débutants.",
    type: "website",
    locale: "fr_FR",
    siteName: "Guides Digitaux",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${jakartaSans.variable} h-full antialiased scroll-smooth`}>
      <head>
        <Script
          id="meta-pixel-script"
          strategy="beforeInteractive"
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
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt="Meta Pixel"
          />
        </noscript>
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
