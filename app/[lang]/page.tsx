import Image from "next/image";
import Link from "next/link";
import site from "@/data/site.json";
import avis from "@/data/avis.json";
import { getDict, isLocale, type Dict, type Locale } from "@/lib/i18n";
import { firstImg } from "@/lib/media";
import { pagePath } from "@/lib/pages";
import { homeJsonLd } from "@/lib/jsonld";
import { Reveal } from "@/components/Reveal";
import { OpenStatus } from "@/components/OpenStatus";
import { OrderLink } from "@/components/OrderLink";
import { Tiles } from "@/components/Tiles";
import { Services } from "@/components/Services";
import { MenuTabs } from "@/components/MenuTabs";
import { OrderForm } from "@/components/OrderForm";
import { HoursTable } from "@/components/HoursTable";
import { Photo } from "@/components/Photo";
import { Rating } from "@/components/Rating";
import { Mark } from "@/components/Logo";
import type { IllusName } from "@/components/Illus";
import { ArrowIcon, PhoneIcon, PinIcon, PlusIcon, StarIcon } from "@/components/icons";

export const revalidate = 3600;

function SectionHead({ eyebrow, title, intro, center = false }: { eyebrow: string; title: string; intro?: string; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-3 text-[2.4rem] md:text-[3.4rem]">{title}</h2>
      {intro && <p className="lead mt-4">{intro}</p>}
    </Reveal>
  );
}

type Block = { id: string; key: keyof Dict["blocks"]; paths: string[]; illus: IllusName; alt: keyof Dict["alt"]; cta: "menu" | "order" | "quote" };
const BLOCKS: Block[] = [
  { id: "braise", key: "braise", paths: ["/media/grill/poulet-braise.jpg", "/media/grill/braise.jpg"], illus: "flame", alt: "braise", cta: "menu" },
  { id: "specialites", key: "specialites", paths: ["/media/plats/bacalhau-bras.jpg", "/media/plats/bacalhau.jpg"], illus: "fish", alt: "bacalhau", cta: "order" },
  { id: "groupes", key: "fetes", paths: ["/media/plats/fetes.jpg", "/media/grill/poulets-entiers.jpg"], illus: "party", alt: "fetes", cta: "quote" },
];

function Blocks({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <div className="space-y-20 md:space-y-28">
      {BLOCKS.map((b, i) => {
        const t = d.blocks[b.key];
        const cta =
          b.cta === "menu" ? (
            <a href={`/${lang}#carte`} className="btn-line">
              {t.cta}
              <ArrowIcon />
            </a>
          ) : (
            <OrderLink href={`/${lang}#commander`} intent={b.cta === "quote" ? { mode: "groupe" } : undefined} className="btn">
              {t.cta}
            </OrderLink>
          );
        return (
          <section key={b.id} id={b.id} className="mx-auto grid max-w-7xl scroll-mt-24 items-center gap-8 px-4 md:grid-cols-2 md:gap-16 md:px-8">
            <Reveal className={i % 2 ? "md:order-2" : ""}>
              <Photo paths={b.paths} alt={d.alt[b.alt]} illus={b.illus} tint={i === 1 ? "azul" : "warm"} sizes="(min-width: 768px) 46vw, 100vw" className="aspect-[4/5] md:aspect-[5/6]" illusClassName="h-1/3 w-1/3" />
            </Reveal>
            <Reveal delay={0.05} className="px-1 md:max-w-lg">
              <p className="eyebrow">{t.eyebrow}</p>
              <h2 className="display mt-3 text-[2.4rem] md:text-[3.2rem]">{t.title}</h2>
              <p className="lead mt-5">{t.text}</p>
              <div className="mt-8">{cta}</div>
            </Reveal>
          </section>
        );
      })}
    </div>
  );
}

