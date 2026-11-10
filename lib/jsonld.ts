import site from "@/data/site.json";
import { getDict, locales, type Locale } from "@/lib/i18n";
import { weekHours } from "@/lib/hours";
import { categories, ITEMS } from "@/lib/carte";
import { pagePath, type PageId } from "@/lib/pages";

const BUSINESS = `${site.url}/#restaurant`;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function menu(lang: Locale) {
  const d = getDict(lang);
  return {
    "@type": "Menu",
    "@id": `${site.url}${pagePath("carte", lang)}#menu`,
    name: d.pages.carte.title,
    inLanguage: lang,
    hasMenuSection: categories().map((c) => ({
      "@type": "MenuSection",
      name: d.carte.tabs[c.id],
      hasMenuItem: c.items.map((id) => {
        const it = ITEMS[id];
        return {
          "@type": "MenuItem",
          name: d.products[id].name,
          description: d.products[id].desc,
          ...(it.price !== null ? { offers: { "@type": "Offer", price: it.price.toFixed(2), priceCurrency: "EUR" } } : {}),
        };
      }),
    })),
  };
}

function business(lang: Locale) {
  const d = getDict(lang);
  return {
    "@type": ["Restaurant", "FastFoodRestaurant"],
    "@id": BUSINESS,
    name: site.name,
    alternateName: ["Le Piri-Piri", "Piri Piri Pont-de-Metz", "Le Piri Piri Amiens"],
    description: d.meta.description,
    url: `${site.url}/${lang}`,
    image: [`${site.url}/og.jpg`],
    logo: `${site.url}/logo.svg`,
    telephone: site.phoneIntl,
    ...(site.email ? { email: site.email } : {}),
    priceRange: "€€",
    servesCuisine: ["Portuguese", "Portugaise", "Poulet piri piri", "Grillades", "Bacalhau"],
    address: { "@type": "PostalAddress", streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressRegion: site.address.region, addressCountry: site.address.country },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: ["Pont-de-Metz", "Amiens", "Salouël", "Saleux", "Dury"],
    hasMap: site.mapsUrl,
    openingHoursSpecification: weekHours().flatMap((slots, i) => slots.map(([opens, closes]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${DAYS[i]}`, opens, closes }))),
    // Note Google relevée à la main (date dans data/site.json → rating.checked) : à mettre à jour de temps en temps
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5, worstRating: 1, dateModified: site.rating.checked },
    sameAs: [site.facebook],
    acceptsReservations: false,
    currenciesAccepted: "EUR",
    knowsLanguage: ["fr", "pt", "en"],
    hasMenu: { "@id": `${site.url}${pagePath("carte", lang)}#menu` },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: d.jsonld.takeaway, value: true },
      { "@type": "LocationFeatureSpecification", name: d.jsonld.dineIn, value: true },
      { "@type": "LocationFeatureSpecification", name: d.jsonld.groups, value: true },
    ],
    potentialAction: { "@type": "OrderAction", target: `${site.url}/${lang}#commander`, deliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModePickUp" },
  };
}

const faqPage = (items: { q: string; a: string }[]) => ({ "@type": "FAQPage", mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });

/** Données structurées de l'accueil : Restaurant (horaires, note Google datée, menu), FAQ. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [{ "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, inLanguage: [...locales], publisher: { "@id": BUSINESS } }, business(lang), menu(lang), faqPage(d.faq.items)],
  };
}

/** Données structurées d'une page secondaire, plus fil d'Ariane. */
export function pageJsonLd(lang: Locale, id: PageId) {
  const d = getDict(lang);
  const url = `${site.url}${pagePath(id, lang)}`;
  const seo = id === "portugais" || id === "piripiri" ? d.pages[id] : null;
  return {
    "@context": "https://schema.org",
    "@graph": [
      business(lang),
      ...(id === "carte" ? [menu(lang)] : []),
      ...(seo ? [faqPage(seo.faq)] : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/${lang}` },
          { "@type": "ListItem", position: 2, name: d.pages[id].title, item: url },
        ],
      },
    ],
  };
}
