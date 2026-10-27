import { SERVICES } from "@/lib/data";

// Franja de títulos que pasa como los créditos de una película
export function Marquee() {
  const names = SERVICES.map((s) => s.name);
  return (
    <div className="relative py-6 border-y border-border overflow-hidden bg-black" aria-hidden>
      <div className="marquee">
        {[...names, ...names].map((n, i) => (
          <span key={i} className="flex items-center font-serif text-2xl sm:text-3xl font-light italic text-foreground/70 whitespace-nowrap px-8">
            {n}
            <span className="ml-16 text-[var(--gold)] not-italic text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
