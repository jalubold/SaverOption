import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Keep recently visited app pages in the browser for 30 s, and pages fetched ahead of a click
    // (sidebar hover, static pages) for 60 s, so moving between them is instant. Saving anything
    // calls revalidatePath, which clears this cache.
    staleTimes: { dynamic: 30, static: 60 },
  },
};

export default nextConfig;
