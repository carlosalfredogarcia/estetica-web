import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const STATS = [
  { value: "8", label: "Tratamientos Faciales" },
  { value: "5", label: "Tratamientos Corporales" },
  { value: "9", label: "Zonas Láser" },
];

export function Intro() {
  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8 bg-[var(--secondary)]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image */}
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80"
              alt="Sala de tratamientos DIMUX Estética"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[var(--background)]/90 backdrop-blur-sm px-6 py-4">
              <p className="text-xs font-sans tracking-[0.15em] uppercase text-[var(--gold)]">
                Centro DIMUX Estética
              </p>
              <p className="text-sm font-light text-foreground/80 mt-1">
                Málaga
              </p>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        <div className="space-y-8">
          <Reveal>
            <SectionHeading
              eyebrow="Sobre nosotros"
              title="La estética como arte"
              description="En DIMUX combinamos tecnología de vanguardia con un trato cercano y personalizado. Cada tratamiento está diseñado para realzar tu belleza natural con resultados reales y duraderos."
            />
          </Reveal>

          {/* Stats */}
          <Reveal delay={150}>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-4xl font-light text-[var(--gold)]">
                    {stat.value}
                  </p>
                  <p className="text-xs font-sans text-muted-foreground mt-1 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <a
              href="#servicios"
              className="btn-elegant border border-foreground px-8 py-3 text-xs font-sans tracking-[0.2em] uppercase inline-flex items-center"
            >
              Ver tratamientos
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
