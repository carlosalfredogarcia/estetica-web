import { TESTIMONIALS } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Testimonials() {
  return (
    <section
      id="testimonios"
      className="py-20 lg:py-28 px-6 lg:px-8 bg-[var(--secondary)]"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Opiniones"
            title="Lo que dicen nuestras clientas"
            center
            className="mb-14"
          />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-px bg-border">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="bg-[var(--background)] p-8 flex flex-col gap-6 h-full">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="text-[var(--gold)] text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="font-serif text-lg font-light leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="text-xs font-sans tracking-[0.1em] uppercase text-muted-foreground">
                  — {t.name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
