// Logo typographique du Piri Piri (pas de logo officiel connu : à remplacer par le vrai s'il en existe un).
// Un carreau d'azulejo au trait bleu, un petit piment rouge posé dessus, et « LE PIRI PIRI » en Fraunces.
// Le même tracé sert à l'ouverture (Intro), au favicon (app/icon.svg) et à public/logo.svg.

/** Tracés du carreau (viewBox 0 0 64 64). */
export const TILE = {
  frame: "M6 6H58V58H6Z",
  corners: ["M6 18A12 12 0 0 0 18 6", "M46 6A12 12 0 0 0 58 18", "M58 46A12 12 0 0 0 46 58", "M18 58A12 12 0 0 0 6 46"],
  petals: ["M32 15C37.5 20.5 37.5 26.5 32 32C26.5 26.5 26.5 20.5 32 15Z", "M49 32C43.5 37.5 37.5 37.5 32 32C37.5 26.5 43.5 26.5 49 32Z", "M32 49C26.5 43.5 26.5 37.5 32 32C37.5 37.5 37.5 43.5 32 49Z", "M15 32C20.5 26.5 26.5 26.5 32 32C26.5 37.5 20.5 37.5 15 32Z"],
};

/** Le piment, posé en diagonale sur le bas du carreau. */
export const CHILI = {
  body: "M19 47.5C28 50 41 46 49 35.5C50.6 33.4 53.6 34.3 53.2 37C51.4 47.8 36.5 56.4 22.5 53.6C17.6 52.6 15.6 46.6 19 47.5Z",
  shine: "M24 50.2C31 51 39 48.4 44.5 43",
  stem: "M52 35.2C51.6 31.6 53.4 28.6 57 27.6",
  cap: "M48.6 36.4C49.6 33.4 53.6 32.6 55.2 35.4",
};

export function Mark({ className = "h-10 w-10", stroke = "#1F4E8C" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <g stroke={stroke} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <path d={TILE.frame} />
        {TILE.corners.map((d) => (
          <path key={d} d={d} />
        ))}
        {TILE.petals.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path d={CHILI.body} fill="#C8322B" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      <path d={CHILI.shine} stroke="#fff" strokeOpacity={0.55} strokeWidth={1.4} strokeLinecap="round" />
      <path d={CHILI.cap} fill="#3F6B2A" />
      <path d={CHILI.stem} stroke="#3F6B2A" strokeWidth={2.6} strokeLinecap="round" />
    </svg>
  );
}

/** Logo complet : le carreau + « LE PIRI PIRI ». `tone="light"` sur fond bleu. */
export function Logo({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} translate="no">
      <Mark className="h-9 w-9 shrink-0 md:h-10 md:w-10" stroke={tone === "light" ? "#FBF8F2" : "#1F4E8C"} />
      <span className={`font-[family-name:var(--font-display)] text-[1.3rem] leading-none font-[680] tracking-[0.03em] whitespace-nowrap md:text-[1.45rem] ${tone === "light" ? "text-paper" : "text-braise"}`}>
        LE PIRI PIRI
      </span>
    </span>
  );
}
