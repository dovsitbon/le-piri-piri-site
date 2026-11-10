import Link from "next/link";
import site from "@/data/site.json";
import { Logo } from "@/components/Logo";
import { HoursTable } from "@/components/HoursTable";
import { FacebookIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/pages";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const links = [
    { href: pagePath("carte", lang), label: d.footer.menu },
    { href: pagePath("portugais", lang), label: d.footer.portugais },
    { href: pagePath("piripiri", lang), label: d.footer.piripiri },
    { href: pagePath("legal", lang), label: d.footer.legal },
  ];
  return (
    <footer className="azulejo-dark pb-24 text-paper md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_1fr_1.2fr] md:px-10 md:py-20">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs leading-relaxed text-paper/85">{d.footer.tagline}</p>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="-ms-3 mt-4 flex h-11 w-11 items-center justify-center hover:text-sol" aria-label={d.nav.facebook}>
            <FacebookIcon />
          </a>
        </div>
        <div className="leading-relaxed">
          <p className="mb-3 font-[family-name:var(--font-display)] text-lg italic text-sol">{d.infos.address}</p>
          <address className="text-lg not-italic">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </address>
          <div className="mt-3 flex flex-col items-start">
            <a href={`tel:${site.phoneIntl}`} className="inline-flex min-h-11 items-center gap-2 font-medium hover:text-sol">
              <PhoneIcon className="h-[18px] w-[18px]" />
              {site.phone}
            </a>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-medium hover:text-sol">
              <PinIcon className="h-[18px] w-[18px]" />
              {d.nav.route}
            </a>
          </div>
          <ul className="mt-5 space-y-0.5 text-paper/85">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-9 items-center hover:text-paper hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-[family-name:var(--font-display)] text-lg italic text-sol">{d.infos.hours}</p>
          <HoursTable lang={lang} d={d} compact />
        </div>
      </div>
      <p className="border-t border-paper/15 px-6 py-6 text-center text-sm text-paper/75">{fill(d.footer.rights, { year: new Date().getFullYear() })}</p>
    </footer>
  );
}
