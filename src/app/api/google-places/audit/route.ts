import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Helper pour résoudre les redirections de liens courts Google Maps (ex: maps.app.goo.gl, share.google) et extraire le Place ID
async function resolveGoogleMapsInput(rawInput: string): Promise<{ placeId?: string; resolvedQuery: string }> {
  try {
    let target = rawInput.trim();
    if (target.startsWith('ChIJ')) {
      return { placeId: target, resolvedQuery: target };
    }
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`;
    }

    // 1. Résolution de la redirection HTTP si lien court
    let finalUrl = target;
    try {
      const headRes = await fetch(target, { method: 'HEAD', redirect: 'manual' });
      if (headRes.status >= 300 && headRes.status < 400) {
        finalUrl = headRes.headers.get('location') || target;
      }
    } catch (e) {
      // Ignorer
    }

    // 2. ChIJ direct dans l'URL ?
    const directChij = finalUrl.match(/placeid[=:]\s*(ChIJ[a-zA-Z0-9_-]{23,})/i) || finalUrl.match(/!1s(ChIJ[a-zA-Z0-9_-]{23,})/);
    if (directChij && directChij[1]) {
      return { placeId: directChij[1], resolvedQuery: rawInput };
    }

    // 3. Récupération du code HTML Google Maps pour extraire le lien preview ou le ChIJ
    try {
      const mapRes = await fetch(finalUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
        }
      });
      const html = await mapRes.text();

      const htmlChij = html.match(/ChIJ[a-zA-Z0-9_-]{23,}/);
      if (htmlChij && htmlChij[0]) {
        return { placeId: htmlChij[0], resolvedQuery: rawInput };
      }

      const linkHref = html.match(/<link[^>]*href=\"(\/maps\/preview\/place[^\"]+)\"/);
      if (linkHref && linkHref[1]) {
        const fullPreviewUrl = 'https://www.google.com' + linkHref[1].replace(/&amp;/g, '&');
        const pRes = await fetch(fullPreviewUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
          }
        });
        const pText = await pRes.text();
        const previewChij = pText.match(/ChIJ[a-zA-Z0-9_-]{23,}/);
        if (previewChij && previewChij[0]) {
          return { placeId: previewChij[0], resolvedQuery: rawInput };
        }
      }
    } catch (err) {
      console.warn('Erreur extraction Maps HTML:', err);
    }

    // 4. Fallback extraction du nom depuis l'URL
    const decoded = decodeURIComponent(finalUrl);
    const placeMatch = decoded.match(/place\/([^\/@?#]+)/);
    if (placeMatch && placeMatch[1]) {
      const cleanName = placeMatch[1].replace(/\+/g, ' ').replace(/,\s*\d+.*$/, '').trim();
      if (cleanName.length > 1 && !cleanName.startsWith('@')) {
        return { resolvedQuery: cleanName };
      }
    }

    const qMatch = decoded.match(/[?&]q=([^&]+)/) || decoded.match(/search\/([^\/@?#]+)/);
    if (qMatch && qMatch[1]) {
      const cleanName = decodeURIComponent(qMatch[1]).replace(/\+/g, ' ').replace(/,\s*\d+.*$/, '').trim();
      if (cleanName.length > 1 && !cleanName.startsWith('@')) {
        return { resolvedQuery: cleanName };
      }
    }

    return { resolvedQuery: rawInput };
  } catch (e) {
    return { resolvedQuery: rawInput };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, url, businessName, city, clientToken, userEmail, manualRating, manualReviewCount } = body;

    // 1. Contrôle de sécurité d'accès Acheteur / Membre
    const referer = req.headers.get('referer') || '';
    const isInternalRequest = referer.includes('/outils/calculateur-fiche-google') || referer.includes('/tunnel/confirmation') || referer.includes('/dashboard/eleve');
    
    // Vérification de la session utilisateur Supabase SSR
    let isAuthorized = false;
    let authUserEmail = userEmail;

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        authUserEmail = user.email;
        const { data: orders } = await supabaseAdmin
          .from('orders')
          .select('id, product_id')
          .eq('user_id', user.id)
          .eq('status', 'paid');

        const hasProduct = orders?.some(o => 
          o.product_id.includes('google') || 
          o.product_id.includes('calculateur') ||
          o.product_id.includes('orderbump')
        );

        if (
          hasProduct || 
          user.email === 'contact@guides-digitaux.com' || 
          user.email?.includes('admin') || 
          user.email?.includes('stephanie') || 
          user.email?.includes('stratec-digital.com')
        ) {
          isAuthorized = true;
        }
      }
    } catch (authCheckErr) {
      // Session non active
    }

    if (clientToken || isInternalRequest || isAuthorized || process.env.NODE_ENV === 'development') {
      isAuthorized = true;
    }

    if (!isAuthorized && process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        found: false,
        error: 'Accès restreint : cet outil d\'audit est exclusivement réservé aux acheteurs de la formation Fiche Google.'
      }, { status: 403 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyCrvvH4CDd2aloQA4vXacXUGzYbiYpcqZU';

    // Résolution du terme de recherche ou du Place ID direct
    let directPlaceId: string | undefined;
    let searchQuery = '';
    const rawInput = (url || query || '').trim();

    if (rawInput.startsWith('ChIJ')) {
      directPlaceId = rawInput;
    } else if (rawInput.startsWith('http://') || rawInput.startsWith('https://') || rawInput.includes('maps.google') || rawInput.includes('goo.gl')) {
      const resolved = await resolveGoogleMapsInput(rawInput);
      if (resolved.placeId) {
        directPlaceId = resolved.placeId;
      }
      searchQuery = resolved.resolvedQuery;
    } else if (businessName) {
      searchQuery = `${businessName} ${city || ''}`.trim();
    } else if (query) {
      searchQuery = query.trim();
    }

    if (!searchQuery && city) {
      searchQuery = city.trim();
    }

    let place: any = null;

    // A. Récupération directe par Place ID si résolu
    if (directPlaceId) {
      try {
        const placeRes = await fetch(`https://places.googleapis.com/v1/places/${directPlaceId}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'id,displayName,formattedAddress,shortFormattedAddress,rating,userRatingCount,photos,types,editorialSummary,websiteUri,nationalPhoneNumber,regularOpeningHours,pureServiceAreaBusiness,googleMapsUri'
          }
        });
        const placeData = await placeRes.json();
        if (placeData && (placeData.id || placeData.displayName)) {
          place = placeData;
        }
      } catch (err) {
        console.warn('Erreur appel direct Place ID:', err);
      }
    }

    // B. Recherche textuelle si pas de Place ID direct
    if (!place && searchQuery && !searchQuery.startsWith('http')) {
      const trySearch = async (q: string) => {
        const googleRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.shortFormattedAddress,places.rating,places.userRatingCount,places.photos,places.types,places.editorialSummary,places.websiteUri,places.nationalPhoneNumber,places.regularOpeningHours,places.pureServiceAreaBusiness,places.reviews,places.googleMapsUri'
          },
          body: JSON.stringify({
            textQuery: q,
            languageCode: 'fr'
          })
        });
        const data = await googleRes.json();
        return data.places?.[0] || null;
      };

      place = await trySearch(searchQuery);

      if (!place && businessName && searchQuery !== businessName) {
        place = await trySearch(businessName);
      }

      if (!place && businessName && city) {
        place = await trySearch(`${businessName} ${city} France`);
      }
    }

    // 2. Si l'API a trouvé l'établissement réel
    if (place) {
      const realName = place.displayName?.text || businessName || searchQuery || 'Établissement';
      const realAddress = place.formattedAddress || place.shortFormattedAddress || (place.pureServiceAreaBusiness ? 'Zone de service (Prestataire itinérant)' : '') || city || '';
      const realRating = place.rating !== undefined ? place.rating : (Number(manualRating) || 5.0);
      const realRatingCount = place.userRatingCount !== undefined ? place.userRatingCount : (Number(manualReviewCount) || 0);
      const realPhotoCount = place.photos?.length || 0;
      const hasDescription = Boolean(place.editorialSummary?.text && place.editorialSummary.text.length > 30);
      const hasWebsite = Boolean(place.websiteUri);
      const hasPhone = Boolean(place.nationalPhoneNumber);
      const hasHours = Boolean(place.regularOpeningHours?.weekdayDescriptions?.length);
      const types = place.types || [];

      // Calcul des 4 Piliers Fondamentaux (sur 25 points chacun = 100 points max)
      
      // Pilier 1 : Coordonnées & Complétude (25 pts)
      let pillar1Score = 10;
      if (hasPhone) pillar1Score += 5;
      if (hasHours) pillar1Score += 5;
      if (hasWebsite) pillar1Score += 5;

      // Pilier 2 : Preuve Sociale & Avis Clients (25 pts)
      let pillar2Score = 5;
      if (realRatingCount >= 20) pillar2Score = 20;
      else if (realRatingCount >= 10) pillar2Score = 16;
      else if (realRatingCount >= 5) pillar2Score = 12;
      else if (realRatingCount >= 1) pillar2Score = 8;

      if (realRating >= 4.8) pillar2Score += 5;
      else if (realRating >= 4.4) pillar2Score += 3;
      else if (realRating >= 4.0) pillar2Score += 1;
      pillar2Score = Math.min(25, pillar2Score);

      // Pilier 3 : Couverture Visuelle & Photos (25 pts)
      let pillar3Score = 6;
      if (realPhotoCount >= 10) pillar3Score = 25;
      else if (realPhotoCount >= 5) pillar3Score = 18;
      else if (realPhotoCount >= 2) pillar3Score = 12;

      // Pilier 4 : Sémantique & Description Métier (25 pts)
      let pillar4Score = hasDescription ? 24 : 10;

      const finalScore = Math.min(Math.max(pillar1Score + pillar2Score + pillar3Score + pillar4Score, 20), 99);

      let grade = 'Critique (Risque élevé d\'invisibilité)';
      let statusColor = '#ef4444'; // rouge

      if (finalScore >= 85) {
        grade = 'Excellent (Fiche Optimisée Top 3 Google Maps)';
        statusColor = '#10b981'; // vert
      } else if (finalScore >= 70) {
        grade = 'Bon potentiel (Optimisation recommandée)';
        statusColor = '#18757d'; // teal
      } else if (finalScore >= 50) {
        grade = 'Moyen (Perte de visibilité locale)';
        statusColor = '#f59e0b'; // orange
      }

      // Génération dynamique des 3 Quick Wins
      const quickWins = [];

      if (realRatingCount < 15 || realRating < 4.8) {
        quickWins.push({
          id: 1,
          icon: '⭐',
          title: `Activer la récolte d'avis WhatsApp (${realRatingCount} avis répertoriés)`,
          impact: 'Critique' as const,
          time: '3 minutes',
          action: `Votre fiche compte actuellement ${realRatingCount} avis (${realRating}★). Envoyez notre modèle WhatsApp post-prestation à vos 5 derniers clients pour consolider votre positionnement local.`,
          moduleLink: 'Module 6 : La Machine à Avis 5 Étoiles'
        });
      }

      if (realPhotoCount < 10) {
        quickWins.push({
          id: 2,
          icon: '📸',
          title: 'Ajouter 5 photos professionnelles d\'atelier ou réalisations',
          impact: 'Élevé' as const,
          time: '5 minutes',
          action: `Seulement ${realPhotoCount} photo(s) publique(s) détectée(s). L'algorithme Google Maps privilégie les fiches avec une galerie active et des clichés récents de vos créations.`,
          moduleLink: 'Module 4 : Photos Vendeuses & Google Vision AI'
        });
      }

      if (!hasDescription || finalScore < 85) {
        quickWins.push({
          id: 3,
          icon: '✍️',
          title: 'Optimiser la description avec les 10 Prompts IA',
          impact: 'Très élevé' as const,
          time: '2 minutes',
          action: `Rédigez une bio de 750 caractères intégrant vos mots-clés de savoir-faire couplés à votre zone géographique (${realAddress.split(',')[1]?.trim() || 'votre ville'}).`,
          moduleLink: 'Module 3 : Description & Prompts IA'
        });
      }

      if (quickWins.length < 3) {
        quickWins.push({
          id: 4,
          icon: '📢',
          title: 'Publier 1 Post Google avec appel à l\'action direct',
          impact: 'Élevé' as const,
          time: '2 minutes',
          action: 'Les actualités régulières envoient un signal de fraîcheur algorithmique prioritaire dans le Pack Local.',
          moduleLink: 'Module 7 : Routine 5 min & Posts Google'
        });
      }

      return NextResponse.json({
        found: true,
        data: {
          placeId: place.id,
          name: realName,
          address: realAddress,
          rating: realRating,
          ratingCount: realRatingCount,
          photoCount: realPhotoCount,
          hasDescription,
          hasWebsite,
          hasPhone,
          hasHours,
          types,
          googleMapsUri: place.googleMapsUri,
          score: finalScore,
          grade,
          statusColor,
          summary: `Fiche réelle analysée en direct sur Google Maps : score d'excellence de ${finalScore}/100 (${realRatingCount} avis vérifiés, note de ${realRating}★). En appliquant les actions prioritaires ci-dessous, vous consolidez votre place dans le Pack Local.`,
          pillars: [
            {
              title: 'Fondations & Complétude',
              score: pillar1Score,
              max: 25,
              status: pillar1Score >= 20 ? 'good' : 'warning',
              feedback: hasWebsite && hasPhone ? 'Coordonnées, horaires et site web parfaitement renseignés.' : 'Complétez votre numéro ou votre site pour faciliter le contact direct.'
            },
            {
              title: 'Preuve Sociale & Avis Clients',
              score: pillar2Score,
              max: 25,
              status: pillar2Score >= 20 ? 'good' : pillar2Score >= 12 ? 'warning' : 'bad',
              feedback: `${realRatingCount} avis répertoriés avec une note moyenne de ${realRating}★. ${realRatingCount >= 20 ? 'Excellente réputation locale et volume d\'avis solide.' : 'Continuez à collecter régulièrement des avis 5 étoiles pour devancer vos concurrents.'}`
            },
            {
              title: 'Couverture Visuelle (Google Vision)',
              score: pillar3Score,
              max: 25,
              status: pillar3Score >= 20 ? 'good' : pillar3Score >= 12 ? 'warning' : 'bad',
              feedback: `${realPhotoCount} photo(s) publique(s). ${realPhotoCount >= 10 ? 'Très bonne présence photo.' : 'Ajoutez davantage de visuels de votre atelier et de vos créations.'}`
            },
            {
              title: 'Sémantique & Description Métier',
              score: pillar4Score,
              max: 25,
              status: pillar4Score >= 20 ? 'good' : 'warning',
              feedback: hasDescription ? 'Description présente et bien indexée sur votre fiche.' : 'Description incomplète : insérez vos mots-clés métiers pour capter plus de recherches locales.'
            }
          ],
          quickWins: quickWins.slice(0, 3)
        }
      });
    }

    // 3. Fallback : Si aucune fiche Google Maps n'a été trouvée via l'API
    return NextResponse.json({
      found: false,
      message: `Aucun établissement Google Places n'a pu être scanné pour "${searchQuery || 'ce lien'}". Vérifiez que le lien Google Maps est valide et que la fiche est bien publique.`
    });

  } catch (error: any) {
    console.error('Erreur audit Places API:', error);
    return NextResponse.json({
      found: false,
      error: 'Erreur lors de la communication avec l\'API Google Places.',
      details: error.message
    }, { status: 500 });
  }
}
