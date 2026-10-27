import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DigitalizationQuiz from '@/components/DigitalizationQuiz';

export const metadata: Metadata = {
  title: "Quiz Gratuit : Mon site web, c'est pour moi ? | Guides Digitaux",
  description: "Réponds à 6 questions simples pour évaluer tes besoins, lever tes appréhensions et recevoir ton plan d'action personnalisé en 2 minutes chrono.",
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans flex flex-col justify-between">
      <Header />

      {/* QUIZ CONTAINER */}
      <main className="flex-1 py-4 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <DigitalizationQuiz />
        </div>
      </main>

      <Footer />
    </div>
  );
}

