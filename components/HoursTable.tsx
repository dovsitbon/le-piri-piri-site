import { formatTime } from "@/lib/format";
import { hoursConfirmed, weekHours } from "@/lib/hours";
import type { Dict, Locale } from "@/lib/i18n";

/** Horaires de la semaine (data/horaires.json), du lundi au dimanche ; midi et soir. */
export function HoursTable({ lang, d, compact = false, note = true }: { lang: Locale; d: Dict; compact?: boolean; note?: boolean }) {
  const week = weekHours();
  return (
    <>
      <table className={`w-full ${compact ? "text-[0.9375rem]" : "text-base"}`}>
        <tbody>
          {week.map((slots, i) => (
            <tr key={i} className="border-b border-current/10 last:border-0">
              <th scope="row" className="py-2 pe-4 text-start font-normal">
                {d.infos.days[i]}
              </th>
              <td className={`py-2 text-end tabular-nums ${slots.length ? "" : "opacity-60"}`}>{slots.length ? slots.map(([a, b]) => `${formatTime(a, lang)} – ${formatTime(b, lang)}`).join(" · ") : d.infos.closed}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {note && !hoursConfirmed && <p className="mt-3 text-[0.9375rem] opacity-80">{d.infos.hoursTbc}</p>}
    </>
  );
}
