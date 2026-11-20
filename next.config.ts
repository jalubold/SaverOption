import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Keep recently visited app pages in the browser for 30 s, and pages fetched ahead of a click
    // (sidebar hover, static pages) for 60 s, so moving between them is instant. Saving anything
    // calls revalidatePath, which clears this cache.
    staleTimes: { dynamic: 30, static: 60 },
  },
  async rewrites() {
    return {
      // saveroption.com is Saver Option Business: the home page shows the Business landing page
      // (/business still works and is the same page, with the same cached copy). beforeFiles, so it
      // takes the place of the deals home page (src/app/page.tsx); the deals catalog keeps /deals,
      // /categories, /for and the deal pages.
      beforeFiles: [{ source: "/", destination: "/business" }],
    };
  },
};

export default nextConfig;
