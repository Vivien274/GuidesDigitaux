/**
 * Builds a server-authorized download URL. The file path is deliberately not
 * sent to the server: the API resolves it from the purchased product id.
 */
export function getEncryptedDownloadUrl(_filePath: string, productId?: string, _expiresHours?: number): string {
  if (!productId) return '#';

  const params = new URLSearchParams({ productId });
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    const checkoutSessionId = searchParams.get('session_id') || searchParams.get('sessionId');
    if (checkoutSessionId) params.set('session_id', checkoutSessionId);
  }

  return `/api/download?${params.toString()}`;
}
