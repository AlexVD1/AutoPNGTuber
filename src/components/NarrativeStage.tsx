import React from "react";
import { TipoComposicionVisual, TipoEscenario } from "../types";

export interface NarrativeStageProps {
  escenario?: TipoEscenario;
  composicionVisual?: TipoComposicionVisual;
  frame: number;
}

/** Escenarios de fondo oscuro: el Stickman recibe halo blanco automático para no perderse. */
export const ESCENARIOS_OSCUROS: ReadonlySet<TipoEscenario> = new Set<TipoEscenario>([
  "abismo_oceanico",
  "interior_cuerpo",
  "lunar",
  "habitacion_noche",
  "espacio_profundo",
  "tormenta_electrica",
  "bosque_frio_nocturno",
  "laboratorio_neuro",
  "nucleo_tierra",
  "red_subterranea",
  "vuelo_relativista",
]);

/** Pseudo-aleatorio determinista (mismo valor en cada render del mismo índice). */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Abismo oceánico (Fosa de las Marianas): gradiente abisal, rayos cenitales, 3 capas de parallax,
 * chimenea hidrotermal, nieve marina, burbujas y medusas bioluminiscentes. */
const AbismoOceanico: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const farDrift = Math.sin(f / 120) * 8;
  const midDrift = Math.sin(f / 80) * 14;
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="abismoAgua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E5A82" />
            <stop offset="30%" stopColor="#0A3358" />
            <stop offset="62%" stopColor="#061A36" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="abismoSuelo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2B4A6F" />
            <stop offset="100%" stopColor="#0B1528" />
          </linearGradient>
          <radialGradient id="abismoGlow">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Capa 0: columna de agua con gradiente abisal */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#abismoAgua)" />

        {/* Rayos de luz cenitales oscilantes */}
        {[140, 380, 640, 900].map((x, i) => (
          <polygon
            key={`ray${i}`}
            points={`${x - 30},0 ${x + 30},0 ${x + 170},1250 ${x - 110},1250`}
            fill="#BAE6FD"
            opacity={0.05 + 0.03 * Math.sin(f / 25 + i * 1.7)}
            transform={`rotate(${Math.sin(f / 70 + i) * 3} ${x} 0)`}
          />
        ))}

        {/* Capa 1 (lejana): agujas de roca en silueta */}
        <g transform={`translate(${farDrift} 0)`}>
          <path
            d="M -40 1260 L 40 760 L 110 900 L 180 640 L 260 980 L 330 860 L 420 1260 Z M 640 1260 L 720 900 L 800 700 L 870 940 L 950 780 L 1040 1000 L 1120 820 L 1120 1260 Z"
            fill="#0B2545"
            stroke="#000000"
            strokeWidth="3"
            opacity="0.85"
          />
        </g>

        {/* Medusas bioluminiscentes lejanas */}
        {[
          { x: 830, y: 420, s: 1, c: "#C4B5FD" },
          { x: 230, y: 560, s: 0.7, c: "#67E8F9" },
        ].map((m, i) => {
          const bob = Math.sin(f / 22 + i * 2) * 18;
          const pulse = 1 + Math.sin(f / 9 + i) * 0.08;
          return (
            <g key={`jelly${i}`} transform={`translate(${m.x + Math.sin(f / 50 + i) * 20} ${m.y + bob}) scale(${m.s * pulse} ${m.s / pulse})`}>
              <circle cx="0" cy="0" r="70" fill="url(#abismoGlow)" opacity="0.35" />
              <path d="M -38 0 Q -38 -40 0 -42 Q 38 -40 38 0 Q 20 8 0 4 Q -20 8 -38 0 Z" fill={m.c} stroke="#000000" strokeWidth="3" opacity="0.85" />
              {[-24, -8, 8, 24].map((tx, k) => (
                <path
                  key={k}
                  d={`M ${tx} 4 Q ${tx + Math.sin(f / 8 + k) * 10} 34 ${tx} 64`}
                  stroke={m.c}
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.75"
                />
              ))}
            </g>
          );
        })}

        {/* Capa 2 (media): formaciones rocosas laterales + chimenea hidrotermal */}
        <g transform={`translate(${midDrift} 0)`}>
          <path d="M -20 1270 L -20 980 Q 40 900 90 960 Q 140 1010 170 1270 Z" fill="#14325A" stroke="#000000" strokeWidth="5" />
          <path d="M 880 1270 L 905 1010 L 940 930 L 975 1010 L 1000 1270 Z" fill="#1E3A5F" stroke="#000000" strokeWidth="5" />
          <path d="M 920 960 L 960 960" stroke="#F97316" strokeWidth="6" strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(f / 6)} />
          {/* Humo negro de la fumarola */}
          {[0, 1, 2, 3, 4].map((k) => {
            const t = ((f * 0.9 + k * 40) % 200) / 200;
            return (
              <circle
                key={`smoke${k}`}
                cx={940 + Math.sin(t * 6 + k) * 18}
                cy={930 - t * 380}
                r={18 + t * 46}
                fill="#0F172A"
                stroke="#000000"
                strokeWidth="3"
                opacity={0.75 * (1 - t)}
              />
            );
          })}
          {/* Gusanos tubícolas gigantes ondulando */}
          {[60, 95, 130, 800, 835].map((x, k) => {
            const sway = Math.sin(f / 14 + k) * 10;
            return (
              <g key={`tube${k}`}>
                <path d={`M ${x} 1270 Q ${x + sway} 1190 ${x + sway * 1.6} ${1120 - (k % 2) * 30}`} stroke="#000000" strokeWidth="16" strokeLinecap="round" fill="none" />
                <path d={`M ${x} 1270 Q ${x + sway} 1190 ${x + sway * 1.6} ${1120 - (k % 2) * 30}`} stroke="#F8FAFC" strokeWidth="9" strokeLinecap="round" fill="none" />
                <circle cx={x + sway * 1.6} cy={1112 - (k % 2) * 30} r="12" fill="#EF4444" stroke="#000000" strokeWidth="4" />
              </g>
            );
          })}
        </g>

        {/* Capa 3 (suelo): lecho abisal con borde negro donde pisa el Stickman */}
        <path
          d="M 0 1262 Q 180 1240 360 1258 T 720 1256 T 1080 1250 L 1080 1920 L 0 1920 Z"
          fill="url(#abismoSuelo)"
          stroke="#000000"
          strokeWidth="6"
        />
        {[
          [150, 1380, 70, 22],
          [520, 1520, 110, 30],
          [880, 1420, 80, 24],
          [300, 1700, 130, 34],
          [790, 1760, 95, 26],
        ].map(([cx, cy, rx, ry], k) => (
          <ellipse key={`rock${k}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#1A2F4D" stroke="#000000" strokeWidth="4" />
        ))}
        {/* Puntos bioluminiscentes en el sedimento */}
        {[...Array(14)].map((_, k) => (
          <circle
            key={`bio${k}`}
            cx={40 + rnd(k) * 1000}
            cy={1300 + rnd(k + 50) * 560}
            r={3 + rnd(k + 9) * 3}
            fill="#67E8F9"
            opacity={0.35 + 0.35 * Math.sin(f / 10 + k)}
          />
        ))}

        {/* Partículas: nieve marina descendente */}
        {[...Array(30)].map((_, k) => (
          <circle
            key={`snow${k}`}
            cx={(rnd(k) * 1080 + Math.sin(f / 30 + k) * 12) % 1080}
            cy={(rnd(k + 100) * 1920 + f * (0.5 + rnd(k + 200) * 0.7)) % 1920}
            r={1.5 + rnd(k + 300) * 2.5}
            fill="#E0F2FE"
            opacity={0.35 + rnd(k + 400) * 0.35}
          />
        ))}
        {/* Partículas: burbujas ascendentes */}
        {[...Array(10)].map((_, k) => {
          const y = 1300 - ((f * (1.6 + rnd(k) * 1.2) + k * 140) % 1300);
          return (
            <circle
              key={`bub${k}`}
              cx={80 + rnd(k + 7) * 920 + Math.sin(f / 12 + k) * 10}
              cy={y}
              r={5 + rnd(k + 70) * 9}
              fill="none"
              stroke="#E0F2FE"
              strokeWidth="2.5"
              opacity="0.6"
            />
          );
        })}
      </svg>

      {/* Viñeta abisal perimetral (más intensa en primer plano) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, transparent ${isPrimerPlano ? 35 : 50}%, rgba(2, 6, 23, ${isPrimerPlano ? 0.75 : 0.55}) 100%)`,
        }}
      />
    </div>
  );
};

/** Mar Abierto: horizonte tropical, sol brillante, nubes neo-brutalistas, 3 capas de oleaje en parallax,
 * destellos de luz marina y salpicaduras de espuma. */
