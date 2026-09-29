const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360">
<rect width="100%" height="100%" fill="#e2e8f0"/>
<text x="50%" y="50%" fill="#64748b" font-family="sans-serif" font-size="22" text-anchor="middle">Image unavailable</text></svg>`;

export const FALLBACK_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export function handleImgError(e) {
  e.currentTarget.onerror = null; // avoid infinite loop
  e.currentTarget.src = FALLBACK_IMG;
}