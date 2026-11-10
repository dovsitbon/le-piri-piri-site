import site from "@/data/site.json";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatDay, formatTime, isoDay, price } from "@/lib/format";
import { isItem, unitPrice, type ItemId } from "@/lib/carte";
import { addDays, pickupTimes } from "@/lib/hours";

/** À emporter, sur place, ou demande de devis pour une fête / un groupe. */
export const MODES = ["emporter", "surplace", "groupe"] as const;
export type Mode = (typeof MODES)[number];

/** Le piquant du piri piri, et la sauce à part. */
export const PREFS = ["mild", "hot", "sauceApart"] as const;
export type Pref = (typeof PREFS)[number];

export type OrderLine = { item: ItemId; qty: number };
export type Order = { mode: Mode; lines: OrderLine[]; persons: number; day: string; time: string; prefs: Pref[]; name: string; phone: string; email: string; message: string };

export const emptyLine = (item: ItemId = "demi-poulet"): OrderLine => ({ item, qty: 1 });

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Jours de retrait proposés pour une commande : aujourd'hui et les jours suivants qui ont encore un créneau. */
export function pickupDays(now: Date) {
  const today = isoDay(now);
  return Array.from({ length: site.order.daysAhead + 1 }, (_, i) => addDays(today, i)).filter((day) => pickupTimes(day, now).length > 0);
}

/** Bornes de date pour une fête ou un groupe (au moins 2 jours à l'avance). */
export function groupRange(now: Date) {
  const today = isoDay(now);
  return { min: addDays(today, site.order.groupMinDays), max: addDays(today, site.order.groupMaxDays) };
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Nettoie une commande reçue côté serveur : null si elle est incomplète ou hors des heures d'ouverture. */
export function parseOrder(v: unknown, now = new Date()): Order | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const mode: Mode = MODES.includes(o.mode as Mode) ? (o.mode as Mode) : "emporter";
  const merged = new Map<ItemId, number>();
  for (const l of (Array.isArray(o.lines) ? o.lines : []).slice(0, 30)) {
    if (!l || typeof l !== "object") continue;
    const x = l as Record<string, unknown>;
    if (!isItem(x.item)) continue;
    const qty = Math.min(Math.max(Math.round(Number(x.qty) || 1), 1), mode === "groupe" ? 200 : site.order.maxPerLine);
    merged.set(x.item, (merged.get(x.item) ?? 0) + qty);
  }
  const lines = [...merged].map(([item, qty]) => ({ item, qty }));
  const day = ISO.test(str(o.day, 10)) ? str(o.day, 10) : "";
  const q: Order = {
    mode,
    lines,
    persons: Math.min(Math.max(Math.round(Number(o.persons) || 0), 0), 500),
    day,
    time: str(o.time, 5),
    prefs: (Array.isArray(o.prefs) ? o.prefs : []).filter((p): p is Pref => PREFS.includes(p as Pref)),
    name: str(o.name, 120),
    phone: str(o.phone, 30),
    email: str(o.email, 160),
    message: str(o.message, 1500),
  };
  if (!q.name || !isPhone(q.phone) || !day) return null;
  if (q.email && !isEmail(q.email)) q.email = "";
  if (mode === "groupe") {
    const r = groupRange(now);
    if (day < r.min || day > r.max || q.persons < 1) return null;
    // Heure souhaitée libre pour un devis (le restaurant rappelle), mais au format HH:MM
    if (q.time && !/^\d{2}:\d{2}$/.test(q.time)) q.time = "";
    return q;
  }
  // Marge de 10 minutes : le client a pu choisir son heure juste avant qu'elle ne sorte de la liste
  const graceNow = new Date(now.getTime() - 10 * 60_000);
  if (!q.lines.length || !pickupTimes(day, graceNow).includes(q.time)) return null;
  return q;
}

/** Total estimé ; « partial » si un des plats n'a pas encore de prix. */
export function orderTotal(lines: OrderLine[]) {
  let sum = 0;
  let partial = false;
  for (const l of lines) {
    const p = unitPrice(l.item);
    if (p === null) partial = true;
    else sum += p * l.qty;
  }
  return { sum, partial, count: lines.reduce((n, l) => n + l.qty, 0) };
}

export const lineLabel = (l: OrderLine, d: Dict) => `${l.qty} × ${d.products[l.item].name}`;

/** Récapitulatif texte de la commande (e-mail, WhatsApp, écran de confirmation). */
export function orderText(q: Order, lang: Locale, d: Dict, withContact = true) {
  const m = d.order.mail;
  const c = lang === "fr" ? " :" : ":";
  const { sum, partial } = orderTotal(q.lines);
  const when = `${formatDay(q.day, lang, { weekday: "long", day: "numeric", month: "long" })}${q.time ? `, ${formatTime(q.time, lang)}` : ""}`;
  const blocks = [
    `${m.mode}${c} ${d.order.modes[q.mode]}`,
    q.mode === "groupe" ? `${m.persons}${c} ${q.persons}` : "",
    q.lines.length ? [`${m.lines}${c}`, ...q.lines.map((l) => `– ${lineLabel(l, d)}`)].join("\n") : "",
    `${q.mode === "groupe" ? m.date : m.pickup}${c} ${when}`,
    q.prefs.length ? `${m.prefs}${c} ${q.prefs.map((p) => d.order.prefs[p]).join(", ")}` : "",
    q.lines.length ? `${m.total}${c} ${sum ? price(sum, lang) : ""}${partial ? `${sum ? " + " : ""}${d.carte.priceTbc.toLowerCase()}` : ""}` : "",
    withContact ? [`${m.name}${c} ${q.name}`, `${m.phone}${c} ${q.phone}`, q.email ? `${m.email}${c} ${q.email}` : ""].filter(Boolean).join("\n") : "",
    q.message ? `${m.message}${c}\n${q.message}` : "",
  ];
  return blocks.filter(Boolean).join("\n\n");
}

/** Lien WhatsApp (vide tant que le restaurant n'a pas donné de portable : data/site.json → whatsapp). */
export const waLink = (text: string) => (site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : "");
