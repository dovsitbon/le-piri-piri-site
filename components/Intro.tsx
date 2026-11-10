"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { CHILI, TILE } from "@/components/Logo";

const KEY = "piri-intro";
const at = (d: number, t?: number) => ({ "--d": `${d}s`, ...(t ? { "--t": `${t}s` } : {}) }) as CSSProperties;

/**
 * Ouverture (1,2 s, une fois par session), tout en CSS (globals.css) : fond blanc, un carreau d'azulejo
 * se dessine au trait bleu, un petit piment rouge se pose dessus, « LE PIRI PIRI » apparaît, fondu sur le hero.
 * Bouton « Passer » ; ignorée si l'utilisateur préfère réduire les animations.
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  const p = { pathLength: 1, className: "intro-draw" };
  return (
    <div className="intro-curtain flex flex-col items-center justify-center text-braise">
      <svg viewBox="0 0 64 64" className="h-28 w-28 md:h-32 md:w-32" fill="none" aria-hidden="true">
        <g stroke="#1F4E8C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path {...p} d={TILE.frame} style={at(0, 0.32)} />
          {TILE.corners.map((d, i) => (
            <path key={d} {...p} d={d} style={at(0.16 + i * 0.04, 0.16)} />
          ))}
          {TILE.petals.map((d, i) => (
            <path key={d} {...p} d={d} style={at(0.24 + i * 0.05, 0.2)} />
          ))}
        </g>
        <g className="intro-chili">
          <path d={CHILI.body} fill="#C8322B" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
          <path d={CHILI.cap} fill="#3F6B2A" />
          <path d={CHILI.stem} stroke="#3F6B2A" strokeWidth={2.6} strokeLinecap="round" />
        </g>
      </svg>
      <p className="intro-word mt-5 font-[family-name:var(--font-display)] text-[1.75rem] font-[680] tracking-[0.04em]" aria-hidden="true" translate="no">
        LE PIRI PIRI
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="absolute end-4 bottom-4 min-h-11 px-4 font-medium text-muted underline-offset-4 hover:text-braise hover:underline"
      >
        {skipLabel}
      </button>
    </div>
  );
}
