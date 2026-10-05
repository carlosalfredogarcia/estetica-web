import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { Services } from "@/components/services";
import { Testimonials } from "@/components/testimonials";
import { Booking } from "@/components/booking";
import { Schedule } from "@/components/schedule";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Intro />
        <Services />
        <Testimonials />
        <Booking />
        <Schedule />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
