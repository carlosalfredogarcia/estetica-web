"use client";

import { useEffect, useState } from "react";
import { IntroSello } from "./intro-sello";
import { IntroOro } from "./intro-oro";

// La intro de la portada: el sello dorado por defecto; ?intro=oro enseña la de oro líquido
export function Intro() {
  const [tipo, setTipo] = useState<"sello" | "oro">("sello");
  useEffect(() => {
    const t = setTimeout(() => {
      if (new URLSearchParams(location.search).get("intro") === "oro") setTipo("oro");
    }, 0);
    return () => clearTimeout(t);
  }, []);
  return tipo === "oro" ? <IntroOro /> : <IntroSello />;
}
