import { SCHEDULE } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Schedule() {
  return (
    <section id="horario" className="py-20 lg:py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Horario"
            title="Cuándo encontrarnos"
            description="Reserva tu cita con antelación para asegurar disponibilidad. También puedes escribirnos por WhatsApp."
            className="mb-12"
          />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {SCHEDULE.map((item, i) => (
            <Reveal key={item.d} delay={i * 80}>
              <div className="bg-[var(--background)] p-6 h-full">
                <p className="text-xs font-sans font-medium tracking-[0.15em] uppercase text-[var(--gold)] mb-3">
                  {item.d}
                </p>
                <p className="font-serif text-lg font-light leading-snug">
                  {item.h === "Cerrado" ? (
                    <span className="text-muted-foreground">{item.h}</span>
                  ) : (
                    item.h
                  )}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-8 p-6 border border-[var(--gold)]/30 bg-[var(--gold)]/5">
            <p className="text-sm font-sans text-muted-foreground">
              <span className="text-[var(--gold)] font-medium">Nota:</span>{" "}
              Para consultar disponibilidad exacta, usa el calendario de reservas
              o contáctanos directamente.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
