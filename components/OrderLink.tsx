"use client";

import type { ReactNode } from "react";
import type { ItemId } from "@/lib/carte";
import type { Mode } from "@/lib/order";

export const ORDER_EVENT = "piri:order";
export type OrderIntent = { item?: ItemId; mode?: Mode };

const scrollToForm = (el: Element) => {
  el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  history.replaceState(null, "", "#commander");
};

/**
 * Ajoute un plat (ou choisit « fête / groupe ») dans le formulaire de commande.
 * « Ajouter » depuis la carte reste sur place (le panier se remplit, un repère s'affiche) ;
 * les autres liens descendent jusqu'au formulaire. Sans JavaScript, le lien #commander suffit.
 */
export function goToOrder(intent?: OrderIntent) {
  if (intent) window.dispatchEvent(new CustomEvent<OrderIntent>(ORDER_EVENT, { detail: intent }));
  const el = document.getElementById("commander");
  if (!el) {
    // Autre page : le formulaire de l'accueil reprendra la demande à son chargement
    try {
      if (intent) sessionStorage.setItem(ORDER_EVENT, JSON.stringify(intent));
    } catch {}
    return false;
  }
  if (!intent?.item) scrollToForm(el);
  return true;
}

export function OrderLink({ href, intent, className = "", children, label, onNavigate }: { href: string; intent?: OrderIntent; className?: string; children: ReactNode; label?: string; onNavigate?: () => void }) {
  return (
    <a
      href={href}
      aria-label={label}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (goToOrder(intent)) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}
