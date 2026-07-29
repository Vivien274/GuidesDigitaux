import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

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
      <body className="min-h-full flex flex-col bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
