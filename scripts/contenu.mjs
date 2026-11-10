// CONTENU.md : tous les textes (français) et la carte, pour validation par le restaurant.
//   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = async (f) => JSON.parse(await readFile(path.join(ROOT, f), "utf8"));
const fr = await read("locales/fr.json");
const carte = await read("data/carte.json");
const site = await read("data/site.json");
const hours = await read("data/horaires.json");

const eur = (n) => (n === null ? "**à remplir**" : `${n.toFixed(2).replace(".", ",")} €`);
const L = [];
const h = (n, t) => L.push("", `${"#".repeat(n)} ${t}`, "");

L.push("# Le Piri Piri : contenu du site, à valider", "", `Généré par \`npm run contenu\` depuis locales/fr.json et data/*.json. Les versions anglaise et portugaise suivent les mêmes textes (locales/en.json, locales/pt.json).`, "", "Tout ce qui est marqué **à remplir** ou **à confirmer** doit être vérifié avec le restaurant.");

h(2, "Titre du hero : 3 propositions");
L.push(`1. **${fr.hero.title}** (en ligne)`, "2. Poulet piri piri et saveurs du Portugal.", "3. Un voyage à Lisbonne, à Pont-de-Metz.", "", `Petite ligne : ${fr.hero.eyebrow}`, `Sous-titre : ${fr.hero.sub}`, `Boutons : ${fr.hero.ctaOrder} · ${fr.hero.ctaMenu}`, `Note : ${site.rating.value}/5 sur ${site.rating.count} avis Google (relevée le ${site.rating.checked})`);

h(2, "Bandeau d'infos (data/annonces.json)");
const ann = await read("data/annonces.json");
L.push(`- Par défaut : ${ann.default.fr}`, ...ann.items.map((a) => `- Du ${a.from} au ${a.to} : ${a.fr}`));

h(2, "Coordonnées");
L.push(`- Adresse : ${site.address.street}, ${site.address.postalCode} ${site.address.city}`, `- Téléphone : ${site.phone} (fixe)`, `- WhatsApp : ${site.whatsapp || "**à remplir** (portable)"}`, `- E-mail : ${site.email || "**à remplir**"}`, `- Société : ${site.legal.company} · SIRET : ${site.legal.siret || "**à remplir**"}`);

h(2, `Horaires ${hours.confirmed ? "" : "(**PROVISOIRES, à confirmer**)"}`);
for (let i = 1; i <= 7; i++) L.push(`- ${fr.infos.days[i - 1]} : ${hours.week[i].length ? hours.week[i].map(([a, b]) => `${a}–${b}`).join(", ") : "fermé"}`);

h(2, "Tuiles et services");
L.push(`Tuiles : ${Object.values(fr.tiles.items).join(" · ")}`, "", ...fr.services.items.map((s) => `- **${s.title}** : ${s.text}`));

h(2, "La carte (prix à remplir dans data/carte.json)");
L.push(`${fr.carte.title} ${fr.carte.intro}`, "", "Plats, noms portugais et descriptions à confirmer ; « à partir de » = le prix varie.");
for (const c of carte.categories) {
  h(3, fr.carte.tabs[c.id]);
  L.push("| Plat | Nom portugais | Description | Prix |", "|---|---|---|---|");
  for (const id of c.items) {
    const it = carte.items[id];
    const p = fr.products[id];
    L.push(`| ${p.name} | ${it.pt ?? ""} | ${p.desc} | ${it.from ? "à partir de " : ""}${eur(it.price)} |`);
  }
}

h(2, "Blocs alternés");
for (const b of Object.values(fr.blocks)) L.push(`**${b.eyebrow} — ${b.title}**`, "", b.text, "", `Bouton : ${b.cta}`, "");

h(2, "Avis");
L.push(`${fr.reviews.intro} ${fr.reviews.themes.join(", ")}.`, "", "Emplacements vides : aucun avis inventé. Avec l'accord du restaurant, ajouter de vrais avis Google dans data/avis.json.");

h(2, "Commande");
L.push(`${fr.order.title} ${fr.order.intro}`, "", `Types : ${Object.values(fr.order.modes).join(" · ")}`, `Piri piri : ${Object.values(fr.order.prefs).join(" · ")}`, `Fêtes et groupes : ${fr.order.groupIntro}`);

h(2, "Infos pratiques");
L.push(`- Accès : ${fr.infos.accessText}`, `- Stationnement : ${fr.infos.parkingText}`);

h(2, "FAQ (à valider)");
for (const f of fr.faq.items) L.push(`**${f.q}**`, "", f.a, "");

for (const id of ["portugais", "piripiri"]) {
  const p = fr.pages[id];
  h(2, `Page « ${p.title} »`);
  L.push(`Title : ${p.metaTitle}`, `Description : ${p.metaDescription}`, "", p.lead, "");
  for (const s of p.sections) L.push(`**${s.h}** — ${s.p}`, "");
  for (const f of p.faq) L.push(`- ${f.q} ${f.a}`);
}

h(2, "Référencement (accueil)");
L.push(`- Title : ${fr.meta.title}`, `- Description : ${fr.meta.description}`);

await writeFile(path.join(ROOT, "CONTENU.md"), L.join("\n").replace(/\n{3,}/g, "\n\n") + "\n");
console.log("CONTENU.md prêt");
