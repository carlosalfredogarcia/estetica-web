"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WHATSAPP, INSTAGRAM } from "@/lib/data";
import { WhatsAppIcon, InstagramIcon } from "@/components/brand-icons";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Horario", href: "#horario" },
  { label: "Contacto", href: "#contacto" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[var(--background)]/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#inicio"
          className="font-serif text-xl tracking-[0.15em] uppercase font-light flex-shrink-0"
        >
          DIMUX
        </a>

        {/* Desktop nav — visible from md breakpoint */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-sans tracking-[0.12em] uppercase text-foreground/70 hover:text-foreground transition-colors duration-300 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <a
            href={`https://instagram.com/${INSTAGRAM}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a
            href="#reservar"
            className="btn-elegant border border-foreground px-5 py-2 text-xs font-sans tracking-[0.15em] uppercase"
          >
            Reservar
          </a>
        </div>

        {/* Mobile menu toggle — only on small screens */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span
            className={cn(
              "block w-5 h-0.5 bg-current transition-all mb-1.5",
              menuOpen && "rotate-45 translate-y-2"
            )}
          />
          <span
            className={cn(
              "block w-5 h-0.5 bg-current transition-all mb-1.5",
              menuOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block w-3.5 h-0.5 bg-current transition-all",
              menuOpen && "-rotate-45 -translate-y-2 w-5"
            )}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--background)] border-t border-border px-6 py-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-sans tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 flex items-center gap-4 border-t border-border">
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
            <a
              href={`https://instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href="#reservar"
              className="ml-auto btn-elegant border border-foreground px-5 py-2 text-xs font-sans tracking-[0.15em] uppercase"
              onClick={() => setMenuOpen(false)}
            >
              Reservar
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
