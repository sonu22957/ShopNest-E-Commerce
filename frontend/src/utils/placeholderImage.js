export const getPlaceholderImage = (label = "Product") => {
  const safeLabel = String(label).slice(0, 24);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500"><rect width="600" height="500" fill="#1a1a2e"/><text x="300" y="260" fill="#ff6b00" font-family="sans-serif" font-size="28" text-anchor="middle">${safeLabel}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};