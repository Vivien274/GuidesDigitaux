import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { BLOG_ARTICLES, getArticleTimestamp } from '@/data/blogArticles';
import DigitalizationQuiz from '@/components/DigitalizationQuiz';
import StratecBanner from '@/components/StratecBanner';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.guides-digitaux.com';

function findArticle(slug: string) {
  return BLOG_ARTICLES.find((a) => a.slug === slug || a.id === slug);
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.filter((a) => a.status !== 'draft').map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);

  if (!article) {
    return {
      title: 'Article non trouvé | Guides Digitaux',
      robots: { index: false, follow: false },
    };
  }

  const timestamp = getArticleTimestamp(article);
  const publishedIso = timestamp > 0 ? new Date(timestamp).toISOString() : undefined;
  const canonicalPath = `/blog/${article.slug}`;

  return {
    title: `${article.title} | Guides Digitaux`,
    description: article.excerpt,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${canonicalPath}`,
      title: article.title,
      description: article.excerpt,
      siteName: 'Guides Digitaux',
      locale: 'fr_FR',
      publishedTime: publishedIso,
      authors: [article.author],
      images: [
        {
          url: article.image,
          alt: article.imageAlt || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function BlogArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);

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

  const rawHtml = article.contentHtml;
  const hasQuizAnchor = rawHtml.includes('<div id="digitalisation-quiz-anchor"></div>');
  const timestamp = getArticleTimestamp(article);
  const publishedIso = timestamp > 0 ? new Date(timestamp).toISOString() : undefined;
  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const imageUrl = article.image.startsWith('http') ? article.image : `${SITE_URL}${article.image}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${articleUrl}#article`,
        headline: article.title,
        description: article.excerpt,
        image: imageUrl,
        datePublished: publishedIso,
        dateModified: publishedIso,
        inLanguage: 'fr-FR',
        articleSection: article.category,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl,
        },
        author: {
          '@type': 'Person',
          name: article.author,
        },
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Accueil',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${SITE_URL}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: articleUrl,
          },
        ],
      },
      ...(article.faq && article.faq.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: article.faq.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
            {article.geoSummary && (
              <div className="mb-8 p-6 bg-[#e6f4f3] border-l-4 border-[#18757d] rounded-2xl space-y-2">
                <p className="text-xs sm:text-sm font-black text-[#18757d] uppercase tracking-wider m-0">
                  📌 {article.geoSummary.title}
                </p>
                <p className="text-sm sm:text-base text-[#332420] font-medium leading-relaxed m-0">
                  {article.geoSummary.text}
                </p>
              </div>
            )}

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

            {/* Structured FAQ section (matches FAQPage JSON-LD for SEO & GEO) */}
            {article.faq && article.faq.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#e8ded0] space-y-6">
                <h2 className="text-2xl sm:text-3xl font-black text-[#332420] tracking-tight">
                  Questions fréquentes
                </h2>
                <div className="space-y-4">
                  {article.faq.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 bg-[#faf8f5] rounded-2xl border border-[#ebdcc8] space-y-2"
                    >
                      <h3 className="text-base sm:text-lg font-extrabold text-[#18757d]">
                        {item.question}
                      </h3>
                      <p className="text-sm sm:text-base text-[#5e4d46] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* End of Article Content */}

        </div>
      </section>

      <Footer />
    </div>
  );
}
