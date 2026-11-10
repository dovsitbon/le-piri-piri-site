import { BagIcon, FlameIcon, PartyIcon, PhoneLineIcon } from "@/components/icons";
import type { Dict } from "@/lib/i18n";

const ICONS = [BagIcon, FlameIcon, PartyIcon, PhoneLineIcon];

/** Bande de services en 4 pictos : à emporter, grillé à la braise, groupes et fêtes, téléphone. */
export function Services({ d }: { d: Dict }) {
  return (
    <ul className="grid grid-cols-2 border-y border-line md:grid-cols-4" aria-label={d.services.title}>
      {d.services.items.map((s, i) => {
        const Icon = ICONS[i];
        return (
          <li key={s.title} className={`flex flex-col items-center px-4 py-8 text-center md:py-10 ${i % 2 ? "border-s border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-s" : ""}`}>
            <Icon className="h-9 w-9 text-azul" />
            <p className="mt-3 font-[family-name:var(--font-display)] text-[1.25rem] font-semibold">{s.title}</p>
            <p className="mt-1 max-w-[16rem] text-[0.9375rem] text-muted">{s.text}</p>
          </li>
        );
      })}
    </ul>
  );
}
