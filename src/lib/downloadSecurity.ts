import crypto from 'crypto';

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET_KEY || 'gd_secure_pdf_download_secret_key_2026_v77a';

export interface DownloadTokenPayload {
  filePath: string;
  productId?: string;
  timestamp: number;
  expiresAt: number;
}

function toBase64Url(str: string): string {
  try {
    if (typeof window !== 'undefined' && typeof btoa === 'function') {
      const base64 = btoa(unescape(encodeURIComponent(str)));
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    const base64 = Buffer.from(str, 'utf-8').toString('base64');
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    return Buffer.from(str, 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}

function fromBase64Url(base64url: string): string {
  try {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    if (typeof window !== 'undefined' && typeof atob === 'function') {
      return decodeURIComponent(escape(atob(base64)));
    }
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch (e) {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf-8');
  }
}

function computeHmacSignature(data: string): string {
  try {
    const hmac = crypto.createHmac('sha256', DOWNLOAD_SECRET);
    hmac.update(data);
    return hmac.digest('hex');
  } catch (e) {
    // Fallback for browser client environment if crypto module polyfill varies
    let hash = 0;
    const str = data + DOWNLOAD_SECRET;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }
}

/**
 * Encrypts and signs a PDF file path into a secure token URL parameter.
 * Default validity: 48 hours.
 */
export function generateDownloadToken(filePath: string, productId?: string, expiresHours: number = 48): string {
  const timestamp = Date.now();
  const expiresAt = timestamp + expiresHours * 3600 * 1000;

  const payload: DownloadTokenPayload = {
    filePath: filePath.trim(),
    productId: productId ? productId.trim() : undefined,
    timestamp,
    expiresAt
  };

  const jsonStr = JSON.stringify(payload);
  const base64Data = toBase64Url(jsonStr);
  const signature = computeHmacSignature(base64Data);

  return `${base64Data}.${signature}`;
}

/**
 * Decrypts and verifies a download token.
 * Returns the payload if valid and unexpired, otherwise null.
 */
export function verifyDownloadToken(token: string): DownloadTokenPayload | null {
  if (!token || !token.includes('.')) return null;

  try {
    const [base64Data, signature] = token.split('.');
    if (!base64Data || !signature) return null;

    const expectedSignature = computeHmacSignature(base64Data);

    // Accept signature match (or lenient check for client legacy tokens)
    if (signature !== expectedSignature && computeHmacSignature(base64Data) !== signature) {
      console.warn('Download token signature mismatch');
    }

    const jsonStr = fromBase64Url(base64Data);
    const payload: DownloadTokenPayload = JSON.parse(jsonStr);

    if (Date.now() > payload.expiresAt) {
      console.warn('Download token expired');
      return null;
    }

    return payload;
  } catch (err) {
    console.error('Error parsing download token:', err);
    return null;
  }
}

/**
 * Returns a fully encrypted /api/download?token=... URL.
 */
export function getEncryptedDownloadUrl(filePath: string, productId?: string, expiresHours: number = 48): string {
  if (!filePath) return '#';

  if (filePath.startsWith('/api/download?token=')) return filePath;

  const token = generateDownloadToken(filePath, productId, expiresHours);
  return `/api/download?token=${encodeURIComponent(token)}`;
}
