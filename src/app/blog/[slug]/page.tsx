'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, Clock, ArrowLeft, Share2, Sparkles } from 'lucide-react';
import { BLOG_ARTICLES } from '@/data/blogArticles';
import DigitalizationQuiz from '@/components/DigitalizationQuiz';
import StratecBanner from '@/components/StratecBanner';

export default function BlogArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const article = BLOG_ARTICLES.find(a => a.slug === slug || a.id === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans flex flex-col justify-between">
        <Header />
        <div className="py-24 text-center space-y-4">
          <h1 className="text-3xl font-black">Article non trouvé</h1>
          <p className="text-sm text-[#5e4d46]">L'article de blog que tu recherches n'existe pas ou a été déplacé.</p>
          <Link href="/blog" className="inline-block px-6 py-3 bg-[#18757d] text-white font-bold text-xs rounded-xl">
            Retourner au blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const pourAllerIdx = article.contentHtml.indexOf('Pour aller plus loin');
  const rawHtml = pourAllerIdx !== -1
    ? article.contentHtml.slice(0, article.contentHtml.lastIndexOf('<div', pourAllerIdx))
    : article.contentHtml;

  const hasQuizAnchor = rawHtml.includes('<div id="digitalisation-quiz-anchor"></div>');

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Header />

      {/* Article Hero */}
      <section className="bg-gradient-to-b from-[#f4ede0]/70 to-[#faf8f5] py-12 sm:py-16 border-b border-[#e8ded0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-black text-[#18757d] hover:text-[#12595f] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux articles</span>
          </Link>

          <div className="space-y-3">
            <span className="px-3.5 py-1 bg-[#18757d] text-white text-xs font-black rounded-full uppercase tracking-wider inline-block">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#332420] leading-tight">
              {article.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-[#5e4d46] font-medium pt-2 border-t border-[#ebdcc8]/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#18757d]" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#18757d]" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#18757d]" />
              <span>Par {article.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Main Image */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md border border-[#e8ded0]">
            <Image
              src={article.image}
              alt={article.imageAlt || article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Text Content */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e8ded0] shadow-sm">
            {hasQuizAnchor ? (
              <>
                <div
                  className="prose max-w-none"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{
                    __html: rawHtml.split('<div id="digitalisation-quiz-anchor"></div>')[0]
                  }}
                />
                
                <DigitalizationQuiz />

                <div
                  className="prose max-w-none"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{
                    __html: rawHtml.split('<div id="digitalisation-quiz-anchor"></div>')[1] || ''
                  }}
                />
              </>
            ) : article.slug === 'comment-savoir-entreprise-digitalisation' ? (
              <>
                <div
                  className="prose max-w-none"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{ __html: rawHtml }}
                />
                <DigitalizationQuiz />
              </>
            ) : (
              <div
                className="prose max-w-none"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: rawHtml }}
              />
            )}

            {/* Stratec Banner for relevant articles */}
            {(article.slug.includes('reseau') || article.slug.includes('digital') || article.id === '2380' || article.id === '3002') && (
              <StratecBanner />
            )}
          </div>

          {/* End of Article Content */}

        </div>
      </section>

      <Footer />
    </div>
  );
}
