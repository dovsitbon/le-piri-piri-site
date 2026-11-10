"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { OrderLink } from "@/components/OrderLink";
import { CloseIcon, MenuIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";

export function Header() {
  const { lang, d } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const home = `/${lang}`;
  const order = `${home}#commander`;
  const links = [
    { href: `${home}#carte`, label: d.nav.carte },
    { href: order, label: d.nav.order },
    { href: `${home}#groupes`, label: d.nav.groups },
    { href: `${home}#infos`, label: d.nav.infos },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 border-b bg-paper/95 backdrop-blur-sm transition-colors duration-300 ${scrolled ? "border-line" : "border-transparent"}`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:bg-paper focus:px-4 focus:py-2">
          {d.nav.skip}
        </a>
        <div className="mx-auto grid h-16 max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 md:h-[4.75rem] md:px-6 xl:px-10">
          <div className="flex items-center">
            <button type="button" className="flex h-11 w-11 items-center justify-center lg:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
              <MenuIcon className="h-6 w-6" />
            </button>
            <nav className="hidden items-center gap-6 lg:flex" aria-label={d.nav.menu}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="py-2 text-[1.0625rem] font-medium whitespace-nowrap underline-offset-[6px] decoration-2 decoration-sol hover:underline">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href={home} aria-label={d.nav.home} className="block py-1">
            <Logo />
          </Link>

          <div className="flex items-center justify-end gap-2 lg:gap-4">
            <LangSwitch lang={lang} label={d.nav.lang} className="hidden lg:flex" />
            <a href={`tel:${site.phoneIntl}`} className="hidden items-center gap-2 font-medium whitespace-nowrap hover:underline xl:inline-flex">
              <PhoneIcon className="h-[18px] w-[18px]" />
              {site.phone}
            </a>
            <a href={`tel:${site.phoneIntl}`} className="flex h-11 w-11 items-center justify-center xl:hidden" aria-label={`${d.nav.call} ${site.phone}`}>
              <PhoneIcon className="h-5 w-5" />
            </a>
            <OrderLink href={order} className="btn hidden !min-h-11 !px-5 md:inline-flex">
              {d.nav.orderCta}
            </OrderLink>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fade-in fixed inset-0 z-[60] flex flex-col overscroll-contain bg-paper" role="dialog" aria-modal="true" aria-label={d.nav.menu}>
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-3">
            <button type="button" className="flex h-11 w-11 items-center justify-center justify-self-start" onClick={() => setMenu(false)} aria-label={d.nav.close}>
              <CloseIcon className="h-6 w-6" />
            </button>
            <Logo />
            <span />
          </div>
          <div className="frieze mx-4 opacity-60" aria-hidden="true" />
          <nav className="flex flex-1 flex-col justify-center gap-1 px-8" aria-label={d.nav.menu}>
            {links.map((l, i) => (
              <div key={l.href} className="rise" style={{ animationDelay: `${0.04 * i}s` }}>
                <Link href={l.href} onClick={() => setMenu(false)} className="display block py-2 text-[2.6rem]">
                  {l.label}
                </Link>
              </div>
            ))}
          </nav>
          {/* Raccourcis : Commander, Appeler, Itinéraire */}
          <div className="grid grid-cols-3 gap-2 border-t border-line p-3" aria-label={d.nav.shortcuts}>
            <OrderLink href={order} className="btn !min-h-14 !px-2" onNavigate={() => setMenu(false)}>
              {d.nav.orderCta}
            </OrderLink>
            <a href={`tel:${site.phoneIntl}`} className="btn-line !min-h-14 !px-2">
              <PhoneIcon className="h-[18px] w-[18px]" />
              {d.nav.call}
            </a>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-line !min-h-14 !px-2">
              <PinIcon className="h-[18px] w-[18px]" />
              {d.nav.route}
            </a>
          </div>
          <div className="flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <LangSwitch lang={lang} label={d.nav.lang} />
          </div>
        </div>
      )}
    </>
  );
}

/** Barre fixée en bas de l'écran sur mobile : « Commander » toujours à portée de pouce, et l'appel. */
export function MobileOrderBar() {
  const { lang, d } = useLocale();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-paper/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
      <OrderLink href={`/${lang}#commander`} className="btn flex-1">
        {d.nav.orderCta}
      </OrderLink>
      <a href={`tel:${site.phoneIntl}`} className="btn-line !px-4" aria-label={`${d.nav.call} ${site.phone}`}>
        <PhoneIcon className="h-5 w-5" />
        {d.nav.call}
      </a>
    </div>
  );
}
