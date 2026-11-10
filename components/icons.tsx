// Pictos au trait, dessinés pour le site (stroke = currentColor).
type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const PlusIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2}>
    <path d="M5 12h14" />
  </svg>
);

export const CheckIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const CloseIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.8}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const MenuIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.8}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const PhoneIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6.6 3.5h2.6l1.5 4.2-2 1.4a11.5 11.5 0 0 0 6.2 6.2l1.4-2 4.2 1.5v2.6a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
);

export const PinIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const StarIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="currentColor" d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />
  </svg>
);

export const ArrowIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={`${className} rtl:-scale-x-100`} {...base} strokeWidth={1.8}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const FacebookIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M14 21v-7.5h2.6l.4-3H14V8.7c0-.9.3-1.5 1.5-1.5H17V4.5a19 19 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.2H8.3v3H11V21" />
  </svg>
);

export const WhatsAppIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 20l1.2-3.9A8.3 8.3 0 1 1 8 18.9Z" />
    <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5a6 6 0 0 0 2.8 2.4c.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .6-.3 1.6-1.6 1.8-1 .2-2.6-.2-4.4-1.6-1.4-1.1-2.6-2.7-2.8-3.8-.2-1 .2-1.8.5-2.3Z" />
  </svg>
);

/** À emporter : un sac kraft. */
export const BagIcon = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}>
    <path d="M7 11h18l-1.5 16h-15Z" />
    <path d="M12 11V8.5a4 4 0 0 1 8 0V11" />
    <path d="M13 17.5c1.6 1.4 4.4 1.4 6 0" />
  </svg>
);

/** Grillé à la braise : une flamme sur la grille. */
export const FlameIcon = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}>
    <path d="M16 4c1 4.5 6 6.5 6 12a6 6 0 0 1-12 0c0-2.8 1.5-4.4 2.6-5.6.3 2 1.2 3 2.2 3.4C14.4 10.6 14.5 7 16 4Z" />
    <path d="M5 27h22M8 24h16" />
  </svg>
);

/** Groupes et fêtes : un plat partagé. */
export const PartyIcon = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}>
    <path d="M4 19h24a12 12 0 0 1-24 0Z" />
    <path d="M16 19v-4M13 9.5a3 3 0 0 1 6 0" />
    <path d="M8 13l-2-3M24 13l2-3M16 7V4" />
  </svg>
);

export const PhoneLineIcon = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 32" className={className} {...base}>
    <path d="M9 5h3.4l2 5.4-2.6 1.8a15 15 0 0 0 8 8l1.8-2.6 5.4 2V23a2.7 2.7 0 0 1-2.9 2.7A21.8 21.8 0 0 1 6.3 7.9 2.7 2.7 0 0 1 9 5Z" />
    <path d="M20 5.5a7 7 0 0 1 6.5 6.5M20 9.5a3 3 0 0 1 2.5 2.5" />
  </svg>
);
