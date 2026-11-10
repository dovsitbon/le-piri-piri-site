import type { Locale } from "@/lib/locales";

// Pages secondaires et leurs adresses dans chaque langue.
// « portugais » et « piripiri » : pages de référencement local (restaurant portugais près d'Amiens, poulet piri piri à Amiens).
export const PAGE_IDS = ["carte", "portugais", "piripiri", "legal"] as const;
export type PageId = (typeof PAGE_IDS)[number];

export const SLUGS: Record<PageId, Record<Locale, string>> = {
  carte: { fr: "carte", en: "menu", pt: "ementa" },
  portugais: { fr: "restaurant-portugais-amiens", en: "portuguese-restaurant-amiens", pt: "restaurante-portugues-amiens" },
  piripiri: { fr: "poulet-piri-piri-amiens", en: "piri-piri-chicken-amiens", pt: "frango-piri-piri-amiens" },
  legal: { fr: "mentions-legales", en: "legal", pt: "informacoes-legais" },
};

export const pagePath = (id: PageId, lang: Locale) => `/${lang}/${SLUGS[id][lang]}`;

export const pageOfSlug = (slug: string, lang: Locale) => PAGE_IDS.find((id) => SLUGS[id][lang] === slug) ?? null;
