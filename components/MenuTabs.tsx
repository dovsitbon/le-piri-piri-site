"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale } from "@/components/providers";
import { goToOrder } from "@/components/OrderLink";
import { Photo } from "@/components/Photo";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { categories, ITEMS, type CategoryId, type ItemId } from "@/lib/carte";
import { fill } from "@/lib/i18n";
import { price } from "@/lib/format";
import { firstImg } from "@/lib/media";

export const TAB_EVENT = "piri:tab";

/** Ouvre un onglet de la carte depuis une tuile, puis descend jusqu'à la carte. */
export function openTab(id: CategoryId) {
  window.dispatchEvent(new CustomEvent<CategoryId>(TAB_EVENT, { detail: id }));
  const el = document.getElementById("carte");
  if (!el) return false;
  el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  return true;
}

function Price({ id }: { id: ItemId }) {
  const { lang, d } = useLocale();
  const it = ITEMS[id];
  if (it.price === null) return <span className="text-[0.9375rem] font-medium text-muted">{d.carte.priceTbc}</span>;
  return (
    <span className="tabular-nums">
      {it.from && <span className="me-1 text-[0.875rem] font-normal text-muted">{d.carte.from}</span>}
      {price(it.price, lang)}
    </span>
  );
}

/** Carte produit complète : photo, nom (et nom portugais), description, prix, ajout direct à la commande. */
function Dish({ id }: { id: ItemId }) {
  const { lang, d } = useLocale();
  const it = ITEMS[id];
  const p = d.products[id];
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <li className="group flex flex-col border border-line bg-white">
      <Photo paths={it.photo} alt={it.photo.length ? p.name : ""} illus={it.illus} tint={it.tags.includes("fish") ? "azul" : "warm"} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className={firstImg(it.photo) ? "aspect-[4/3]" : "aspect-[2/1]"} illusClassName="h-[58%] w-[58%]" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="display text-[1.4rem]">{p.name}</h3>
        {it.pt && it.pt !== p.name && (
          <p className="mt-0.5 font-[family-name:var(--font-display)] text-[0.9875rem] italic text-azul" lang="pt" translate="no">
            {it.pt}
          </p>
        )}
        <p className="mt-2 flex-1 text-[0.9875rem] leading-relaxed text-muted">{p.desc}</p>
        {it.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {it.tags.map((t) => (
              <li key={t} className={`tag tag-${t}`}>
                {d.tags[t]}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
          <p className="display text-[1.25rem]">
            <Price id={id} />
          </p>
          <a
            href={`/${lang}#commander`}
            aria-label={fill(d.carte.addLabel, { name: p.name })}
            onClick={(e) => {
              if (goToOrder({ item: id })) e.preventDefault();
              setAdded(true);
              clearTimeout(timer.current);
              timer.current = setTimeout(() => setAdded(false), 1600);
            }}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-[4px] border-2 px-4 font-medium transition-colors ${added ? "border-azul bg-azul text-white" : "border-braise hover:bg-braise hover:text-paper"}`}
          >
            {added ? <CheckIcon /> : <PlusIcon />}
            <span aria-live="polite">{added ? d.carte.added : d.carte.add}</span>
          </a>
        </div>
      </div>
    </li>
  );
}

/** La carte, en une seule page avec onglets par catégorie. */
export function MenuTabs({ initial = "poulet" }: { initial?: CategoryId }) {
  const { d } = useLocale();
  const cats = categories();
  const [tab, setTab] = useState<CategoryId>(initial);
  const reduce = useReducedMotion();
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const on = (e: Event) => setTab((e as CustomEvent<CategoryId>).detail);
    window.addEventListener(TAB_EVENT, on);
    return () => window.removeEventListener(TAB_EVENT, on);
  }, []);

  const current = cats.find((c) => c.id === tab) ?? cats[0];
  const anyPrice = cats.some((c) => c.items.some((id) => ITEMS[id].price !== null));

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!n) return;
    e.preventDefault();
    const j = (i + n + cats.length) % cats.length;
    setTab(cats[j].id);
    refs.current[j]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={d.carte.tabsLabel} className="-mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 [scrollbar-width:none] md:mx-0 md:px-0">
        {cats.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${c.id}`}
            aria-selected={tab === c.id}
            aria-controls={`${uid}-panel`}
            tabIndex={tab === c.id ? 0 : -1}
            onClick={() => setTab(c.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`relative min-h-12 shrink-0 px-3 pb-3 font-[family-name:var(--font-display)] text-[1.125rem] whitespace-nowrap transition-colors md:px-4 ${tab === c.id ? "font-semibold text-braise" : "text-muted hover:text-braise"}`}
          >
            {d.carte.tabs[c.id]}
            {tab === c.id && <motion.span layoutId={`${uid}-bar`} className="absolute inset-x-2 -bottom-px h-[3px] bg-piment" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }} />}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${current.id}`} className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={current.id} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.18 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {current.items.map((id) => (
              <Dish key={id} id={id} />
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
      {!anyPrice && <p className="mt-6 border-s-[3px] border-sol ps-4 text-[0.9875rem]">{d.carte.tbcNote}</p>}
      <p className="mt-4 text-[0.9375rem] text-muted">{d.carte.allergens}</p>
    </div>
  );
}
