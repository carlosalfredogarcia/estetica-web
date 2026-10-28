"use client";

import { telefonoBonito } from "@/lib/data";
import { WhatsAppIcon, InstagramIcon } from "@/components/brand-icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { useNegocio } from "@/components/negocio";

export function Contact() {
  const { instagram: INSTAGRAM, whatsapp: WHATSAPP } = useNegocio();
  return (
    <section
      id="contacto"
      className="py-20 lg:py-28 px-6 lg:px-8 bg-[var(--secondary)]"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Contacto"
            title="Estamos aquí para ti"
            description={INSTAGRAM ? "Escríbenos por WhatsApp o síguenos en Instagram para novedades, promociones y consejos de belleza." : "Escríbenos por WhatsApp: te respondemos dudas, precios y disponibilidad."}
            center
            className="mb-12 [&>p:last-child]:mx-auto"
          />
        </Reveal>

        <div className={`grid gap-px bg-border mx-auto ${INSTAGRAM ? "sm:grid-cols-2 max-w-2xl" : "max-w-sm"}`}>
          {/* WhatsApp */}
          <Reveal>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--background)] p-8 flex flex-col items-center gap-4 text-center group hover:bg-[var(--secondary)] transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <p className="font-serif text-lg font-light mb-1">WhatsApp</p>
                <p className="text-xs font-sans text-muted-foreground tracking-wide">
                  {telefonoBonito(WHATSAPP)}
                </p>
              </div>
              <span className="text-xs font-sans tracking-[0.15em] uppercase text-[var(--gold)] group-hover:underline">
                Enviar mensaje →
              </span>
            </a>
          </Reveal>

          {/* Instagram */}
          {INSTAGRAM && <Reveal delay={100}>
            <a
              href={`https://instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--background)] p-8 flex flex-col items-center gap-4 text-center group hover:bg-[var(--secondary)] transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#E1306C]/10 flex items-center justify-center">
                <InstagramIcon className="w-6 h-6 text-[#E1306C]" />
              </div>
              <div>
                <p className="font-serif text-lg font-light mb-1">Instagram</p>
                <p className="text-xs font-sans text-muted-foreground tracking-wide">
                  @{INSTAGRAM}
                </p>
              </div>
              <span className="text-xs font-sans tracking-[0.15em] uppercase text-[var(--gold)] group-hover:underline">
                Seguir →
              </span>
            </a>
          </Reveal>}
        </div>
      </div>
    </section>
  );
}
