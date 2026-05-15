import { useEffect } from "react";

const SITE = "https://spelmodellen.se";

export interface PageMeta {
  title: string;
  description?: string;
  /** Path-only canonical, e.g. "/forsvar". Defaults to current pathname. */
  canonical?: string;
  /** OG image override (absolute or root-relative). Defaults to /og-image.png. */
  image?: string;
  /** Add <meta name="robots" content="noindex"> for auth-only pages. */
  noindex?: boolean;
}

function upsertMeta(selector: string, create: () => HTMLElement) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setNamed(name: string, content: string) {
  const el = upsertMeta(`meta[name="${name}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("name", name);
    return m;
  });
  el.setAttribute("content", content);
}

function setProperty(property: string, content: string) {
  const el = upsertMeta(`meta[property="${property}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("property", property);
    return m;
  });
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sätter route-specifik <title>, description, canonical och OG/Twitter-taggar.
 * Tar bort behov av Helmet — vi har bara en handfull rutter och en SPA.
 *
 * Default-värden ärvs från index.html om en page inte kallar usePageMeta.
 */
export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    const title = meta.title;
    const description = meta.description ?? "";
    const path = meta.canonical ?? window.location.pathname;
    const canonical = `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
    const image = meta.image
      ? meta.image.startsWith("http")
        ? meta.image
        : `${SITE}${meta.image.startsWith("/") ? meta.image : `/${meta.image}`}`
      : `${SITE}/og-image.png`;

    document.title = title;
    if (description) setNamed("description", description);
    setCanonical(canonical);

    setProperty("og:title", title);
    if (description) setProperty("og:description", description);
    setProperty("og:url", canonical);
    setProperty("og:image", image);
    setProperty("og:image:secure_url", image);
    setProperty("og:type", "website");
    setProperty("og:locale", "sv_SE");
    setProperty("og:site_name", "Gunnilse IS");

    setNamed("twitter:card", "summary_large_image");
    setNamed("twitter:title", title);
    if (description) setNamed("twitter:description", description);
    setNamed("twitter:image", image);

    // Robots-styrning: chatten/loginade rutter ska inte indexeras.
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (meta.noindex) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex, nofollow");
    } else if (robots) {
      robots.setAttribute("content", "index, follow");
    }
  }, [meta.title, meta.description, meta.canonical, meta.image, meta.noindex]);
}
