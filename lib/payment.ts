import site from "@/data/site.json";
import type { Locale } from "@/lib/locales";
import { ITEMS } from "@/lib/carte";
import type { Dict } from "@/lib/i18n";
import type { Order } from "@/lib/order";

// Paiement en ligne (Stripe Checkout), PRÉVU MAIS DÉSACTIVÉ.
// Pour l'activer : data/site.json → payment.enabled = true, variable Vercel STRIPE_SECRET_KEY,
// et des prix renseignés pour tous les plats commandés (data/carte.json).
// Tant que ce n'est pas le cas, le client paie au retrait, et le formulaire ne propose pas le paiement.

export const paymentEnabled = () => site.payment.enabled && !!process.env.STRIPE_SECRET_KEY;

/** Crée une session Stripe Checkout ; null si le paiement est désactivé ou si un prix manque. */
export async function createCheckout(q: Order, lang: Locale, d: Dict, origin: string): Promise<string | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!site.payment.enabled || !key || q.mode === "groupe" || !q.lines.length) return null;
  if (q.lines.some((l) => ITEMS[l.item].price === null)) return null;
  const form = new URLSearchParams({ mode: "payment", locale: lang, success_url: `${origin}/${lang}?paiement=ok#commander`, cancel_url: `${origin}/${lang}?paiement=annule#commander`, "metadata[name]": q.name, "metadata[phone]": q.phone, "metadata[pickup]": `${q.day} ${q.time}` });
  if (q.email) form.set("customer_email", q.email);
  q.lines.forEach((l, i) => {
    form.set(`line_items[${i}][quantity]`, String(l.qty));
    form.set(`line_items[${i}][price_data][currency]`, "eur");
    form.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round((ITEMS[l.item].price ?? 0) * 100)));
    form.set(`line_items[${i}][price_data][product_data][name]`, d.products[l.item].name);
  });
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/x-www-form-urlencoded" }, body: form });
  if (!res.ok) return null;
  const json = (await res.json()) as { url?: string };
  return json.url ?? null;
}