const MarAbierto: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const farDrift = Math.sin(f / 100) * 12;
  const midWave1 = Math.sin(f / 35) * 14;
  const midWave2 = Math.cos(f / 28) * 16;
  const sunPulse = 1 + Math.sin(f / 20) * 0.05;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0284C7]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="marCielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="65%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#F0F9FF" />
          </linearGradient>
          <linearGradient id="marAgua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="40%" stopColor="#0369A1" />
            <stop offset="100%" stopColor="#082F49" />
          </linearGradient>
        </defs>

        {/* Capa 0: Cielo soleado */}
        <rect x="0" y="0" width="1080" height="1180" fill="url(#marCielo)" />

        {/* Sol radiante neo-brutalista */}
        <g transform={`translate(860 320) scale(${sunPulse})`}>
          <circle cx="0" cy="0" r="110" fill="#FEF08A" opacity="0.35" />
          <circle cx="0" cy="0" r="80" fill="#FDE047" stroke="#000000" strokeWidth="6" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
            <line
              key={ang}
              x1={Math.cos((ang * Math.PI) / 180) * 95}
              y1={Math.sin((ang * Math.PI) / 180) * 95}
              x2={Math.cos((ang * Math.PI) / 180) * 125}
              y2={Math.sin((ang * Math.PI) / 180) * 125}
              stroke="#000000"
              strokeWidth="6"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Nubes esponjosas neo-brutalistas (Parallax lejano) */}
        <g transform={`translate(${farDrift} 0)`}>
          <g transform="translate(180 380)">
            <ellipse cx="60" cy="40" rx="80" ry="40" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />
            <ellipse cx="140" cy="30" rx="60" ry="35" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />
            <ellipse cx="100" cy="15" rx="50" ry="35" fill="#FFFFFF" />
            <rect x="0" y="40" width="180" height="35" fill="#FFFFFF" />
            <line x1="-15" y1="75" x2="200" y2="75" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
          </g>
          <g transform="translate(560 520) scale(0.75)">
            <ellipse cx="60" cy="40" rx="70" ry="35" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />
            <ellipse cx="130" cy="35" rx="55" ry="30" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />
            <rect x="0" y="40" width="170" height="30" fill="#FFFFFF" />
            <line x1="-10" y1="70" x2="185" y2="70" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>

        {/* Capa 1: Oleaje lejano en el horizonte */}
        <g transform={`translate(0 ${midWave1})`}>
          <path
            d="M -20 1180 Q 140 1150 300 1180 T 620 1180 T 940 1180 T 1120 1180 L 1120 1350 L -20 1350 Z"
            fill="#0369A1"
            stroke="#000000"
            strokeWidth="5"
          />
        </g>

        {/* Capa 2: Oleaje medio con crestas de espuma blanca */}
        <g transform={`translate(0 ${midWave2})`}>
          <path
            d="M -20 1230 Q 180 1190 380 1230 T 780 1230 T 1120 1230 L 1120 1450 L -20 1450 Z"
            fill="#0284C7"
            stroke="#000000"
            strokeWidth="6"
          />
          <path
            d="M 60 1222 Q 180 1192 320 1222 M 460 1222 Q 580 1195 720 1222 M 860 1222 Q 980 1195 1060 1222"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Capa 3: Superficie frontal / Plataforma */}
        <rect x="0" y="1260" width="1080" height="660" fill="url(#marAgua)" stroke="#000000" strokeWidth="8" />
        
        {/* Rayas dinámicas de corriente marina neo-brutalistas */}
        {[1320, 1420, 1540, 1680, 1800].map((y, idx) => {
          const shift = Math.sin(f / 25 + idx) * 35;
          return (
            <line
              key={idx}
              x1={80 + shift}
              y1={y}
              x2={1000 + shift}
              y2={y}
              stroke="#38BDF8"
              strokeWidth="6"
              strokeDasharray="40 30 90 25"
              strokeLinecap="round"
              opacity={0.45}
            />
          );
        })}

        {/* Salpicaduras de agua y burbujas que ascienden */}
        {[...Array(12)].map((_, i) => {
          const x = 90 + ((i * 85 + f * 1.8) % 920);
          const y = 1300 + ((i * 120 - f * 2.5 + 1000) % 550);
          const r = 5 + (i % 4) * 3;
          return (
            <g key={`drop${i}`} transform={`translate(${x} ${y})`}>
              <circle cx="0" cy="0" r={r} fill="#E0F2FE" stroke="#000000" strokeWidth="2.5" />
              <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.25} fill="#FFFFFF" />
            </g>
          );
        })}
      </svg>
      {isPrimerPlano && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(2, 44, 80, 0.45) 100%)" }}
        />
      )}
    </div>
  );
};

/** Espacio profundo: cosmos infinito, agujero negro con disco de acreción distorsionado,
 * cuadrícula espacio-temporal y polvo estelar. */
const EspacioProfundo: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const spin = f * 0.4;
  const pulse = 1 + Math.sin(f / 15) * 0.04;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="discoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#EA580C" stopOpacity="0.7" />
            <stop offset="75%" stopColor="#7C3AED" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sueloGrid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1920" fill="#030712" />

        {/* Estrellas distantes titilantes */}
        {[...Array(40)].map((_, i) => {
          const x = (i * 97 + rnd(i) * 200) % 1080;
          const y = (i * 123 + rnd(i + 4) * 300) % 1200;
          const blink = 0.35 + 0.65 * Math.sin(f / 8 + i * 1.5);
          const r = 2 + (i % 3) * 1.5;
          return <circle key={`st${i}`} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={blink} />;
        })}

        {/* Agujero Negro con Disco de Acreción y Relatividad (Centro superior 540, 620) */}
        <g transform="translate(540 620)">
          {/* Resplandor exterior de energía */}
          <ellipse cx="0" cy="0" rx={320 * pulse} ry={130 * pulse} fill="url(#discoGlow)" transform={`rotate(${spin * 0.1})`} />
          {/* Anillo de acreción inclinado neo-brutalista */}
          <ellipse cx="0" cy="0" rx="270" ry="85" fill="none" stroke="#F97316" strokeWidth="18" opacity="0.9" strokeDasharray="30 10 50 15" />
          <ellipse cx="0" cy="0" rx="240" ry="70" fill="none" stroke="#FDE047" strokeWidth="10" />
          <ellipse cx="0" cy="0" rx="210" ry="58" fill="none" stroke="#38BDF8" strokeWidth="6" opacity="0.75" />
          {/* Lente gravitacional superior */}
          <path d="M -180 -10 Q 0 -130 180 -10" stroke="#F97316" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85" />
          <path d="M -140 -12 Q 0 -100 140 -12" stroke="#FDE047" strokeWidth="7" fill="none" strokeLinecap="round" />
          {/* Singularidad central */}
          <circle cx="0" cy="0" r="105" fill="#000000" stroke="#000000" strokeWidth="8" />
          <circle cx="0" cy="0" r="102" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />
        </g>

        {/* Suelo: Cuadrícula espacio-temporal neo-brutalista (Gravitational Grid) */}
        <rect x="0" y="1260" width="1080" height="660" fill="url(#sueloGrid)" stroke="#000000" strokeWidth="8" />
        
        {/* Líneas horizontales de perspectiva con deformación gravitatoria */}
        {[1280, 1340, 1420, 1530, 1680, 1850].map((y, idx) => (
          <line
            key={`gridY${idx}`}
            x1="0"
            y1={y}
            x2="1080"
            y2={y}
            stroke="#6366F1"
            strokeWidth={4 + idx * 0.8}
            opacity={0.4 + idx * 0.1}
          />
        ))}

        {/* Líneas radiales convergiendo hacia el centro del vacío */}
        {[60, 200, 360, 540, 720, 880, 1020].map((x, idx) => (
          <line
            key={`gridX${idx}`}
            x1="540"
            y1="1260"
            x2={x}
            y2="1920"
            stroke="#818CF8"
            strokeWidth="4"
            opacity="0.4"
          />
        ))}

        {/* Polvo cósmico y partículas flotantes */}
        {[...Array(14)].map((_, i) => {
          const px = 80 + ((i * 135 + f * 1.2) % 920);
          const py = 120 + ((i * 140 + f * 0.8) % 1650);
          const pr = 3 + (i % 3) * 2;
          return <circle key={`dust${i}`} cx={px} cy={py} r={pr} fill={i % 2 === 0 ? "#FDE047" : "#38BDF8"} opacity={0.6} />;
        })}
      </svg>
      {isPrimerPlano && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(3, 7, 18, 0.75) 100%)" }}
        />
      )}
    </div>
  );
};

/** Cielo de día: azul radiante, sol sonriente con rayos, 3 capas de colinas y nubes,
 * pradera verde con flores y polen flotante. */
const CieloDia: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const cloudDrift1 = ((f * 0.8) % 1200) - 150;
  const cloudDrift2 = ((f * 0.4 + 400) % 1200) - 150;
  const sunRot = f * 0.6;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#60A5FA]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cieloDiaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="55%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>
          <linearGradient id="pastoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1260" fill="url(#cieloDiaGrad)" />

        {/* Sol con rayos giratorios */}
        <g transform="translate(220 280)">
          <g transform={`rotate(${sunRot})`}>
            {[...Array(12)].map((_, idx) => {
              const a = (idx * 30 * Math.PI) / 180;
              return (
                <line
                  key={idx}
                  x1={Math.cos(a) * 85}
                  y1={Math.sin(a) * 85}
                  x2={Math.cos(a) * 125}
                  y2={Math.sin(a) * 125}
                  stroke="#F59E0B"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
          <circle cx="0" cy="0" r="75" fill="#FDE047" stroke="#000000" strokeWidth="6" />
          <circle cx="-18" cy="-12" r="8" fill="#000000" />
          <circle cx="18" cy="-12" r="8" fill="#000000" />
          <path d="M -22 18 Q 0 38 22 18" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>

        {/* Nubes Neo-Brutalistas */}
        <g transform={`translate(${cloudDrift1} 360)`}>
          <rect x="0" y="40" width="220" height="40" rx="20" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
          <circle cx="70" cy="30" r="45" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
          <circle cx="140" cy="35" r="35" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
          <rect x="25" y="30" width="160" height="35" fill="#FFFFFF" />
        </g>
        <g transform={`translate(${cloudDrift2} 520) scale(0.8)`}>
          <rect x="0" y="40" width="200" height="40" rx="20" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
          <circle cx="70" cy="30" r="40" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
          <circle cx="130" cy="35" r="32" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
          <rect x="25" y="30" width="140" height="35" fill="#FFFFFF" />
        </g>

        {/* Colinas en el horizonte lejano (Parallax) */}
        <path
          d="M -50 1260 Q 220 1020 520 1260 Q 820 1040 1130 1260 Z"
          fill="#10B981"
          stroke="#000000"
          strokeWidth="6"
        />
        <path
          d="M 280 1260 Q 640 1100 1020 1260 Z"
          fill="#059669"
          stroke="#000000"
          strokeWidth="6"
        />

        {/* Suelo: Pradera verde con contorno grueso */}
        <rect x="0" y="1260" width="1080" height="660" fill="url(#pastoGrad)" stroke="#000000" strokeWidth="8" />

        {/* Detalles de hierba */}
        {[120, 280, 480, 680, 890].map((x, idx) => (
          <g key={`tuft${idx}`} transform={`translate(${x} 1260)`}>
            <line x1="0" y1="0" x2="-14" y2="-28" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
            <line x1="0" y1="0" x2="0" y2="-36" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
            <line x1="0" y1="0" x2="14" y2="-28" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
          </g>
        ))}

        {/* Polen / semillas de diente de león flotando */}
        {[...Array(10)].map((_, i) => {
          const px = (i * 120 + f * 1.5) % 1080;
          const py = 500 + ((i * 110 + f * 0.7) % 800);
          return (
            <g key={`pol${i}`} transform={`translate(${px} ${py})`}>
              <circle cx="0" cy="0" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
              <line x1="0" y1="0" x2="-8" y2="-10" stroke="#000000" strokeWidth="2" />
              <line x1="0" y1="0" x2="8" y2="-10" stroke="#000000" strokeWidth="2" />
            </g>
          );
        })}
      </svg>
      {isPrimerPlano && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(30, 58, 138, 0.35) 100%)" }}
        />
      )}
    </div>
  );
};

