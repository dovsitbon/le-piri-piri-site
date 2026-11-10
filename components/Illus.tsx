import type { Illus as IllusKind } from "@/lib/carte";

// Petites illustrations au trait, dessinées pour le Piri Piri. Elles tiennent la place des photos
// tant que le restaurant n'en a pas fourni (voir assets/A-PHOTOGRAPHIER.md). viewBox 0 0 120 120, trait = currentColor.

export type IllusName = IllusKind | "facade" | "room" | "team" | "flame" | "party";

const P: Record<IllusName, string[]> = {
  chicken: [
    "M22 70C18 52 34 38 56 40C78 42 96 50 98 66C100 82 84 92 62 92C40 92 26 84 22 70Z",
    "M30 66C40 72 58 74 74 70",
    "M36 56l6 6M50 52l6 6M64 52l6 6M78 56l6 6",
    "M96 62l12-6M94 74l14 2",
    "M14 98h92",
  ],
  grill: ["M18 50h84M18 64h84M18 78h84", "M30 50v28M50 50v28M70 50v28M90 50v28", "M30 92c4-6 8-6 12 0s8 6 12 0 8-6 12 0 8 6 12 0 8-6 12 0", "M40 40c10-6 30-6 40 0"],
  skewer: ["M14 96 104 22", "M34 70l12-10 10 12-12 10Z", "M52 56l12-10 10 12-12 10Z", "M70 42l12-10 10 12-12 10Z", "M22 76c-4 4-4 8 0 10"],
  sausage: ["M20 72C20 50 48 40 72 44S104 62 100 76 76 92 60 88 20 90 20 72Z", "M36 60c4 6 4 12 0 18M56 56c4 6 4 14 0 22M76 58c4 6 4 12 0 18", "M100 76l10 6"],
  sandwich: ["M18 60c0-14 20-22 42-22s42 8 42 22Z", "M16 66h88", "M20 72c8 4 16-4 24 0s16-4 24 0 16-4 24 0 8-2 12 0", "M18 80h84c0 8-18 12-42 12S18 88 18 80Z"],
  fish: ["M14 60c16-20 50-26 74-8l18-14v44L88 68C64 86 30 80 14 60Z", "M34 56a3 3 0 1 0 .1 0", "M52 46c6 8 6 20 0 28M64 48c4 6 4 18 0 24"],
  croquette: ["M20 66c0-12 14-20 30-20s30 8 30 20-14 20-30 20-30-8-30-20Z", "M56 52c0-10 12-16 24-16s24 6 24 16-12 16-24 16", "M32 62c2 2 4 2 6 0M44 70c2 2 4 2 6 0M80 46c2 2 4 2 6 0"],
  plate: ["M10 66a50 22 0 1 0 100 0a50 22 0 1 0-100 0", "M26 66a34 13 0 1 0 68 0a34 13 0 1 0-68 0", "M40 62c4-8 18-10 26-4M70 58l14 8M44 70l8-2 6 4"],
  fries: ["M32 56h56l-8 48H40Z", "M38 56l-4-30M50 56l-2-38M62 56V22M74 56l2-34M86 56l4-28", "M44 80c10 6 22 6 32 0"],
  bowl: ["M14 56h92c0 26-20 42-46 42S14 82 14 56Z", "M46 98l2 8h24l2-8", "M30 56c4-8 10-8 14 0 4-8 10-8 14 0 4-8 10-8 14 0 4-8 10-8 14 0 4-8 8-8 10 0"],
  chili: ["M26 80c22 6 52-2 66-26 3-5 9-4 8 2-4 24-34 42-64 36-10-2-14-14-10-12Z", "M92 54c0-8 4-14 12-16", "M84 56c2-6 10-8 14-2"],
  nata: ["M18 60c0-8 18-14 42-14s42 6 42 14l-6 24c-2 8-16 12-36 12s-34-4-36-12Z", "M18 60c0 8 18 14 42 14s42-6 42-14", "M44 58a4 4 0 1 0 .1 0M64 54a5 5 0 1 0 .1 0M74 62a3 3 0 1 0 .1 0"],
  bottle: ["M50 14h20v10l6 14v62a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6V38l6-14Z", "M44 56h32M44 84h32", "M54 66h12"],
  facade: ["M14 106V36h92v70", "M8 36h104l-6-14H14Z", "M26 106V64h22v42", "M62 64h32v24H62Z", "M78 64v24M62 76h32", "M30 50h60"],
  room: ["M14 104h92", "M22 104V70h34v34M22 78h34", "M68 104V60M68 60h30v10H68", "M84 70v34", "M40 30h40M60 30v12"],
  team: ["M36 46a12 12 0 1 0 .1 0M84 46a12 12 0 1 0 .1 0", "M14 104c0-24 10-38 22-38s22 14 22 38", "M62 104c0-24 10-38 22-38s22 14 22 38", "M10 104h100"],
  flame: ["M60 14c4 18 28 26 28 52a28 28 0 0 1-56 0c0-14 8-22 14-28 2 10 6 14 12 16-6-14-4-28 2-40Z", "M60 74c6 4 10 10 6 18-2 4-10 6-14 0-4-6 2-12 8-18Z", "M14 104h92"],
  party: ["M10 76h100a50 26 0 0 1-100 0Z", "M30 70c0-14 14-22 30-22s30 8 30 22", "M60 48V40M54 34a6 6 0 0 1 12 0", "M24 40l-6-10M96 40l6-10M60 22V12"],
};

export function Illus({ name, className = "h-24 w-24", strokeWidth = 2.6 }: { name: IllusName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
