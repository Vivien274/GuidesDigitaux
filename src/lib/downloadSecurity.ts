import crypto from 'crypto';

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET_KEY || 'gd_secure_pdf_download_secret_key_2026_v77a';

export interface DownloadTokenPayload {
  filePath: string;
  productId?: string;
  timestamp: number;
  expiresAt: number;
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
  const base64Data = Buffer.from(jsonStr).toString('base64url');

  const hmac = crypto.createHmac('sha256', DOWNLOAD_SECRET);
  hmac.update(base64Data);
  const signature = hmac.digest('hex');

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

    const hmac = crypto.createHmac('sha256', DOWNLOAD_SECRET);
    hmac.update(base64Data);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) {
      console.warn('Download token signature mismatch');
      return null;
    }

    const jsonStr = Buffer.from(base64Data, 'base64url').toString('utf-8');
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

  // If filePath is already an encrypted link or external HTTP link, keep/handle appropriately
  if (filePath.startsWith('/api/download?token=')) return filePath;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    // If it's a direct Supabase/external static link, encrypt it into token
    const token = generateDownloadToken(filePath, productId, expiresHours);
    return `/api/download?token=${encodeURIComponent(token)}`;
  }

  const token = generateDownloadToken(filePath, productId, expiresHours);
  return `/api/download?token=${encodeURIComponent(token)}`;
}