/** Atardecer Dorado: cielo ardiente violeta-naranja, sol gigante en el horizonte,
 * siluetas de montañas y postes, suelo cálido neo-brutalista. */
const AtardecerDorado: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const sunPulse = 1 + Math.sin(f / 24) * 0.03;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#4C1D95]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="atardecerCielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4C1D95" />
            <stop offset="35%" stopColor="#BE185D" />
            <stop offset="68%" stopColor="#EA580C" />
            <stop offset="92%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>
          <linearGradient id="atardecerSuelo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E1065" />
            <stop offset="100%" stopColor="#0F051D" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1260" fill="url(#atardecerCielo)" />

        {/* Sol poniente gigante */}
        <g transform={`translate(540 1080) scale(${sunPulse})`}>
          <circle cx="0" cy="0" r="220" fill="#FDE047" opacity="0.3" />
          <circle cx="0" cy="0" r="160" fill="#FEF08A" stroke="#000000" strokeWidth="8" />
          <line x1="-200" y1="30" x2="200" y2="30" stroke="#EA580C" strokeWidth="8" strokeDasharray="25 15" />
          <line x1="-170" y1="70" x2="170" y2="70" stroke="#BE185D" strokeWidth="10" strokeDasharray="30 20" />
        </g>

        {/* Silueta de montañas lejanas */}
        <polygon
          points="-40,1260 120,980 280,1120 460,920 620,1080 820,880 1000,1060 1120,950 1120,1260"
          fill="#3B0764"
          stroke="#000000"
          strokeWidth="6"
        />

        {/* Siluetas de árboles y postes en el horizonte */}
        <g transform="translate(180 1260)">
          <line x1="0" y1="0" x2="0" y2="-90" stroke="#000000" strokeWidth="8" />
          <line x1="-30" y1="-80" x2="30" y2="-80" stroke="#000000" strokeWidth="6" />
          <line x1="-25" y1="-65" x2="25" y2="-65" stroke="#000000" strokeWidth="5" />
        </g>
        <g transform="translate(860 1260)">
          <line x1="0" y1="0" x2="0" y2="-75" stroke="#000000" strokeWidth="7" />
          <circle cx="0" cy="-105" r="38" fill="#180828" stroke="#000000" strokeWidth="6" />
        </g>

        {/* Suelo: Terreno en penumbra con borde dorado */}
        <rect x="0" y="1260" width="1080" height="660" fill="url(#atardecerSuelo)" stroke="#000000" strokeWidth="8" />
        <line x1="0" y1="1264" x2="1080" y2="1264" stroke="#F59E0B" strokeWidth="6" />

        {/* Motes de polvo dorados en el aire cálido */}
        {[...Array(12)].map((_, i) => {
          const mx = 60 + ((i * 95 + f * 1.1) % 960);
          const my = 400 + ((i * 110 - f * 0.9 + 1000) % 850);
          return <circle key={`gold${i}`} cx={mx} cy={my} r={4 + (i % 3) * 2} fill="#FEF08A" opacity={0.65} />;
        })}
      </svg>
      {isPrimerPlano && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(46, 16, 101, 0.55) 100%)" }}
        />
      )}
    </div>
  );
};

/** Tormenta Eléctrica: cielo tormentoso sombrío, nubes densas, rayos procedurales con destello
 * en pantalla, suelo mojado con charcos reflectantes y lluvia diagonal. */
const TormentaElectrica: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const cycle = f % 38;
  const isLightning = cycle >= 0 && cycle <= 3;
  const flashAlpha = isLightning ? (cycle === 0 ? 0.75 : 0.4) : 0;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="tormentaCielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#090D16" />
            <stop offset="60%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1260" fill="url(#tormentaCielo)" />

        {/* Nubes densas oscuras */}
        <g transform="translate(140 260)">
          <ellipse cx="160" cy="80" rx="200" ry="90" fill="#1E293B" stroke="#000000" strokeWidth="8" />
          <ellipse cx="360" cy="90" rx="180" ry="85" fill="#334155" stroke="#000000" strokeWidth="8" />
          <ellipse cx="600" cy="70" rx="220" ry="95" fill="#1E293B" stroke="#000000" strokeWidth="8" />
        </g>

        {/* Relámpago procedural ramificado */}
        {isLightning && (
          <g>
            <polyline
              points="480,320 420,490 530,680 470,890 580,1110 520,1260"
              fill="none"
              stroke="#67E8F9"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            <polyline
              points="530,680 620,780 670,920"
              fill="none"
              stroke="#FDE047"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="480,320 420,490 530,680 470,890 580,1110 520,1260"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="480,320 420,490 530,680 470,890 580,1110 520,1260"
              fill="none"
              stroke="#FDE047"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Lluvia torrencial diagonal */}
        {[...Array(24)].map((_, idx) => {
          const rx = ((idx * 48 + f * 12) % 1180) - 50;
          const ry = (idx * 75 + f * 22) % 1260;
          return (
            <line
              key={`rain${idx}`}
              x1={rx}
              y1={ry}
              x2={rx - 18}
              y2={ry + 45}
              stroke="#93C5FD"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.6"
            />
          );
        })}

        {/* Suelo: Asfalto mojado oscuro con charcos reflectantes */}
        <rect x="0" y="1260" width="1080" height="660" fill="#0F172A" stroke="#000000" strokeWidth="8" />

        {/* Charcos de agua con reflejo eléctrico */}
        <ellipse cx="320" cy="1440" rx="140" ry="32" fill="#1E293B" stroke="#000000" strokeWidth="5" />
        <ellipse cx="320" cy="1440" rx="110" ry="22" fill={isLightning ? "#67E8F9" : "#38BDF8"} opacity={isLightning ? 0.8 : 0.3} />
        
        <ellipse cx="780" cy="1560" rx="180" ry="40" fill="#1E293B" stroke="#000000" strokeWidth="5" />
        <ellipse cx="780" cy="1560" rx="150" ry="28" fill={isLightning ? "#FDE047" : "#38BDF8"} opacity={isLightning ? 0.7 : 0.25} />
      </svg>

      {flashAlpha > 0 && (
        <div className="absolute inset-0 pointer-events-none bg-cyan-200" style={{ opacity: flashAlpha }} />
      )}

      {isPrimerPlano && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(9, 13, 22, 0.7) 100%)" }}
        />
      )}
    </div>
  );
};

/** Bosque Frío Nocturno: luna helada, niebla espectral deslizante, 3 capas de pinos
 * en silueta oscura, suelo escarchado con nieve y copos cayendo. */
const BosqueFrioNocturno: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const mist1 = Math.sin(f / 35) * 50;
  const mist2 = Math.cos(f / 28) * 60;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bosqueCielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="55%" stopColor="#0B1528" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1260" fill="url(#bosqueCielo)" />

        {/* Luna helada con halo frío */}
        <circle cx="780" cy="340" r="130" fill="#E2E8F0" opacity="0.15" />
        <circle cx="780" cy="340" r="90" fill="#F1F5F9" stroke="#000000" strokeWidth="6" />
        <circle cx="750" cy="320" r="18" fill="#CBD5E1" opacity="0.6" />
        <circle cx="810" cy="360" r="22" fill="#CBD5E1" opacity="0.5" />

        {/* Capa 1: Pinos lejanos */}
        {[80, 240, 420, 600, 780, 960].map((x, i) => (
          <polygon
            key={`pineFar${i}`}
            points={`${x},780 ${x - 55},1060 ${x - 35},1060 ${x - 70},1260 ${x + 70},1260 ${x + 35},1060 ${x + 55},1060`}
            fill="#0F2236"
            stroke="#000000"
            strokeWidth="4"
          />
        ))}

        {/* Capa 2: Pinos medios */}
        {[160, 360, 560, 740, 920, 1060].map((x, i) => (
          <polygon
            key={`pineMid${i}`}
            points={`${x},660 ${x - 75},960 ${x - 45},960 ${x - 90},1260 ${x + 90},1260 ${x + 45},960 ${x + 75},960`}
            fill="#081422"
            stroke="#000000"
            strokeWidth="6"
          />
        ))}

        {/* Niebla fría flotante */}
        <g transform={`translate(${mist1} 0)`}>
          <ellipse cx="360" cy="1200" rx="420" ry="60" fill="#94A3B8" opacity="0.25" />
        </g>
        <g transform={`translate(${mist2} 0)`}>
          <ellipse cx="780" cy="1230" rx="380" ry="50" fill="#BAE6FD" opacity="0.2" />
        </g>

        {/* Suelo: Capa de nieve y escarcha con trazo negro grueso */}
        <rect x="0" y="1260" width="1080" height="660" fill="#CBD5E1" stroke="#000000" strokeWidth="8" />
        <ellipse cx="280" cy="1320" rx="160" ry="30" fill="#E2E8F0" stroke="#000000" strokeWidth="4" />
        <ellipse cx="760" cy="1360" rx="210" ry="35" fill="#E2E8F0" stroke="#000000" strokeWidth="4" />

        {/* Copos de nieve / escarcha cayendo */}
        {[...Array(16)].map((_, idx) => {
          const sx = (idx * 70 + f * 1.2) % 1080;
          const sy = (idx * 85 + f * 2.8) % 1650;
          return <circle key={`snow${idx}`} cx={sx} cy={sy} r={3 + (idx % 3) * 2} fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />;
        })}
      </svg>
      {isPrimerPlano && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(2, 6, 23, 0.7) 100%)" }}
        />
      )}
    </div>
  );
};

