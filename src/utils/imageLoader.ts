import type { ImageLoaderProps } from "next/image";

// No Vercel image optimization at all (the Hobby plan caps transformations,
// and a custom loader disables the built-in /_next/image endpoint anyway):
// - TMDB already serves resized copies from its CDN, so request the closest size.
// - Local images in /public are pre-compressed .webp/.svg and served as-is.
const TMDB_PREFIX = "https://image.tmdb.org/t/p/";
const TMDB_WIDTHS = [92, 154, 185, 300, 342, 500, 780, 1280];

export default function imageLoader({ src, width }: ImageLoaderProps) {
  // The query is ignored by the static file server; it only keeps the URL
  // width-aware, which Next checks for.
  if (!src.startsWith(TMDB_PREFIX)) return `${src}?w=${width}`;

  const file = src.slice(TMDB_PREFIX.length).replace(/^[^/]+/, "");
  const size = TMDB_WIDTHS.find((w) => w >= width);
  return `${TMDB_PREFIX}${size ? `w${size}` : "original"}${file}`;
}
