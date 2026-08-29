/**
 * Google reCAPTCHA v3 (Invisible) & Anti-Spam Security Helper
 * Guides Digitaux
 */

export async function verifyReCaptchaToken(token: string): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // If no secret key configured in environment, fallback to valid so development/testing works seamlessly
  if (!secretKey) {
    return { success: true, score: 1.0 };
  }

  if (!token) {
    return { success: false, error: 'Jeton reCAPTCHA manquant' };
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await res.json();

    if (data.success && (data.score === undefined || data.score >= 0.5)) {
      return { success: true, score: data.score ?? 0.9 };
    }

    return {
      success: false,
      score: data.score,
      error: 'Échec de la vérification de sécurité (détection de bot automatique).',
    };
  } catch (err: any) {
    console.error('Erreur de vérification reCAPTCHA:', err);
    return { success: false, error: 'Erreur lors du contrôle reCAPTCHA' };
  }
}
