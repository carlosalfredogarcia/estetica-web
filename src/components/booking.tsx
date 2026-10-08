"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { SERVICES, SCHEDULE_MAP, DAYS, MONTHS, WHATSAPP } from "@/lib/data";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;
type Category = "Facial" | "Corporal" | "Láser";

const TABS: { id: Category; label: string }[] = [
  { id: "Facial", label: "Faciales" },
  { id: "Corporal", label: "Corporales" },
  { id: "Láser", label: "Láser" },
];

function buildTimeSlots(slots: { s: number; e: number }[]): string[] {
  const times: string[] = [];
  for (const { s, e } of slots) {
    for (let h = s; h < e; h++) {
      times.push(`${String(h).padStart(2, "0")}:00`);
    }
  }
  return times;
}

export function Booking() {
  const [step, setStep] = useState<Step>(1);
  const [catTab, setCatTab] = useState<Category>("Facial");
  const [selectedService, setSelectedService] = useState("");
  const [calendarDate, setCalendarDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  /* --- Pre-select service from card click --- */
  useEffect(() => {
    function handleSelect(e: Event) {
      const { name, cat } = (e as CustomEvent<{ name: string; cat: Category }>).detail;
      setStep(1);
      setCatTab(cat);
      setSelectedService(name);
    }
    window.addEventListener("dimux:select-service", handleSelect);
    return () => window.removeEventListener("dimux:select-service", handleSelect);
  }, []);

  /* --- Calendar logic --- */
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();

  const calDays = useMemo(() => {
    const firstDow = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const blanks = Array<null>(firstDow).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...blanks, ...days];
  }, [calYear, calMonth]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isAvailable(day: number) {
    const d = new Date(calYear, calMonth, day);
    if (d < today) return false;
    const dow = d.getDay();
    return SCHEDULE_MAP[dow] !== null && SCHEDULE_MAP[dow] !== undefined;
  }

  function getTimeSlots(day: Date): string[] {
    const dow = day.getDay();
    const slots = SCHEDULE_MAP[dow];
    if (!slots) return [];
    return buildTimeSlots(slots);
  }

  /* --- WhatsApp confirm --- */
  function handleConfirm() {
    if (!selectedService || !selectedDay || !selectedTime || !name) return;
    const dayNum = selectedDay.getDate();
    const monthName = MONTHS[selectedDay.getMonth()];
    const yearNum = selectedDay.getFullYear();
    const dayName = DAYS[selectedDay.getDay()];
    const msg = `Hola! Me gustaría reservar:\n\n*Tratamiento:* ${selectedService}\n*Fecha:* ${dayName} ${dayNum} de ${monthName} de ${yearNum}\n*Hora:* ${selectedTime}h\n*Nombre:* ${name}${phone ? `\n*Teléfono:* ${phone}` : ""}`;
    // window.open(
    //   `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
    //   "_blank",
    //   "noopener,noreferrer"
    // );
    setConfirmed(true);
  }

  function handleNewBooking() {
    setConfirmed(false);
    setStep(1);
    setSelectedService("");
    setSelectedDay(null);
    setSelectedTime("");
    setName("");
    setPhone("");
  }

  const filteredServices = SERVICES.filter((s) => s.cat === catTab);

  return (
    <section id="reservar" className="py-20 lg:py-28 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow="Reservas"
            title="Reserva tu cita"
            description="Selecciona tu tratamiento, elige día y hora disponible y te confirmamos la cita por WhatsApp."
            className="mb-10"
          />
        </Reveal>

        {/* Confirmation screen */}
        {confirmed && selectedDay && (
          <Reveal>
            <div className="border border-[var(--gold)]/40 bg-[var(--gold)]/5 p-10 text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-[var(--gold)] flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-light">¡Reserva recibida!</h3>
                <p className="text-sm font-sans text-muted-foreground max-w-md mx-auto">
                  En breve nos pondremos en contacto contigo para confirmar tu cita.
                </p>
              </div>
              <div className="border-t border-[var(--gold)]/20 pt-6 grid sm:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-sans tracking-[0.15em] uppercase text-[var(--gold)]">Tratamiento</p>
                  <p className="font-serif font-light">{selectedService}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-sans tracking-[0.15em] uppercase text-[var(--gold)]">Fecha</p>
                  <p className="font-serif font-light">
                    {DAYS[selectedDay.getDay()]} {selectedDay.getDate()} de {MONTHS[selectedDay.getMonth()]}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-sans tracking-[0.15em] uppercase text-[var(--gold)]">Hora</p>
                  <p className="font-serif font-light">{selectedTime}h</p>
                </div>
              </div>
              <button
                onClick={handleNewBooking}
                className="btn-elegant border border-foreground/40 px-8 py-3 text-xs font-sans tracking-[0.2em] uppercase mt-2"
              >
                Hacer otra reserva
              </button>
            </div>
          </Reveal>
        )}

        {/* Step indicator + form (hidden when confirmed) */}
        {!confirmed && (<>
        <Reveal delay={80}>
          <div className="flex items-center gap-3 mb-10">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-medium transition-all",
                    step === s
                      ? "bg-foreground text-[var(--background)]"
                      : step > s
                        ? "bg-[var(--gold)] text-white"
                        : "border border-border text-muted-foreground"
                  )}
                >
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                <span
                  className={cn(
                    "text-xs font-sans tracking-wider uppercase hidden sm:block",
                    step === s ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s === 1 ? "Tratamiento" : s === 2 ? "Fecha y hora" : "Datos"}
                </span>
                {s < 3 && (
                  <div
                    className={cn(
                      "h-px w-8 transition-all",
                      step > s ? "bg-[var(--gold)]" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* STEP 1 — Select service */}
        {step === 1 && (
          <Reveal>
            <div className="space-y-6">
              {/* Category tabs */}
              <div className="flex gap-1 border-b border-border">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCatTab(tab.id)}
                    className={cn(
                      "px-5 py-3 text-xs font-sans tracking-[0.15em] uppercase transition-all duration-300 border-b-2 -mb-px",
                      catTab === tab.id
                        ? "border-[var(--gold)] text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Service list */}
              <div className="grid sm:grid-cols-2 gap-px bg-border">
                {filteredServices.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => setSelectedService(service.name)}
                    className={cn(
                      "bg-[var(--background)] p-5 text-left flex items-start justify-between gap-4 transition-colors",
                      selectedService === service.name
                        ? "ring-1 ring-inset ring-[var(--gold)]"
                        : "hover:bg-[var(--secondary)]"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-base font-light truncate">
                        {service.name}
                      </p>
                      <p className="text-xs font-sans text-muted-foreground mt-1">
                        {service.dur} · {service.price}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                        selectedService === service.name
                          ? "border-[var(--gold)] bg-[var(--gold)]"
                          : "border-border"
                      )}
                    >
                      {selectedService === service.name && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className={cn(
                  "btn-elegant border border-foreground px-8 py-3 text-xs font-sans tracking-[0.2em] uppercase",
                  !selectedService && "opacity-40 pointer-events-none"
                )}
              >
                Siguiente →
              </button>
            </div>
          </Reveal>
        )}

        {/* STEP 2 — Calendar + time */}
        {step === 2 && (
          <Reveal>
            <div className="space-y-8">
              {/* Calendar */}
              <div className="border border-border p-6">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => {
                      const d = new Date(calendarDate);
                      d.setMonth(d.getMonth() - 1);
                      setCalendarDate(d);
                      setSelectedDay(null);
                      setSelectedTime("");
                    }}
                    className="p-2 hover:bg-[var(--secondary)] transition-colors"
                    aria-label="Mes anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <p className="font-serif text-lg font-light">
                    {MONTHS[calMonth]} {calYear}
                  </p>
                  <button
                    onClick={() => {
                      const d = new Date(calendarDate);
                      d.setMonth(d.getMonth() + 1);
                      setCalendarDate(d);
                      setSelectedDay(null);
                      setSelectedTime("");
                    }}
                    className="p-2 hover:bg-[var(--secondary)] transition-colors"
                    aria-label="Mes siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs font-sans text-muted-foreground py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-0.5">
                  {calDays.map((day, i) => {
                    if (day === null) {
                      return <div key={`blank-${i}`} />;
                    }
                    const available = isAvailable(day);
                    const thisDate = new Date(calYear, calMonth, day);
                    const isSelected =
                      selectedDay?.toDateString() === thisDate.toDateString();
                    return (
                      <button
                        key={day}
                        disabled={!available}
                        onClick={() => {
                          setSelectedDay(thisDate);
                          setSelectedTime("");
                        }}
                        className={cn(
                          "aspect-square flex items-center justify-center text-sm font-sans transition-all",
                          isSelected
                            ? "bg-foreground text-[var(--background)]"
                            : available
                              ? "hover:bg-[var(--secondary)] text-foreground cursor-pointer"
                              : "text-muted-foreground/40 cursor-not-allowed"
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-4 text-xs font-sans text-muted-foreground">
                <span>⬜ Disponible</span>
                <span className="text-muted-foreground/40">Cerrado</span>
              </div>

              {/* Time slots */}
              {selectedDay && (
                <div className="space-y-3">
                  <p className="text-xs font-sans tracking-[0.15em] uppercase text-[var(--gold)]">
                    Horas disponibles —{" "}
                    {DAYS[selectedDay.getDay()]} {selectedDay.getDate()} de{" "}
                    {MONTHS[selectedDay.getMonth()]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getTimeSlots(selectedDay).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "px-4 py-2 text-xs font-sans border transition-all",
                          selectedTime === time
                            ? "bg-foreground text-[var(--background)] border-foreground"
                            : "border-border hover:border-foreground"
                        )}
                      >
                        {time}h
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="btn-elegant border border-border px-6 py-3 text-xs font-sans tracking-[0.2em] uppercase"
                >
                  ← Volver
                </button>
                <button
                  disabled={!selectedDay || !selectedTime}
                  onClick={() => setStep(3)}
                  className={cn(
                    "btn-elegant border border-foreground px-8 py-3 text-xs font-sans tracking-[0.2em] uppercase",
                    (!selectedDay || !selectedTime) &&
                      "opacity-40 pointer-events-none"
                  )}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </Reveal>
        )}

        {/* STEP 3 — Personal data + confirm */}
        {step === 3 && (
          <Reveal>
            <div className="space-y-8">
              {/* Summary */}
              <div className="border border-[var(--gold)]/30 p-6 bg-[var(--gold)]/5 space-y-2">
                <p className="text-xs font-sans tracking-[0.15em] uppercase text-[var(--gold)] mb-3">
                  Resumen de la reserva
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-muted-foreground font-sans">
                    Tratamiento
                  </span>
                  <span className="font-serif font-light">{selectedService}</span>
                  <span className="text-muted-foreground font-sans">Fecha</span>
                  <span className="font-serif font-light">
                    {selectedDay &&
                      `${DAYS[selectedDay.getDay()]} ${selectedDay.getDate()} de ${MONTHS[selectedDay.getMonth()]} de ${selectedDay.getFullYear()}`}
                  </span>
                  <span className="text-muted-foreground font-sans">Hora</span>
                  <span className="font-serif font-light">
                    {selectedTime}h
                  </span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-sans tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full border border-border bg-transparent px-4 py-3 text-sm font-sans placeholder:text-muted-foreground/50 focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-sans tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full border border-border bg-transparent px-4 py-3 text-sm font-sans placeholder:text-muted-foreground/50 focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="btn-elegant border border-border px-6 py-3 text-xs font-sans tracking-[0.2em] uppercase"
                >
                  ← Volver
                </button>
                <button
                  disabled={!name.trim()}
                  onClick={handleConfirm}
                  className={cn(
                    "btn-gold px-8 py-3 text-xs font-sans tracking-[0.2em] uppercase inline-flex items-center gap-2",
                    !name.trim() && "opacity-40 pointer-events-none"
                  )}
                >
                  Confirmar reserva →
                </button>
              </div>

              <p className="text-xs font-sans text-muted-foreground">
                Al confirmar recibirás un mensaje de Lucía para validar tu cita.
              </p>
            </div>
          </Reveal>
        )}
        </>)}
      </div>
    </section>
  );
}
