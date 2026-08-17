const encoder = new TextEncoder();

export interface SessionData {
  userId: string;
  email: string;
  role: 'superadmin' | 'formateur' | 'eleve';
  fullName?: string;
  exp: number; // Expiration timestamp in ms
}

const DEFAULT_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'guides-digitaux-secure-session-secret-key-2026!';

/**
 * Generates an encrypted HMAC-SHA256 session token with a specific expiration time.
 */
export async function signSession(
  payload: { userId: string; email: string; role: string; fullName?: string },
  secret: string = DEFAULT_SECRET,
  expiresInDays: number = 30
): Promise<string> {
  const timestamp = Date.now();
  const exp = timestamp + expiresInDays * 24 * 60 * 60 * 1000;
  const normalizedEmail = payload.email.toLowerCase().trim();
  const rawData = JSON.stringify({
    userId: payload.userId,
    email: normalizedEmail,
    role: payload.role,
    fullName: payload.fullName || normalizedEmail.split('@')[0],
    exp
  });

  const base64Data = Buffer.from(rawData).toString('base64url');
  
  const keyBuf = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuf,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuf = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(base64Data)
  );
  
  const signatureHex = Array.from(new Uint8Array(signatureBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
    
  return `${base64Data}.${signatureHex}`;
}

/**
 * Cryptographically verifies if the given session token is valid and not expired.
 */
export async function verifySession(
  token: string | undefined | null,
  secret: string = DEFAULT_SECRET
): Promise<SessionData | null> {
  if (!token || !secret) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    
    const [base64Data, signature] = parts;
    
    const keyBuf = encoder.encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuf,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const expectedBuf = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      encoder.encode(base64Data)
    );
    
    const expectedHex = Array.from(new Uint8Array(expectedBuf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
      
    if (signature !== expectedHex) {
      return null;
    }

    const decodedJson = Buffer.from(base64Data, 'base64url').toString('utf-8');
    const data = JSON.parse(decodedJson) as SessionData;

    // Check if session has expired
    if (Date.now() > data.exp) {
      return null;
    }

    return data;
  } catch (e) {
    return null;
  }
}