type Review = { author: string; date: string; rating: number; text: string; lang: string };

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const d = getDict(lang);
  const order = `/${lang}#commander`;
  const hero = firstImg(["/media/hero/hero.jpg", "/media/hero/poulet-braise.jpg"]);
  const reviews = avis.items as Review[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }} />

      {/* 1. Hero : la plus belle photo (emplacement prêt), un titre court, deux boutons, la note Google et le statut juste dessous */}
      <section className="azulejo-dark relative text-paper">
        <div className="mx-auto grid max-w-[90rem] lg:min-h-[calc(100svh-7.25rem)] lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-center px-5 py-14 md:px-10 md:py-20 xl:px-16">
            <p className="rise font-[family-name:var(--font-body)] text-[0.875rem] font-medium tracking-[0.14em] text-sol uppercase">{d.hero.eyebrow}</p>
            <h1 className="display rise mt-5 text-[3.1rem] leading-[0.98] md:text-[4.6rem] xl:text-[5.4rem]" style={{ animationDelay: "0.05s" }}>
              {d.hero.title}
            </h1>
            <p className="rise mt-6 max-w-md text-[1.1875rem] leading-relaxed text-paper/90" style={{ animationDelay: "0.1s" }}>
              {d.hero.sub}
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "0.15s" }}>
              <OrderLink href={order} className="btn !min-h-14 !px-8 !text-[1.125rem]">
                {d.hero.ctaOrder}
              </OrderLink>
              <a href={`/${lang}#carte`} className="btn-light !min-h-14 !px-7 !text-[1.125rem]">
                {d.hero.ctaMenu}
              </a>
            </div>
            <div className="rise mt-7 flex flex-col gap-2 text-[0.9875rem] sm:flex-row sm:flex-wrap sm:gap-x-7" style={{ animationDelay: "0.2s" }}>
              <Rating lang={lang} d={d} />
              <OpenStatus tone="light" />
            </div>
          </div>
          <div className={`relative ${hero ? "min-h-[46svh]" : ""} lg:min-h-0`}>
            {hero ? (
              <Image src={hero.src} alt={d.alt.hero} width={hero.width} height={hero.height} sizes="(min-width: 1024px) 48vw, 100vw" quality={80} priority fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              // Emplacement de la photo du hero (assets/hero/hero.jpg + npm run media) : en attendant, le carreau de la maison en grand
              <div className="hidden h-full items-center justify-center lg:flex" data-photo-slot="/media/hero/hero.jpg">
                <Mark className="w-[min(62%,26rem)] drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)]" stroke="#FBF8F2" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Tuiles de catégories, juste après le hero */}
      <section aria-label={d.tiles.title} className="px-2 pt-2 md:px-3 md:pt-3">
        <h2 className="sr-only">{d.tiles.title}</h2>
        <Tiles />
      </section>

      {/* 3. Bande de services en 4 pictos */}
      <section className="mx-auto mt-14 max-w-7xl px-4 md:mt-20 md:px-8">
        <h2 className="sr-only">{d.services.title}</h2>
        <Services d={d} />
      </section>

      {/* 4. La carte : onglets, photos, prix en HTML, bouton Ajouter */}
      <section id="carte" className="scroll-mt-20 px-4 pt-20 md:px-8 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHead eyebrow={d.carte.eyebrow} title={d.carte.title} intro={d.carte.intro} />
            <Link href={pagePath("carte", lang)} className="link-line shrink-0 self-start font-medium md:self-auto">
              {d.carte.seeFull}
            </Link>
          </div>
          <MenuTabs />
        </div>
      </section>

      {/* 5. Trois blocs alternés : la braise, les spécialités, les fêtes */}
      <div className="pt-24 md:pt-32">
        <Blocks lang={lang} d={d} />
      </div>

      {/* 6. Avis : la note Google et les thèmes qui reviennent ; aucun avis inventé */}
      <section id="avis" className="px-4 pt-24 md:px-8 md:pt-32">
        <div className="mx-auto max-w-7xl border-y border-line py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <Reveal>
              <p className="eyebrow">{d.reviews.eyebrow}</p>
              <h2 className="display mt-3 text-[2.4rem] md:text-[3.2rem]">{d.reviews.title}</h2>
              <p className="display mt-8 flex items-baseline gap-3 text-[4.5rem] leading-none text-azul">
                {new Intl.NumberFormat(lang === "en" ? "en-GB" : lang === "pt" ? "pt-PT" : "fr-FR", { minimumFractionDigits: 1 }).format(site.rating.value)}
                <span className="text-[1.5rem] text-muted">/5</span>
              </p>
              <div className="mt-3">
                <Rating lang={lang} d={d} />
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="lead">{d.reviews.intro}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {d.reviews.themes.map((th) => (
                  <li key={th} className="border border-line bg-white px-4 py-2.5 font-[family-name:var(--font-display)] text-[1.125rem] italic">
                    {th}
                  </li>
                ))}
              </ul>
              <div hidden dangerouslySetInnerHTML={{ __html: "<!-- À REMPLIR avec de vrais avis clients (data/avis.json), avec l'accord du restaurant. N'en inventer aucun. -->" }} />
              {reviews.length > 0 && (
                <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                  {reviews.map((r) => (
                    <li key={r.author + r.date} className="border border-line bg-white p-5" lang={r.lang}>
                      <span className="flex text-sol" aria-label={`${r.rating}/5`}>
                        {Array.from({ length: r.rating }, (_, i) => (
                          <StarIcon key={i} className="h-4 w-4" />
                        ))}
                      </span>
                      <p className="mt-3 leading-relaxed">{r.text}</p>
                      <p className="mt-3 text-[0.9375rem] text-muted">{r.author}</p>
                    </li>
                  ))}
                </ul>
              )}
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-line mt-8">
                {d.reviews.google}
                <ArrowIcon />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7. Commande à emporter (formulaire, panier) */}
      <section id="commander" className="scroll-mt-20 px-4 pt-24 md:px-8 md:pt-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead eyebrow={d.order.eyebrow} title={d.order.title} intro={d.order.intro} />
            <Reveal delay={0.05} className="azulejo-soft mt-8 p-6">
              <div className="bg-paper p-5">
                <p className="display text-[1.5rem]">{d.order.callTitle}</p>
                <p className="mt-1 text-muted">{d.order.callText}</p>
                <a href={`tel:${site.phoneIntl}`} className="btn mt-5 w-full sm:w-auto">
                  <PhoneIcon />
                  {d.order.callCta} · {site.phone}
                </a>
                <div className="mt-4 text-[0.9375rem]">
                  <OpenStatus />
                </div>
              </div>
            </Reveal>
          </div>
          <OrderForm />
        </div>
      </section>

      {/* 8. Infos pratiques */}
      <section id="infos" className="scroll-mt-20 px-4 pt-24 md:px-8 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <SectionHead eyebrow={d.infos.eyebrow} title={d.infos.title} />
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
            <Reveal className="space-y-7 border border-line bg-white p-6 md:p-9">
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-2">{d.infos.address}</p>
                  <address className="text-lg font-medium not-italic">
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city}
                  </address>
                </div>
                <div>
                  <p className="eyebrow mb-2">{d.infos.phone}</p>
                  <a href={`tel:${site.phoneIntl}`} className="link-line text-lg font-medium">
                    {site.phone}
                  </a>
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">{d.infos.hours}</p>
                <HoursTable lang={lang} d={d} />
                <div className="mt-3 font-medium">
                  <OpenStatus />
                </div>
              </div>
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-2">{d.infos.access}</p>
                  <p className="leading-relaxed text-muted">{d.infos.accessText}</p>
                </div>
                <div>
                  <p className="eyebrow mb-2">{d.infos.parking}</p>
                  <p className="leading-relaxed text-muted">{d.infos.parkingText}</p>
                </div>
              </div>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-line">
                <PinIcon />
                {d.infos.route}
              </a>
            </Reveal>
            <Reveal delay={0.05} className="flex min-h-96 flex-col border border-line bg-white">
              <Photo paths={["/media/facade/facade.jpg"]} alt={d.alt.facade} illus="facade" tint="warm" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/7]" illusClassName="h-1/2 w-1/2 max-h-28" />
              <iframe title={d.infos.mapTitle} src={site.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="min-h-80 w-full flex-1 border-0" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className="px-4 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHead eyebrow={d.faq.eyebrow} title={d.faq.title} />
          <Reveal delay={0.05}>
            <div className="border-t border-line">
              {d.faq.items.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="flex min-h-16 items-center justify-between gap-6 py-4 font-[family-name:var(--font-display)] text-[1.25rem] font-medium">
                    {f.q}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center text-azul">
                      <PlusIcon className="faq-plus h-5 w-5" />
                    </span>
                  </summary>
                  <p className="pb-6 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