/** Sala de Estar: interior hogareño cálido neo-brutalista, cuadro abstracto moderno,
 * lámpara de arco con foco encendido, planta monstera y piso de duela con tapete geométrico. */
const SalaEstar: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const lampGlow = 0.85 + Math.sin(f / 12) * 0.15;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#FEF3C7]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        {/* Pared con patrón de papel tapiz discreto */}
        <rect x="0" y="0" width="1080" height="1260" fill="#FEF3C7" />
        {[...Array(9)].map((_, i) => (
          <line
            key={`strip${i}`}
            x1={120 * i}
            y1="0"
            x2={120 * i}
            y2="1260"
            stroke="#FDE68A"
            strokeWidth="3"
            strokeDasharray="15 15"
          />
        ))}

        {/* Cuadro de Arte Moderno Neo-Brutalista (Izquierda) */}
        <g transform="translate(140 340)">
          <rect x="-8" y="-8" width="236" height="276" rx="6" fill="#000000" />
          <rect x="0" y="0" width="220" height="260" rx="4" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
          <circle cx="110" cy="100" r="55" fill="#EF4444" stroke="#000000" strokeWidth="5" />
          <polygon points="50,220 170,220 110,130" fill="#3B82F6" stroke="#000000" strokeWidth="5" />
          <rect x="130" y="60" width="60" height="60" fill="#FBBF24" stroke="#000000" strokeWidth="5" />
        </g>

        {/* Lámpara de arco alta retro (Derecha) */}
        <g transform="translate(860 260)">
          <path d="M 120 1000 Q 120 200 -80 200" fill="none" stroke="#000000" strokeWidth="10" strokeLinecap="round" />
          <path d="M -115 200 L -45 200 L -30 250 L -130 250 Z" fill="#F59E0B" stroke="#000000" strokeWidth="6" />
          <circle cx="-80" cy="255" r="16" fill="#FDE047" stroke="#000000" strokeWidth="4" />
          <polygon points="-160,520 -80,260 0,520" fill="#FEF08A" opacity={0.35 * lampGlow} />
          <ellipse cx="120" cy="1000" rx="65" ry="18" fill="#1E293B" stroke="#000000" strokeWidth="6" />
        </g>

        {/* Planta Monstera en maceta neo-brutalista (Esquina izquierda) */}
        <g transform="translate(120 1080)">
          <polygon points="20,180 80,180 90,80 10,80" fill="#EA580C" stroke="#000000" strokeWidth="6" />
          <ellipse cx="30" cy="40" rx="45" ry="25" fill="#16A34A" stroke="#000000" strokeWidth="5" transform="rotate(-30 30 40)" />
          <ellipse cx="75" cy="30" rx="50" ry="28" fill="#22C55E" stroke="#000000" strokeWidth="5" transform="rotate(25 75 30)" />
          <ellipse cx="50" cy="-15" rx="42" ry="25" fill="#15803D" stroke="#000000" strokeWidth="5" />
        </g>

        {/* Suelo: Madera de duela / parquet cálido */}
        <rect x="0" y="1260" width="1080" height="660" fill="#D97706" stroke="#000000" strokeWidth="8" />
        <line x1="0" y1="1266" x2="1080" y2="1266" stroke="#000000" strokeWidth="4" />
        {[1360, 1470, 1600, 1750].map((y, idx) => (
          <line key={`wood${idx}`} x1="0" y1={y} x2="1080" y2={y} stroke="#78350F" strokeWidth="4" />
        ))}

        {/* Tapete geométrico central */}
        <ellipse cx="540" cy="1540" rx="380" ry="140" fill="#F3F4F6" stroke="#000000" strokeWidth="7" />
        <ellipse cx="540" cy="1540" rx="310" ry="105" fill="#38BDF8" stroke="#000000" strokeWidth="5" />
        <ellipse cx="540" cy="1540" rx="220" ry="70" fill="#FBBF24" stroke="#000000" strokeWidth="5" />
      </svg>
      {isPrimerPlano && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(120, 53, 15, 0.35) 100%)" }}
        />
      )}
    </div>
  );
};

/** Laboratorio Neuro: ambiente cibernético oscuro, cerebro holográfico pulsante 3D,
 * osciloscopios con ondas EEG vivas, terminales de datos y piso de fibra de carbono. */
const LaboratorioNeuro: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const pulse = 1 + Math.sin(f / 10) * 0.06;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A0F1D]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="neuroHoloGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0A0F1D" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1260" fill="#0A0F1D" />

        {/* Proyector Holográfico central con Cerebro 3D */}
        <g transform="translate(540 540)">
          <polygon points="-240,400 0,-180 240,400" fill="url(#neuroHoloGlow)" opacity="0.35" />
          
          <g transform={`scale(${pulse})`}>
            <path
              d="M -90 0 C -120 -80, -40 -140, 0 -130 C 40 -140, 120 -80, 90 0 C 110 50, 70 110, 0 100 C -70 110, -110 50, -90 0 Z"
              fill="#0891B2"
              stroke="#22D3EE"
              strokeWidth="6"
              opacity="0.8"
            />
            <path d="M -50 -70 Q -10 -90 10 -60 Q 30 -30 -10 -10 Q -40 20 20 40" stroke="#A5F3FC" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 40 -80 Q 70 -40 50 10 Q 30 60 0 80" stroke="#67E8F9" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M -70 -20 Q -40 -30 -30 20 Q -10 60 -40 70" stroke="#67E8F9" strokeWidth="5" fill="none" strokeLinecap="round" />
            {[
              { x: -40, y: -50 },
              { x: 20, y: -70 },
              { x: 50, y: -20 },
              { x: -20, y: 30 },
              { x: 30, y: 50 },
            ].map((p, idx) => (
              <circle
                key={`syn${idx}`}
                cx={p.x}
                cy={p.y}
                r={6 + Math.sin(f / 5 + idx * 2) * 3}
                fill="#FDE047"
                stroke="#000000"
                strokeWidth="2"
              />
            ))}
          </g>

          <ellipse cx="0" cy="380" rx="140" ry="32" fill="#1E293B" stroke="#000000" strokeWidth="6" />
          <ellipse cx="0" cy="375" rx="110" ry="22" fill="#06B6D4" stroke="#000000" strokeWidth="4" />
        </g>

        {/* Pantallas laterales de EEG */}
        <g transform="translate(80 320)">
          <rect x="0" y="0" width="220" height="150" rx="12" fill="#030712" stroke="#000000" strokeWidth="6" />
          <text x="20" y="32" fill="#22C55E" fontSize="14" fontFamily="monospace" fontWeight="bold">EEG_CH1: ALPHA</text>
          <path
            d={`M 15 90 ${[...Array(12)]
              .map((_, i) => `L ${25 + i * 16} ${90 + Math.sin(f / 4 + i * 0.9) * 26}`)
              .join(" ")}`}
            stroke="#22D3EE"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <g transform="translate(780 320)">
          <rect x="0" y="0" width="220" height="150" rx="12" fill="#030712" stroke="#000000" strokeWidth="6" />
          <text x="20" y="32" fill="#38BDF8" fontSize="14" fontFamily="monospace" fontWeight="bold">EEG_CH2: GAMMA</text>
          <path
            d={`M 15 90 ${[...Array(12)]
              .map((_, i) => `L ${25 + i * 16} ${90 + Math.sin(f / 2 + i * 1.8) * 32}`)
              .join(" ")}`}
            stroke="#38BDF8"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Suelo: Laboratorio técnico oscuro con líneas de datos iluminadas */}
        <rect x="0" y="1260" width="1080" height="660" fill="#0F172A" stroke="#000000" strokeWidth="8" />
        {[180, 360, 540, 720, 900].map((x, idx) => (
          <line
            key={`circuit${idx}`}
            x1={x}
            y1="1260"
            x2={x}
            y2="1920"
            stroke="#06B6D4"
            strokeWidth="4"
            strokeDasharray="30 15"
            opacity={0.4}
          />
        ))}

        {/* Datos / chispas de sinapsis ascendentes */}
        {[...Array(12)].map((_, i) => {
          const px = 90 + ((i * 125 + f * 1.8) % 900);
          const py = 200 + ((i * 110 - f * 2.2 + 1500) % 1100);
          return <rect key={`spark${i}`} x={px} y={py} width="6" height="6" fill="#38BDF8" stroke="#000000" strokeWidth="1.5" />;
        })}
      </svg>
      {isPrimerPlano && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(10, 15, 29, 0.75) 100%)" }}
        />
      )}
    </div>
  );
};

/** Interior del cuerpo humano: tejido rosado, vaso sanguíneo con glóbulos rojos fluyendo,
 * células lejanas flotando y superficie de tejido celular. */
