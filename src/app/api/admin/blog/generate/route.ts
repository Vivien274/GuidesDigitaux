import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic, category } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Le sujet de l\'article est requis.' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    let title = `Guide pratique : ${topic}`;
    let excerpt = `Découvrez tous les conseils et étapes indispensables sur le thème "${topic}" spécialement conçus pour les artisans, créateurs et indépendants.`;
    let contentHtml = `
      <p>Bienvenue dans cet article dédié à <strong>${topic}</strong>. Quand on est artisan, créateur ou indépendant, chaque décision compte pour développer sa visibilité et attirer des clients de confiance.</p>
      
      <h2>🎯 1. Pourquoi ce sujet est essentiel pour votre entreprise</h2>
      <p>La digitalisation des petites entreprises et des métiers passion nécessite une approche simple, pragmatique et sans jargon technique. Aborder <em>${topic}</em> vous permet de poser des bases solides pour votre activité.</p>

      <h2>📌 2. Les étapes clés pour réussir</h2>
      <p>Voici les points essentiels à mettre en place dès aujourd'hui :</p>
      <ul>
        <li><strong>Définir vos objectifs :</strong> Clarifiez ce que vous souhaitez accomplir.</li>
        <li><strong>Choisir les bons outils :</strong> Privilégiez la simplicité et l'efficacité au quotidien.</li>
        <li><strong>Rester authentique :</strong> Mettez en valeur votre savoir-faire unique et votre passion.</li>
        <li><strong>Mesurer vos résultats :</strong> Ajustez votre stratégie au fur et a mesure.</li>
      </ul>

      <h2>💡 3. Les conseils pratiques de Stéphanie (Stratec Digital)</h2>
      <p>Ne cherchez pas la perfection immédiate. L'important est de faire le premier pas, d'appliquer une méthode claire étape par étape et de garder un rythme régulier.</p>

      <h2>🚀 En conclusion</h2>
      <p>En mettant en pratique ces conseils sur <strong>${topic}</strong>, vous construirez une présence digitale solide et pérenne qui vous ressemble !</p>
    `.trim();

    // If Gemini API Key is available, invoke official Gemini API
    if (geminiApiKey) {
      try {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Tu es Stéphanie Rocq, experte en digitalisation pour artisans, créateurs et indépendants chez Guides Digitaux (Stratec Digital).
Rédige un article de blog complet et pédagogique en français sur le sujet : "${topic}" (catégorie : "${category || 'Digitalisation'}").
Le ton doit être chaleureux, bienveillant, clair, sans jargon technique inutile.

Réponds uniquement sous forme d'un objet JSON strict avec les champs suivants (sans balises markdown triple backticks) :
{
  "title": "Titre accrocheur de l'article",
  "excerpt": "Résumé d'accroche de 2-3 phrases",
  "readTime": "5 min de lecture",
  "contentHtml": "<p>Introduction...</p><h2>1. Titre section...</h2><p>...</p><ul><li>...</li></ul><h2>Conclusion</h2><p>...</p>"
}`
              }]
            }]
          })
        });

        const geminiData = await geminiRes.json();
        const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (parsed.title && parsed.contentHtml) {
            title = parsed.title;
            excerpt = parsed.excerpt || excerpt;
            contentHtml = parsed.contentHtml;
          }
        }
      } catch (e) {
        console.error('Gemini API call error (using fallback generator):', e);
      }
    }

    return NextResponse.json({
      success: true,
      article: {
        title,
        excerpt,
        contentHtml,
        author: 'Stéphanie Rocq',
        category: category || 'Digitalisation',
        readTime: '5 min de lecture'
      }
    });
  } catch (error) {
    console.error('Error generating blog article:', error);
    return NextResponse.json({ error: 'Erreur lors de la génération de l\'article par Gemini.' }, { status: 500 });
  }
}
