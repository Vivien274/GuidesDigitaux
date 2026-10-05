/**
 * Builds a server-authorized download URL. The file path is deliberately not
 * sent to the server: the API resolves it from the purchased product id.
 */
export function getEncryptedDownloadUrl(_filePath: string, productId?: string, _expiresHours?: number): string {
  if (!productId) return '#';

  const params = new URLSearchParams({ productId });
  if (typeof window !== 'undefined') {
    const checkoutSessionId = new URLSearchParams(window.location.search).get('session_id');
    if (checkoutSessionId) params.set('session_id', checkoutSessionId);
  }

  return `/api/download?${params.toString()}`;
}
