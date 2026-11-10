"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers";
import { fill } from "@/lib/i18n";
import { formatDay, formatTime, isoDay } from "@/lib/format";
import { addDays, hoursConfirmed, statusAt, type Status } from "@/lib/hours";

/** « Ouvert maintenant, jusqu'à 21 h » / « Fermé en ce moment, ouvre mardi à 11 h 30 », calculé en direct (heure de Paris). */
export function OpenStatus({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { lang, d } = useLocale();
  const [s, setS] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () => setS(statusAt(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Rendu serveur : place réservée, pour éviter un saut de mise en page
  if (!s) return <span className={`inline-flex min-h-6 ${className}`} aria-hidden="true" />;

  let text: string;
  if (s.open) text = `${d.status.open}, ${fill(d.status.until, { time: formatTime(s.until, lang) })}`;
  else if (s.nextDay && s.at) {
    const today = isoDay(new Date());
    const day = s.nextDay === today ? d.status.today : s.nextDay === addDays(today, 1) ? d.status.tomorrow : formatDay(s.nextDay, lang, { weekday: "long" });
    text = `${d.status.closed}, ${fill(d.status.opens, { day, time: formatTime(s.at, lang) })}`;
  } else text = d.status.closed;

  const dot = s.open ? "bg-[#4caf50]" : tone === "light" ? "bg-sol" : "bg-piment";
  return (
    <span className={`inline-flex min-h-6 items-center gap-2.5 ${className}`} role="status">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      <span>
        {text}
        {!hoursConfirmed && <span className="opacity-75"> ({d.status.tbc})</span>}
      </span>
    </span>
  );
}
