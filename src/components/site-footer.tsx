import { WHATSAPP, INSTAGRAM } from "@/lib/data";
import { WhatsAppIcon, InstagramIcon } from "@/components/brand-icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="border-t border-border py-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg tracking-[0.15em] uppercase font-light">
            DIMUX Estética
          </p>

          <div className="flex items-center gap-5">
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
            <a
              href={`https://instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs font-sans text-muted-foreground">
            © {year} DIMUX Estética · Málaga
          </p>
        </div>
      </footer>

      {/* Mobile sticky WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform sm:hidden"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
    </>
  );
}
