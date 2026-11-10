"use client";

import { useLocale } from "@/components/providers";
import { openTab } from "@/components/MenuTabs";
import { Photo, type Tint } from "@/components/Photo";
import type { IllusName } from "@/components/Illus";
import type { CategoryId } from "@/lib/carte";

type Tile = { id: Exclude<CategoryId, "boissons">; paths: string[]; illus: IllusName; tint: Tint };

// Une tuile par catégorie, nom en capitales sur la photo (assets/plats/tuile-<catégorie>.jpg, ou la photo du plat phare).
const TILES: Tile[] = [
  { id: "poulet", paths: ["/media/plats/tuile-poulet.jpg", "/media/plats/demi-poulet.jpg", "/media/grill/poulet-braise.jpg"], illus: "chicken", tint: "dark" },
  { id: "grillades", paths: ["/media/plats/tuile-grillades.jpg", "/media/grill/grillades.jpg", "/media/plats/espetada.jpg"], illus: "grill", tint: "warm" },
  { id: "bacalhau", paths: ["/media/plats/tuile-bacalhau.jpg", "/media/plats/bacalhau-bras.jpg"], illus: "fish", tint: "azul" },
  { id: "assiettes", paths: ["/media/plats/tuile-assiettes.jpg", "/media/plats/assiette-piri.jpg"], illus: "plate", tint: "warm" },
  { id: "accompagnements", paths: ["/media/plats/tuile-accompagnements.jpg", "/media/plats/frites.jpg"], illus: "fries", tint: "azul" },
  { id: "desserts", paths: ["/media/plats/tuile-desserts.jpg", "/media/plats/pastel-nata.jpg"], illus: "nata", tint: "warm" },
];

export function Tiles() {
  const { lang, d } = useLocale();
  return (
    <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
      {TILES.map((t) => (
        <li key={t.id}>
          <a
            href={`/${lang}#carte`}
            onClick={(e) => {
              if (openTab(t.id)) e.preventDefault();
            }}
            className="group relative block aspect-[4/5] overflow-hidden"
          >
            <Photo paths={t.paths} alt="" illus={t.illus} tint={t.tint} sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw" className="absolute inset-0 h-full w-full" illusClassName="h-[42%] w-[42%] -translate-y-5 transition-transform duration-500 group-hover:-translate-y-7" />
            <span className="absolute inset-x-0 bottom-0 flex min-h-14 items-center justify-center bg-paper px-2 text-center text-[0.875rem] font-semibold tracking-[0.12em] text-braise uppercase transition-colors group-hover:bg-sol md:text-[0.9375rem]">
              {d.tiles.items[t.id]}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
