import { useState, useEffect } from "react";

const fallbackCMS = {
  categories: [
    { id: "strategy", title: "Strategi", blurb: "Retning og prioriteringer." },
    { id: "research", title: "Innsikt", blurb: "Intervjuer og undersøkelser." },
    {
      id: "service",
      title: "Tjenestedesign",
      blurb: "Flyt og kontaktpunkter.",
    },
    { id: "brand", title: "Merkevare", blurb: "Identitet og posisjon." },
    { id: "content", title: "Innhold", blurb: "Historier og format." },
    { id: "product", title: "Produkt", blurb: "Digitale opplevelser." },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Prosjekt Alfa",
      excerpt:
        "Vi hentet innsikt gjennom 1:1 samtaler og leverte en tydelig retning.",
      categories: ["research", "strategy"],
      images: ["/cms/alfa-1.jpg", "/cms/alfa-2.jpg"],
    },
    {
      id: "proj-2",
      title: "Prosjekt Beta",
      excerpt: "Nye brukerreiser og tjenesteflyt på tvers av kanaler.",
      categories: ["service"],
      images: ["/cms/beta-1.jpg"],
    },
    {
      id: "proj-3",
      title: "Prosjekt Gamma",
      excerpt: "Ny visuell identitet og merkevareplattform.",
      categories: ["brand", "content"],
      images: ["/cms/gamma-1.jpg", "/cms/gamma-2.jpg"],
    },
  ],
};

export default function useCMS() {
  const [cms, setCMS] = useState(fallbackCMS);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/cms/data.json", { cache: "no-store" });
        if (!res.ok) return; // use fallback if 404
        const data = await res.json();
        if (!cancelled) setCMS(data);
      } catch (_) {
        // ignore, use fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return cms;
}
