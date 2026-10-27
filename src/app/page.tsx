import { SiteHeader } from "@/components/site-header";
import { CinemaIntro } from "@/components/cinema-intro";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Intro } from "@/components/intro";
import { Diagnostico } from "@/components/diagnostico";
import { Services } from "@/components/services";
import { Testimonials } from "@/components/testimonials";
import { Booking } from "@/components/booking";
import { Cuidados } from "@/components/cuidados";
import { Schedule } from "@/components/schedule";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";
import { SERVICES, SCHEDULE_MAP, WHATSAPP, INSTAGRAM } from "@/lib/data";

// Ficha del negocio para Google (horario, servicios y precios en los resultados)
const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "DIMUX Estética",
  description: "Centro de estética avanzada en Málaga: tratamientos faciales, corporales y depilación láser.",
  telephone: `+${WHATSAPP}`,
  address: { "@type": "PostalAddress", addressLocality: "Málaga", addressCountry: "ES" },
  sameAs: [`https://instagram.com/${INSTAGRAM}`],
  priceRange: "6€ - 89€",
  openingHoursSpecification: Object.entries(SCHEDULE_MAP).flatMap(([d, slots]) =>
    (slots ?? []).map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DOW[Number(d)],
      opens: hh(s.s),
      closes: hh(s.e),
    }))
  ),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Tratamientos",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, description: s.desc },
      ...(parseFloat(s.price) ? { price: parseFloat(s.price), priceCurrency: "EUR" } : {}),
    })),
  },
};

export default function Home() {
  return (
    <div className="cine">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CinemaIntro />
      <div className="film-grain" aria-hidden />
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <Intro />
        <Diagnostico />
        <Services />
        <Testimonials />
        <Booking />
        <Cuidados />
        <Schedule />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
