// ============================================================================
// HexaHome Image URL Normalizer & Fallback Utility
// Resolves relative URLs, localhost media server URLs, and handles fallbacks
// ============================================================================

export const DEFAULT_PROPERTY_IMAGE =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';

export const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : (import.meta.env.PROD ? 'https://hexahome-backend-xjmu.onrender.com' : '');

/**
 * Normalizes an image URL so it works in both local dev and production on Render/Vercel.
 * Replaces localhost:8081 references with the live backend host.
 */
export function resolveImageUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_PROPERTY_IMAGE;
  }

  const clean = url.trim();

  // If in-memory blob or data URL, return as is
  if (clean.startsWith('blob:') || clean.startsWith('data:')) {
    return clean;
  }

  // If pointing to localhost/127.0.0.1 in production
  if (clean.includes('localhost:8081') || clean.includes('127.0.0.1:8081')) {
    if (BACKEND_BASE_URL) {
      return clean.replace(/https?:\/\/(localhost|127\.0\.0\.1):8081/, BACKEND_BASE_URL);
    }
    return clean.replace(/https?:\/\/(localhost|127\.0\.0\.1):8081/, '');
  }

  // If starts with /uploads and in production, prepend backend URL
  if (clean.startsWith('/uploads') && BACKEND_BASE_URL) {
    return `${BACKEND_BASE_URL}${clean}`;
  }

  return clean;
}

/**
 * Standard image onError handler to replace broken images with a high-res placeholder
 */
export function handleImageError(e) {
  if (e?.target && e.target.src !== DEFAULT_PROPERTY_IMAGE) {
    e.target.src = DEFAULT_PROPERTY_IMAGE;
  }
}