const InteriorCuerpo: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const heartbeat = 1 + Math.max(0, Math.sin(f / 5)) * 0.03;
  const vx0 = -120;
  const vy0 = 300;
  const vx1 = 1200;
  const vy1 = 720;
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#9F1239]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cuerpoFondo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="45%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>
          <linearGradient id="cuerpoSuelo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>

        {/* Capa 0: atmósfera de tejido */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#cuerpoFondo)" />

        {/* Capa 1 (lejana): células gigantes desenfocadas */}
        {[
          [170, 900, 120],
          [900, 1050, 150],
          [560, 180, 90],
          [980, 260, 70],
        ].map(([cx, cy, r], k) => (
          <g key={`cellbg${k}`} transform={`translate(${Math.sin(f / 60 + k) * 14} ${Math.cos(f / 70 + k) * 10})`} opacity="0.45">
            <circle cx={cx} cy={cy} r={r} fill="#FECDD3" stroke="#9F1239" strokeWidth="4" />
            <circle cx={cx + r * 0.2} cy={cy - r * 0.1} r={r * 0.35} fill="#BE185D" />
          </g>
        ))}

        {/* Capa 2 (media): vaso sanguíneo latiendo con glóbulos rojos en flujo */}
        <g transform={`translate(540 510) scale(1 ${heartbeat}) translate(-540 -510)`}>
          <line x1={vx0} y1={vy0} x2={vx1} y2={vy1} stroke="#000000" strokeWidth="190" />
          <line x1={vx0} y1={vy0} x2={vx1} y2={vy1} stroke="#E11D48" strokeWidth="178" />
          <line x1={vx0} y1={vy0 - 40} x2={vx1} y2={vy1 - 40} stroke="#FB7185" strokeWidth="18" strokeLinecap="round" opacity="0.6" />
          {[...Array(9)].map((_, k) => {
            const t = (f * 0.0035 + k / 9) % 1;
            const off = (rnd(k) - 0.5) * 100;
            const cx = vx0 + (vx1 - vx0) * t;
            const cy = vy0 + (vy1 - vy0) * t + off;
            const rot = f * 2 + k * 40;
            return (
              <g key={`rbc${k}`} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
                <ellipse cx="0" cy="0" rx="36" ry="24" fill="#DC2626" stroke="#000000" strokeWidth="4" />
                <ellipse cx="0" cy="0" rx="16" ry="9" fill="#991B1B" />
              </g>
            );
          })}
        </g>
        {/* Capilar secundario */}
        <path d="M -20 1080 Q 300 980 560 1060 T 1100 1000" stroke="#000000" strokeWidth="46" fill="none" />
        <path d="M -20 1080 Q 300 980 560 1060 T 1100 1000" stroke="#FB7185" strokeWidth="36" fill="none" />

        {/* Capa 3 (suelo): superficie de tejido celular con borde negro */}
        <path
          d="M 0 1258 Q 135 1236 270 1258 T 540 1258 T 810 1258 T 1080 1252 L 1080 1920 L 0 1920 Z"
          fill="url(#cuerpoSuelo)"
          stroke="#000000"
          strokeWidth="6"
        />
        {[...Array(4)].map((_, row) =>
          [...Array(7)].map((__, col) => {
            const w = 150;
            const x = col * w + (row % 2 ? -75 : 0) + 10;
            const y = 1310 + row * 150;
            return (
              <g key={`tis${row}-${col}`}>
                <rect x={x} y={y} width={w - 20} height="120" rx="40" fill="#FBCFE8" stroke="#9D174D" strokeWidth="3" opacity="0.9" />
                <circle cx={x + 65} cy={y + 60} r="16" fill="#DB2777" opacity="0.7" />
              </g>
            );
          })
        )}

        {/* Partículas: plaquetas y anticuerpos flotando */}
        {[...Array(12)].map((_, k) => (
          <circle
            key={`plq${k}`}
            cx={(rnd(k) * 1080 + f * (0.4 + rnd(k + 5) * 0.6)) % 1080}
            cy={200 + rnd(k + 20) * 1000 + Math.sin(f / 18 + k) * 20}
            r={4 + rnd(k + 50) * 4}
            fill="#FDE047"
            stroke="#000000"
            strokeWidth="2"
            opacity="0.8"
          />
        ))}
      </svg>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, transparent ${isPrimerPlano ? 38 : 55}%, rgba(76, 5, 25, ${isPrimerPlano ? 0.6 : 0.4}) 100%)`,
        }}
      />
    </div>
  );
};

const AzoteaRascacielos: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({
  frame,
  isPrimerPlano,
}) => {
  const cloud1X = ((frame * 1.8) % 1300) - 200;
  const cloud2X = ((frame * 1.1 + 450) % 1400) - 250;
  const beaconBlink = Math.sin(frame * 0.15) > 0 ? 1 : 0.2;
  const ventSpin = (frame * 12) % 360;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Cielo de gran altitud y vértigo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0284C7 0%, #38BDF8 30%, #BAE6FD 65%, #F0F9FF 100%)",
        }}
      />

      {/* 2. Sol brillante con halo */}
      <div className="absolute top-[160px] right-[140px] w-[140px] h-[140px]">
        <div className="absolute inset-0 rounded-full bg-[#FEF08A] opacity-30 animate-pulse" />
        <div
          className="absolute inset-[18px] rounded-full bg-[#FACC15] border-4 border-black"
          style={{ boxShadow: "6px 6px 0px #000000" }}
        />
      </div>

      {/* 3. Nubes neo-brutalistas flotando */}
      <div
        className="absolute top-[320px] w-[260px] h-[90px] bg-white rounded-3xl border-4 border-black"
        style={{
          left: `${cloud1X}px`,
          boxShadow: "8px 8px 0px #000000",
        }}
      >
        <div className="absolute -top-[35px] left-[50px] w-[90px] h-[90px] bg-white rounded-full border-t-4 border-l-4 border-black" />
        <div className="absolute -top-[20px] left-[120px] w-[70px] h-[70px] bg-white rounded-full border-t-4 border-r-4 border-black" />
      </div>

      <div
        className="absolute top-[480px] w-[220px] h-[75px] bg-white rounded-3xl border-4 border-black"
        style={{
          left: `${cloud2X}px`,
          boxShadow: "6px 6px 0px #000000",
        }}
      >
        <div className="absolute -top-[25px] left-[40px] w-[70px] h-[70px] bg-white rounded-full border-t-4 border-l-4 border-black" />
      </div>

      {/* 4. Rascacielos lejanos (Fondo silueta) */}
      <svg
        viewBox="0 0 1080 1920"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <rect x="80" y="600" width="130" height="800" fill="#0369A1" stroke="#000000" strokeWidth="4" />
        <line x1="145" y1="520" x2="145" y2="600" stroke="#000000" strokeWidth="5" />
        <circle cx="145" cy="516" r="6" fill="#EF4444" opacity={beaconBlink} />

        <rect x="250" y="700" width="180" height="700" fill="#0284C7" stroke="#000000" strokeWidth="4" />
        {[740, 780, 820, 860, 900, 940, 980].map((y, i) => (
          <g key={`win_${i}`}>
            <rect x="280" y={y} width="24" height="20" rx="3" fill="#FEF08A" stroke="#000000" strokeWidth="2" />
            <rect x="330" y={y} width="24" height="20" rx="3" fill="#FEF08A" stroke="#000000" strokeWidth="2" />
            <rect x="380" y={y} width="24" height="20" rx="3" fill="#FEF08A" stroke="#000000" strokeWidth="2" />
          </g>
        ))}

        <rect x="720" y="620" width="220" height="780" fill="#0369A1" stroke="#000000" strokeWidth="4" />
        <line x1="830" y1="530" x2="830" y2="620" stroke="#000000" strokeWidth="5" />
        <circle cx="830" cy="525" r="6" fill="#EF4444" opacity={beaconBlink} />
        {[660, 710, 760, 810, 860, 910].map((y, i) => (
          <g key={`win2_${i}`}>
            <rect x="750" y={y} width="26" height="22" rx="3" fill="#FEF08A" stroke="#000000" strokeWidth="2" />
            <rect x="815" y={y} width="26" height="22" rx="3" fill="#FEF08A" stroke="#000000" strokeWidth="2" />
            <rect x="880" y={y} width="26" height="22" rx="3" fill="#FEF08A" stroke="#000000" strokeWidth="2" />
          </g>
        ))}
      </svg>

      {/* 5. Suelo firme de la Azotea */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[580px] bg-[#E2E8F0]"
        style={{
          borderTop: "6px solid #000000",
          boxShadow: "0px -10px 0px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="w-full h-[28px] border-b-4 border-black"
          style={{
            background:
              "repeating-linear-gradient(45deg, #FACC15, #FACC15 24px, #000000 24px, #000000 48px)",
          }}
        />

        <div
          className="absolute inset-0 top-[28px] pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#64748B 2px, transparent 2px), linear-gradient(90deg, #64748B 2px, transparent 2px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Baranda de seguridad */}
        <div className="absolute -top-[130px] left-[60px] w-[260px] h-[130px] border-t-6 border-l-6 border-black bg-transparent">
          <div className="absolute top-0 left-0 w-full h-[12px] bg-[#0F172A] border-b-3 border-black" />
          <div className="absolute top-[55px] left-0 w-full h-[8px] bg-[#334155] border-b-2 border-black" />
          <div className="absolute top-0 left-[60px] w-[14px] h-[130px] bg-[#0F172A]" />
          <div className="absolute top-0 left-[180px] w-[14px] h-[130px] bg-[#0F172A]" />
        </div>

        {/* Unidad de Ventilación HVAC */}
        <div
          className="absolute -top-[160px] right-[80px] w-[220px] h-[160px] bg-[#CBD5E1] rounded-xl overflow-hidden"
          style={{
            border: "6px solid #000000",
            boxShadow: "8px 8px 0px #000000",
          }}
        >
          <div className="absolute top-[16px] left-[16px] w-[90px] h-[90px] rounded-full bg-[#0F172A] border-4 border-black flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 90 90"
              className="w-full h-full"
              style={{ transform: `rotate(${ventSpin}deg)` }}
            >
              <line x1="45" y1="8" x2="45" y2="82" stroke="#64748B" strokeWidth="10" strokeLinecap="round" />
              <line x1="8" y1="45" x2="82" y2="45" stroke="#64748B" strokeWidth="10" strokeLinecap="round" />
              <circle cx="45" cy="45" r="10" fill="#FACC15" stroke="#000000" strokeWidth="3" />
            </svg>
          </div>
          <div className="absolute top-[20px] right-[18px] w-[70px] h-[26px] bg-[#EF4444] border-2 border-black rounded text-[9px] font-black text-white flex items-center justify-center">
            HVAC-01
          </div>
          <div className="absolute bottom-[20px] left-[16px] right-[16px] h-[18px] bg-[#94A3B8] border-2 border-black rounded" />
        </div>
      </div>

      {/* 6. Viñeta ambiental */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 40%, transparent ${isPrimerPlano ? 40 : 60}%, rgba(15, 23, 42, ${isPrimerPlano ? 0.45 : 0.25}) 100%)`,
        }}
      />
    </div>
  );
};

