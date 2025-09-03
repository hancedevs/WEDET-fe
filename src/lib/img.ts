// lib/img.ts
export const optimizeImageUrl = (url: string, width = 960, quality = 70) => {
  try {
    const u = new URL(url, typeof window === "undefined" ? "https://base" : undefined);

    // Example: Supabase Storage transforms
    if (u.hostname.endsWith(".supabase.co") && u.pathname.includes("/storage/")) {
      u.searchParams.set("width", String(width));
      u.searchParams.set("quality", String(quality));
      u.searchParams.set("format", "webp");
      return u.toString();
    }

    return url; // Next <Image> will still optimize remotely
  } catch {
    return url;
  }
};
