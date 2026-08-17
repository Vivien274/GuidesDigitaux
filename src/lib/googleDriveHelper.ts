/**
 * Google Drive URL Extraction & Auto-Conversion Helper
 * Converts any Google Drive share link into a direct downloadable or embeddable URL.
 */

export function extractGoogleDriveId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  // Format 1: https://drive.google.com/file/d/FILE_ID/view...
  const matchFileD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Format 2: https://drive.google.com/open?id=FILE_ID or uc?id=FILE_ID
  const matchIdParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  return null;
}

/**
 * Converts a Google Drive URL or raw File ID into a direct PDF download link
 */
export function convertToGoogleDrivePdfUrl(urlOrId: string): string {
  const fileId = extractGoogleDriveId(urlOrId) || urlOrId.trim();
  if (!fileId) return urlOrId;
  // If it's already a full non-drive HTTP URL, return as is
  if (urlOrId.startsWith('http') && !urlOrId.includes('drive.google.com') && !urlOrId.includes('docs.google.com')) {
    return urlOrId;
  }
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Converts a Google Drive URL or raw File ID into a direct Image Embed URL
 */
export function convertToGoogleDriveImageUrl(urlOrId: string): string {
  const fileId = extractGoogleDriveId(urlOrId) || urlOrId.trim();
  if (!fileId) return urlOrId;
  if (urlOrId.startsWith('http') && !urlOrId.includes('drive.google.com') && !urlOrId.includes('docs.google.com')) {
    return urlOrId;
  }
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}