const TumbaEgipcia: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const torchWobble1 = Math.sin(frame * 0.25) * 4;
  const torchWobble2 = Math.cos(frame * 0.2) * 4;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#78350F]">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #451A03 0%, #78350F 35%, #B45309 70%, #D97706 100%)",
        }}
      />
      <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {[300, 500, 700, 900, 1100].map((y, i) => (
          <line key={`block_${i}`} x1="0" y1={y} x2="1080" y2={y} stroke="#000000" strokeWidth="5" />
        ))}
        <g stroke="#FDE68A" strokeWidth="3" fill="none" opacity="0.6">
          <circle cx="180" cy="400" r="22" />
          <path d="M 180 422 L 180 460 M 165 440 L 195 440" />
          <ellipse cx="880" cy="420" rx="30" ry="16" />
          <circle cx="880" cy="420" r="7" fill="#FDE68A" />
          <path d="M 850 420 Q 880 460 910 420" />
          <ellipse cx="540" cy="600" rx="20" ry="26" fill="#F59E0B" stroke="#000000" strokeWidth="3" />
          <line x1="510" y1="580" x2="570" y2="620" stroke="#000000" strokeWidth="3" />
          <line x1="510" y1="620" x2="570" y2="580" stroke="#000000" strokeWidth="3" />
        </g>
        <rect x="0" y="200" width="120" height="1720" fill="#B45309" stroke="#000000" strokeWidth="6" />
        <rect x="960" y="200" width="120" height="1720" fill="#B45309" stroke="#000000" strokeWidth="6" />
        <g transform="translate(120, 700)">
          <rect x="-8" y="0" width="16" height="60" fill="#451A03" stroke="#000000" strokeWidth="3" />
          <polygon points={`-16,0 16,0 ${torchWobble1},-45`} fill="#F59E0B" stroke="#000000" strokeWidth="3" />
          <polygon points={`-8,-4 8,-4 ${torchWobble1 * 0.7},-32`} fill="#FEF08A" />
        </g>
        <g transform="translate(960, 700)">
          <rect x="-8" y="0" width="16" height="60" fill="#451A03" stroke="#000000" strokeWidth="3" />
          <polygon points={`-16,0 16,0 ${torchWobble2},-45`} fill="#F59E0B" stroke="#000000" strokeWidth="3" />
          <polygon points={`-8,-4 8,-4 ${torchWobble2 * 0.7},-32`} fill="#FEF08A" />
        </g>
      </svg>
      <div
        className="absolute bottom-0 left-0 right-0 h-[560px] bg-[#92400E]"
        style={{ borderTop: "6px solid #000000" }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#FDE68A 3px, transparent 3px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, transparent ${isPrimerPlano ? 35 : 55}%, rgba(69, 26, 3, ${isPrimerPlano ? 0.7 : 0.45}) 100%)`,
        }}
      />
    </div>
  );
};

const SuperficieMarte: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const roverBlink = Math.sin(frame * 0.2) > 0 ? 1 : 0.2;
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#7F1D1D]">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #450A0A 0%, #7F1D1D 25%, #991B1B 55%, #C2410C 100%)",
        }}
      />
      <div className="absolute top-[180px] left-[200px] w-[80px] h-[80px] rounded-full bg-[#FEF08A] opacity-40 border-2 border-black" />
      <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <polygon points="-50,900 350,650 750,920" fill="#7F1D1D" stroke="#000000" strokeWidth="5" />
        <polygon points="400,950 820,700 1200,980" fill="#991B1B" stroke="#000000" strokeWidth="5" />
        <rect x="680" y="930" width="40" height="22" rx="4" fill="#E2E8F0" stroke="#000000" strokeWidth="3" />
        <line x1="695" y1="910" x2="695" y2="930" stroke="#000000" strokeWidth="3" />
        <circle cx="695" cy="908" r="3.5" fill="#22C55E" opacity={roverBlink} />
      </svg>
      <div
        className="absolute bottom-0 left-0 right-0 h-[620px] bg-[#C2410C]"
        style={{ borderTop: "6px solid #000000" }}
      >
        <svg viewBox="0 0 1080 620" className="w-full h-full">
          <ellipse cx="260" cy="180" rx="90" ry="24" fill="#9A3412" stroke="#000000" strokeWidth="4" />
          <ellipse cx="780" cy="240" rx="140" ry="34" fill="#9A3412" stroke="#000000" strokeWidth="4" />
          <polygon points="120,380 160,330 220,350 200,410" fill="#7C2D12" stroke="#000000" strokeWidth="5" />
          <polygon points="850,420 900,360 970,390 940,460" fill="#7C2D12" stroke="#000000" strokeWidth="5" />
        </svg>
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, transparent ${isPrimerPlano ? 35 : 55}%, rgba(69, 10, 10, ${isPrimerPlano ? 0.7 : 0.4}) 100%)`,
        }}
      />
    </div>
  );
};

const LagoHelado: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0C4A6E]">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #082F49 0%, #0C4A6E 30%, #0284C7 65%, #BAE6FD 100%)",
        }}
      />
      <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <polygon points="-40,950 220,680 500,980" fill="#0284C7" stroke="#000000" strokeWidth="5" />
        <polygon points="180,680 220,680 320,800 240,800" fill="#F0F9FF" />
        <polygon points="420,980 750,620 1120,990" fill="#0369A1" stroke="#000000" strokeWidth="5" />
        <polygon points="700,620 750,620 860,760 760,760" fill="#F0F9FF" />
      </svg>
      <div
        className="absolute bottom-0 left-0 right-0 h-[600px] bg-[#E0F2FE]"
        style={{ borderTop: "6px solid #000000" }}
      >
        <svg viewBox="0 0 1080 600" className="w-full h-full">
          <path d="M 120 0 L 260 160 L 320 340 M 260 160 L 400 220" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 880 0 L 740 180 L 680 380 M 740 180 L 620 220" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="540" cy="180" rx="380" ry="80" fill="#BAE6FD" opacity="0.5" />
        </svg>
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, transparent ${isPrimerPlano ? 38 : 58}%, rgba(8, 47, 73, ${isPrimerPlano ? 0.65 : 0.4}) 100%)`,
        }}
      />
    </div>
  );
};

const SelvaTropical: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const vineWiggle = Math.sin(frame * 0.06) * 12;
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#064E3B]">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #022C22 0%, #064E3B 35%, #047857 70%, #10B981 100%)",
        }}
      />
      <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <polygon points="200,0 350,0 480,1200 300,1200" fill="#FEF08A" opacity="0.08" />
        <polygon points="650,0 800,0 950,1200 780,1200" fill="#FEF08A" opacity="0.08" />
        <path d={`M 220 0 Q ${220 + vineWiggle} 300 240 600`} stroke="#000000" strokeWidth="8" fill="none" />
        <path d={`M 220 0 Q ${220 + vineWiggle} 300 240 600`} stroke="#065F46" strokeWidth="5" fill="none" />
        <path d={`M 840 0 Q ${840 - vineWiggle} 350 820 680`} stroke="#000000" strokeWidth="8" fill="none" />
        <path d={`M 840 0 Q ${840 - vineWiggle} 350 820 680`} stroke="#065F46" strokeWidth="5" fill="none" />
        <path d="M 0 150 Q 180 200 240 380 Q 80 400 0 350 Z" fill="#059669" stroke="#000000" strokeWidth="5" />
        <path d="M 1080 180 Q 900 240 840 420 Q 1000 440 1080 380 Z" fill="#059669" stroke="#000000" strokeWidth="5" />
      </svg>
      <div
        className="absolute bottom-0 left-0 right-0 h-[580px] bg-[#064E3B]"
        style={{ borderTop: "6px solid #000000" }}
      >
        <svg viewBox="0 0 1080 580" className="w-full h-full">
          <ellipse cx="220" cy="180" rx="120" ry="36" fill="#10B981" stroke="#000000" strokeWidth="4" />
          <ellipse cx="860" cy="190" rx="140" ry="40" fill="#10B981" stroke="#000000" strokeWidth="4" />
          <path d="M 0 320 Q 350 220 540 340 T 1080 280 L 1080 580 L 0 580 Z" fill="#022C22" stroke="#000000" strokeWidth="5" />
        </svg>
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, transparent ${isPrimerPlano ? 38 : 55}%, rgba(2, 44, 34, ${isPrimerPlano ? 0.65 : 0.4}) 100%)`,
        }}
      />
    </div>
  );
};

/** Núcleo ardiente y manto de la Tierra: gradiente magmático, esfera incandescente central,
 * corrientes convectivas de hierro fundido, plataforma de basalto con fisuras de lava y chispas. */
const NucleoTierra: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const corePulse = Math.sin(f / 10) * 8;
  const magmaFlow = Math.sin(f / 8) * 12;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A0503]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="nucleoSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1C1917" />
            <stop offset="30%" stopColor="#450A0A" />
            <stop offset="65%" stopColor="#7F1D1D" />
            <stop offset="85%" stopColor="#C2410C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <radialGradient id="innerCoreGlow">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#F97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1920" fill="url(#nucleoSky)" />

        <circle cx="540" cy="1580" r={520 + corePulse} fill="url(#innerCoreGlow)" />
        <circle cx="540" cy="1580" r={360 + corePulse * 0.5} fill="#FEF08A" stroke="#000000" strokeWidth="8" />
        
        {[-320, -160, 0, 160, 320].map((dx, i) => (
          <path
            key={`magField${i}`}
            d={`M ${540 + dx} 1200 Q ${540 + dx * 1.8} 800 ${540 + dx * 0.8} 300`}
            stroke="#FDE047"
            strokeWidth="3.5"
            strokeDasharray="14 12"
            fill="none"
            opacity={0.4 + Math.sin(f / 12 + i) * 0.25}
          />
        ))}

        <path
          d={`M 0 1150 Q 280 ${1120 + magmaFlow} 540 1160 T 1080 ${1130 - magmaFlow} L 1080 1350 L 0 1350 Z`}
          fill="#DC2626"
          stroke="#000000"
          strokeWidth="6"
        />
        <path
          d={`M 0 1180 Q 320 ${1160 - magmaFlow} 600 1190 T 1080 1170 L 1080 1350 L 0 1350 Z`}
          fill="#EA580C"
          opacity="0.85"
        />

        <path
          d="M 0 1260 Q 300 1230 540 1250 Q 800 1270 1080 1240 L 1080 1920 L 0 1920 Z"
          fill="#1C1917"
          stroke="#000000"
          strokeWidth="8"
        />
        <path
          d="M 80 1320 Q 220 1350 360 1310 L 440 1380 M 620 1300 Q 780 1340 980 1310"
          stroke="#EF4444"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 80 1320 Q 220 1350 360 1310 L 440 1380 M 620 1300 Q 780 1340 980 1310"
          stroke="#FEF08A"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {Array.from({ length: 22 }).map((_, i) => {
          const speed = 2.2 + rnd(i * 3) * 2.8;
          const py = 1920 - ((f * speed + rnd(i * 7) * 1920) % 1920);
          const px = 80 + rnd(i * 11) * 920 + Math.sin(f / 8 + i) * 16;
          const r = 2.5 + rnd(i * 5) * 4;
          return (
            <circle
              key={`spark${i}`}
              cx={px}
              cy={py}
              r={r}
              fill={i % 2 === 0 ? "#FEF08A" : "#F97316"}
              stroke="#000000"
              strokeWidth="1.5"
              opacity={0.85}
            />
          );
        })}
      </svg>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 60%, transparent ${isPrimerPlano ? 35 : 55}%, rgba(127, 29, 29, ${isPrimerPlano ? 0.6 : 0.35}) 100%)`,
        }}
      />
    </div>
  );
};

