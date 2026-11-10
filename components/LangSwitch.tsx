"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/locales";
import { pageOfSlug, SLUGS } from "@/lib/pages";

const NAMES: Record<Locale, string> = { fr: "Français", en: "English", pt: "Português" };

/** « FR · EN · PT » : renvoie vers la même page dans l'autre langue (les adresses des pages sont traduites). */
export function LangSwitch({ lang, label, className = "" }: { lang: Locale; label: string; className?: string }) {
  const pathname = usePathname() || `/${lang}`;
  const slug = pathname.replace(/^\/(fr|en|pt)\/?/, "").split("/")[0];
  const page = slug ? pageOfSlug(slug, lang) : null;
  const target = (l: Locale) => (page ? `/${l}/${SLUGS[page][l]}` : `/${l}`);

  return (
    <nav aria-label={label} className={`flex items-center gap-1.5 text-[0.875rem] tracking-[0.08em] ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden="true" className="opacity-40">
              ·
            </span>
          )}
          <a
            href={target(l)}
            hrefLang={l}
            lang={l}
            aria-label={NAMES[l]}
            aria-current={l === lang ? "true" : undefined}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000;samesite=lax`;
            }}
            className={`inline-flex min-h-10 min-w-7 items-center justify-center transition-opacity ${l === lang ? "font-semibold opacity-100" : "opacity-60 hover:opacity-100"}`}
          >
            {l.toUpperCase()}
          </a>
        </span>
      ))}
    </nav>
  );
}
