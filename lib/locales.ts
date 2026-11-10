// Langues du site, sans les textes : importable côté client sans embarquer les dictionnaires.
export const locales = ["fr", "en", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export const ogLocale: Record<Locale, string> = { fr: "fr_FR", en: "en_GB", pt: "pt_PT" };
export const intlLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB", pt: "pt-PT" };
