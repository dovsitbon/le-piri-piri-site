"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import site from "@/data/site.json";
import { ORDER_EVENT, type OrderIntent } from "@/components/OrderLink";
import { CheckIcon, CloseIcon, MinusIcon, PhoneIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { fill } from "@/lib/i18n";
import { formatDay, formatTime, isoDay, price } from "@/lib/format";
import { addDays, pickupTimes, slotsOn } from "@/lib/hours";
import { categories, ITEMS, unitPrice, type ItemId } from "@/lib/carte";
import { emptyLine, groupRange, isEmail, isPhone, MODES, orderText, orderTotal, pickupDays, PREFS, waLink, type Mode, type Order, type OrderLine, type Pref } from "@/lib/order";

type Errors = Partial<Record<"lines" | "day" | "time" | "name" | "phone" | "email" | "persons" | "send", string>>;
type Sent = { notified: boolean; confirmed: boolean; text: string; email: string; group: boolean };

export function OrderForm() {
  const { lang, d } = useLocale();
  const t = d.order;
  const [mode, setMode] = useState<Mode>("emporter");
  const [lines, setLines] = useState<OrderLine[]>([emptyLine()]);
  const touched = useRef(false);
  const [persons, setPersons] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [prefs, setPrefs] = useState<Pref[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const group = mode === "groupe";

  // Heures recalculées chaque minute : seuls les créneaux encore possibles restent proposés
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const days = useMemo(() => (now ? pickupDays(now) : []), [now]);
  const range = useMemo(() => (now ? groupRange(now) : null), [now]);
  const times = useMemo(() => (now && day ? pickupTimes(day, now) : []), [now, day]);

  useEffect(() => {
    if (group) {
      if (range && (!day || day < range.min || day > range.max)) setDay(range.min);
      return;
    }
    if (!days.length) return;
    if (!day || !days.includes(day)) setDay(days[0]);
  }, [days, day, group, range]);
  useEffect(() => {
    if (time && !times.includes(time)) setTime("");
  }, [times, time]);

  useEffect(() => {
    const apply = (intent: OrderIntent) => {
      if (intent.mode) setMode(intent.mode);
      if (!intent.item) return;
      const item = intent.item;
      const keep = touched.current;
      touched.current = true;
      setLines((ls) => {
        if (!keep) return [emptyLine(item)];
        const same = ls.findIndex((l) => l.item === item);
        if (same >= 0) return ls.map((l, i) => (i === same ? { ...l, qty: Math.min(l.qty + 1, site.order.maxPerLine) } : l));
        return [...ls, emptyLine(item)];
      });
    };
    try {
      const saved = sessionStorage.getItem(ORDER_EVENT);
      if (saved) {
        sessionStorage.removeItem(ORDER_EVENT);
        apply(JSON.parse(saved) as OrderIntent);
      }
    } catch {}
    const onIntent = (e: Event) => apply((e as CustomEvent<OrderIntent>).detail);
    window.addEventListener(ORDER_EVENT, onIntent);
    return () => window.removeEventListener(ORDER_EVENT, onIntent);
  }, []);

  const update = (i: number, patch: Partial<OrderLine>) => {
    touched.current = true;
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  };
  const togglePref = (p: Pref) =>
    setPrefs((ps) => {
      const next = ps.includes(p) ? ps.filter((x) => x !== p) : [...ps, p];
      if (p === "mild" && next.includes("mild")) return next.filter((x) => x !== "hot");
      if (p === "hot" && next.includes("hot")) return next.filter((x) => x !== "mild");
      return next;
    });

  const total = orderTotal(lines);
  const maxQty = group ? 200 : site.order.maxPerLine;

  function validate(): Errors {
    const e: Errors = {};
    if (!group && !lines.length) e.lines = t.errors.lines;
    if (group && !(Number(persons) >= 1)) e.persons = t.errors.persons;
    if (!day) e.day = t.errors.day;
    if (!group && !time) e.time = t.errors.time;
    if (!name.trim()) e.name = t.errors.name;
    if (!isPhone(phone)) e.phone = t.errors.phone;
    if (email.trim() && !isEmail(email)) e.email = t.errors.email;
    return e;
  }

  async function submit(ev: FormEvent, pay = false) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>(`[data-err="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }
    const order: Order = { mode, lines, persons: group ? Number(persons) : 0, day, time, prefs, name: name.trim(), phone: phone.trim(), email: email.trim(), message: message.trim() };
    setSending(true);
    try {
      const res = await fetch("/api/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang, order, pay }) });
      const json = (await res.json()) as { ok: boolean; notified?: boolean; confirmed?: boolean; checkoutUrl?: string };
      if (!res.ok || !json.ok) throw new Error("send");
      if (json.checkoutUrl) {
        window.location.href = json.checkoutUrl;
        return;
      }
      setSent({ notified: !!json.notified, confirmed: !!json.confirmed, text: orderText(order, lang, d), email: order.email, group });
      document.getElementById("commander")?.scrollIntoView({ block: "start" });
    } catch {
      setErrors({ send: t.errors.send });
    } finally {
      setSending(false);
    }
  }

  const call = (
    <a href={`tel:${site.phoneIntl}`} className="btn">
      <PhoneIcon />
      {t.callCta} · {site.phone}
    </a>
  );

  if (sent) {
    const wa = waLink(sent.text);
    return (
      <div className="fade-in border border-line bg-white p-6 md:p-10" role="status">
        <span className={`flex h-12 w-12 items-center justify-center rounded-full ${sent.notified ? "bg-azul text-white" : "bg-sol-soft text-braise"}`}>{sent.notified ? <CheckIcon className="h-6 w-6" /> : <PhoneIcon className="h-6 w-6" />}</span>
        <h3 className="display mt-5 text-[2rem]">{sent.notified ? (sent.group ? t.done.groupTitle : t.done.title) : t.done.pendingTitle}</h3>
        <p className="lead mt-2">{sent.notified ? (sent.group ? t.done.groupText : t.done.text) : t.done.pendingText}</p>
        {sent.confirmed && <p className="mt-2 text-muted">{fill(t.done.mail, { email: sent.email })}</p>}
        <pre className="mt-6 bg-paper-deep p-5 font-[family-name:var(--font-body)] text-[0.9875rem] leading-relaxed whitespace-pre-wrap text-braise">{sent.text}</pre>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {call}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-line">
              <WhatsAppIcon />
              {t.whatsapp}
            </a>
          )}
          <button
            type="button"
            className="link-line ms-1 min-h-11 font-medium text-muted"
            onClick={() => {
              setSent(null);
              setLines(group ? [] : [emptyLine()]);
              touched.current = false;
              setTime("");
              setPrefs([]);
              setMessage("");
            }}
          >
            {t.done.again}
          </button>
        </div>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`err-${k}`} className="mt-2 text-[0.9375rem] font-medium text-piment-deep">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Errors) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `err-${k}` : undefined, "data-err": k });
  const dayLabel = (x: string) => {
    if (!now) return x;
    const today = isoDay(now);
    return x === today ? t.today : x === addDays(today, 1) ? t.tomorrow : formatDay(x, lang, { weekday: "long", day: "numeric" });
  };
  const legend = (n: number, label: string) => (
    <legend className="display mb-4 flex items-center gap-3 text-[1.5rem]">
      <span className="flex h-8 w-8 items-center justify-center border-[1.5px] border-azul font-[family-name:var(--font-body)] text-[0.9375rem] font-semibold text-azul">{n}</span>
      {label}
    </legend>
  );
  const groupClosed = group && day && !slotsOn(day).length;

  return (
    <form onSubmit={(e) => submit(e)} noValidate className="space-y-10 border border-line bg-white p-5 md:p-8">
      {/* 1. Type : à emporter, sur place, fête ou groupe */}
      <fieldset>
        {legend(1, t.modesTitle)}
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <label key={m} className="chip">
              <input
                type="radio"
                name="mode"
                value={m}
                checked={mode === m}
                onChange={() => {
                  setMode(m);
                  if (m === "groupe" && !touched.current) setLines([]);
                  if (m !== "groupe" && !lines.length) setLines([emptyLine()]);
                }}
                className="sr-only"
              />
              {t.modes[m]}
            </label>
          ))}
        </div>
        {group && (
          <>
            <p className="mt-4 text-muted">{t.groupIntro}</p>
            <label className="mt-4 block sm:w-1/2">
              <span className="label">{t.persons}</span>
              <input className="field" type="number" inputMode="numeric" min={1} max={500} value={persons} onChange={(e) => setPersons(e.target.value)} {...aria("persons")} />
              {err("persons")}
            </label>
          </>
        )}
      </fieldset>

      {/* 2. Plats (panier) */}
      <fieldset>
        {legend(2, group ? t.itemsOptional : t.itemsTitle)}
        <ul className="space-y-2">
          {lines.map((l, i) => {
            const unit = unitPrice(l.item);
            return (
              <li key={i} className="grid grid-cols-[1fr_auto_auto] items-end gap-3 border-b border-line pb-3">
                <label className="block min-w-0">
                  <span className="label">{t.dish}</span>
                  <select className="field" value={l.item} onChange={(e) => update(i, { item: e.target.value as ItemId })} {...(i === 0 ? aria("lines") : {})}>
                    {categories().map((g) => (
                      <optgroup key={g.id} label={d.carte.tabs[g.id]}>
                        {g.items.map((id) => (
                          <option key={id} value={id}>
                            {d.products[id].name}
                            {ITEMS[id].price !== null ? ` · ${price(ITEMS[id].price ?? 0, lang)}` : ""}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
                <div>
                  <span className="label" id={`qty-${i}`}>
                    {t.quantity}
                  </span>
                  <div className="flex h-12 items-center border-[1.5px] border-[#cdbfab]" role="group" aria-labelledby={`qty-${i}`}>
                    <button type="button" className="flex h-11 w-10 items-center justify-center hover:bg-paper-deep disabled:opacity-30" onClick={() => update(i, { qty: Math.max(1, l.qty - 1) })} disabled={l.qty <= 1} aria-label="−1">
                      <MinusIcon />
                    </button>
                    <output className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
                      {l.qty}
                    </output>
                    <button type="button" className="flex h-11 w-10 items-center justify-center hover:bg-paper-deep disabled:opacity-30" onClick={() => update(i, { qty: Math.min(maxQty, l.qty + 1) })} disabled={l.qty >= maxQty} aria-label="+1">
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                <div className="flex h-12 items-center">
                  <button type="button" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))} className="flex h-11 w-11 items-center justify-center text-muted hover:bg-paper-deep hover:text-braise disabled:opacity-30" aria-label={t.removeLine} disabled={!group && lines.length === 1}>
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="col-span-3 -mt-1 text-end text-[0.9375rem] text-muted tabular-nums">{unit !== null ? price(unit * l.qty, lang) : d.carte.priceTbc}</p>
              </li>
            );
          })}
        </ul>
        {lines.length < 20 && (
          <button
            type="button"
            onClick={() => {
              touched.current = true;
              setLines((ls) => [...ls, emptyLine(group ? "poulet-entier" : "frites")]);
            }}
            className="mt-3 inline-flex min-h-11 items-center gap-2 px-1 font-medium text-azul hover:underline"
          >
            <PlusIcon />
            {t.addLine}
          </button>
        )}
        {err("lines")}
      </fieldset>

      {/* 3. Jour et heure : seulement aux heures d'ouverture */}
      <fieldset>
        {legend(3, group ? t.groupDate : mode === "surplace" ? t.pickupTitleSurPlace : t.pickupTitle)}
        {group ? (
          <label className="block sm:w-1/2">
            <span className="label">{t.groupDate}</span>
            <input className="field" type="date" min={range?.min} max={range?.max} value={day} onChange={(e) => setDay(e.target.value)} {...aria("day")} />
          </label>
        ) : (
          <div role="radiogroup" aria-label={t.day} aria-describedby={errors.day ? "err-day" : undefined} className="flex flex-wrap gap-2">
            {days.map((x, i) => (
              <label key={x} className="chip">
                <input type="radio" name="day" value={x} checked={day === x} onChange={() => setDay(x)} className="sr-only" {...(i === 0 ? { "data-err": "day" } : {})} />
                <span className="first-letter:uppercase">{dayLabel(x)}</span>
              </label>
            ))}
          </div>
        )}
        {err("day")}
        {groupClosed ? (
          <p className="mt-4 text-[0.9375rem] text-muted">{t.closedDay}</p>
        ) : (
          <label className="mt-5 block sm:w-1/2">
            <span className="label">{group ? t.timeOptional : t.time}</span>
            <select className="field" value={time} onChange={(e) => setTime(e.target.value)} {...aria("time")}>
              <option value="">—</option>
              {times.map((x) => (
                <option key={x} value={x}>
                  {formatTime(x, lang)}
                </option>
              ))}
            </select>
            {!group && day && now && !times.length && <span className="mt-2 block text-[0.9375rem] text-muted">{t.noSlots}</span>}
            {err("time")}
          </label>
        )}
      </fieldset>

      {/* 4. Le piri piri et les remarques */}
      <fieldset>
        {legend(4, t.prefsTitle)}
        <div className="flex flex-wrap gap-2">
          {PREFS.map((p) => (
            <label key={p} className="chip">
              <input type="checkbox" checked={prefs.includes(p)} onChange={() => togglePref(p)} className="sr-only" />
              {prefs.includes(p) && <CheckIcon />}
              {t.prefs[p]}
            </label>
          ))}
        </div>
        <label className="mt-5 block">
          <span className="label">{t.message}</span>
          <textarea name="message" className="field min-h-24 resize-y" maxLength={1500} placeholder={group ? t.messagePhGroup : t.messagePh} value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
      </fieldset>

      {/* 5. Coordonnées */}
      <fieldset>
        {legend(5, t.contactTitle)}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">{t.name}</span>
            <input className="field" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required {...aria("name")} />
            {err("name")}
          </label>
          <label className="block">
            <span className="label">{t.phone}</span>
            <input className="field" name="tel" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required {...aria("phone")} />
            {err("phone")}
          </label>
          <label className="block sm:col-span-2">
            <span className="label">{t.email}</span>
            <input className="field" name="email" type="email" spellCheck={false} inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} {...aria("email")} />
            <span className="mt-1.5 block text-[0.9375rem] text-muted">{t.emailHint}</span>
            {err("email")}
          </label>
        </div>
      </fieldset>

      <div className="bg-paper-deep p-5">
        {lines.length > 0 && (
          <>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-medium">{t.total}</span>
              <span className="display text-[1.75rem] tabular-nums">{total.sum ? price(total.sum, lang) : "—"}</span>
            </div>
            {total.partial && <p className="mt-1 text-[0.9375rem] text-muted">{t.totalNote}</p>}
          </>
        )}
        <button type="submit" className="btn mt-5 w-full" disabled={sending}>
          {sending ? t.sending : group ? t.submitGroup : t.submit}
        </button>
        {site.payment.enabled && !group && !total.partial && (
          <button type="button" className="btn-line mt-3 w-full" disabled={sending} onClick={(e) => submit(e as unknown as FormEvent, true)}>
            {t.payOnline}
          </button>
        )}
        {!group && <p className="mt-3 text-center text-[0.9375rem] text-muted">{t.payNote}</p>}
        {errors.send && (
          <div className="mt-5 space-y-4" role="alert">
            <p className="font-medium text-piment-deep">{errors.send}</p>
            {call}
          </div>
        )}
      </div>
    </form>
  );
}
