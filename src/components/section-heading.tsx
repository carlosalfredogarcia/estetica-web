import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(center && "text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-[var(--gold)] mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-wide">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  );
}