/** Arrecife de coral somero y fondo arenoso: aguas turquesas del Caribe, caústicas de sol,
 * corales cerebro y abanicos oscilando, madriguera arenosa y burbujas. */
const ArrecifeCoral: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const causticsDrift = Math.sin(f / 16) * 18;
  const coralSway = Math.sin(f / 12) * 8;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0284C7]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="arrecifeAgua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="40%" stopColor="#0EA5E9" />
            <stop offset="75%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="arenaFondo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1920" fill="url(#arrecifeAgua)" />

        {[100, 320, 560, 780, 950].map((x, i) => (
          <polygon
            key={`caustic${i}`}
            points={`${x + causticsDrift},0 ${x + 80 + causticsDrift},0 ${x + 140 - causticsDrift},1400 ${x - 40 - causticsDrift},1400`}
            fill="#BAE6FD"
            opacity={0.16 + Math.sin(f / 10 + i) * 0.08}
          />
        ))}

        {[0, 1, 2].map((k) => {
          const fx = ((f * 2.5 + k * 350) % 1300) - 100;
          const fy = 450 + k * 120 + Math.sin(f / 14 + k) * 20;
          return (
            <path
              key={`fish${k}`}
              d={`M ${fx} ${fy} Q ${fx + 25} ${fy - 12} ${fx + 50} ${fy} L ${fx + 65} ${fy - 10} L ${fx + 65} ${fy + 10} Z`}
              fill="#FDE047"
              stroke="#000000"
              strokeWidth="2"
              opacity="0.75"
            />
          );
        })}

        <g transform={`translate(140, 1160) scale(1.2)`}>
          <circle cx="0" cy="0" r="85" fill="#EC4899" stroke="#000000" strokeWidth="6" />
          <path d="M -60 -20 Q -20 -60 20 -20 Q 60 -50 40 10 Q 0 40 -40 20 Z" stroke="#000000" strokeWidth="5" fill="none" />
          <circle cx="0" cy="0" r="50" fill="#F472B6" stroke="#000000" strokeWidth="4" />
        </g>
        <g transform={`translate(${900 + coralSway}, 1120) scale(1.15)`}>
          <path
            d="M 0 120 L 0 0 L -35 -50 M 0 -10 L 35 -60 M 35 -20 L 65 -40 M -20 -30 L -45 -20"
            stroke="#F97316"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 0 120 L 0 0 L -35 -50 M 0 -10 L 35 -60 M 35 -20 L 65 -40 M -20 -30 L -45 -20"
            stroke="#000000"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        <path
          d="M 0 1270 Q 280 1240 540 1260 Q 820 1280 1080 1250 L 1080 1920 L 0 1920 Z"
          fill="url(#arenaFondo)"
          stroke="#000000"
          strokeWidth="7"
        />
        <ellipse cx="260" cy="1310" rx="75" ry="32" fill="#0F172A" stroke="#000000" strokeWidth="5" />
        <ellipse cx="260" cy="1310" rx="55" ry="20" fill="#020617" />
        <circle cx="210" cy="1285" r="14" fill="#94A3B8" stroke="#000000" strokeWidth="4" />
        <circle cx="315" cy="1290" r="18" fill="#64748B" stroke="#000000" strokeWidth="4" />

        {Array.from({ length: 18 }).map((_, i) => {
          const speed = 2.0 + rnd(i * 3) * 2.2;
          const by = 1920 - ((f * speed + rnd(i * 7) * 1920) % 1920);
          const bx = 60 + rnd(i * 11) * 960 + Math.sin(f / 10 + i) * 14;
          const r = 3 + rnd(i * 5) * 6;
          return (
            <circle
              key={`bub${i}`}
              cx={bx}
              cy={by}
              r={r}
              fill="#E0F2FE"
              fillOpacity="0.45"
              stroke="#0284C7"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent ${isPrimerPlano ? 38 : 55}%, rgba(3, 105, 161, ${isPrimerPlano ? 0.5 : 0.3}) 100%)`,
        }}
      />
    </div>
  );
};

/** Red subterránea de micelio ("Wood Wide Web"): parte superior con suelo de bosque y árboles,
 * parte inferior con corte transversal de tierra oscura, raíces entrelazadas y red fúngica luminosa con pulso de nutrientes. */
const RedSubterranea: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const pulseA = Math.sin(f / 8) * 0.5 + 0.5;
  const pulseB = Math.cos(f / 10) * 0.5 + 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#1C1917]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="0" width="1080" height="1920" fill="#1C1917" />

        <rect x="0" y="0" width="1080" height="420" fill="#15803D" stroke="#000000" strokeWidth="6" />
        <rect x="0" y="380" width="1080" height="60" fill="#166534" stroke="#000000" strokeWidth="4" />

        <path d="M 120 0 L 140 400 L 220 400 L 240 0 Z" fill="#78350F" stroke="#000000" strokeWidth="6" />
        <path d="M 840 0 L 820 400 L 920 400 L 940 0 Z" fill="#78350F" stroke="#000000" strokeWidth="6" />

        {[340, 520, 700].map((hx, i) => (
          <g key={`shroom${i}`} transform={`translate(${hx}, 380)`}>
            <path d="M 0 0 L 0 -28 M 8 0 L 8 -22" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M -16 -28 Q 0 -52 16 -28 Z" fill="#EF4444" stroke="#000000" strokeWidth="3" />
            <circle cx="-4" cy="-34" r="2.5" fill="#FFFFFF" />
            <circle cx="6" cy="-32" r="2" fill="#FFFFFF" />
          </g>
        ))}

        <path
          d="M 180 400 Q 140 650 240 900 Q 340 1150 420 1350"
          stroke="#92400E"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 870 400 Q 920 700 800 950 Q 680 1200 620 1350"
          stroke="#92400E"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M 240 900 Q 540 820 800 950"
          stroke="#34D399"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 320 1020 Q 540 1080 720 1080"
          stroke="#F43F5E"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 240 900 Q 360 1050 540 1080 Q 720 1050 800 950"
          stroke="#FFE600"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 420 1350 Q 540 1280 620 1350"
          stroke="#38BDF8"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {[
          { cx: 380, cy: 860, color: "#FFE600", r: 16 },
          { cx: 540, cy: 920, color: "#34D399", r: 20 },
          { cx: 700, cy: 900, color: "#F43F5E", r: 16 },
          { cx: 460, cy: 1060, color: "#38BDF8", r: 18 },
          { cx: 620, cy: 1080, color: "#FFE600", r: 18 },
          { cx: 540, cy: 1300, color: "#A78BFA", r: 15 },
        ].map((node, i) => (
          <g key={`node${i}`}>
            <circle cx={node.cx} cy={node.cy} r={node.r + 6 * (i % 2 === 0 ? pulseA : pulseB)} fill={node.color} opacity="0.35" />
            <circle cx={node.cx} cy={node.cy} r={node.r} fill={node.color} stroke="#000000" strokeWidth="4" />
            <circle cx={node.cx} cy={node.cy} r={node.r * 0.45} fill="#FFFFFF" />
          </g>
        ))}

        {Array.from({ length: 16 }).map((_, i) => {
          const t = ((f * 1.5 + i * 45) % 360) / 360;
          const px = 240 + t * 560;
          const py = 900 + Math.sin(t * Math.PI) * (i % 2 === 0 ? -60 : 120);
          return (
            <circle
              key={`nutr${i}`}
              cx={px}
              cy={py}
              r={4}
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1.5"
            />
          );
        })}

        <path
          d="M 0 1260 Q 300 1230 540 1250 Q 800 1270 1080 1240 L 1080 1920 L 0 1920 Z"
          fill="#292524"
          stroke="#000000"
          strokeWidth="7"
        />
        <path
          d="M 120 1310 Q 320 1340 540 1300 T 960 1320"
          stroke="#44403C"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent ${isPrimerPlano ? 35 : 55}%, rgba(28, 25, 23, ${isPrimerPlano ? 0.7 : 0.4}) 100%)`,
        }}
      />
    </div>
  );
};

/** Espacio relativista a 0.99c con efecto Doppler y distorsión de Lorentz: estrellas con corrimiento al azul en el frente,
 * malla espacio-temporal curvada y puente de mando de nave de exploración. */
