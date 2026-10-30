// Sello «rp» e iconos de línea dorada (los de sus historias destacadas de Instagram)

export function Sello({ className, grosor = 4 }: { className?: string; grosor?: number }) {
  return (
    <svg className={className} viewBox="0 0 260 260" aria-hidden="true">
      <circle cx="130" cy="130" r="120" fill="none" stroke="#C9A96E" strokeWidth={grosor} />
      <text x="130" y="160" textAnchor="middle" fontFamily="Cormorant Garamond, Garamond, serif" fontStyle="italic" fontWeight={300} fontSize={92} fill="#C9A96E" letterSpacing={-4}>
        rp
      </text>
    </svg>
  );
}

export function IconoGotero() {
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true">
      <rect x="-24" y="-38" width="10" height="13" rx="5" />
      <rect x="-26" y="-25" width="14" height="6" rx="1" />
      <rect x="-32" y="-19" width="26" height="46" rx="4" />
      <line x1="-25" y1="2" x2="-13" y2="2" />
      <path d="M20 -12 C20 -12 11 1 11 7 a9 9 0 0 0 18 0 C29 1 20 -12 20 -12Z" />
    </svg>
  );
}

export function IconoTijeras({ animada = false }: { animada?: boolean }) {
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true">
      <g className={animada ? "rp-hoja rp-hoja-a" : undefined}>
        <line x1="-17" y1="-32" x2="7" y2="9" />
        <circle cx="11" cy="17" r="8.5" />
      </g>
      <g className={animada ? "rp-hoja rp-hoja-b" : undefined}>
        <line x1="17" y1="-32" x2="-7" y2="9" />
        <circle cx="-11" cy="17" r="8.5" />
      </g>
      <circle cx="0" cy="-3.4" r="1.6" style={{ fill: "#C9A96E", stroke: "none" }} />
      <line x1="26" y1="-36" x2="26" y2="-24" />
      <line x1="20" y1="-30" x2="32" y2="-30" />
    </svg>
  );
}

// Iconos para las tarjetas de barbería mientras llegan sus fotos
const ICONOS: Record<string, React.ReactNode> = {
  corte: <IconoTijeras />,
  ritual: (
    <svg viewBox="-50 -50 100 100" aria-hidden="true">
      <path d="M-30 -6 h60 v8 a30 30 0 0 1 -60 0 Z" />
      <path d="M-14 -6 c0 -12 4 -20 14 -26 c10 6 14 14 14 26" />
      <line x1="0" y1="-32" x2="0" y2="-40" />
      <line x1="-36" y1="34" x2="36" y2="34" />
    </svg>
  ),
  barba: (
    <svg viewBox="-50 -50 100 100" aria-hidden="true">
      <path d="M-34 -10 L18 -28 a6 6 0 0 1 8 4 l-2 6 L-30 -2 Z" />
      <path d="M-30 -2 l-6 4 l4 8 l8 -6" />
      <path d="M-20 22 c6 -6 14 -6 20 0 c6 6 14 6 20 0" />
      <path d="M-20 34 c6 -6 14 -6 20 0 c6 6 14 6 20 0" />
    </svg>
  ),
  facial: (
    <svg viewBox="-50 -50 100 100" aria-hidden="true">
      <ellipse cx="0" cy="0" rx="24" ry="32" />
      <path d="M-10 -6 h6 M4 -6 h6 M-8 14 c5 4 11 4 16 0" />
      <path d="M30 -30 l4 -8 l4 8 l-4 8 Z" />
    </svg>
  ),
  color: (
    <svg viewBox="-50 -50 100 100" aria-hidden="true">
      <path d="M-30 4 h44 l-4 26 h-36 Z" />
      <line x1="-8" y1="4" x2="22" y2="-34" />
      <path d="M18 -38 l10 8 l-4 4 l-10 -8 Z" />
    </svg>
  ),
  detalle: (
    <svg viewBox="-50 -50 100 100" aria-hidden="true">
      <path d="M-34 4 c14 -16 54 -16 68 0" />
      <path d="M-24 20 c8 6 40 6 48 0" />
      <path d="M26 -30 l4 -8 l4 8 l-4 8 Z" />
    </svg>
  ),
};

export function FotoIcono({ tipo }: { tipo: string }) {
  return <div className="rp-icono-foto">{ICONOS[tipo] ?? ICONOS.corte}</div>;
}

export function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36A9.4 9.4 0 0 1 2.6 12C2.6 6.8 6.84 2.56 12.05 2.56c2.52 0 4.89.98 6.67 2.77A9.37 9.37 0 0 1 21.5 12c0 5.2-4.24 9.45-9.45 9.45M20.1 3.9A11.3 11.3 0 0 0 12.05.6C5.78.6.68 5.7.68 11.97c0 2 .52 3.96 1.52 5.68L.6 23.4l5.9-1.55a11.4 11.4 0 0 0 5.54 1.41h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.9-3.33-8.04" />
    </svg>
  );
}
