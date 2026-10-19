import { siteConfig } from "@/config/site";

/** GTM container ID, or null when unset or malformed. */
export function googleTagManagerId(): string | null {
  const id = siteConfig.googleTagManagerId?.trim();
  return id && /^GTM-[A-Z0-9]+$/.test(id) ? id : null;
}

/** GTM loader. Render as high in <head> as possible. */
export function GoogleTagManagerScript() {
  const id = googleTagManagerId();
  if (!id) return null;
  return (
    // Google's own snippet, inline so it runs as early as possible (no @next/third-parties dependency).
    // eslint-disable-next-line @next/next/next-script-for-ga
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`,
      }}
    />
  );
}

/** GTM fallback for visitors without JavaScript. Render right after <body>. */
export function GoogleTagManagerNoScript() {
  const id = googleTagManagerId();
  if (!id) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
