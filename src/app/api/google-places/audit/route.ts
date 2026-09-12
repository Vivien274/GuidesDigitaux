import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Helper pour résoudre les redirections de liens courts Google Maps (ex: maps.app.goo.gl)
async function resolveGoogleMapsUrl(rawUrl: string): Promise<{ resolvedQuery: string; placeId?: string }> {
  try {
    let targetUrl = rawUrl.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    let finalUrl = targetUrl;
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      finalUrl = response.url || targetUrl;
    } catch (fetchErr) {
      finalUrl = targetUrl;
    }

    const decoded = decodeURIComponent(finalUrl);

    // Extraction 1 : /place/Nom+Etablissement/
    const placeMatch = decoded.match(/place\/([^\/@?#]+)/);
    if (placeMatch && placeMatch[1]) {
      const cleanName = placeMatch[1].replace(/\+/g, ' ').replace(/,\s*\d+.*$/, '').trim();
      if (cleanName.length > 1 && !cleanName.startsWith('@')) {
        return { resolvedQuery: cleanName };
      }
    }

    // Extraction 2 : /search/Nom+Etablissement/ ou ?q=Nom
    const qMatch = decoded.match(/[?&]q=([^&]+)/) || decoded.match(/search\/([^\/@?#]+)/);
    if (qMatch && qMatch[1]) {
      const cleanName = decodeURIComponent(qMatch[1]).replace(/\+/g, ' ').replace(/,\s*\d+.*$/, '').trim();
      if (cleanName.length > 1 && !cleanName.startsWith('@')) {
        return { resolvedQuery: cleanName };
      }
    }

    // Extraction 3 : data=!1s... Place ID
    const placeIdMatch = decoded.match(/!1s(0x[0-9a-fA-F]+:0x[0-9a-fA-F]+)/);
    if (placeIdMatch && placeIdMatch[1]) {
      return { resolvedQuery: rawUrl, placeId: placeIdMatch[1] };
    }

    return { resolvedQuery: rawUrl };
  } catch (e) {
    return { resolvedQuery: rawUrl };
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

    // Résolution du terme de recherche
    let searchQuery = '';
    const rawInput = (url || query || '').trim();

    if (rawInput.startsWith('http://') || rawInput.startsWith('https://') || rawInput.includes('maps.google') || rawInput.includes('goo.gl')) {
      const { resolvedQuery } = await resolveGoogleMapsUrl(rawInput);
      searchQuery = resolvedQuery;
    } else if (businessName) {
      searchQuery = `${businessName} ${city || ''}`.trim();
    } else if (query) {
      searchQuery = query.trim();
    }

    if (!searchQuery && city) {
      searchQuery = city.trim();
    }

    // Helper pour vérifier que l'établissement trouvé par Google correspond bien au nom et à la zone recherchée
    const isNameMatching = (searchedName: string, candidateName: string, searchedCity?: string, candidateAddress?: string): boolean => {
      if (!searchedName || !candidateName) return true;
      const cleanA = searchedName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
      const cleanB = candidateName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
      
      // Si les chaînes nettoyées sont très proches
      if (cleanA === cleanB || cleanB.startsWith(cleanA) || cleanA.startsWith(cleanB)) return true;
      
      const wordsA = searchedName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/\s+/).filter(w => w.length > 1);
      const wordsB = candidateName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/\s+/).filter(w => w.length > 1);
      
      // Vérification géographique si une ville est spécifiée
      if (searchedCity && candidateAddress) {
        const cleanCity = searchedCity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        const cleanAddr = candidateAddress.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (cleanCity.length > 2 && !cleanAddr.includes(cleanCity)) {
          return false; // Rejeter si la ville ne correspond pas
        }
      }

      // Pourcentage de mots en commun
      const matchingWords = wordsA.filter(w => wordsB.some(wb => wb === w || (w.length > 3 && (wb.includes(w) || w.includes(wb)))));
      const matchRatio = matchingWords.length / wordsA.length;

      return matchRatio >= 0.6;
    };

    let place: any = null;

    if (searchQuery && !searchQuery.startsWith('http')) {
      const trySearch = async (q: string) => {
        const googleRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.types,places.editorialSummary,places.websiteUri,places.nationalPhoneNumber,places.regularOpeningHours,places.reviews,places.googleMapsUri'
          },
          body: JSON.stringify({
            textQuery: q,
            languageCode: 'fr'
          })
        });
        const data = await googleRes.json();
        const candidate = data.places?.[0] || null;
        if (candidate && businessName && candidate.displayName?.text) {
          if (!isNameMatching(businessName, candidate.displayName.text, city, candidate.formattedAddress)) {
            return null; // Rejeter le faux positif renvoyé par le fuzzy matching de Google
          }
        }
        return candidate;
      };

      place = await trySearch(searchQuery);

      // Essai 2 : Si échec, essayer avec juste le nom
      if (!place && businessName && searchQuery !== businessName) {
        place = await trySearch(businessName);
      }

      // Essai 3 : Si échec, essayer en ajoutant la ville et la France
      if (!place && businessName && city) {
        place = await trySearch(`${businessName} ${city} France`);
      }
    }

    // 2. Si l'API a trouvé l'établissement réel
    if (place) {
      const realName = place.displayName?.text || businessName || searchQuery || 'Établissement';
      const realAddress = place.formattedAddress || city || '';
      const realRating = place.rating || Number(manualRating) || 5.0;
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
      message: `Aucun établissement Google Places n'a pu être scanné automatiquement pour "${searchQuery}". Vous pouvez utiliser le mode de simulation manuelle ci-dessous.`
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
