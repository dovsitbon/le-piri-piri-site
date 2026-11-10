import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import { fill, getDict, isLocale, locales, type Dict, type Locale } from "@/lib/i18n";
import { formatDay } from "@/lib/format";
import { checked } from "@/lib/carte";
import { PAGE_IDS, pageOfSlug, pagePath, SLUGS, type PageId } from "@/lib/pages";
import { pageJsonLd } from "@/lib/jsonld";
import { MenuTabs } from "@/components/MenuTabs";
import { OrderLink } from "@/components/OrderLink";
import { OpenStatus } from "@/components/OpenStatus";
import { HoursTable } from "@/components/HoursTable";
import { Rating } from "@/components/Rating";
import { Photo } from "@/components/Photo";
import { PhoneIcon, PinIcon } from "@/components/icons";

export function generateStaticParams() {
  return locales.flatMap((lang) => PAGE_IDS.map((id) => ({ lang, slug: SLUGS[id][lang] })));
}
export const dynamicParams = false;

function resolve(lang: string, slug: string): { lang: Locale; id: PageId } | null {
  if (!isLocale(lang)) return null;
  const id = pageOfSlug(slug, lang);
  return id ? { lang, id } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang: l, slug } = await params;
  const r = resolve(l, slug);
  if (!r) return {};
  const d = getDict(r.lang);
  const p = d.pages[r.id];
  const description = "metaDescription" in p ? p.metaDescription : d.meta.description;
  return {
    title: p.metaTitle,
    description,
    alternates: {
      canonical: pagePath(r.id, r.lang),
      languages: { ...Object.fromEntries(locales.map((x) => [x, pagePath(r.id, x)])), "x-default": pagePath(r.id, "fr") },
    },
    openGraph: { title: p.metaTitle, description, url: pagePath(r.id, r.lang), images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
    robots: r.id === "legal" ? { index: false, follow: true } : undefined,
  };
}

function CallBand({ lang, d, title }: { lang: Locale; d: Dict; title: string }) {
  return (
    <div className="azulejo-dark mt-16 flex flex-col items-start gap-5 p-6 text-paper md:flex-row md:items-center md:justify-between md:p-10">
      <div>
        <p className="display text-[1.9rem]">{title}</p>
        <div className="mt-2 text-[0.9875rem]">
          <Rating lang={lang} d={d} />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <OrderLink href={`/${lang}#commander`} className="btn">
          {d.nav.orderCta}
        </OrderLink>
        <a href={`tel:${site.phoneIntl}`} className="btn-light">
          <PhoneIcon />
          {d.nav.call}
        </a>
      </div>
    </div>
  );
}

function Carte({ lang, d }: { lang: Locale; d: Dict }) {
  const p = d.pages.carte;
  return (
    <div className="px-4 pt-12 pb-24 md:px-8 md:pt-16 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">{p.eyebrow}</p>
            <h1 className="display mt-3 text-[3rem] md:text-[4.4rem]">{p.title}</h1>
            <p className="lead mt-4 max-w-xl">{p.lead}</p>
          </div>
          <div className="border border-line bg-white p-5 md:p-6">
            <HoursTable lang={lang} d={d} compact />
            <div className="mt-3 font-medium">
              <OpenStatus />
            </div>
          </div>
        </header>
        <div className="mt-12">
          <MenuTabs />
        </div>
        {checked && <p className="mt-3 text-[0.9375rem] text-muted">{fill(d.carte.checked, { date: formatDay(checked, lang, { day: "numeric", month: "long", year: "numeric" }) })}</p>}
        <CallBand lang={lang} d={d} title={d.order.title} />
      </div>
    </div>
  );
}

/** Pages de référencement local : « Restaurant portugais près d'Amiens », « Poulet piri piri à Amiens ». */
function Seo({ lang, d, id }: { lang: Locale; d: Dict; id: "portugais" | "piripiri" }) {
  const p = d.pages[id];
  const other = id === "portugais" ? "piripiri" : "portugais";
  return (
    <div className="px-4 pt-12 pb-24 md:px-8 md:pt-16 md:pb-32">
      <article className="mx-auto max-w-6xl">
        <header className="grid items-end gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">{p.eyebrow}</p>
            <h1 className="display mt-3 text-[2.9rem] md:text-[4.2rem]">{p.title}</h1>
            <p className="lead mt-5 max-w-xl">{p.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {id === "piripiri" ? (
                <OrderLink href={`/${lang}#commander`} intent={{ item: "poulet-entier" }} className="btn">
                  {p.cta}
                </OrderLink>
              ) : (
                <Link href={pagePath("carte", lang)} className="btn">
                  {p.cta}
                </Link>
              )}
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-line">
                <PinIcon />
                {d.nav.route}
              </a>
            </div>
          </div>
          <Photo paths={id === "piripiri" ? ["/media/grill/poulet-braise.jpg"] : ["/media/facade/facade.jpg"]} alt={id === "piripiri" ? d.alt.braise : d.alt.facade} illus={id === "piripiri" ? "chicken" : "facade"} tint="warm" sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/3]" />
        </header>

        <div className="frieze mt-16 opacity-50" aria-hidden="true" />

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {p.sections.map((s) => (
            <section key={s.h}>
              <h2 className="display text-[1.75rem]">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.p}</p>
            </section>
          ))}
        </div>

        <section className="mt-16 border-t border-line">
          {p.faq.map((f) => (
            <div key={f.q} className="border-b border-line py-6">
              <h2 className="font-[family-name:var(--font-display)] text-[1.3rem] font-medium">{f.q}</h2>
              <p className="mt-2 leading-relaxed text-muted">{f.a}</p>
            </div>
          ))}
        </section>

        <p className="mt-10">
          <Link href={pagePath(other, lang)} className="link-line font-medium">
            {d.pages[other].title}
          </Link>
        </p>

        <CallBand lang={lang} d={d} title={`${site.address.street}, ${site.address.city}`} />
      </article>
    </div>
  );
}

function Legal({ d }: { d: Dict }) {
  const p = d.pages.legal;
  const pending = <em className="text-muted">{p.toConfirm}</em>;
  const blocks: [string, React.ReactNode][] = [
    [p.editor, `${site.legal.company} (${site.name}), ${site.address.street}, ${site.address.postalCode} ${site.address.city} · ${site.phone}${site.email ? ` · ${site.email}` : ""}`],
    [p.siret, site.legal.siret || pending],
    [p.director, site.legal.director || pending],
    [p.host, site.legal.host],
    [p.data, fill(p.dataText, { phone: site.phone })],
    [p.photos, p.photosText],
  ];
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="display text-[2.8rem] md:text-[3.6rem]">{p.title}</h1>
      {blocks.map(([title, body]) => (
        <section key={title} className="mt-9">
          <h2 className="eyebrow">{title}</h2>
          <p className="mt-2 leading-relaxed">{body}</p>
        </section>
      ))}
    </div>
  );
}

export default async function Page({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang: l, slug } = await params;
  const r = resolve(l, slug);
  if (!r) notFound();
  const d = getDict(r.lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(r.lang, r.id)) }} />
      {r.id === "carte" && <Carte lang={r.lang} d={d} />}
      {(r.id === "portugais" || r.id === "piripiri") && <Seo lang={r.lang} d={d} id={r.id} />}
      {r.id === "legal" && <Legal d={d} />}
    </>
  );
}