const VueloRelativista: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const gridWarp = Math.sin(f / 12) * 12;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="warpGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1920" fill="#030712" />

        <circle cx="540" cy="720" r={420} fill="url(#warpGlow)" />

        {[-480, -320, -160, 0, 160, 320, 480].map((offset, i) => (
          <line
            key={`gridLine${i}`}
            x1={540 + offset * 2.2}
            y1="0"
            x2={540 + offset * 0.3}
            y2="720"
            stroke="#38BDF8"
            strokeWidth="2.5"
            opacity="0.35"
          />
        ))}
        {[200, 380, 560, 720].map((y, i) => (
          <ellipse
            key={`gridRing${i}`}
            cx="540"
            cy="720"
            rx={140 + i * 110 + gridWarp}
            ry={70 + i * 55 + gridWarp * 0.5}
            fill="none"
            stroke="#818CF8"
            strokeWidth="2"
            opacity={0.3 + i * 0.1}
          />
        ))}

        {Array.from({ length: 24 }).map((_, i) => {
          const speed = 14 + rnd(i * 3) * 16;
          const dist = ((f * speed + rnd(i * 7) * 1200) % 1200);
          const angle = rnd(i * 11) * Math.PI * 2;
          const x1 = 540 + Math.cos(angle) * (dist * 0.6);
          const y1 = 720 + Math.sin(angle) * (dist * 0.5);
          const x2 = 540 + Math.cos(angle) * dist;
          const y2 = 720 + Math.sin(angle) * dist;
          return (
            <line
              key={`streak${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 3 === 0 ? "#FFFFFF" : i % 3 === 1 ? "#38BDF8" : "#A78BFA"}
              strokeWidth={2 + rnd(i * 5) * 3}
              strokeLinecap="round"
              opacity={0.8}
            />
          );
        })}

        <path
          d="M 0 1260 L 280 1220 L 800 1220 L 1080 1260 L 1080 1920 L 0 1920 Z"
          fill="#0F172A"
          stroke="#000000"
          strokeWidth="7"
        />
        <line x1="280" y1="1220" x2="800" y2="1220" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
        <rect x="360" y="1250" width="360" height="24" rx="6" fill="#1E293B" stroke="#000000" strokeWidth="3" />
        <text x="540" y="1267" font-family="'Arial Black', sans-serif" font-size="11" font-weight="900" fill="#38BDF8" text-anchor="middle">
          FACTOR DE LORENTZ: γ = 7.09 | v = 0.99c
        </text>
      </svg>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 40%, transparent ${isPrimerPlano ? 38 : 55}%, rgba(3, 7, 18, ${isPrimerPlano ? 0.7 : 0.4}) 100%)`,
        }}
      />
    </div>
  );
};

export const NarrativeStage: React.FC<NarrativeStageProps> = ({
  escenario = "vacio",
  composicionVisual = "minimalista",
  frame,
}) => {
  const isPrimerPlano = composicionVisual === "primer_plano";

  if (escenario === "azotea_rascacielos" || escenario === "rascacielos") {
    return <AzoteaRascacielos frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "tumba_egipcia" || escenario === "egipto") {
    return <TumbaEgipcia frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "superficie_marte" || escenario === "marte") {
    return <SuperficieMarte frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "lago_helado" || escenario === "glaciar" || escenario === "artico") {
    return <LagoHelado frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "selva_tropical" || escenario === "bosque_tropical" || escenario === "amazonas") {
    return <SelvaTropical frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "abismo_oceanico") {
    return <AbismoOceanico frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "interior_cuerpo") {
    return <InteriorCuerpo frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "mar_abierto") {
    return <MarAbierto frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "espacio_profundo") {
    return <EspacioProfundo frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "cielo_dia") {
    return <CieloDia frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "atardecer_dorado") {
    return <AtardecerDorado frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "tormenta_electrica") {
    return <TormentaElectrica frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "bosque_frio_nocturno") {
    return <BosqueFrioNocturno frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "sala_estar") {
    return <SalaEstar frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "laboratorio_neuro") {
    return <LaboratorioNeuro frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "nucleo_tierra") {
    return <NucleoTierra frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "arrecife_coral") {
    return <ArrecifeCoral frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "red_subterranea") {
    return <RedSubterranea frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "vuelo_relativista") {
    return <VueloRelativista frame={frame} isPrimerPlano={isPrimerPlano} />;
  }

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

  if (escenario === "habitacion_noche") {
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
              <circle cx="55" cy="70" r="3.5" fill="#FFFFFF" opacity={starBlink1} />
              <circle cx="105" cy="140" r="2.5" fill="#FFFFFF" opacity={starBlink2} />
              <circle cx="75" cy="230" r="3" fill="#FFFFFF" opacity={starBlink3} />
              <circle cx="210" cy="200" r="3.5" fill="#FFFFFF" opacity={starBlink1} />
              {/* Marco de ventana cruzado */}
              <line x1="130" y1="0" x2="130" y2="340" stroke="#1E293B" strokeWidth="6" />
              <line x1="0" y1="170" x2="260" y2="170" stroke="#1E293B" strokeWidth="6" />
            </svg>
          </div>

          {/* Cama ilustrada en la esquina derecha del cuarto */}
          <div className="absolute top-[960px] right-[40px] w-[340px] h-[300px]">
            <svg viewBox="0 0 340 300" className="w-full h-full">
              {/* Cabecera de madera */}
              <rect x="260" y="60" width="65" height="240" rx="10" fill="#94A3B8" stroke="#000000" strokeWidth="6" />
              {/* Almohada */}
              <rect x="200" y="150" width="70" height="45" rx="14" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />
              {/* Colchón y sábana suave */}
              <rect x="20" y="180" width="250" height="110" rx="18" fill="#38BDF8" stroke="#000000" strokeWidth="6" />
              <path d="M 120 180 L 120 290" stroke="#0284C7" strokeWidth="4" strokeDasharray="8 6" />
              {/* Patas de cama */}
              <rect x="30" y="275" width="16" height="25" fill="#000000" rx="4" />
              <rect x="250" y="275" width="16" height="25" fill="#000000" rx="4" />
            </svg>
          </div>

          {/* Reloj de pared minimalista */}
          <div
            className="absolute top-[260px] right-[140px] w-[90px] h-[90px] rounded-full bg-white border-4 border-black flex items-center justify-center"
            style={{ boxShadow: "5px 5px 0px #000000" }}
          >
            <svg viewBox="0 0 90 90" className="w-full h-full">
              <circle cx="45" cy="45" r="3" fill="#000000" />
              <line x1="45" y1="45" x2="45" y2="24" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
              <line x1="45" y1="45" x2="65" y2="45" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
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
          <div className="w-full h-[60px] bg-black/10" />
        </div>

        {/* Partículas de sueño flotando */}
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

          {/* Mesa de laboratorio auxiliar */}
          <div className="absolute top-[980px] right-[40px] w-[320px] h-[280px]">
            <svg viewBox="0 0 320 280" className="w-full h-full">
              <rect x="20" y="140" width="280" height="30" rx="6" fill="#64748B" stroke="#000000" strokeWidth="6" />
              <rect x="40" y="170" width="18" height="110" fill="#000000" />
              <rect x="260" y="170" width="18" height="110" fill="#000000" />
              <path d="M 95 90 L 105 90 L 105 110 L 125 140 L 75 140 L 95 110 Z" fill="#38BDF8" stroke="#000000" strokeWidth="5" />
              <circle cx="95" cy="125" r="4" fill="#FFFFFF" opacity="0.8" />
              <circle cx="105" cy="132" r="3" fill="#FFFFFF" opacity="0.8" />
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
          <div
            className="w-full h-[24px]"
            style={{
              background: "repeating-linear-gradient(45deg, #F59E0B, #F59E0B 16px, #000000 16px, #000000 32px)",
              borderBottom: "3px solid #000000",
            }}
          />
        </div>

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
            <circle cx="120" cy="180" r="3" fill="#FFFFFF" opacity={starBlink1} />
            <circle cx="280" cy="90" r="2.5" fill="#FFFFFF" opacity={starBlink2} />
            <circle cx="450" cy="240" r="2" fill="#FFFFFF" opacity={starBlink1} />
            <circle cx="680" cy="140" r="3" fill="#FFFFFF" opacity={starBlink2} />
            <circle cx="890" cy="220" r="2.5" fill="#FFFFFF" opacity={starBlink1} />
            <circle cx="980" cy="80" r="2" fill="#FFFFFF" opacity={starBlink2} />
            <circle cx="200" cy="420" r="2" fill="#FFFFFF" opacity={starBlink1} />
            <circle cx="820" cy="460" r="3" fill="#FFFFFF" opacity={starBlink2} />

            {/* Planeta Tierra visto desde la Luna */}
            <g transform="translate(780, 260)">
              <circle cx="0" cy="0" r="80" fill="#0284C7" stroke="#000000" strokeWidth="6" />
              <path d="M -40 -30 Q -10 -60 20 -40 Q 50 -10 30 20 Q 0 40 -30 20 Z" fill="#10B981" />
              <path d="M -60 20 Q -40 10 -20 30 Q -10 60 -50 50 Z" fill="#10B981" />
              <path d="M -50 -40 Q 0 -20 40 -30" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
              <path d="M -30 10 Q 10 30 60 10" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />
            </g>

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
            <ellipse cx="220" cy="120" rx="90" ry="32" fill="#64748B" stroke="#000000" strokeWidth="5" />
            <ellipse cx="200" cy="115" rx="65" ry="20" fill="#475569" />

            <ellipse cx="760" cy="180" rx="140" ry="45" fill="#64748B" stroke="#000000" strokeWidth="6" />
            <ellipse cx="740" cy="172" rx="100" ry="28" fill="#475569" />

            <ellipse cx="480" cy="340" rx="110" ry="35" fill="#64748B" stroke="#000000" strokeWidth="5" />
            <ellipse cx="465" cy="332" rx="80" ry="22" fill="#475569" />

            <g transform="translate(940, 0)">
              <line x1="0" y1="-80" x2="0" y2="0" stroke="#000000" strokeWidth="5" />
              <rect x="0" y="-80" width="45" height="28" fill="#EF4444" stroke="#000000" strokeWidth="3" />
            </g>
          </svg>
        </div>

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
