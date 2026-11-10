import { Resend } from "resend";
import { orderText, parseOrder } from "@/lib/order";
import { fill, getDict, isLocale, type Locale } from "@/lib/i18n";
import { createCheckout } from "@/lib/payment";

// Commande à emporter / sur place, ou demande de devis (fête, groupe). Le restaurant n'a qu'une ligne fixe :
// la commande part par e-mail (Resend).
//  1. notification au restaurant (en français, avec la langue du client) ;
//  2. confirmation au client, dans sa langue, s'il a donné son e-mail.
// Variables Vercel : RESEND_API_KEY, ORDER_NOTIFY_EMAIL (adresse du restaurant), RESEND_FROM (domaine vérifié dans Resend,
// ex. « Le Piri Piri <commandes@mondomaine.fr> » ; sans domaine vérifié, Resend n'envoie qu'à l'adresse du compte).
// Sans ces variables, la route répond { notified: false } et le site invite le client à appeler pour confirmer.
// Paiement en ligne : voir lib/payment.ts (désactivé par défaut).

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function html(title: string, text: string) {
  const body = escapeHtml(text)
    .split("\n\n")
    .map((p) => `<p style="margin:0 0 18px">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `<div style="background:#FBF8F2;padding:32px 16px"><div style="max-width:560px;margin:0 auto;background:#ffffff;border-top:6px solid #1F4E8C;padding:32px 28px;font-family:Helvetica,Arial,sans-serif;color:#3A241A;font-size:15px;line-height:1.65">
<p style="margin:0 0 6px;font-size:13px;font-weight:bold;letter-spacing:.08em;color:#1F4E8C">LE PIRI PIRI · PONT-DE-METZ</p>
<h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:26px;color:#3A241A">${escapeHtml(title)}</h1>${body}
<p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #E2D8C8;font-size:13px;color:#5F4B40">2 ter rue de l'Eau, 80480 Pont-de-Metz · 03 22 44 76 51</p></div></div>`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const lang: Locale = typeof body.lang === "string" && isLocale(body.lang) ? body.lang : "fr";
  const q = parseOrder(body.order);
  if (!q) return Response.json({ ok: false }, { status: 400 });

  const fr = getDict("fr");
  const d = getDict(lang);
  const group = q.mode === "groupe";
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;

  let notified = false;
  let confirmed = false;
  if (key && to) {
    const resend = new Resend(key);
    const from = process.env.RESEND_FROM ?? "Le Piri Piri <onboarding@resend.dev>";
    const frText = orderText(q, "fr", fr);
    const text = lang === "fr" ? frText : `${frText}\n\n${fr.order.mail.lang} : ${lang.toUpperCase()}`;
    const title = group ? fr.order.mail.titleGroup : fr.order.mail.title;
    try {
      const r = await resend.emails.send({ from, to, replyTo: q.email || undefined, subject: `${group ? fr.order.mail.subjectGroup : fr.order.mail.subject} · ${q.name} · ${q.day}${q.time ? ` ${q.time}` : ""}`, html: html(title, text), text });
      notified = !r.error;
    } catch {}

    if (q.email && notified) {
      const m = d.order.mail;
      const msg = `${fill(m.confirmIntro, { name: q.name })}\n\n${orderText(q, lang, d, false)}\n\n${m.confirmOutro}`;
      try {
        const r = await resend.emails.send({ from, to: q.email, replyTo: to, subject: m.confirmSubject, html: html(m.confirmSubject, msg), text: msg });
        confirmed = !r.error;
      } catch {}
    }
  }

  // Paiement en ligne demandé (désactivé par défaut : createCheckout renvoie null)
  const checkoutUrl = body.pay === true ? await createCheckout(q, lang, d, new URL(req.url).origin) : null;
  return Response.json({ ok: true, notified, confirmed, ...(checkoutUrl ? { checkoutUrl } : {}) });
}
