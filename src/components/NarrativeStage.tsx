import React from "react";
import { TipoComposicionVisual, TipoEscenario } from "../types";

export interface NarrativeStageProps {
  escenario?: TipoEscenario;
  composicionVisual?: TipoComposicionVisual;
  frame: number;
}

export const NarrativeStage: React.FC<NarrativeStageProps> = ({
  escenario = "vacio",
  composicionVisual = "minimalista",
  frame,
}) => {
  // En minimalista o vacio, fondo limpio neo-brutalista
  if (escenario === "vacio") {
    return (
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundColor: "#F8FAFC",
          backgroundImage: "radial-gradient(#cbd5e1 2px, transparent 2px)",
          backgroundSize: "36px 36px",
        }}
      />
    );
  }

  // Viñeta y líneas de tensión para primer plano
  const isPrimerPlano = composicionVisual === "primer_plano";

  if (escenario === "habitacion_noche") {
    // Escenario ilustrado de habitación nocturna (ventana con luna, piso de madera, cama y estrellas)
    const starBlink1 = 0.5 + Math.sin(frame / 8) * 0.5;
    const starBlink2 = 0.5 + Math.cos(frame / 10) * 0.5;
    const starBlink3 = 0.5 + Math.sin(frame / 6 + 1.2) * 0.5;

    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#F8FAFC]">
        {/* Capa de pared nocturna suave */}
        <div
          className="absolute top-0 left-0 right-0 h-[1260px]"
          style={{
            background:
              "linear-gradient(180deg, #E2E8F0 0%, #F1F5F9 85%, #E2E8F0 100%)",
            borderBottom: "6px solid #000000",
          }}
        >
          {/* Ventana con cielo nocturno y luna creciente */}
          <div
            className="absolute top-[280px] left-[100px] w-[260px] h-[340px] bg-[#0F172A] rounded-2xl overflow-hidden border-4 border-black"
            style={{ boxShadow: "8px 8px 0px #000000" }}
          >
            <svg viewBox="0 0 260 340" className="w-full h-full">
              {/* Brillo de luna */}
              <circle cx="170" cy="90" r="50" fill="#FEF08A" opacity="0.18" />
              {/* Luna creciente */}
              <path
                d="M 180 50 A 45 45 0 0 1 180 130 A 35 35 0 0 0 180 50 Z"
                fill="#FDE047"
                stroke="#000000"
                strokeWidth="2"
              />
              {/* Estrellas titilantes */}
              <circle
                cx="55"
                cy="70"
                r="3.5"
                fill="#FFFFFF"
                opacity={starBlink1}
              />
              <circle
                cx="105"
                cy="140"
                r="2.5"
                fill="#FFFFFF"
                opacity={starBlink2}
              />
              <circle
                cx="75"
                cy="230"
                r="3"
                fill="#FFFFFF"
                opacity={starBlink3}
              />
              <circle
                cx="210"
                cy="200"
                r="3.5"
                fill="#FFFFFF"
                opacity={starBlink1}
              />
              {/* Marco de ventana cruzado */}
              <line
                x1="130"
                y1="0"
                x2="130"
                y2="340"
                stroke="#1E293B"
                strokeWidth="6"
              />
              <line
                x1="0"
                y1="170"
                x2="260"
                y2="170"
                stroke="#1E293B"
                strokeWidth="6"
              />
            </svg>
          </div>

          {/* Cama ilustrada en la esquina derecha del cuarto */}
          <div className="absolute top-[960px] right-[40px] w-[340px] h-[300px]">
            <svg viewBox="0 0 340 300" className="w-full h-full">
              {/* Cabecera de madera */}
              <rect
                x="260"
                y="60"
                width="65"
                height="240"
                rx="10"
                fill="#94A3B8"
                stroke="#000000"
                strokeWidth="6"
              />
              {/* Almohada */}
              <rect
                x="200"
                y="150"
                width="70"
                height="45"
                rx="14"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="5"
              />
              {/* Colchón y sábana suave */}
              <rect
                x="20"
                y="180"
                width="250"
                height="110"
                rx="18"
                fill="#38BDF8"
                stroke="#000000"
                strokeWidth="6"
              />
              <path
                d="M 120 180 L 120 290"
                stroke="#0284C7"
                strokeWidth="4"
                strokeDasharray="8 6"
              />
              {/* Patas de cama */}
              <rect
                x="30"
                y="275"
                width="16"
                height="25"
                fill="#000000"
                rx="4"
              />
              <rect
                x="250"
                y="275"
                width="16"
                height="25"
                fill="#000000"
                rx="4"
              />
            </svg>
          </div>

          {/* Cuadro o reloj de pared minimalista */}
          <div
            className="absolute top-[260px] right-[140px] w-[90px] h-[90px] rounded-full bg-white border-4 border-black flex items-center justify-center"
            style={{ boxShadow: "5px 5px 0px #000000" }}
          >
            <svg viewBox="0 0 90 90" className="w-full h-full">
              <circle cx="45" cy="45" r="3" fill="#000000" />
              {/* Manecillas a las 2:15 AM */}
              <line
                x1="45"
                y1="45"
                x2="45"
                y2="24"
                stroke="#000000"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="45"
                y1="45"
                x2="65"
                y2="45"
                stroke="#EF4444"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Capa de piso: Tablas de parquet ilustradas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[660px]"
          style={{
            background:
              "repeating-linear-gradient(45deg, #CBD5E1, #CBD5E1 30px, #E2E8F0 30px, #E2E8F0 60px)",
            borderTop: "8px solid #000000",
          }}
        >
          {/* Sombra de suelo y perspectiva */}
          <div className="w-full h-[60px] bg-black/10" />
        </div>

        {/* Partículas de sueño flotando sutilmente en primer plano */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => {
            const x = (i * 180 + frame * (0.8 + i * 0.3)) % 1080;
            const y = 300 + ((i * 140 + frame * 0.5) % 1100);
            const size = 6 + (i % 3) * 4;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-yellow-300 border border-black/40"
                style={{
                  left: x,
                  top: y,
                  width: size,
                  height: size,
                  opacity: 0.25 + Math.sin((frame + i * 20) / 10) * 0.15,
                }}
              />
            );
          })}
        </div>
        {/* Viñeta cinematográfica dramática para primer plano */}
        {isPrimerPlano && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 40%, rgba(15, 23, 42, 0.45) 100%)",
            }}
          />
        )}
      </div>
    );
  }

  if (escenario === "laboratorio") {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#F1F5F9]">
        {/* Pared del laboratorio con pizarra científica y estantes */}
        <div
          className="absolute top-0 left-0 right-0 h-[1260px] bg-[#F8FAFC]"
          style={{
            backgroundImage: "linear-gradient(#E2E8F0 1.5px, transparent 1.5px), linear-gradient(90deg, #E2E8F0 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
            borderBottom: "6px solid #000000",
          }}
        >
          {/* Pizarra científica */}
          <div
            className="absolute top-[260px] left-[120px] w-[320px] h-[220px] bg-[#1E293B] rounded-2xl border-4 border-black p-4 flex flex-col justify-between"
            style={{ boxShadow: "8px 8px 0px #000000" }}
          >
            <div className="text-emerald-400 font-mono text-sm tracking-wider">
              {">"} EXPERIMENTO_04
            </div>
            <svg viewBox="0 0 200 120" className="w-full h-[120px]">
              {/* Molécula dibujada con tiza */}
              <circle cx="40" cy="60" r="12" fill="none" stroke="#FFFFFF" strokeWidth="3" />
              <line x1="52" y1="60" x2="98" y2="60" stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="110" cy="60" r="14" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="3" />
              <line x1="120" y1="50" x2="155" y2="25" stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="165" cy="20" r="10" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" />
              <line x1="120" y1="70" x2="155" y2="95" stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="165" cy="100" r="10" fill="#EF4444" stroke="#FFFFFF" strokeWidth="3" />
            </svg>
            <div className="text-yellow-300 font-mono text-xs">
              CO2 + NUCLEACIÓN = ¡PUM!
            </div>
          </div>

          {/* Mesa de laboratorio auxiliar con matraces al lado derecho */}
          <div className="absolute top-[980px] right-[40px] w-[320px] h-[280px]">
            <svg viewBox="0 0 320 280" className="w-full h-full">
              {/* Superficie de mesa resistente */}
              <rect x="20" y="140" width="280" height="30" rx="6" fill="#64748B" stroke="#000000" strokeWidth="6" />
              {/* Patas metálicas */}
              <rect x="40" y="170" width="18" height="110" fill="#000000" />
              <rect x="260" y="170" width="18" height="110" fill="#000000" />
              {/* Matraz Erlenmeyer con líquido burbujeante */}
              <path d="M 95 90 L 105 90 L 105 110 L 125 140 L 75 140 L 95 110 Z" fill="#38BDF8" stroke="#000000" strokeWidth="5" />
              <circle cx="95" cy="125" r="4" fill="#FFFFFF" opacity="0.8" />
              <circle cx="105" cy="132" r="3" fill="#FFFFFF" opacity="0.8" />
              {/* Probeta con líquido naranja */}
              <rect x="150" y="70" width="22" height="70" rx="4" fill="#F59E0B" stroke="#000000" strokeWidth="5" />
              <line x1="150" y1="90" x2="160" y2="90" stroke="#000000" strokeWidth="2" />
              <line x1="150" y1="105" x2="160" y2="105" stroke="#000000" strokeWidth="2" />
              <line x1="150" y1="120" x2="160" y2="120" stroke="#000000" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Suelo técnico de laboratorio */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[660px]"
          style={{
            backgroundColor: "#CBD5E1",
            borderTop: "8px solid #000000",
            backgroundImage: "repeating-linear-gradient(90deg, #94A3B8, #94A3B8 2px, transparent 2px, transparent 120px)",
          }}
        >
          {/* Banda de advertencia industrial amarilla y negra */}
          <div
            className="w-full h-[24px]"
            style={{
              background: "repeating-linear-gradient(45deg, #F59E0B, #F59E0B 16px, #000000 16px, #000000 32px)",
              borderBottom: "3px solid #000000",
            }}
          />
        </div>

        {/* Viñeta cinematográfica dramática para primer plano */}
        {isPrimerPlano && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 40%, rgba(15, 23, 42, 0.45) 100%)",
            }}
          />
        )}
      </div>
    );
  }

  if (escenario === "lunar") {
    const starBlink1 = 0.5 + Math.sin(frame / 8) * 0.5;
    const starBlink2 = 0.5 + Math.cos(frame / 11) * 0.5;

    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#090D16]">
        {/* Espacio profundo con estrellas */}
        <div className="absolute top-0 left-0 right-0 h-[1260px] bg-[#090D16]">
          <svg className="w-full h-full" viewBox="0 0 1080 1260">
            {/* Estrellas distantes */}
            <circle cx="120" cy="180" r="3" fill="#FFFFFF" opacity={starBlink1} />
            <circle cx="280" cy="90" r="2.5" fill="#FFFFFF" opacity={starBlink2} />
            <circle cx="450" cy="240" r="2" fill="#FFFFFF" opacity={starBlink1} />
            <circle cx="680" cy="140" r="3" fill="#FFFFFF" opacity={starBlink2} />
            <circle cx="890" cy="220" r="2.5" fill="#FFFFFF" opacity={starBlink1} />
            <circle cx="980" cy="80" r="2" fill="#FFFFFF" opacity={starBlink2} />
            <circle cx="200" cy="420" r="2" fill="#FFFFFF" opacity={starBlink1} />
            <circle cx="820" cy="460" r="3" fill="#FFFFFF" opacity={starBlink2} />

            {/* Planeta Tierra visto desde la Luna (Earthrise) */}
            <g transform="translate(780, 260)">
              <circle cx="0" cy="0" r="80" fill="#0284C7" stroke="#000000" strokeWidth="6" />
              <path d="M -40 -30 Q -10 -60 20 -40 Q 50 -10 30 20 Q 0 40 -30 20 Z" fill="#10B981" />
              <path d="M -60 20 Q -40 10 -20 30 Q -10 60 -50 50 Z" fill="#10B981" />
              <path d="M -50 -40 Q 0 -20 40 -30" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
              <path d="M -30 10 Q 10 30 60 10" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />
            </g>

            {/* Nebulosa o resplandor lunar sutil */}
            <ellipse cx="540" cy="1260" rx="600" ry="200" fill="#1E293B" opacity="0.3" />
          </svg>
        </div>

        {/* Superficie y suelo lunar con cráteres */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[660px]"
          style={{
            backgroundColor: "#94A3B8",
            borderTop: "8px solid #000000",
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 1080 660">
            {/* Cráteres en el suelo lunar */}
            <ellipse cx="220" cy="120" rx="90" ry="32" fill="#64748B" stroke="#000000" strokeWidth="5" />
            <ellipse cx="200" cy="115" rx="65" ry="20" fill="#475569" />

            <ellipse cx="760" cy="180" rx="140" ry="45" fill="#64748B" stroke="#000000" strokeWidth="6" />
            <ellipse cx="740" cy="172" rx="100" ry="28" fill="#475569" />

            <ellipse cx="480" cy="340" rx="110" ry="35" fill="#64748B" stroke="#000000" strokeWidth="5" />
            <ellipse cx="465" cy="332" rx="80" ry="22" fill="#475569" />

            {/* Pequeña bandera clavada en el horizonte lunar */}
            <g transform="translate(940, 0)">
              <line x1="0" y1="-80" x2="0" y2="0" stroke="#000000" strokeWidth="5" />
              <rect x="0" y="-80" width="45" height="28" fill="#EF4444" stroke="#000000" strokeWidth="3" />
            </g>
          </svg>
        </div>

        {/* Viñeta cinematográfica dramática para primer plano */}
        {isPrimerPlano && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 40%, rgba(9, 13, 22, 0.65) 100%)",
            }}
          />
        )}
      </div>
    );
  }

  // Escenario por defecto con piso neo-brutalista
  return (
    <div className="absolute inset-0 pointer-events-none z-0 bg-[#F8FAFC]">
      <div
        className="absolute top-0 left-0 right-0 h-[1260px]"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 2px, transparent 2px)",
          backgroundSize: "36px 36px",
          borderBottom: "6px solid #000000",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-[660px] bg-[#E2E8F0] border-t-8 border-black" />
    </div>
  );
};
