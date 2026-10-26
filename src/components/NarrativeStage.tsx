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
  "playa_bioluminiscente",
  "caldera_volcan",
  "crater_volcanico",
  "volcan",
  "ofrenda_dia_muertos",
  "cosmogonia_prehispanica",
  "paramo_celta_niebla",
  "umbral_cielo_infierno",
  "laboratorio_balistica",
  "diagrama_termico_rupert",
  "laboratorio_penumbra",
  "microcosmos_acuatico",
  "corte_glaciar_antartico",
  "interior_guia_ondas_hielo",
  "carrera_ondas_dispersion",
  "laboratorio_antartico",
  "atardecer_polar_despedida",
  "microcosmos_choque_fotones",
  "orbita_sol_estrellas",
  "despliegue_vela_solar",
  "diagrama_optica_rebote",
  "velocidad_curvatura_espacio",
  "surf_nebulosa_estelar",
  "microcosmos_cohesion_molecular",
  "mascara_agua_asfixia",
  "diagrama_sublimacion_fases",
  "crater_kawah_ijen_noche",
  "crater_gas_toxico_azufre",
  "corte_subsuelo_olla_presion",
  "macro_soplete_autoignicion",
  "ladera_azufre_liquido_flujo",
  "panoramica_kawah_ijen_cierre",
  "microcosmos_polimero_petasa",
  "metabolismo_mhetasa_powerup",
  "estudio_pausa_fotogramas",
  "estudio_reloj_estroboscopico",
  "habitacion_ventilador_pov",
  "lago_natron_orilla_roja",
  "volcan_ol_doinyo_lengai",
  "lago_natron_espejo_mortal",
  "lago_natron_calcificacion_timelapse",
  "macro_anatomia_cabeza_hormiga",
  "diagrama_quimico_feromonas",
  "diagrama_bucle_cerrado_glitch",
  "cueva_naica_megacristales_calor",
  "cueva_naica_escala_panoramica",
  "corte_geologico_magma_submarino",
  "cueva_naica_drenaje_horno",
  "diagrama_condensacion_lata_pulmon",
  "cueva_naica_rescate_traje_hielo",
  "mina_naica_compuerta_escape",
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

/** Playa bioluminiscente nocturna: océano con olas azul neón, cielo estrellado y arena luminosa. */
const PlayaBioluminiscente: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const waveGlow1 = 0.5 + 0.5 * Math.sin(frame / 12);
  const waveGlow2 = 0.5 + 0.5 * Math.sin(frame / 15 + 2);
  const waveGlow3 = 0.5 + 0.5 * Math.sin(frame / 9 + 4);
  const starBlink1 = 0.4 + 0.6 * Math.sin(frame / 7);
  const starBlink2 = 0.4 + 0.6 * Math.cos(frame / 9);
  const starBlink3 = 0.4 + 0.6 * Math.sin(frame / 11 + 1.5);
  const surfDrift = Math.sin(frame / 40) * 20;
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020B1A]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        {/* Cielo nocturno profundo */}
        <defs>
          <linearGradient id="bioSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#010612" />
            <stop offset="60%" stopColor="#031530" />
            <stop offset="100%" stopColor="#072A4A" />
          </linearGradient>
          <linearGradient id="bioOcean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#041E3A" />
            <stop offset="40%" stopColor="#031525" />
            <stop offset="100%" stopColor="#010810" />
          </linearGradient>
          <radialGradient id="moonGlowBio">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bioWaveGlow">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Cielo */}
        <rect x="0" y="0" width="1080" height="900" fill="url(#bioSky)" />
        {/* Estrellas titilantes */}
        {[
          { x: 80, y: 80, r: 2.5, b: starBlink1 },
          { x: 220, y: 160, r: 2, b: starBlink2 },
          { x: 380, y: 60, r: 3, b: starBlink3 },
          { x: 520, y: 140, r: 2, b: starBlink1 },
          { x: 700, y: 90, r: 2.5, b: starBlink2 },
          { x: 860, y: 180, r: 2, b: starBlink3 },
          { x: 980, y: 70, r: 3, b: starBlink1 },
          { x: 150, y: 300, r: 2, b: starBlink2 },
          { x: 460, y: 280, r: 2.5, b: starBlink3 },
          { x: 780, y: 320, r: 2, b: starBlink1 },
          { x: 920, y: 260, r: 2.5, b: starBlink2 },
        ].map((s, i) => (
          <circle key={`star${i}`} cx={s.x} cy={s.y} r={s.r} fill="#FFFFFF" opacity={s.b} />
        ))}
        {/* Luna creciente con halo */}
        <circle cx="920" cy="180" r="70" fill="url(#moonGlowBio)" opacity="0.5" />
        <path d="M 920 120 A 60 60 0 1 1 920 240 A 45 45 0 1 0 920 120 Z" fill="#FDE047" stroke="#000000" strokeWidth="3" />
        {/* Océano */}
        <rect x="0" y="900" width="1080" height="1020" fill="url(#bioOcean)" />
        {/* Línea de horizonte */}
        <line x1="0" y1="900" x2="1080" y2="900" stroke="#0EA5E9" strokeWidth="4" opacity="0.5" />
        {/* Olas bioluminiscentes en el fondo (parallax lejano) */}
        {[0, 1, 2].map((i) => {
          const y = 980 + i * 80;
          const glow = [waveGlow1, waveGlow2, waveGlow3][i];
          return (
            <g key={`farwave${i}`} transform={`translate(${surfDrift * 0.3} 0)`}>
              <path
                d={`M -60 ${y} Q 120 ${y - 15} 300 ${y} T 660 ${y} T 1020 ${y} T 1380 ${y}`}
                stroke="#22D3EE"
                strokeWidth="3"
                fill="none"
                opacity={0.3 + glow * 0.3}
              />
              <path
                d={`M -60 ${y + 4} Q 120 ${y - 11} 300 ${y + 4} T 660 ${y + 4} T 1020 ${y + 4} T 1380 ${y + 4}`}
                stroke="#06B6D4"
                strokeWidth="2"
                fill="none"
                opacity={0.2}
              />
            </g>
          );
        })}
        {/* Olas principales bioluminiscentes (plano medio) */}
        {[0, 1, 2, 3].map((i) => {
          const y = 1050 + i * 120;
          const glow = 0.5 + 0.5 * Math.sin(frame / 8 + i * 1.5);
          const xOff = Math.sin(frame / 30 + i) * 15;
          return (
            <g key={`midwave${i}`} transform={`translate(${xOff} 0)`}>
              <path
                d={`M -80 ${y} Q 100 ${y - 25} 280 ${y} T 640 ${y} T 1000 ${y} T 1360 ${y}`}
                stroke="#22D3EE"
                strokeWidth={4 + glow * 2}
                fill="none"
                opacity={0.5 + glow * 0.4}
              />
              {/* Resplandor de la ola */}
              <ellipse
                cx={280 + i * 200}
                cy={y}
                rx={120}
                ry={30}
                fill="url(#bioWaveGlow)"
                opacity={glow * 0.4}
              />
              <ellipse
                cx={640 + i * 150}
                cy={y}
                rx={100}
                ry={25}
                fill="url(#bioWaveGlow)"
                opacity={glow * 0.3}
              />
            </g>
          );
        })}
        {/* Partículas bioluminiscentes flotando (dinoflagelados) */}
        {[...Array(40)].map((_, i) => {
          const x = (i * 97 + frame * (0.3 + (i % 5) * 0.15)) % 1080;
          const y = 920 + ((i * 137 + frame * (0.2 + (i % 3) * 0.1)) % 980);
          const sz = 2 + (i % 3);
          const pulse = 0.3 + 0.7 * Math.abs(Math.sin(frame / 6 + i * 0.7));
          return (
            <circle
              key={`particle${i}`}
              cx={x}
              cy={y}
              r={sz}
              fill="#22D3EE"
              opacity={pulse * 0.6}
            />
          );
        })}
        {/* Espuma bioluminiscente en la orilla (primer plano) */}
        <g transform={`translate(${surfDrift} 0)`}>
          {[...Array(12)].map((_, i) => {
            const x = i * 95 - 20;
            const y = 1580 + Math.sin(frame / 10 + i) * 8;
            const glow = 0.4 + 0.6 * Math.abs(Math.sin(frame / 7 + i * 0.8));
            return (
              <ellipse
                key={`foam${i}`}
                cx={x}
                cy={y}
                rx={50}
                ry={18}
                fill="#22D3EE"
                opacity={glow * 0.5}
              />
            );
          })}
        </g>
        {/* Arena (suelo) */}
        <rect x="0" y="1620" width="1080" height="300" fill="#1C1410" />
        <rect x="0" y="1620" width="1080" height="8" fill="#3D2B1F" />
        {/* Partículas de arena brillante */}
        {[...Array(20)].map((_, i) => {
          const x = (i * 53 + frame * 0.1) % 1080;
          const y = 1640 + (i * 17) % 260;
          const glow = 0.2 + 0.4 * Math.abs(Math.sin(frame / 5 + i));
          return (
            <circle
              key={`sand${i}`}
              cx={x}
              cy={y}
              r={1.5}
              fill="#22D3EE"
              opacity={glow}
            />
          );
        })}
      </svg>
      {isPrimerPlano && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 40%, rgba(2, 11, 26, 0.55) 100%)",
          }}
        />
      )}
    </div>
  );
};

/** Caldera y Cráter Volcánico con lago de lava basáltica hirviendo, humo sulfuroso,
 * corteza agrietada con magma palpitante y partículas de cenizas/chispas incandescentes. */
const CraterVolcanico: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const smokeSway = Math.sin(f / 25) * 18;
  const lavaWave = Math.sin(f / 14) * 12;
  const crustBreath = Math.sin(f / 18) * 8;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#120502]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="volcanCielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#180703" />
            <stop offset="30%" stopColor="#3F0D0C" />
            <stop offset="60%" stopColor="#7F1D1D" />
            <stop offset="85%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="lavaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="15%" stopColor="#F59E0B" />
            <stop offset="45%" stopColor="#EF4444" />
            <stop offset="80%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>
          <radialGradient id="lavaGlow">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#EA580C" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Capa 0: Cielo crepuscular volcánico saturado */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#volcanCielo)" />

        {/* Humo y ceniza piroclástica lejana */}
        {[
          { x: 260, y: 480, r: 160, c: "#260E0B", o: 0.75, s: 1 },
          { x: 540, y: 380, r: 210, c: "#1C0A08", o: 0.85, s: 1.2 },
          { x: 820, y: 460, r: 170, c: "#260E0B", o: 0.7, s: 0.9 },
        ].map((cloud, i) => {
          const drift = Math.sin(f / 20 + i * 2) * 22;
          return (
            <g key={`smoke${i}`} transform={`translate(${cloud.x + drift} ${cloud.y - (f * 0.4) % 180}) scale(${cloud.s})`}>
              <circle cx="0" cy="0" r={cloud.r} fill={cloud.c} opacity={cloud.o} />
              <circle cx="-50" cy="40" r={cloud.r * 0.75} fill={cloud.c} opacity={cloud.o} />
              <circle cx="60" cy="30" r={cloud.r * 0.7} fill={cloud.c} opacity={cloud.o} />
            </g>
          );
        })}

        {/* Resplandor del cráter lejano */}
        <ellipse cx="540" cy="1180" rx="580" ry="240" fill="url(#lavaGlow)" />

        {/* Capa 1: Borde escarpado de la caldera basáltica lejana */}
        <path
          d={`M -50 1120 L 160 920 L 320 990 L 520 860 L 710 960 L 890 890 L 1130 1140 L 1130 1350 L -50 1350 Z`}
          fill="#1C1917"
          stroke="#000000"
          strokeWidth="6"
        />

        {/* Columnas de humo ascendente sobre fisuras */}
        <path
          d={`M 320 990 Q ${320 + smokeSway} 700 ${360 - smokeSway} 450 Q ${330 + smokeSway} 250 400 120`}
          stroke="#451A03"
          strokeWidth="28"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <path
          d={`M 710 960 Q ${710 - smokeSway} 680 ${680 + smokeSway} 420 Q ${730 - smokeSway} 200 700 80`}
          stroke="#451A03"
          strokeWidth="32"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />

        {/* Capa 2: Paredes medias del cráter con fisuras de lava */}
        <path
          d="M -30 1250 L 180 1100 L 380 1170 L 600 1080 L 840 1160 L 1110 1090 L 1110 1380 L -30 1380 Z"
          fill="#292524"
          stroke="#000000"
          strokeWidth="7"
        />
        {/* Venas de magma en las paredes rocosas */}
        <path
          d="M 190 1110 Q 240 1180 280 1260 M 590 1090 Q 560 1170 540 1260 M 830 1170 Q 860 1220 890 1260"
          stroke="#F97316"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 190 1110 Q 240 1180 280 1260 M 590 1090 Q 560 1170 540 1260 M 830 1170 Q 860 1220 890 1260"
          stroke="#FEF08A"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Capa 3: Lago de Lava Basáltica Hirviendo (Suelo activo) */}
        <path
          d={`M 0 1240 Q 270 ${1215 + lavaWave} 540 1240 T 1080 ${1225 - lavaWave} L 1080 1920 L 0 1920 Z`}
          fill="url(#lavaGrad)"
          stroke="#000000"
          strokeWidth="8"
        />

        {/* Olas y ondulaciones de magma espeso en superficie */}
        <path
          d={`M 0 1280 Q 260 ${1260 - lavaWave} 540 1285 T 1080 ${1270 + lavaWave}`}
          stroke="#FEF08A"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d={`M 0 1320 Q 320 ${1305 + lavaWave} 640 1325 T 1080 1315`}
          stroke="#F97316"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Placas de corteza basáltica flotante y agrietada */}
        {[
          { x: 120, y: 1420, w: 260, h: 140 },
          { x: 440, y: 1380, w: 220, h: 120 },
          { x: 720, y: 1440, w: 280, h: 150 },
          { x: 260, y: 1620, w: 320, h: 180 },
          { x: 620, y: 1650, w: 360, h: 190 },
        ].map((plate, i) => {
          const bob = Math.sin(f / 16 + i * 1.5) * 6;
          return (
            <g key={`plate${i}`} transform={`translate(${plate.x + crustBreath * (i % 2 === 0 ? 1 : -1)} ${plate.y + bob})`}>
              <polygon
                points={`-30,-20 ${plate.w * 0.4},-35 ${plate.w},0 ${plate.w * 0.85},${plate.h} 20,${plate.h * 0.9} -20,${plate.h * 0.5}`}
                fill="#1C1917"
                stroke="#000000"
                strokeWidth="6"
              />
              {/* Grietas internas incandescentes en la placa */}
              <path
                d={`M 15 10 L ${plate.w * 0.4} ${plate.h * 0.3} L ${plate.w * 0.7} ${plate.h * 0.6}`}
                stroke="#EF4444"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={`M 15 10 L ${plate.w * 0.4} ${plate.h * 0.3} L ${plate.w * 0.7} ${plate.h * 0.6}`}
                stroke="#FEF08A"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          );
        })}

        {/* Burbujas gigantes de lava que revientan */}
        {[
          { cx: 320, cy: 1360, r: 35, phase: 0 },
          { cx: 780, cy: 1350, r: 42, phase: 2 },
          { cx: 540, cy: 1520, r: 48, phase: 4 },
        ].map((bub, i) => {
          const bubCycle = (f + bub.phase * 15) % 45;
          const bubScale = Math.min(1, bubCycle / 30);
          const isPopped = bubCycle > 30;
          if (isPopped) {
            return (
              <g key={`burst${i}`} transform={`translate(${bub.cx} ${bub.cy})`}>
                <circle cx="-15" cy="-20" r="5" fill="#FEF08A" stroke="#000000" strokeWidth="2" />
                <circle cx="18" cy="-22" r="6" fill="#F59E0B" stroke="#000000" strokeWidth="2" />
                <circle cx="0" cy="-30" r="4" fill="#EF4444" />
              </g>
            );
          }
          return (
            <g key={`bub${i}`} transform={`translate(${bub.cx} ${bub.cy}) scale(${bubScale})`}>
              <ellipse cx="0" cy="0" rx={bub.r} ry={bub.r * 0.7} fill="#F59E0B" stroke="#000000" strokeWidth="5" />
              <ellipse cx="-8" cy="-8" rx={bub.r * 0.35} ry={bub.r * 0.22} fill="#FEF08A" />
            </g>
          );
        })}

        {/* Partículas vivas: 28 chispas de lava y ceniza incandescente ascendiendo */}
        {Array.from({ length: 28 }).map((_, i) => {
          const speed = 2.4 + rnd(i * 3) * 3.2;
          const py = 1920 - ((f * speed + rnd(i * 7) * 1920) % 1920);
          const px = 60 + rnd(i * 13) * 960 + Math.sin(f / 10 + i) * 24;
          const r = 2.5 + rnd(i * 5) * 4;
          const sparkColor = i % 3 === 0 ? "#FEF08A" : i % 3 === 1 ? "#F59E0B" : "#EF4444";
          return (
            <circle
              key={`spark${i}`}
              cx={px}
              cy={py}
              r={r}
              fill={sparkColor}
              stroke="#000000"
              strokeWidth={1.5}
              opacity={0.85 + Math.sin(f / 6 + i) * 0.15}
            />
          );
        })}
      </svg>

      {/* Halo de calor radiante extremo en primer plano */}
      {isPrimerPlano && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 35%, rgba(185, 28, 28, 0.45) 85%, rgba(69, 10, 10, 0.75) 100%)",
          }}
        />
      )}
    </div>
  );
};

/** Ofrenda tradicional de Día de Muertos: guirnaldas de papel picado oscilando al viento,
 * veladoras con flama viva, pétalos de cempasúchil flotando y mesa ceremonial rústica. */
const OfrendaDiaMuertos: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const candleFlame1 = Math.sin(f * 0.28) * 4;
  const candleFlame2 = Math.cos(f * 0.24) * 4;
  const candleFlame3 = Math.sin(f * 0.32 + 1.5) * 4;

  const flagColors = ["#EC4899", "#F97316", "#A855F7", "#FACC15", "#06B6D4", "#22C55E", "#E11D48"];

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#180A22]">
      {/* 1. Fondo degradado ceremonial: violeta místico nocturno a ámbar cálido de ofrenda */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #180A22 0%, #2E0854 28%, #7C2D12 68%, #3E1608 100%)",
        }}
      />

      <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id="altarWarmGlow" cx="50%" cy="55%" r="48%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#D97706" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#180A22" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flameHalo">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Resplandor cálido central del altar */}
        <rect x="0" y="300" width="1080" height="1200" fill="url(#altarWarmGlow)" />

        {/* =========================================================================
            GUIRNALDA 1 DE PAPEL PICADO (Superior alta)
            ========================================================================= */}
        <path d="M -20 160 Q 270 230 540 170 Q 810 230 1100 160" fill="none" stroke="#000000" strokeWidth="6" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const t = (i + 0.5) / 7;
          const x = -20 + t * 1120;
          const baseY = 160 + Math.sin(t * Math.PI) * 55;
          const sway = Math.sin(f / 16 + i * 1.1) * 6;
          const color = flagColors[i % flagColors.length];
          return (
            <g key={`flag1_${i}`} transform={`translate(${x}, ${baseY}) rotate(${sway})`}>
              <polygon
                points="-52,0 52,0 52,90 26,78 0,90 -26,78 -52,90"
                fill={color}
                stroke="#000000"
                strokeWidth="4"
              />
              {/* Calaverita calada en el papel picado */}
              <circle cx="0" cy="32" r="14" fill="#FFFFFF" opacity="0.85" stroke="#000000" strokeWidth="2.5" />
              <circle cx="-5" cy="30" r="3.5" fill="#000000" />
              <circle cx="5" cy="30" r="3.5" fill="#000000" />
              <rect x="-4" y="40" width="8" height="6" rx="1.5" fill="#000000" />
            </g>
          );
        })}

        {/* =========================================================================
            GUIRNALDA 2 DE PAPEL PICADO (Segunda capa con ligero desfase)
            ========================================================================= */}
        <path d="M -20 280 Q 270 340 540 290 Q 810 350 1100 280" fill="none" stroke="#000000" strokeWidth="5" opacity="0.9" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const t = (i + 0.5) / 7;
          const x = -10 + t * 1100;
          const baseY = 280 + Math.sin(t * Math.PI) * 50;
          const sway = Math.sin(f / 14 + i * 1.3 + 2) * 5.5;
          const color = flagColors[(i + 3) % flagColors.length];
          return (
            <g key={`flag2_${i}`} transform={`translate(${x}, ${baseY}) rotate(${sway})`}>
              <polygon
                points="-46,0 46,0 46,78 23,68 0,78 -23,68 -46,78"
                fill={color}
                stroke="#000000"
                strokeWidth="4"
              />
              <circle cx="0" cy="28" r="10" fill="#FFFFFF" opacity="0.8" />
              <circle cx="-16" cy="45" r="5" fill="#FFFFFF" opacity="0.8" />
              <circle cx="16" cy="45" r="5" fill="#FFFFFF" opacity="0.8" />
            </g>
          );
        })}

        {/* =========================================================================
            MESA DE OFRENDA / BASE RÚSTICA CON MANTELES PICADOS
            ========================================================================= */}
        <g transform="translate(0, 1360)">
          {/* Faldón decorativo escalonado estilo altar */}
          <rect x="0" y="0" width="1080" height="560" fill="#2A1205" stroke="#000000" strokeWidth="8" />
          <rect x="40" y="20" width="1000" height="28" fill="#D97706" stroke="#000000" strokeWidth="4" />
          <line x1="0" y1="50" x2="1080" y2="50" stroke="#000000" strokeWidth="6" />

          {/* Vetas de madera rústica */}
          {[120, 220, 320, 420].map((ly, idx) => (
            <line
              key={`wood_${idx}`}
              x1="60"
              y1={ly}
              x2="1020"
              y2={ly}
              stroke="#1C0B02"
              strokeWidth="5"
              strokeDasharray="90 35 140 45"
            />
          ))}

          {/* Tapete o camino de pétalos de cempasúchil en la mesa */}
          <path
            d="M 180 30 Q 360 48 540 32 Q 720 48 900 30 L 910 50 Q 720 68 540 52 Q 360 68 170 50 Z"
            fill="#F59E0B"
            stroke="#000000"
            strokeWidth="3"
          />
        </g>

        {/* =========================================================================
            VELADORAS TRADICIONALES EN AMBOS COSTADOS CON LLAMA VIVA
            ========================================================================= */}
        {/* Veladora Izquierda 1 */}
        <g transform="translate(130, 1310)">
          <circle cx="0" cy="-28" r="48" fill="url(#flameHalo)" />
          <rect x="-24" y="-8" width="48" height="66" rx="6" fill="#F8FAFC" stroke="#000000" strokeWidth="6" />
          <rect x="-20" y="2" width="40" height="12" fill="#E2E8F0" rx="3" />
          <path d="M 0 -8 L 0 -20" stroke="#000000" strokeWidth="4" />
          <path
            d={`M 0 -48 C 16 -32 12 -18 0 -18 C -12 -18 -16 -32 0 -48 Z`}
            fill="#F97316"
            stroke="#000000"
            strokeWidth="4"
            transform={`rotate(${candleFlame1} 0 -18)`}
          />
          <ellipse cx="0" cy="-26" rx="5" ry="9" fill="#FEF08A" transform={`rotate(${candleFlame1} 0 -18)`} />
        </g>

        {/* Veladora Izquierda 2 (más pequeña y adelantada) */}
        <g transform="translate(220, 1335) scale(0.82)">
          <circle cx="0" cy="-28" r="42" fill="url(#flameHalo)" />
          <rect x="-22" y="-8" width="44" height="62" rx="6" fill="#FEF3C7" stroke="#000000" strokeWidth="6" />
          <path d="M 0 -8 L 0 -18" stroke="#000000" strokeWidth="4" />
          <path
            d={`M 0 -44 C 14 -30 10 -16 0 -16 C -10 -16 -14 -30 0 -44 Z`}
            fill="#F59E0B"
            stroke="#000000"
            strokeWidth="4"
            transform={`rotate(${candleFlame2} 0 -16)`}
          />
          <ellipse cx="0" cy="-24" rx="4.5" ry="8" fill="#FFFFFF" transform={`rotate(${candleFlame2} 0 -16)`} />
        </g>

        {/* Veladora Derecha 1 */}
        <g transform="translate(950, 1310)">
          <circle cx="0" cy="-28" r="48" fill="url(#flameHalo)" />
          <rect x="-24" y="-8" width="48" height="66" rx="6" fill="#F8FAFC" stroke="#000000" strokeWidth="6" />
          <rect x="-20" y="2" width="40" height="12" fill="#E2E8F0" rx="3" />
          <path d="M 0 -8 L 0 -20" stroke="#000000" strokeWidth="4" />
          <path
            d={`M 0 -48 C 16 -32 12 -18 0 -18 C -12 -18 -16 -32 0 -48 Z`}
            fill="#F97316"
            stroke="#000000"
            strokeWidth="4"
            transform={`rotate(${candleFlame3} 0 -18)`}
          />
          <ellipse cx="0" cy="-26" rx="5" ry="9" fill="#FEF08A" transform={`rotate(${candleFlame3} 0 -18)`} />
        </g>

        {/* Veladora Derecha 2 */}
        <g transform="translate(860, 1335) scale(0.82)">
          <circle cx="0" cy="-28" r="42" fill="url(#flameHalo)" />
          <rect x="-22" y="-8" width="44" height="62" rx="6" fill="#FEF3C7" stroke="#000000" strokeWidth="6" />
          <path d="M 0 -8 L 0 -18" stroke="#000000" strokeWidth="4" />
          <path
            d={`M 0 -44 C 14 -30 10 -16 0 -16 C -10 -16 -14 -30 0 -44 Z`}
            fill="#F59E0B"
            stroke="#000000"
            strokeWidth="4"
            transform={`rotate(${candleFlame1} 0 -16)`}
          />
          <ellipse cx="0" cy="-24" rx="4.5" ry="8" fill="#FFFFFF" transform={`rotate(${candleFlame1} 0 -16)`} />
        </g>

        {/* Ramos de Cempasúchil en las esquinas inferiores */}
        {[-30, 20, 60].map((ox, k) => (
          <g key={`cemp_left_${k}`} transform={`translate(${160 + ox}, 1355)`}>
            <circle cx="0" cy="0" r="22" fill="#EA580C" stroke="#000000" strokeWidth="4" />
            <circle cx="0" cy="0" r="16" fill="#F59E0B" stroke="#000000" strokeWidth="3" />
            <circle cx="0" cy="0" r="9" fill="#FDE047" />
          </g>
        ))}
        {[-40, 10, 50].map((ox, k) => (
          <g key={`cemp_right_${k}`} transform={`translate(${900 + ox}, 1355)`}>
            <circle cx="0" cy="0" r="22" fill="#EA580C" stroke="#000000" strokeWidth="4" />
            <circle cx="0" cy="0" r="16" fill="#F59E0B" stroke="#000000" strokeWidth="3" />
            <circle cx="0" cy="0" r="9" fill="#FDE047" />
          </g>
        ))}

        {/* =========================================================================
            PÉTALOS DE CEMPASÚCHIL FLOTANDO Y OSCILANDO CON EL VIENTO
            ========================================================================= */}
        {[
          { x: 180, yOff: 120, spd: 1.4, s: 1.1 },
          { x: 320, yOff: 620, spd: 1.2, s: 0.9 },
          { x: 480, yOff: 1040, spd: 1.6, s: 1.3 },
          { x: 620, yOff: 380, spd: 1.3, s: 0.8 },
          { x: 790, yOff: 840, spd: 1.5, s: 1.0 },
          { x: 920, yOff: 210, spd: 1.1, s: 1.2 },
          { x: 260, yOff: 1400, spd: 1.4, s: 0.85 },
          { x: 740, yOff: 1280, spd: 1.5, s: 1.15 },
        ].map((p, idx) => {
          const py = (p.yOff + f * (p.spd * 2.5)) % 1920;
          const px = p.x + Math.sin(f / 22 + idx * 1.5) * 32;
          const rot = (f * (2 + idx % 3) + idx * 45) % 360;
          return (
            <g
              key={`petal_${idx}`}
              transform={`translate(${px}, ${py}) rotate(${rot}) scale(${p.s})`}
              opacity="0.88"
            >
              <path
                d="M 0 -14 C 10 -10 12 6 0 14 C -12 6 -10 -10 0 -14 Z"
                fill="#F59E0B"
                stroke="#000000"
                strokeWidth="2.5"
              />
              <path d="M 0 -8 L 0 8" stroke="#D97706" strokeWidth="2" />
            </g>
          );
        })}
      </svg>

      {/* Viñeta cinematográfica para intensificar la atmósfera */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent ${isPrimerPlano ? 30 : 50}%, rgba(15, 5, 25, ${isPrimerPlano ? 0.75 : 0.5}) 100%)`,
        }}
      />
    </div>
  );
};

/** Espacio cosmogónico prehispánico: brújula mesoamericana proyectada en el suelo
 * ceremonial con los cuatro rumbos mexicas (Mictlampa, Huitztlampa, Tlahuiztlampa, Cihuatlampa),
 * glifos de poder y haces de luz cósmica disparándose hacia los puntos cardinales. */
const CosmogoniaPrehispanica: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const pulse = 1 + Math.sin(f / 12) * 0.05;
  const rayOpacity = 0.55 + Math.sin(f / 10) * 0.25;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#07050E]">
      {/* Fondo cósmico obsidiana profundo */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #07050E 0%, #150D24 45%, #25123A 85%, #0B0615 100%)",
        }}
      />

      <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          {/* Haces de luz cardinales */}
          <linearGradient id="rayNorth" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#991B1B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="raySouth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rayEast" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rayWest" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="compassCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#150D24" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Polvo estelar cósmico flotante */}
        {[40, 180, 360, 520, 720, 890, 1020].map((sx, idx) => {
          const sy = (idx * 270 + f * 1.8) % 1920;
          return (
            <circle
              key={`star_${idx}`}
              cx={sx}
              cy={1920 - sy}
              r={2 + (idx % 3)}
              fill="#FDE047"
              opacity={0.3 + 0.3 * Math.sin(f / 15 + idx)}
            />
          );
        })}

        {/* =========================================================================
            PROYECCIÓN EN PERSPECTIVA DE LA BRÚJULA PREHISPÁNICA EN EL SUELO
            Centro de proyección: (540, 1280)
            ========================================================================= */}
        <g transform="translate(540, 1280)">
          {/* HACES DE LUZ DIRECCIONALES DISPARADOS HACIA LOS CUATRO BORDES */}
          {/* Rayo Norte (Arriba / Mictlampa - Región de los muertos) */}
          <polygon points={`-28,0 28,0 70,-1100 -70,-1100`} fill="url(#rayNorth)" opacity={rayOpacity} />

          {/* Rayo Sur (Abajo / Huitztlampa - Región de Huitzilopochtli y colibríes) */}
          <polygon points={`-28,0 28,0 70,550 -70,550`} fill="url(#raySouth)" opacity={rayOpacity} />

          {/* Rayo Este (Derecha / Tlahuiztlampa - Salida del sol y renacimiento) */}
          <polygon points={`0,-28 0,28 550,55 550,-55`} fill="url(#rayEast)" opacity={rayOpacity} />

          {/* Rayo Oeste (Izquierda / Cihuatlampa - Ocaso de las mujeres y sabiduría) */}
          <polygon points={`0,-28 0,28 -550,55 -550,-55`} fill="url(#rayWest)" opacity={rayOpacity} />

          {/* Gran resplandor central de la encrucijada cósmica */}
          <ellipse cx="0" cy="0" rx="420" ry="210" fill="url(#compassCenterGlow)" />

          {/* Disco ceremonial exterior (estilo Piedra del Sol en perspectiva) */}
          <ellipse cx="0" cy="0" rx="420" ry="195" fill="#1C102C" stroke="#000000" strokeWidth="8" />
          <ellipse cx="0" cy="0" rx="390" ry="180" fill="none" stroke="#F59E0B" strokeWidth="6" strokeDasharray="16 10" />
          <ellipse cx="0" cy="0" rx="330" ry="150" fill="#2A1440" stroke="#000000" strokeWidth="6" />

          {/* Anillos interiores con grecas escalonadas prehispánicas */}
          <ellipse cx="0" cy="0" rx="270" ry="120" fill="none" stroke="#FDE047" strokeWidth="5" />
          <ellipse cx="0" cy="0" rx="190" ry="85" fill="#3D185E" stroke="#000000" strokeWidth="5" />
          <ellipse cx="0" cy="0" rx="110" ry="50" fill="#F59E0B" stroke="#000000" strokeWidth="6" />

          {/* Marcadores y Glifos de los 4 Rumbos del Universo */}
          {/* NORTE (Rojo/Obsidiana) */}
          <g transform="translate(0, -185)">
            <circle cx="0" cy="0" r="26" fill="#DC2626" stroke="#000000" strokeWidth="4" />
            <path d="M 0 -16 L 14 12 L -14 12 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
            <text x="0" y="38" textAnchor="middle" fill="#FCA5A5" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
              NORTE • MICTLAN
            </text>
          </g>

          {/* SUR (Azul/Celeste) */}
          <g transform="translate(0, 185)">
            <circle cx="0" cy="0" r="26" fill="#0284C7" stroke="#000000" strokeWidth="4" />
            <path d="M 0 16 L 14 -12 L -14 -12 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
            <text x="0" y="42" textAnchor="middle" fill="#7DD3FC" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
              SUR • HUITZTLAN
            </text>
          </g>

          {/* ESTE (Ámbar/Dorado) */}
          <g transform="translate(390, 0)">
            <circle cx="0" cy="0" r="26" fill="#F59E0B" stroke="#000000" strokeWidth="4" />
            <path d="M 16 0 L -12 -14 L -12 14 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
            <text x="0" y="42" textAnchor="middle" fill="#FDE68A" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
              ESTE • SOL
            </text>
          </g>

          {/* OESTE (Plata/Blanco) */}
          <g transform="translate(-390, 0)">
            <circle cx="0" cy="0" r="26" fill="#F8FAFC" stroke="#000000" strokeWidth="4" />
            <path d="M -16 0 L 12 -14 L 12 14 Z" fill="#000000" stroke="#000000" strokeWidth="2.5" />
            <text x="0" y="42" textAnchor="middle" fill="#E2E8F0" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
              OESTE • OCASO
            </text>
          </g>

          {/* Cruz sagrada central pulsante (unión de los cuatro caminos) */}
          <g transform={`scale(${pulse})`}>
            <line x1="-70" y1="0" x2="70" y2="0" stroke="#000000" strokeWidth="10" strokeLinecap="round" />
            <line x1="-70" y1="0" x2="70" y2="0" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" />
            <line x1="0" y1="-35" x2="0" y2="35" stroke="#000000" strokeWidth="10" strokeLinecap="round" />
            <line x1="0" y1="-35" x2="0" y2="35" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" />
            <circle cx="0" cy="0" r="14" fill="#EF4444" stroke="#000000" strokeWidth="4" />
          </g>
        </g>
      </svg>

      {/* Viñeta mística periférica */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 65%, transparent 35%, rgba(7, 5, 14, ${isPrimerPlano ? 0.8 : 0.6}) 100%)`,
        }}
      />
    </div>
  );
};

/** Páramo celta nocturno (Irlanda medieval): niebla volumétrica baja, ramas secas retorcidas,
 * luna gélida de Samhain, muros de piedra musgosa y fuegos fatuos errantes. */
const ParamoCeltaNiebla: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const fogDrift1 = Math.sin(f / 35) * 45;
  const fogDrift2 = Math.cos(f / 28) * 40;
  const wispPulse = 0.6 + Math.sin(f / 12) * 0.35;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#071112]">
      {/* 1. Fondo degradado noche gélida de Samhain */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #050E11 0%, #0C1E1B 35%, #152E27 70%, #0A1713 100%)",
        }}
      />

      <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="celticMoonGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#050E11" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fogBand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#94A3B8" stopOpacity="0" />
            <stop offset="30%" stopColor="#CBD5E1" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#94A3B8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="wispGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0C1E1B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Luna gélida en cuarto creciente con halo verdoso */}
        <g transform="translate(860, 260)">
          <circle cx="0" cy="0" r="70" fill="url(#celticMoonGlow)" />
          <path
            d="M 30 -35 A 48 48 0 0 1 30 35 A 38 38 0 0 0 30 -35 Z"
            fill="#E2E8F0"
            stroke="#000000"
            strokeWidth="3.5"
          />
        </g>

        {/* Capa 1: Siluetas lejanas de robles centenarios retorcidos */}
        <g opacity="0.65">
          <path
            d="M 0 1280 L 80 880 L 120 740 L 90 620 L 140 680 L 180 580 L 210 690 L 260 880 L 320 1280 Z"
            fill="#061214"
            stroke="#000000"
            strokeWidth="4"
          />
          <path
            d="M 760 1280 L 820 920 L 860 760 L 910 650 L 950 780 L 1020 620 L 1050 790 L 1080 940 L 1080 1280 Z"
            fill="#061214"
            stroke="#000000"
            strokeWidth="4"
          />
        </g>

        {/* Capa 2: Muros de piedra celta y cabaña en silueta */}
        <g transform="translate(0, 1260)">
          {/* Suelo pantanoso de turba */}
          <rect x="0" y="0" width="1080" height="660" fill="#0A1813" stroke="#000000" strokeWidth="8" />

          {/* Muro bajo de piedras apiladas tradicional irlandés */}
          {[0, 160, 320, 480, 640, 800, 960].map((mx, idx) => (
            <g key={`stone_${idx}`} transform={`translate(${mx}, -30)`}>
              <rect x="0" y="0" width="85" height="34" rx="6" fill="#1E2E28" stroke="#000000" strokeWidth="4" />
              <rect x="75" y="4" width="85" height="30" rx="5" fill="#14231E" stroke="#000000" strokeWidth="4" />
            </g>
          ))}
        </g>

        {/* Niebla volumétrica flotante en capas deslizantes */}
        <g transform={`translate(${fogDrift1}, 1180)`}>
          <ellipse cx="340" cy="40" rx="460" ry="60" fill="url(#fogBand)" />
        </g>
        <g transform={`translate(${fogDrift2}, 1320)`}>
          <ellipse cx="720" cy="50" rx="520" ry="75" fill="url(#fogBand)" />
        </g>

        {/* Fuegos fatuos (luces errantes fantasmales verdes/ámbar) */}
        {[
          { x: 220, y: 1040, s: 1.1 },
          { x: 540, y: 920, s: 0.8 },
          { x: 880, y: 1120, s: 1.2 },
        ].map((w, idx) => {
          const bob = Math.sin(f / 16 + idx * 2) * 18;
          return (
            <g key={`wisp_${idx}`} transform={`translate(${w.x} ${w.y + bob}) scale(${w.s * wispPulse})`}>
              <circle cx="0" cy="0" r="32" fill="url(#wispGlow)" />
              <circle cx="0" cy="0" r="7" fill="#FFFFFF" opacity="0.95" />
            </g>
          );
        })}
      </svg>

      {/* Viñeta de misterio */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 55%, transparent ${isPrimerPlano ? 30 : 50}%, rgba(3, 8, 10, ${isPrimerPlano ? 0.85 : 0.65}) 100%)`,
        }}
      />
    </div>
  );
};

/** Umbral Místico: Cielo arriba (puertas doradas con candado de RECHAZADO)
 * e Infierno abajo (caverna con rejas de hierro ardiente y lava). */
const UmbralCieloInfierno: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const lavaPulse = Math.sin(f / 10) * 0.2;
  const cloudDrift = Math.sin(f / 25) * 20;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A0505]">
      {/* Mitad superior: Cielo divino dorado-azul */}
      <div
        className="absolute top-0 left-0 right-0 h-[960px]"
        style={{
          background: "linear-gradient(180deg, #0284C7 0%, #38BDF8 40%, #FEF08A 85%, #CBD5E1 100%)",
          borderBottom: "8px solid #000000",
        }}
      />

      {/* Mitad inferior: Infierno volcánico ardiente */}
      <div
        className="absolute top-[960px] left-0 right-0 bottom-0"
        style={{
          background: "linear-gradient(180deg, #1C0505 0%, #450A0A 40%, #7F1D1D 80%, #991B1B 100%)",
        }}
      />

      <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {/* =========================================================================
            PARTE SUPERIOR: PUERTAS CELESTIALES CON CANDADO DE RECHAZADO
            ========================================================================= */}
        {/* Nubes celestiales */}
        <g transform={`translate(${cloudDrift}, 0)`}>
          <ellipse cx="320" cy="480" rx="180" ry="60" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />
          <ellipse cx="760" cy="490" rx="210" ry="70" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />
          <ellipse cx="540" cy="520" rx="260" ry="80" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
        </g>

        {/* Puertas doradas del Cielo */}
        <g transform="translate(540, 320)">
          {/* Arco celestial */}
          <path
            d="M -160 180 L -160 0 A 160 160 0 0 1 160 0 L 160 180 Z"
            fill="#FEF08A"
            stroke="#000000"
            strokeWidth="8"
          />
          {/* Rejas doradas */}
          {[-100, -50, 0, 50, 100].map((gx) => (
            <line key={`gate_${gx}`} x1={gx} y1="-80" x2={gx} y2="180" stroke="#EAB308" strokeWidth="6" />
          ))}

          {/* Gran candado de RECHAZADO */}
          <g transform="translate(0, 70)">
            <rect x="-65" y="-15" width="130" height="95" rx="14" fill="#DC2626" stroke="#000000" strokeWidth="7" />
            <path
              d="M -35 -15 L -35 -55 A 35 35 0 0 1 35 -55 L 35 -15"
              fill="none"
              stroke="#000000"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <circle cx="0" cy="22" r="10" fill="#000000" />
            <line x1="0" y1="22" x2="0" y2="45" stroke="#000000" strokeWidth="6" strokeLinecap="round" />

            <rect x="-90" y="85" width="180" height="34" rx="6" fill="#000000" stroke="#FFFFFF" strokeWidth="3" />
            <text x="0" y="108" font-family="'Arial Black', sans-serif" font-size="16" font-weight="900" fill="#EF4444" text-anchor="middle">
              RECHAZADO
            </text>
          </g>
        </g>

        {/* =========================================================================
            PARTE INFERIOR: REJAS DEL INFIERNO CON FUEGO Y LAVA
            ========================================================================= */}
        {/* Rejas de hierro forjado del infierno */}
        <g transform="translate(540, 1420)">
          <rect x="-240" y="-180" width="480" height="360" fill="#1A0505" stroke="#000000" strokeWidth="8" />
          {[-180, -120, -60, 0, 60, 120, 180].map((bx) => (
            <line key={`iron_${bx}`} x1={bx} y1="-180" x2={bx} y2="180" stroke="#000000" strokeWidth="10" />
          ))}
          <line x1="-240" y1="-40" x2="240" y2="-40" stroke="#000000" strokeWidth="10" />
          <line x1="-240" y1="60" x2="240" y2="60" stroke="#000000" strokeWidth="10" />

          {/* Llamas de lava brotando */}
          <path
            d="M -220 180 Q -180 80 -140 180 Q -90 60 -40 180 Q 20 40 80 180 Q 140 70 200 180 Z"
            fill="#F97316"
            stroke="#000000"
            strokeWidth="5"
            opacity={0.85 + lavaPulse}
          />
        </g>
      </svg>
    </div>
  );
};

/** Laboratorio de Balística e Impacto: Fondo oscuro de alta tecnología para pruebas extremas,
 * con cono de foco cenital, banco de acero blindado con franja de advertencia, cuadrícula técnica y partículas en suspensión. */
const LaboratorioBalistica: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const strobePulse = 0.8 + Math.sin(f / 10) * 0.2;
  const beamSwing = Math.sin(f / 35) * 12;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#070B14]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="balisticaFondo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="55%" stopColor="#070B14" />
            <stop offset="100%" stopColor="#020408" />
          </linearGradient>
          <radialGradient id="spotlightCone" cx="50%" cy="0%" r="85%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32" />
            <stop offset="45%" stopColor="#0284C7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#070B14" stopOpacity="0" />
          </radialGradient>
          <pattern id="gridBalistica" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1E293B" strokeWidth="1.5" strokeOpacity="0.45" />
            <circle cx="60" cy="60" r="1.5" fill="#38BDF8" fillOpacity="0.4" />
          </pattern>
          <pattern id="hazardStripes" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="20" height="40" fill="#FACC15" />
            <rect x="20" width="20" height="40" fill="#0F172A" />
          </pattern>
        </defs>

        {/* 1. Fondo gradiente técnico */}
        <rect width="1080" height="1920" fill="url(#balisticaFondo)" />
        <rect width="1080" height="1420" fill="url(#gridBalistica)" opacity="0.7" />

        {/* 2. Haz cenital de luz de alta intensidad */}
        <path
          d={`M 460 0 L 620 0 L ${780 + beamSwing} 1420 L ${300 + beamSwing} 1420 Z`}
          fill="url(#spotlightCone)"
        />

        {/* 3. Marcadores técnicos de telemetría militar/científica */}
        <g opacity="0.6">
          <line x1="80" y1="360" x2="1000" y2="360" stroke="#38BDF8" strokeWidth="2" strokeDasharray="8 6" />
          <text x="90" y="345" fill="#38BDF8" fontSize="20" fontFamily="'Courier New', monospace" fontWeight="bold">
            01 // IMPACT DYNAMICS & BALLISTICS LAB · 5,000 FPS HIGH-SPEED RIG
          </text>
          <text x="90" y="390" fill="#94A3B8" fontSize="16" fontFamily="'Courier New', monospace">
            TARGET: PRINCE RUPERT DROP · STATUS: COMPRESSION ARMORED
          </text>
        </g>

        {/* 4. Banco de pruebas industrial de acero pesado */}
        <g transform="translate(0, 1380)">
          {/* Sombra de profundidad bajo la mesa */}
          <rect x="0" y="40" width="1080" height="500" fill="#020408" />
          {/* Cara frontal metálica */}
          <rect x="0" y="0" width="1080" height="40" fill="#334155" stroke="#000000" strokeWidth="6" />
          {/* Franja de advertencia Hazard (amarillo y negro) */}
          <rect x="0" y="10" width="1080" height="20" fill="url(#hazardStripes)" stroke="#000000" strokeWidth="3" />
          {/* Remaches de acero en la base */}
          {[120, 260, 400, 540, 680, 820, 960].map((rx) => (
            <circle key={`rivet_${rx}`} cx={rx} cy="30" r="4.5" fill="#94A3B8" stroke="#000000" strokeWidth="2" />
          ))}
          {/* Suelo base */}
          <rect x="0" y="40" width="1080" height="500" fill="#0F172A" stroke="#000000" strokeWidth="8" />
          {/* Rejillas de ventilación de impacto */}
          {[160, 360, 560, 760, 960].map((gx) => (
            <g key={`vent_${gx}`} transform={`translate(${gx - 60}, 100)`}>
              <rect width="120" height="240" rx="8" fill="#020617" stroke="#000000" strokeWidth="4" />
              {[30, 60, 90, 120, 150, 180, 210].map((ly) => (
                <line key={`vslit_${ly}`} x1="15" y1={ly} x2="105" y2={ly} stroke="#1E293B" strokeWidth="4" />
              ))}
            </g>
          ))}
        </g>

        {/* 5. Luces estroboscópicas de sensores en el fondo */}
        <circle cx="160" cy="460" r="10" fill="#22C55E" opacity={strobePulse} />
        <circle cx="200" cy="460" r="10" fill="#EF4444" opacity={1 - (strobePulse - 0.8) * 4} />
        <circle cx="920" cy="460" r="12" fill="#38BDF8" opacity={strobePulse} />

        {/* 6. Partículas de polvo en el haz de luz */}
        {[...Array(14)].map((_, i) => {
          const px = 340 + rnd(i * 3) * 400 + Math.sin(f / 20 + i) * 15;
          const py = 200 + ((rnd(i * 7) * 1100 + f * (0.8 + rnd(i) * 0.5)) % 1100);
          const pr = 2 + rnd(i * 5) * 3;
          return <circle key={`dust_${i}`} cx={px} cy={py} r={pr} fill="#BAE6FD" opacity={0.45} />;
        })}
      </svg>
    </div>
  );
};

/** Diagrama Térmico y Molecular de la Gota de Rupert:
 * Gráfico técnico con gradiente térmico de enfriamiento diferencial,
 * vectores centrípetos de compresión, anillos de tensión e isobaras de presión. */
const DiagramaTermicoRupert: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const pulse = Math.sin(f / 8) * 0.15;
  const rot = (f * 0.5) % 360;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <radialGradient id="termicoCentro" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#0284C7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>
          <pattern id="hexGrid" width="60" height="104" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 60 17.3 L 60 52 L 30 69.3 L 0 52 L 0 17.3 Z M 30 104 L 60 86.7 L 60 52 L 30 69.3 L 0 52 L 0 86.7 Z"
              fill="none"
              stroke="#1E293B"
              strokeWidth="1.2"
              strokeOpacity="0.35"
            />
          </pattern>
        </defs>

        {/* 1. Malla hexagonal molecular de fondo */}
        <rect width="1080" height="1920" fill="url(#hexGrid)" />

        {/* 2. Resplandor térmico radial (Núcleo ardiente -> Escudo gélido exterior) */}
        <circle cx="540" cy="960" r="580" fill="url(#termicoCentro)" />

        {/* 3. Anillos concéntricos de isobaras de presión molecular */}
        {[220, 320, 420, 520].map((radius, idx) => (
          <circle
            key={`isobara_${idx}`}
            cx="540"
            cy="960"
            r={radius + (idx % 2 === 0 ? pulse * 20 : -pulse * 20)}
            fill="none"
            stroke={idx === 0 ? "#EF4444" : idx === 1 ? "#F59E0B" : "#38BDF8"}
            strokeWidth="3"
            strokeDasharray={idx === 0 ? "none" : "8 8"}
            strokeOpacity={0.7}
          />
        ))}

        {/* 4. Vectores radiales de compresión centrípeta (flechas apuntando hacia el centro) */}
        <g transform={`translate(540, 960) rotate(${rot})`}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <g key={`arrow_${angle}`} transform={`rotate(${angle})`}>
              <line x1="0" y1="-460" x2="0" y2="-280" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
              <polygon points="0,-260 -14,-290 14,-290" fill="#38BDF8" />
            </g>
          ))}
        </g>

        {/* 5. Cajas de telemetría y datos cinéticos */}
        <g transform="translate(100, 380)">
          <rect width="400" height="80" rx="10" fill="#0B132B" stroke="#000000" strokeWidth="5" />
          <text x="20" y="34" fill="#38BDF8" fontSize="20" fontFamily="'Courier New', monospace" fontWeight="bold">
            EXTERIOR: ~700 MPa
          </text>
          <text x="20" y="62" fill="#BAE6FD" fontSize="16" fontFamily="'Courier New', monospace">
            COMPRESIÓN BRUTAL (CONGELADO)
          </text>
        </g>

        <g transform="translate(580, 380)">
          <rect width="400" height="80" rx="10" fill="#1C0505" stroke="#000000" strokeWidth="5" />
          <text x="20" y="34" fill="#EF4444" fontSize="20" fontFamily="'Courier New', monospace" fontWeight="bold">
            NÚCLEO: TENSIÓN CRÍTICA
          </text>
          <text x="20" y="62" fill="#FECACA" fontSize="16" fontFamily="'Courier New', monospace">
            ENERGÍA MECÁNICA ATRAPADA
          </text>
        </g>
      </svg>
    </div>
  );
};

/** Laboratorio en Penumbra: Espacio experimental oscuro de física acústica,
 * con mesa de trabajo pulida, haz cenital tenue, osciloscopio activo con onda verde y pulsos lumínicos. */
const LaboratorioPenumbra: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const pulse = Math.sin(f / 12) * 0.15;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="penumbraFondo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1329" />
            <stop offset="50%" stopColor="#030712" />
            <stop offset="100%" stopColor="#02040A" />
          </linearGradient>
          <radialGradient id="haloPenumbra" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#0284C7" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#penumbraFondo)" />
        <circle cx="540" cy="800" r="640" fill="url(#haloPenumbra)" />

        {/* Pantalla de osciloscopio en el fondo con onda senoidal viva */}
        <g transform="translate(100, 360)">
          <rect width="280" height="140" rx="10" fill="#020617" stroke="#1E293B" strokeWidth="4" />
          <rect x="15" y="15" width="250" height="110" rx="6" fill="#052E16" stroke="#16A34A" strokeWidth="2" />
          <line x1="15" y1="70" x2="265" y2="70" stroke="#166534" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="140" y1="15" x2="140" y2="125" stroke="#166534" strokeWidth="1.5" strokeDasharray="4 4" />
          <path
            d={`M 20 70 Q 50 ${70 - 35 * Math.sin(f / 6)} 80 70 Q 110 ${70 + 35 * Math.sin(f / 6)} 140 70 Q 170 ${70 - 35 * Math.sin(f / 6)} 200 70 Q 230 ${70 + 35 * Math.sin(f / 6)} 260 70`}
            fill="none"
            stroke="#22C55E"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <text x="25" y="35" fill="#4ADE80" fontSize="12" fontFamily="'Courier New', monospace" fontWeight="bold">
            28.4 kHz ACTIVE
          </text>
        </g>

        {/* Generador de RF en el otro extremo */}
        <g transform="translate(700, 360)">
          <rect width="280" height="140" rx="10" fill="#020617" stroke="#1E293B" strokeWidth="4" />
          <circle cx="70" cy="70" r="30" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
          <line x1="70" y1="70" x2={70 + 20 * Math.cos(f / 15)} y2={70 + 20 * Math.sin(f / 15)} stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
          <text x="130" y="60" fill="#38BDF8" fontSize="16" fontFamily="'Courier New', monospace" fontWeight="bold">
            ACOUSTIC LEV
          </text>
          <text x="130" y="90" fill="#94A3B8" fontSize="14" fontFamily="'Courier New', monospace">
            TRAP: LOCKED
          </text>
        </g>

        {/* Mesa de laboratorio de física pulida */}
        <g transform="translate(0, 1380)">
          <rect x="0" y="0" width="1080" height="30" fill="#1E293B" stroke="#000000" strokeWidth="6" />
          <line x1="0" y1="6" x2="1080" y2="6" stroke="#38BDF8" strokeWidth="2" opacity="0.4" />
          <rect x="0" y="30" width="1080" height="510" fill="#090D16" stroke="#000000" strokeWidth="8" />
        </g>

        {/* Partículas suspendidas sutiles */}
        {[...Array(12)].map((_, i) => {
          const px = 200 + rnd(i * 4) * 680 + Math.sin(f / 25 + i) * 12;
          const py = 400 + ((rnd(i * 9) * 900 + f * 0.7) % 900);
          return <circle key={`pt_${i}`} cx={px} cy={py} r={2.5 + rnd(i) * 2} fill="#38BDF8" opacity={0.35 + pulse} />;
        })}
      </svg>
    </div>
  );
};

/** Microcosmos Acuático: Medio líquido subacuático profundo con ondas de presión estacionarias,
 * turbulencia de cavitación, microburbujas y gradientes ópticos de refracción. */
const MicrocosmosAcuatico: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const acousticPulse = Math.sin(f / 6) * 0.2;
  const causticsWave = Math.sin(f / 20) * 18;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020B1C]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="aguaProfunda" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0369A1" />
            <stop offset="35%" stopColor="#075985" />
            <stop offset="70%" stopColor="#082F49" />
            <stop offset="100%" stopColor="#020B1C" />
          </linearGradient>
          <radialGradient id="plasmaGlowMicro" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#0284C7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#020B1C" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#aguaProfunda)" />

        <g opacity="0.35" transform={`translate(${causticsWave}, 0)`}>
          <path d="M 0 200 Q 270 340 540 220 Q 810 100 1080 260 L 1080 0 L 0 0 Z" fill="#BAE6FD" />
          <path d="M 0 500 Q 300 380 600 520 Q 900 660 1080 480 L 1080 320 L 0 320 Z" fill="#7DD3FC" opacity="0.5" />
        </g>

        {[200, 320, 460, 620].map((r, idx) => (
          <circle
            key={`standing_ring_${idx}`}
            cx="540"
            cy="960"
            r={r + (idx % 2 === 0 ? acousticPulse * 30 : -acousticPulse * 30)}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeDasharray="12 8"
            opacity={0.65 - idx * 0.12}
          />
        ))}

        <circle cx="540" cy="960" r="480" fill="url(#plasmaGlowMicro)" />

        {[...Array(18)].map((_, i) => {
          const bx = 120 + rnd(i * 7) * 840;
          const by = 200 + ((rnd(i * 13) * 1500 - f * 1.4) % 1500 + 1500) % 1500;
          const br = 4 + rnd(i * 3) * 6;
          return (
            <g key={`mbub_${i}`} transform={`translate(${bx}, ${by})`}>
              <circle cx="0" cy="0" r={br} fill="#E0F2FE" fillOpacity="0.45" stroke="#38BDF8" strokeWidth="2" />
              <circle cx={-br * 0.3} cy={-br * 0.3} r={br * 0.25} fill="#FFFFFF" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/** Desierto Polar Antártico: Llanura infinita de hielo, cordillera glacial lejana, ventisca horizontal
 * y perforación cilíndrica de hielo en el centro. */
const DesiertoPolarAntartico: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const windOffset = (f * 18) % 1400;
  const pulse = (Math.sin(f / 6) + 1) * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0369A1]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cieloPolar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="45%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#F0F9FF" />
          </linearGradient>
          <linearGradient id="hieloSuperficie" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="35%" stopColor="#F8FAFC" />
            <stop offset="70%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <radialGradient id="pozoAbismoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#0284C7" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#0369A1" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Cielo polar antártico */}
        <rect width="1080" height="1100" fill="url(#cieloPolar)" />

        {/* Sol polar pálido / halo solar */}
        <circle cx="860" cy="380" r="140" fill="#FFFFFF" opacity="0.3" />
        <circle cx="860" cy="380" r="70" fill="#FFFFFF" opacity="0.8" />

        {/* Cordillera de glaciares lejanos */}
        <polygon points="0,960 120,820 280,910 460,780 620,890 820,760 980,870 1080,800 1080,1100 0,1100" fill="#BAE6FD" opacity="0.75" />
        <polygon points="60,980 220,870 380,940 540,840 720,930 920,830 1080,910 1080,1120 0,1120" fill="#E0F2FE" />

        {/* Capa de hielo y nieve antártica */}
        <rect y="1050" width="1080" height="870" fill="url(#hieloSuperficie)" />
        <line x1="0" y1="1050" x2="1080" y2="1050" stroke="#0284C7" strokeWidth="6" />

        {/* Grietas y sombras de dunas de hielo */}
        <path d="M 0 1180 Q 320 1220 640 1190 T 1080 1210" stroke="#94A3B8" strokeWidth="4" fill="none" opacity="0.4" />
        <path d="M 0 1340 Q 420 1310 800 1360 T 1080 1330" stroke="#94A3B8" strokeWidth="4" fill="none" opacity="0.4" />

        {/* El orificio de perforación cilíndrico en el hielo */}
        <g transform="translate(540, 1420)">
          {/* Resplandor del pozo */}
          <ellipse cx="0" cy="0" rx="210" ry="85" fill="url(#pozoAbismoGlow)" />
          {/* Borde exterior de hielo congelado */}
          <ellipse cx="0" cy="0" rx="160" ry="60" fill="#BAE6FD" stroke="#0284C7" strokeWidth="8" />
          {/* Profundidad abisal del orificio */}
          <ellipse cx="0" cy="0" rx="138" ry="48" fill="#020617" stroke="#000000" strokeWidth="6" />
          {/* Rayo sónico estilizado emergente */}
          <path d={`M -30 0 L 0 -420 L 30 0 Z`} fill="#38BDF8" opacity={0.25 + pulse * 0.35} />
          <ellipse cx="0" cy="0" rx="90" ry="30" fill="#0C4A6E" />
          <ellipse cx="0" cy="0" rx="55" ry="18" fill="#38BDF8" opacity={0.4 + pulse * 0.4} />
        </g>

        {/* Ventisca horizontal de nieve */}
        {[...Array(24)].map((_, i) => {
          const vx = ((rnd(i * 5) * 1400 - windOffset) % 1400 + 1400) % 1400 - 160;
          const vy = 200 + rnd(i * 11) * 1400 + Math.sin(f / 10 + i) * 15;
          const vlen = 35 + rnd(i * 3) * 45;
          return (
            <line
              key={`snow_${i}`}
              x1={vx}
              y1={vy}
              x2={vx + vlen}
              y2={vy + 4}
              stroke="#FFFFFF"
              strokeWidth={2.5 + (i % 3)}
              strokeLinecap="round"
              opacity={0.4 + rnd(i) * 0.45}
            />
          );
        })}
      </svg>
    </div>
  );
};

/** Corte Glaciar Antártico: Sección transversal vertical esquemática de 90 metros de hielo,
 * con regla milimétrica de profundidad y tubo de perforación vertical. */
const CorteGlaciarAntartico: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const reelSpin = (f * 14) % 100;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#031E38]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="estratosHielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="20%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#0369A1" />
            <stop offset="75%" stopColor="#075985" />
            <stop offset="100%" stopColor="#082F49" />
          </linearGradient>
          <linearGradient id="tuboPozoGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="30%" stopColor="#0F172A" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        {/* Superficie antártica en los primeros 220px */}
        <rect width="1080" height="220" fill="#E0F2FE" />
        <line x1="0" y1="220" x2="1080" y2="220" stroke="#000000" strokeWidth="8" />

        {/* Masa colosal de hielo glacial (de 220px a 1920px = 90 metros) */}
        <rect y="220" width="1080" height="1700" fill="url(#estratosHielo)" />

        {/* Estratos geológicos de hielo antiguo (franjas de compresión) */}
        {[380, 560, 780, 1040, 1320, 1600].map((y, idx) => (
          <g key={`estrato_${idx}`}>
            <line x1="0" y1={y} x2="1080" y2={y} stroke="#BAE6FD" strokeWidth="3" opacity="0.3" strokeDasharray="16 8" />
            <line x1="0" y1={y + 12} x2="1080" y2={y + 12} stroke="#020617" strokeWidth="2" opacity="0.25" />
          </g>
        ))}

        {/* Tubo cilíndrico de perforación vertical (guía de ondas de 90m) */}
        <g transform="translate(540, 0)">
          <rect x="-35" y="220" width="70" height="1660" fill="url(#tuboPozoGrad)" stroke="#000000" strokeWidth="6" />
          {/* Núcleo de eco de sonido en el tubo */}
          <line x1="0" y1="220" x2="0" y2="1880" stroke="#38BDF8" strokeWidth="4" strokeDasharray="12 12" opacity="0.75" />
          {/* Fondo del pozo (90m de profundidad) */}
          <rect x="-42" y="1876" width="84" height="24" rx="6" fill="#FACC15" stroke="#000000" strokeWidth="5" />
        </g>

        {/* Regla científica de medición de profundidad (Lado izquierdo) */}
        <g transform="translate(60, 260)">
          <rect width="200" height="1580" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" opacity="0.9" />
          {/* Marcas de profundidad */}
          {[
            { m: "0 m", y: 30, color: "#FFFFFF" },
            { m: "15 m", y: 280, color: "#93C5FD" },
            { m: "30 m", y: 540, color: "#60A5FA" },
            { m: "45 m", y: 800, color: "#3B82F6" },
            { m: "60 m", y: 1060, color: "#2563EB" },
            { m: "75 m", y: 1320, color: "#1D4ED8" },
            { m: "90 m", y: 1540, color: "#FACC15" },
          ].map((mark, i) => (
            <g key={`mark_${i}`} transform={`translate(0, ${mark.y})`}>
              <line x1="10" y1="0" x2="45" y2="0" stroke={mark.color} strokeWidth="4" />
              <text x="60" y="7" fill={mark.color} fontSize="24" fontFamily="'Courier New', monospace" fontWeight="bold">
                {mark.m}
              </text>
            </g>
          ))}
        </g>

        {/* Ficha técnica estilo expediente polar (Lado derecho) */}
        <g transform="translate(760, 260)">
          <rect width="260" height="180" rx="10" fill="#020617" stroke="#38BDF8" strokeWidth="4" opacity="0.9" />
          <text x="20" y="40" fill="#38BDF8" fontSize="18" fontFamily="'Courier New', monospace" fontWeight="bold">
            ICE BOREHOLE
          </text>
          <text x="20" y="75" fill="#FFFFFF" fontSize="16" fontFamily="'Courier New', monospace">
            PROFUNDIDAD: 90 M
          </text>
          <text x="20" y="105" fill="#94A3B8" fontSize="14" fontFamily="'Courier New', monospace">
            DIÁMETRO: 25 CM
          </text>
          <text x="20" y="135" fill="#FACC15" fontSize="14" fontFamily="'Courier New', monospace" fontWeight="bold">
            ACÚSTICA: CILINDRICA
          </text>
        </g>
      </svg>
    </div>
  );
};

/** Llanura Antártica con Pozo: Escenario dinámico de experimentación con ondas sonoras
 * que brotan rítmicamente en compás musical. */
const LlanuraAntarticaPozo: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const pulseA = (Math.sin(f / 4) + 1) * 0.5;
  const pulseB = (Math.sin(f / 7 + 1.2) + 1) * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0284C7]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cieloLlanura" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0369A1" />
            <stop offset="60%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>
        </defs>

        <rect width="1080" height="1100" fill="url(#cieloLlanura)" />
        <rect y="1050" width="1080" height="870" fill="#F8FAFC" />
        <line x1="0" y1="1050" x2="1080" y2="1050" stroke="#000000" strokeWidth="7" />

        {/* Anillos de ondas sonoras rítmicas saliendo del orificio */}
        {[80, 160, 260, 380].map((radius, idx) => (
          <ellipse
            key={`rhythm_wave_${idx}`}
            cx="540"
            cy="1420"
            rx={radius + pulseA * 30}
            ry={(radius + pulseA * 30) * 0.38}
            fill="none"
            stroke={idx % 2 === 0 ? "#38BDF8" : "#A855F7"}
            strokeWidth="5"
            strokeDasharray="14 10"
            opacity={0.7 - idx * 0.15}
          />
        ))}

        {/* Orificio central */}
        <g transform="translate(540, 1420)">
          <ellipse cx="0" cy="0" rx="160" ry="60" fill="#BAE6FD" stroke="#000000" strokeWidth="7" />
          <ellipse cx="0" cy="0" rx="135" ry="46" fill="#020617" stroke="#0284C7" strokeWidth="5" />
          {/* Destellos de disparo láser al compás */}
          <line x1="-30" y1="0" x2="-80" y2={-200 - pulseB * 80} stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" opacity={0.8} />
          <line x1="0" y1="0" x2="0" y2={-260 - pulseA * 100} stroke="#A855F7" strokeWidth="8" strokeLinecap="round" opacity={0.9} />
          <line x1="30" y1="0" x2="80" y2={-200 - pulseB * 80} stroke="#FACC15" strokeWidth="6" strokeLinecap="round" opacity={0.8} />
        </g>
      </svg>
    </div>
  );
};

/** Interior Guía de Ondas de Hielo: Perspectiva cilíndrica profunda mirando hacia el fondo del pozo,
 * con anillos concéntricos de hielo comprimido y choque molecular en el fondo. */
const InteriorGuiaOndasHielo: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const tunnelPulse = Math.sin(f / 5) * 15;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <radialGradient id="hieloCilindricoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#0284C7" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#082F49" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="#030E1F" />

        {/* Anillos de perspectiva del cilindro de hielo hacia el fondo */}
        {[100, 180, 280, 400, 540, 700].map((r, i) => (
          <ellipse
            key={`tunnel_ring_${i}`}
            cx="540"
            cy="960"
            rx={r + tunnelPulse * (i * 0.2)}
            ry={r * 1.35 + tunnelPulse * (i * 0.2)}
            fill="none"
            stroke={i % 2 === 0 ? "#38BDF8" : "#0284C7"}
            strokeWidth={4 + i * 1.5}
            opacity={0.3 + (i / 6) * 0.55}
          />
        ))}

        {/* Líneas de fuga longitudinales del tubo de hielo */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
          const rad = (ang * Math.PI) / 180;
          const x2 = 540 + Math.cos(rad) * 900;
          const y2 = 960 + Math.sin(rad) * 1200;
          return <line key={`line_fuga_${i}`} x1="540" y1="960" x2={x2} y2={y2} stroke="#7DD3FC" strokeWidth="3" opacity="0.4" />;
        })}

        {/* Centro abisal del pozo */}
        <ellipse cx="540" cy="960" rx="90" ry="120" fill="url(#hieloCilindricoGlow)" />
        <ellipse cx="540" cy="960" rx="55" ry="75" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
      </svg>
    </div>
  );
};

/** Carrera de Ondas por Dispersión: Visualización técnica de la separación de frecuencias en el tubo.
 * Las frecuencias agudas (violetas) van en línea recta y llegan primero;
 * las frecuencias graves (rojas) rebotan y se retrasan. */
const CarreraOndasDispersion: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const fastWaveY = ((f * 14) % 1500);
  const slowWaveY = ((f * 6) % 1500);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#030A16]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        {/* Cuadrícula de laboratorio acústico */}
        <defs>
          <pattern id="gridAcustica" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1E293B" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#gridAcustica)" />

        {/* El tubo de hielo central (guía de ondas) */}
        <g transform="translate(540, 0)">
          <rect x="-180" y="100" width="360" height="1720" rx="16" fill="#07172C" stroke="#38BDF8" strokeWidth="6" />

          {/* ONDA AGUDA (ALTA FRECUENCIA - VIOLETA/CYAN) -> VIAJA RÁPIDO Y DIRECTO */}
          <g transform={`translate(0, ${1700 - fastWaveY})`}>
            <circle cx="0" cy="0" r="140" fill="#A855F7" opacity="0.25" />
            <path
              d="M -150 0 Q -75 -40 0 0 Q 75 40 150 0"
              fill="none"
              stroke="#C084FC"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <rect x="-120" y="-55" width="240" height="34" rx="6" fill="#020617" stroke="#C084FC" strokeWidth="3" />
            <text x="0" y="-32" textAnchor="middle" fill="#C084FC" fontSize="16" fontFamily="'Courier New', monospace" fontWeight="bold">
              AGUDAS: LLEGAN 1° (PEW)
            </text>
          </g>

          {/* ONDA GRAVE (BAJA FRECUENCIA - ROJA/NARANJA) -> REBOTA Y SE RETRASA */}
          <g transform={`translate(0, ${1700 - slowWaveY})`}>
            <circle cx="0" cy="0" r="150" fill="#EF4444" opacity="0.25" />
            <path
              d="M -150 0 C -75 80 75 -80 150 0"
              fill="none"
              stroke="#F87171"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <rect x="-120" y="30" width="240" height="34" rx="6" fill="#020617" stroke="#F87171" strokeWidth="3" />
            <text x="0" y="53" textAnchor="middle" fill="#F87171" fontSize="16" fontFamily="'Courier New', monospace" fontWeight="bold">
              GRAVES: RETRASADAS (TSCH)
            </text>
          </g>
        </g>

        {/* Panel lateral de telemetría */}
        <g transform="translate(40, 240)">
          <rect width="280" height="200" rx="10" fill="#020617" stroke="#38BDF8" strokeWidth="4" />
          <text x="20" y="45" fill="#38BDF8" fontSize="18" fontFamily="'Courier New', monospace" fontWeight="bold">
            GUÍA DE ONDAS
          </text>
          <text x="20" y="85" fill="#C084FC" fontSize="16" fontFamily="'Courier New', monospace">
            f &gt; 3.0 kHz: V_fase ↑
          </text>
          <text x="20" y="125" fill="#F87171" fontSize="16" fontFamily="'Courier New', monospace">
            f &lt; 500 Hz: V_grupo ↓
          </text>
          <text x="20" y="165" fill="#FACC15" fontSize="15" fontFamily="'Courier New', monospace" fontWeight="bold">
            Δt = RETRASO TEMPORAL
          </text>
        </g>
      </svg>
    </div>
  );
};

/** Laboratorio Antártico / Closeup Acústico: Diagrama de recepción auditiva humana
 * y osciloscopio que descompone el silbido láser. */
const LaboratorioAntartico: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A1128]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        {/* Fondo tenue */}
        <rect width="1080" height="1920" fill="#0A1128" />

        {/* Gran osciloscopio de espectrograma en fondo */}
        <g transform="translate(140, 260)">
          <rect width="800" height="420" rx="16" fill="#020617" stroke="#38BDF8" strokeWidth="6" />
          <text x="40" y="60" fill="#38BDF8" fontSize="22" fontFamily="'Courier New', monospace" fontWeight="bold">
            ESPECTROGRAMA DISPERSIÓN ACÚSTICA
          </text>
          {/* Curva hiperbólica descendente del eco láser (Chirp) */}
          <path
            d="M 60 120 C 180 140 380 260 740 360"
            fill="none"
            stroke="#FACC15"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <text x="70" y="105" fill="#C084FC" fontSize="18" fontFamily="'Courier New', monospace" fontWeight="bold">
            AGUDO (Inicio)
          </text>
          <text x="640" y="340" fill="#F87171" fontSize="18" fontFamily="'Courier New', monospace" fontWeight="bold">
            GRAVE (Final)
          </text>
        </g>

        {/* Mesa de investigación polar */}
        <rect y="1450" width="1080" height="470" fill="#0F172A" stroke="#000000" strokeWidth="8" />
      </svg>
    </div>
  );
};

/** Atardecer Polar Despedida: Sol bajo naranja sobre el horizonte polar, nieve con sombras violetas,
 * y un haz láser colosal emergiendo del pozo hacia el infinito. */
const AtardecerPolarDespedida: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const beamPulse = (Math.sin(f / 5) + 1) * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#1E1B4B]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cieloAtardecerPolar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="35%" stopColor="#4C1D95" />
            <stop offset="65%" stopColor="#BE185D" />
            <stop offset="85%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
          <linearGradient id="nieveAtardecer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="20%" stopColor="#FED7AA" />
            <stop offset="60%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
        </defs>

        {/* Cielo cálido y dramático de atardecer polar */}
        <rect width="1080" height="1150" fill="url(#cieloAtardecerPolar)" />

        {/* Sol bajo gigante en el horizonte */}
        <circle cx="540" cy="1150" r="180" fill="#FBBF24" opacity="0.9" />
        <circle cx="540" cy="1150" r="120" fill="#FEF08A" />

        {/* Nieve polar con sombras coloreadas */}
        <rect y="1150" width="1080" height="770" fill="url(#nieveAtardecer)" />
        <line x1="0" y1="1150" x2="1080" y2="1150" stroke="#000000" strokeWidth="8" />

        {/* Gran rayo láser definitivo emergiendo del pozo hacia el cielo */}
        <polygon
          points={`500,1540 450,0 630,0 580,1540`}
          fill="#38BDF8"
          opacity={0.35 + beamPulse * 0.4}
        />
        <polygon
          points={`520,1540 500,0 580,0 560,1540`}
          fill="#FFFFFF"
          opacity={0.6 + beamPulse * 0.4}
        />

        {/* El pozo en la nieve */}
        <g transform="translate(540, 1540)">
          <ellipse cx="0" cy="0" rx="180" ry="70" fill="#312E81" stroke="#000000" strokeWidth="8" />
          <ellipse cx="0" cy="0" rx="140" ry="50" fill="#020617" />
          <ellipse cx="0" cy="0" rx="90" ry="30" fill="#38BDF8" opacity={0.8} />
        </g>
      </svg>
    </div>
  );
};

/** Estanque Terrestre Día: Parque minimalista con muelle de madera, estanque con nenúfares,
 * y un haz de luz solar potente bajando en diagonal desde el Sol. */
const EstanqueTerrestreDia: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const rayPulse = (Math.sin(f / 8) + 1) * 0.5;
  const waterWave = Math.sin(f / 15) * 8;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#38BDF8]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cieloEstanque" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="60%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>
          <linearGradient id="aguaEstanque" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="40%" stopColor="#0F766E" />
            <stop offset="100%" stopColor="#115E59" />
          </linearGradient>
          <linearGradient id="rayoSolarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FACC15" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FEF08A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <rect width="1080" height="1100" fill="url(#cieloEstanque)" />

        <circle cx="920" cy="240" r="140" fill="#FDE047" opacity="0.4" />
        <circle cx="920" cy="240" r="90" fill="#FACC15" stroke="#EAB308" strokeWidth="6" />
        <circle cx="920" cy="240" r="60" fill="#FEF08A" />

        <polygon
          points={`920,240 ${380 + rayPulse * 40},1350 ${580 + rayPulse * 40},1350 960,240`}
          fill="url(#rayoSolarGrad)"
          opacity={0.6 + rayPulse * 0.3}
        />

        <g transform="translate(0, 1100)">
          <rect y="120" width="1080" height="700" fill="url(#aguaEstanque)" />
          <path d={`M 0 160 Q 270 ${140 + waterWave} 540 160 T 1080 160`} stroke="#2DD4BF" strokeWidth="4" fill="none" opacity="0.5" />
          <path d={`M 0 260 Q 300 ${280 - waterWave} 600 260 T 1080 260`} stroke="#2DD4BF" strokeWidth="4" fill="none" opacity="0.4" />

          <rect x="180" y="20" width="720" height="120" rx="6" fill="#B45309" stroke="#000000" strokeWidth="6" />
          {[260, 360, 460, 560, 660, 760].map((x, i) => (
            <line key={`plank_${i}`} x1={x} y1="20" x2={x} y2="140" stroke="#78350F" strokeWidth="4" />
          ))}
          <rect x="220" y="140" width="40" height="260" fill="#78350F" stroke="#000000" strokeWidth="5" />
          <rect x="820" y="140" width="40" height="260" fill="#78350F" stroke="#000000" strokeWidth="5" />
        </g>
      </svg>
    </div>
  );
};

/** Microcosmos Choque de Fotones: Diagrama físico microscópico con pared reflectante
 * y fotones como esferas doradas rebotando en ángulo y transfiriendo momento. */
const MicrocosmosChoqueFotones: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A1128]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <pattern id="gridMicrocosmos" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1E293B" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#gridMicrocosmos)" />

        <g transform="translate(720, 320)">
          <rect x="0" y="0" width="80" height="1280" rx="10" fill="#E2E8F0" stroke="#38BDF8" strokeWidth="6" />
          {[160, 420, 680, 940, 1120].map((y, idx) => (
            <circle
              key={`spark_wall_${idx}`}
              cx="0"
              cy={y}
              r={14 + ((f * 3 + idx * 7) % 18)}
              fill="#FDE047"
              opacity={(1 - (((f * 3 + idx * 7) % 18) / 18)) * 0.9}
            />
          ))}
          <g transform="translate(140, 640)">
            <line x1="0" y1="0" x2="160" y2="0" stroke="#38BDF8" strokeWidth="10" strokeLinecap="round" />
            <polygon points="160,-22 200,0 160,22" fill="#38BDF8" />
            <text x="20" y="-20" fill="#38BDF8" fontSize="22" fontFamily="'Courier New', monospace" fontWeight="bold">
              FUERZA F
            </text>
          </g>
        </g>

        <path d="M 120 400 L 720 580 L 120 760" fill="none" stroke="#FACC15" strokeWidth="6" strokeDasharray="16 10" />
        <path d="M 80 840 L 720 1000 L 80 1160" fill="none" stroke="#FACC15" strokeWidth="6" strokeDasharray="16 10" />

        {[...Array(6)].map((_, i) => {
          const tPos = ((f * 18 + i * 180) % 1000) / 1000;
          let px = 120 + tPos * 600;
          let py = 400 + tPos * 180;
          if (tPos > 0.5) {
            const p2 = (tPos - 0.5) * 2;
            px = 720 - p2 * 600;
            py = 580 + p2 * 180;
          }
          return (
            <g key={`photon_circ_${i}`} transform={`translate(${px}, ${py})`}>
              <circle cx="0" cy="0" r="18" fill="#FACC15" stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="0" cy="0" r="28" fill="#FDE047" opacity="0.35" />
            </g>
          );
        })}

        <g transform="translate(100, 240)">
          <rect width="360" height="120" rx="8" fill="#020617" stroke="#38BDF8" strokeWidth="4" />
          <text x="24" y="45" fill="#FACC15" fontSize="20" fontFamily="'Courier New', monospace" fontWeight="bold">
            FOTÓN: m₀ = 0
          </text>
          <text x="24" y="85" fill="#38BDF8" fontSize="18" fontFamily="'Courier New', monospace">
            MOMENTO LINEAL: p = E/c
          </text>
        </g>
      </svg>
    </div>
  );
};

/** Órbita Sol y Estrellas: Vacío espacial con Sol colosal emitiendo viento de luz
 * y campo de estrellas titilantes. */
const OrbitaSolEstrellas: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const sunPulse = (Math.sin(f / 10) + 1) * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <radialGradient id="solGiganteGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="25%" stopColor="#FACC15" />
            <stop offset="55%" stopColor="#F97316" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#EA580C" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="#020617" />

        {[...Array(35)].map((_, i) => {
          const sx = rnd(i * 3) * 1080;
          const sy = rnd(i * 7) * 1920;
          const sr = 1.5 + rnd(i) * 2;
          const stwinkle = 0.3 + (Math.sin(f / 12 + i) + 1) * 0.35;
          return <circle key={`star_orb_${i}`} cx={sx} cy={sy} r={sr} fill="#FFFFFF" opacity={stwinkle} />;
        })}

        <circle cx="180" cy="280" r={380 + sunPulse * 40} fill="url(#solGiganteGrad)" />
        <circle cx="180" cy="280" r="140" fill="#FEF08A" />

        {[0, 20, 40, 60].map((ang, idx) => {
          const rad = (ang * Math.PI) / 180;
          const x2 = 180 + Math.cos(rad) * 1600;
          const y2 = 280 + Math.sin(rad) * 1600;
          return (
            <line
              key={`sunray_${idx}`}
              x1="180"
              y1="280"
              x2={x2}
              y2={y2}
              stroke="#FDE047"
              strokeWidth="12"
              opacity={0.15 + sunPulse * 0.15}
            />
          );
        })}

        <circle cx="920" cy="1480" r="80" fill="#0284C7" stroke="#38BDF8" strokeWidth="4" />
        <ellipse cx="940" cy="1470" rx="35" ry="50" fill="#22C55E" opacity="0.6" />
      </svg>
    </div>
  );
};

/** Despliegue Vela Solar: Gran vela plateada/dorada cuadrada de Mylar estirada
 * por 4 mástiles diagonales con cápsula espacial central. */
const DespliegueVelaSolar: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const sailShimmer = (Math.sin(f / 8) + 1) * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="velaMylarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="30%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>
        </defs>

        <rect width="1080" height="1920" fill="#020617" />

        {[...Array(25)].map((_, i) => (
          <circle key={`vstar_${i}`} cx={rnd(i * 5) * 1080} cy={rnd(i * 11) * 1920} r={2} fill="#FFFFFF" opacity={0.4} />
        ))}

        <g transform="translate(540, 960)">
          <polygon
            points={`0,-620 480,0 0,620 -480,0`}
            fill="url(#velaMylarGrad)"
            stroke="#FACC15"
            strokeWidth="8"
            opacity={0.88 + sailShimmer * 0.12}
          />

          <line x1="0" y1="-620" x2="0" y2="620" stroke="#000000" strokeWidth="6" opacity="0.4" />
          <line x1="-480" y1="0" x2="480" y2="0" stroke="#000000" strokeWidth="6" opacity="0.4" />

          <line x1="0" y1="0" x2="-340" y2="-440" stroke="#020617" strokeWidth="9" strokeLinecap="round" />
          <line x1="0" y1="0" x2="340" y2="-440" stroke="#020617" strokeWidth="9" strokeLinecap="round" />
          <line x1="0" y1="0" x2="-340" y2="440" stroke="#020617" strokeWidth="9" strokeLinecap="round" />
          <line x1="0" y1="0" x2="340" y2="440" stroke="#020617" strokeWidth="9" strokeLinecap="round" />

          <rect x="-55" y="-55" width="110" height="110" rx="20" fill="#0F172A" stroke="#38BDF8" strokeWidth="7" />
          <circle cx="0" cy="0" r="32" fill="#0284C7" stroke="#38BDF8" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
};

/** Diagrama Óptica de Rebote: Explicación de por qué la reflexión duplica el empuje (1x vs 2x). */
const DiagramaOpticaRebote: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const pulse2x = (Math.sin(f / 6) + 1) * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#050D1A]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <rect width="1080" height="1920" fill="#050D1A" />

        <line x1="540" y1="200" x2="540" y2="1500" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />

        <g transform="translate(180, 480)">
          <rect x="0" y="-80" width="300" height="160" rx="10" fill="#020617" stroke="#EF4444" strokeWidth="4" />
          <text x="30" y="-30" fill="#EF4444" fontSize="22" fontFamily="'Courier New', monospace" fontWeight="bold">
            ABSORCIÓN
          </text>
          <text x="30" y="10" fill="#FFFFFF" fontSize="18" fontFamily="'Courier New', monospace">
            Fotón se detiene
          </text>
          <text x="30" y="50" fill="#F87171" fontSize="20" fontFamily="'Courier New', monospace" fontWeight="bold">
            EMPUJE = 1× (p)
          </text>
          <line x1="310" y1="0" x2="360" y2="0" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
        </g>

        <g transform="translate(180, 1020)">
          <rect x="0" y="-80" width="300" height="160" rx="10" fill="#020617" stroke="#22C55E" strokeWidth="4" />
          <text x="30" y="-30" fill="#22C55E" fontSize="22" fontFamily="'Courier New', monospace" fontWeight="bold">
            REBOTE ESPECULAR
          </text>
          <text x="30" y="10" fill="#FFFFFF" fontSize="18" fontFamily="'Courier New', monospace">
            Fotón invierte sentido
          </text>
          <text x="30" y="50" fill="#4ADE80" fontSize="20" fontFamily="'Courier New', monospace" fontWeight="bold">
            EMPUJE = 2× (2p)!
          </text>
          <path d="M 360 -30 L 360 30" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" />
        </g>

        <g transform="translate(740, 1020)">
          <circle cx="80" cy="0" r={80 + pulse2x * 15} fill="#22C55E" opacity="0.25" />
          <circle cx="80" cy="0" r="70" fill="#020617" stroke="#22C55E" strokeWidth="7" />
          <text x="80" y="24" textAnchor="middle" fill="#4ADE80" fontSize="64" fontFamily="'Arial Black', sans-serif" fontWeight="900">
            2X
          </text>
        </g>
      </svg>
    </div>
  );
};

/** Velocidad Curvatura Espacio: Aceleración sostenida con líneas estelares streaming (warp streaks),
 * velocímetro digital ascendente y asteroide en rotación. */
const VelocidadCurvaturaEspacio: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const warpOffset = (f * 42) % 1200;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <rect width="1080" height="1920" fill="#020617" />

        {[...Array(28)].map((_, i) => {
          const sx = ((rnd(i * 7) * 1600 - warpOffset) % 1600 + 1600) % 1600 - 300;
          const sy = 100 + rnd(i * 13) * 1700;
          const slen = 120 + rnd(i * 3) * 240;
          return (
            <line
              key={`warp_line_${i}`}
              x1={sx}
              y1={sy}
              x2={sx + slen}
              y2={sy}
              stroke="#38BDF8"
              strokeWidth={3 + (i % 3)}
              strokeLinecap="round"
              opacity={0.35 + rnd(i) * 0.55}
            />
          );
        })}

        <g transform={`translate(${1300 - ((f * 14) % 1800)}, 580) rotate(${f * 2})`}>
          <polygon points="-60,-40 -20,-70 50,-50 80,-10 60,60 -10,80 -70,30" fill="#475569" stroke="#1E293B" strokeWidth="6" />
          <circle cx="-15" cy="-10" r="12" fill="#334155" />
          <circle cx="25" cy="20" r="18" fill="#334155" />
        </g>
      </svg>
    </div>
  );
};

/** Surf Nebulosa Estelar: Gran nebulosa cósmica magenta/violeta/dorada, polvo estelar
 * y la nave estelar surfeando hacia el infinito. */
const SurfNebulosaEstelar: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const nebPulse = (Math.sin(f / 12) + 1) * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A061C]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <radialGradient id="nebulaVioleta" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#7E22CE" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#4C1D95" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0A061C" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebulaDorada" cx="60%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#EA580C" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0A061C" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="#0A061C" />

        <circle cx="480" cy="720" r={420 + nebPulse * 30} fill="url(#nebulaVioleta)" />
        <circle cx="680" cy="1120" r={380 + nebPulse * 25} fill="url(#nebulaDorada)" />

        {[...Array(40)].map((_, i) => {
          const bx = rnd(i * 9) * 1080;
          const by = rnd(i * 17) * 1920;
          const br = 1.5 + rnd(i) * 3;
          const bstar = 0.4 + (Math.sin(f / 10 + i) + 1) * 0.3;
          return <circle key={`surfstar_${i}`} cx={bx} cy={by} r={br} fill="#FFFFFF" opacity={bstar} />;
        })}

        <line x1="0" y1="1920" x2="1080" y2="400" stroke="#38BDF8" strokeWidth="4" strokeDasharray="16 16" opacity="0.35" />
      </svg>
    </div>
  );
};

/** Módulo ISS Gravedad Cero: Interior de cabina presurizada de la Estación Espacial Internacional
 * con escotilla circular mirando a la Tierra orbital, agarraderas amarillas y racks técnicos. */
const ModuloIssGravedadCero: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <linearGradient id="moduloPared" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="20%" stopColor="#334155" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="80%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <radialGradient id="tierraVentana" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#0284C7" />
            <stop offset="80%" stopColor="#075985" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="url(#moduloPared)" />

        {[220, 580, 940, 1300, 1660].map((y, idx) => (
          <g key={`panel_iss_${idx}`}>
            <line x1="0" y1={y} x2="1080" y2={y} stroke="#0F172A" strokeWidth="4" />
            <circle cx="60" cy={y - 12} r="5" fill="#64748B" />
            <circle cx="1020" cy={y - 12} r="5" fill="#64748B" />
          </g>
        ))}

        <g transform="translate(540, 480)">
          <circle cx="0" cy="0" r="260" fill="#020617" stroke="#0F172A" strokeWidth="22" />
          <circle cx="0" cy="0" r="240" fill="#020617" stroke="#64748B" strokeWidth="8" />
          <circle cx="60" cy="180" r="220" fill="url(#tierraVentana)" />
          <path
            d={`M -120 120 Q ${-40 + Math.sin(f / 20) * 15} 80 80 140 Q 180 160 220 100`}
            stroke="#FFFFFF"
            strokeWidth="28"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
          <path d="M -160 -160 L 160 160" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" opacity="0.15" />
        </g>

        <g transform="translate(140, 980)">
          <rect x="-10" y="0" width="20" height="280" rx="8" fill="#FACC15" stroke="#000000" strokeWidth="5" />
          <line x1="-10" y1="70" x2="10" y2="70" stroke="#000000" strokeWidth="6" />
          <line x1="-10" y1="140" x2="10" y2="140" stroke="#000000" strokeWidth="6" />
          <line x1="-10" y1="210" x2="10" y2="210" stroke="#000000" strokeWidth="6" />
        </g>
        <g transform="translate(940, 980)">
          <rect x="-10" y="0" width="20" height="280" rx="8" fill="#FACC15" stroke="#000000" strokeWidth="5" />
          <line x1="-10" y1="70" x2="10" y2="70" stroke="#000000" strokeWidth="6" />
          <line x1="-10" y1="140" x2="10" y2="140" stroke="#000000" strokeWidth="6" />
          <line x1="-10" y1="210" x2="10" y2="210" stroke="#000000" strokeWidth="6" />
        </g>

        <g transform="translate(760, 240)">
          <rect width="220" height="70" rx="8" fill="#020617" stroke="#38BDF8" strokeWidth="3" />
          <circle cx="30" cy="35" r="8" fill={f % 30 < 15 ? "#22C55E" : "#15803D"} />
          <circle cx="60" cy="35" r="8" fill="#38BDF8" />
          <text x="85" y="42" fill="#38BDF8" fontSize="16" fontFamily="'Courier New', monospace" fontWeight="bold">
            0-G LIFE SUP
          </text>
        </g>
      </svg>
    </div>
  );
};

/** Primer Plano Tapón Fluido: Contacto elástico del dedo enguantado con la membrana de agua,
 * con ondas concéntricas superficiales y deformación de cama elástica. */
const PrimerPlanoTaponFluido: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const ripple1 = (f * 6) % 360;
  const ripple2 = ((f * 6 + 120) % 360);
  const ripple3 = ((f * 6 + 240) % 360);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#082F49]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <radialGradient id="fluidoMembranaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#0284C7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#082F49" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="#0C4A6E" />

        <circle cx="540" cy="960" r="460" fill="url(#fluidoMembranaGrad)" stroke="#38BDF8" strokeWidth="8" />

        {[ripple1, ripple2, ripple3].map((r, idx) => (
          <circle
            key={`wave_rip_${idx}`}
            cx="540"
            cy="960"
            r={100 + r}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
            opacity={(1 - r / 360) * 0.75}
          />
        ))}

        <path
          d={`M 320 620 Q 540 ${580 + Math.sin(f / 10) * 20} 760 660 Q 540 780 320 620 Z`}
          fill="#FFFFFF"
          opacity="0.35"
        />

        {[...Array(8)].map((_, i) => {
          const gx = 200 + rnd(i * 3) * 680 + Math.sin(f / 15 + i) * 15;
          const gy = 300 + rnd(i * 7) * 1300 + Math.cos(f / 15 + i) * 15;
          const gr = 12 + rnd(i) * 14;
          return (
            <g key={`sat_drop_${i}`} transform={`translate(${gx}, ${gy})`}>
              <circle cx="0" cy="0" r={gr} fill="#38BDF8" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />
              <circle cx={-gr * 0.3} cy={-gr * 0.3} r={gr * 0.25} fill="#FFFFFF" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/** Microcosmos Cohesión Molecular: Malla 3D azul marino con moléculas de agua unidas
 * con vectores de atracción radial tirando fuertemente hacia el centro de la gota. */
const MicrocosmosCohesionMolecular: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const pulseCenter = (Math.sin(f / 6) + 1) * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#050D1A]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <pattern id="gridMolecular" width="70" height="70" patternUnits="userSpaceOnUse">
            <path d="M 70 0 L 0 0 0 70" fill="none" stroke="#1E293B" strokeWidth="1.5" />
          </pattern>
        </defs>

        <rect width="1080" height="1920" fill="url(#gridMolecular)" />

        <circle cx="540" cy="960" r={160 + pulseCenter * 25} fill="#0284C7" opacity="0.3" />
        <circle cx="540" cy="960" r="70" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="4" />
        <text x="540" y="970" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontFamily="'Courier New', monospace" fontWeight="bold">
          NÚCLEO
        </text>

        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, idx) => {
          const rad = (deg * Math.PI) / 180;
          const dist = 380 + Math.sin(f / 8 + idx) * 12;
          const mx = 540 + Math.cos(rad) * dist;
          const my = 960 + Math.sin(rad) * dist;
          return (
            <g key={`mol_${idx}`}>
              <line x1={mx} y1={my} x2={540} y2={960} stroke="#38BDF8" strokeWidth="3" strokeDasharray="8 6" opacity="0.6" />
              <circle cx={mx} cy={my} r="26" fill="#0284C7" stroke="#38BDF8" strokeWidth="4" />
              <text x={mx} y={my + 7} textAnchor="middle" fill="#FFFFFF" fontSize="14" fontFamily="'Courier New', monospace" fontWeight="bold">
                H₂O
              </text>
            </g>
          );
        })}

        <g transform="translate(100, 240)">
          <rect width="400" height="130" rx="10" fill="#020617" stroke="#38BDF8" strokeWidth="4" />
          <text x="24" y="45" fill="#38BDF8" fontSize="20" fontFamily="'Courier New', monospace" fontWeight="bold">
            COHESIÓN INTERMOLECULAR
          </text>
          <text x="24" y="80" fill="#FFFFFF" fontSize="16" fontFamily="'Courier New', monospace">
            PUENTES DE HIDRÓGENO
          </text>
          <text x="24" y="110" fill="#FACC15" fontSize="16" fontFamily="'Courier New', monospace" fontWeight="bold">
            MÍNIMA ÁREA / VOLUMEN = ESFERA
          </text>
        </g>
      </svg>
    </div>
  );
};

/** Pecera Flotante 360: Módulo espacial con la esfera de agua suspendida en el aire,
 * con refracción óptica y el pececito dorado nadando felizmente en su interior. */
const PeceraFlotante360: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const wobbleX = Math.sin(f / 12) * 15;
  const wobbleY = Math.cos(f / 14) * 12;
  const fishSwim = Math.sin(f / 8) * 18;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <radialGradient id="peceraEsferaGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#7DD3FC" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#0284C7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#082F49" stopOpacity="0.25" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="#1E293B" />
        <rect x="140" y="180" width="800" height="1560" rx="30" fill="#0F172A" stroke="#334155" strokeWidth="8" />

        <g transform={`translate(${540 + wobbleX}, ${960 + wobbleY})`}>
          <ellipse cx="0" cy="380" rx="220" ry="40" fill="#020617" opacity="0.4" />
          <circle cx="0" cy="0" r="320" fill="url(#peceraEsferaGrad)" stroke="#38BDF8" strokeWidth="8" />

          <path
            d={`M -200 -80 Q 0 ${-40 + Math.sin(f / 10) * 15} 200 -120 Q 140 120 -180 80 Z`}
            fill="#E0F2FE"
            opacity="0.3"
          />

          <g transform={`translate(${fishSwim}, ${Math.sin(f / 10) * 10})`}>
            <ellipse cx="0" cy="0" rx="42" ry="26" fill="#F59E0B" stroke="#000000" strokeWidth="4.5" />
            <polygon
              points={`-40,0 ${-65 + Math.sin(f / 6) * 8},-22 ${-65 + Math.sin(f / 6) * 8},22`}
              fill="#FACC15"
              stroke="#000000"
              strokeWidth="4"
            />
            <polygon points="-10,-24 15,-34 10,-24" fill="#FACC15" stroke="#000000" strokeWidth="3" />
            <circle cx="22" cy="-6" r="8" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
            <circle cx="24" cy="-6" r="3.5" fill="#000000" />
            <circle cx="48" cy="-10" r="6" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" />
          </g>

          <ellipse cx="-120" cy="-140" rx="70" ry="35" transform="rotate(-30 -120 -140)" fill="#FFFFFF" opacity="0.65" />
        </g>
      </svg>
    </div>
  );
};

/** Peligro Adhesión Capilar: Popote largo saliendo de la masa de agua con el líquido reptando
 * hacia la cara del personaje por pura adherencia superficial. */
const PeligroAdhesionCapilar: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const creepOffset = (f * 12) % 650;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A1128]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <rect width="1080" height="1920" fill="#0A1128" />

        <line x1="180" y1="1300" x2="880" y2="400" stroke="#E2E8F0" strokeWidth="26" strokeLinecap="round" opacity="0.7" />
        <line x1="180" y1="1300" x2="880" y2="400" stroke="#38BDF8" strokeWidth="16" strokeLinecap="round" opacity="0.4" />

        <g transform={`translate(${180 + creepOffset * 0.95}, ${1300 - creepOffset * 1.22})`}>
          <ellipse cx="0" cy="0" rx="55" ry="38" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="5" opacity="0.85" />
          <circle cx="-15" cy="-8" r="10" fill="#FFFFFF" opacity="0.7" />
          <circle cx="40" cy="-25" r="14" fill="#0284C7" stroke="#38BDF8" strokeWidth="3" />
        </g>

        <g transform="translate(140, 240)">
          <rect width="360" height="110" rx="10" fill="#020617" stroke="#EF4444" strokeWidth="4" />
          <text x="24" y="45" fill="#EF4444" fontSize="20" fontFamily="'Courier New', monospace" fontWeight="bold">
            ¡ADHESIÓN CAPILAR!
          </text>
          <text x="24" y="85" fill="#F87171" fontSize="16" fontFamily="'Courier New', monospace">
            EL AGUA TREPA POR CONTACTO
          </text>
        </g>
      </svg>
    </div>
  );
};

/** Máscara de Agua Asfixia: Alerta de seguridad espacial, agua adherida cubriendo la cabeza
 * redonda del astronauta con burbujas y el pececito de hule nadando frente a sus ojos. */
const MascaraAguaAsfixia: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const alertFlash = (Math.sin(f / 4) + 1) * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#180808]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <radialGradient id="alertaCascoAgua" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
            <stop offset="65%" stopColor="#0284C7" stopOpacity="0.4" />
            <stop offset="90%" stopColor="#EF4444" stopOpacity={0.2 + alertFlash * 0.25} />
            <stop offset="100%" stopColor="#180808" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="#180808" />

        <circle cx="540" cy="800" r="540" fill="url(#alertaCascoAgua)" />

        {[...Array(14)].map((_, i) => {
          const bx = 380 + rnd(i * 4) * 320;
          const by = 640 + ((rnd(i * 9) * 400 + f * 1.5) % 400);
          const br = 6 + rnd(i) * 10;
          return (
            <g key={`bubble_face_${i}`} transform={`translate(${bx}, ${by})`}>
              <circle cx="0" cy="0" r={br} fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2.5" opacity="0.75" />
              <circle cx={-br * 0.3} cy={-br * 0.3} r={br * 0.25} fill="#FFFFFF" />
            </g>
          );
        })}

        <g transform="translate(180, 240)">
          <rect width="720" height="90" rx="10" fill="#020617" stroke="#EF4444" strokeWidth="5" />
          <text x="360" y="55" textAnchor="middle" fill="#EF4444" fontSize="24" fontFamily="'Courier New', monospace" fontWeight="bold">
            PELIGRO DE ASFIXIA EN MICROGRAVEDAD
          </text>
        </g>
      </svg>
    </div>
  );
};

/** Cierre Orbital Tierra: Escotilla de la cúpula con el planeta azul girando pacíficamente,
 * resolviendo el conflicto y despidiendo el corto. */
const CierreOrbitalTierra: React.FC<{ frame: number; isPrimerPlano: boolean }> = ({ frame, isPrimerPlano }) => {
  const f = frame;
  const sunGlint = (Math.sin(f / 10) + 1) * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="none">
        <defs>
          <radialGradient id="tierraCierre" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="45%" stopColor="#0284C7" />
            <stop offset="75%" stopColor="#082F49" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>

        <rect width="1080" height="1920" fill="#020617" />

        {[...Array(30)].map((_, i) => (
          <circle key={`star_cierre_${i}`} cx={rnd(i * 5) * 1080} cy={rnd(i * 13) * 1920} r={2} fill="#FFFFFF" opacity={0.4} />
        ))}

        <circle cx="540" cy="1800" r="920" fill="url(#tierraCierre)" stroke="#38BDF8" strokeWidth="6" />

        <path
          d="M 0 1180 Q 540 1060 1080 1180"
          stroke="#BAE6FD"
          strokeWidth="12"
          fill="none"
          opacity={0.6 + sunGlint * 0.3}
        />

        <path
          d="M 0 0 L 1080 0 L 1080 420 Q 540 540 0 420 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="8"
        />
        <circle cx="540" cy="220" r="80" fill="#0F172A" stroke="#38BDF8" strokeWidth="5" />
      </svg>
    </div>
  );
};

export const NarrativeStage: React.FC<NarrativeStageProps> = ({
  escenario = "vacio",
  composicionVisual = "minimalista",
  frame,
}) => {
  const isPrimerPlano = composicionVisual === "primer_plano";

  if (escenario === "modulo_iss_gravedad_cero") {
    return <ModuloIssGravedadCero frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "primer_plano_tapon_fluido") {
    return <PrimerPlanoTaponFluido frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "microcosmos_cohesion_molecular") {
    return <MicrocosmosCohesionMolecular frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "pecera_flotante_360") {
    return <PeceraFlotante360 frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "peligro_adhesion_capilar") {
    return <PeligroAdhesionCapilar frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "mascara_agua_asfixia") {
    return <MascaraAguaAsfixia frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "cierre_orbital_tierra") {
    return <CierreOrbitalTierra frame={frame} isPrimerPlano={isPrimerPlano} />;
  }

  if (escenario === "estanque_terrestre_dia") {
    return <EstanqueTerrestreDia frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "microcosmos_choque_fotones") {
    return <MicrocosmosChoqueFotones frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "orbita_sol_estrellas") {
    return <OrbitaSolEstrellas frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "despliegue_vela_solar") {
    return <DespliegueVelaSolar frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "diagrama_optica_rebote") {
    return <DiagramaOpticaRebote frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "velocidad_curvatura_espacio") {
    return <VelocidadCurvaturaEspacio frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "surf_nebulosa_estelar") {
    return <SurfNebulosaEstelar frame={frame} isPrimerPlano={isPrimerPlano} />;
  }

  if (escenario === "desierto_polar_antartico") {
    return <DesiertoPolarAntartico frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "corte_glaciar_antartico") {
    return <CorteGlaciarAntartico frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "llanura_antartica_pozo") {
    return <LlanuraAntarticaPozo frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "interior_guia_ondas_hielo") {
    return <InteriorGuiaOndasHielo frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "carrera_ondas_dispersion") {
    return <CarreraOndasDispersion frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "laboratorio_antartico") {
    return <LaboratorioAntartico frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "atardecer_polar_despedida") {
    return <AtardecerPolarDespedida frame={frame} isPrimerPlano={isPrimerPlano} />;
  }

  if (escenario === "laboratorio_penumbra") {
    return <LaboratorioPenumbra frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "microcosmos_acuatico") {
    return <MicrocosmosAcuatico frame={frame} isPrimerPlano={isPrimerPlano} />;
  }

  if (escenario === "laboratorio_balistica") {
    return <LaboratorioBalistica frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "diagrama_termico_rupert") {
    return <DiagramaTermicoRupert frame={frame} isPrimerPlano={isPrimerPlano} />;
  }

  if (escenario === "paramo_celta_niebla") {
    return <ParamoCeltaNiebla frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "umbral_cielo_infierno") {
    return <UmbralCieloInfierno frame={frame} isPrimerPlano={isPrimerPlano} />;
  }

  if (escenario === "ofrenda_dia_muertos") {
    return <OfrendaDiaMuertos frame={frame} isPrimerPlano={isPrimerPlano} />;
  }
  if (escenario === "cosmogonia_prehispanica") {
    return <CosmogoniaPrehispanica frame={frame} isPrimerPlano={isPrimerPlano} />;
  }

  if (escenario === "crater_volcanico" || escenario === "caldera_volcan" || escenario === "volcan") {
    return <CraterVolcanico frame={frame} isPrimerPlano={isPrimerPlano} />;
  }

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
  if (escenario === "playa_bioluminiscente") {
    return <PlayaBioluminiscente frame={frame} isPrimerPlano={isPrimerPlano} />;
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

  if (escenario === "cordillera_penitentes_panoramica") {
    const f = frame;
    const windDrift = Math.sin(f / 40) * 12;
    const sunPulse = 1 + Math.sin(f / 30) * 0.05;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0C4A6E]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloAndino" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#082F49" />
              <stop offset="35%" stopColor="#0284C7" />
              <stop offset="70%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
            <linearGradient id="hieloPenitente" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>
            <linearGradient id="sueloVolcanico" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="50%" stopColor="#451A03" />
              <stop offset="100%" stopColor="#291002" />
            </linearGradient>
          </defs>

          {/* Cielo de altitud extrema */}
          <rect width="1080" height="1920" fill="url(#cieloAndino)" />

          {/* Sol andino brillante y cortante */}
          <g transform={`translate(860, 280) scale(${sunPulse})`}>
            <circle cx="0" cy="0" r="140" fill="#FEF08A" opacity="0.35" />
            <circle cx="0" cy="0" r="95" fill="#FDE047" stroke="#000000" strokeWidth="6" />
            <circle cx="0" cy="0" r="75" fill="#FFFFFF" />
            {[...Array(12)].map((_, i) => {
              const ang = (i * 30 * Math.PI) / 180;
              const x1 = Math.cos(ang) * 110;
              const y1 = Math.sin(ang) * 110;
              const x2 = Math.cos(ang) * 145;
              const y2 = Math.sin(ang) * 145;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />;
            })}
          </g>

          {/* Cordillera de los Andes de fondo (Plano 1) */}
          <polygon points="-60,1080 180,680 420,920 680,620 940,880 1140,740 1140,1400 -60,1400" fill="#9A3412" stroke="#000000" strokeWidth="8" />
          <polygon points="180,680 240,760 140,780" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
          <polygon points="680,620 740,710 630,730" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />

          {/* Altiplano pedregoso intermedio (Plano 2) */}
          <polygon points="-60,1180 320,1120 780,1160 1140,1100 1140,1920 -60,1920" fill="url(#sueloVolcanico)" stroke="#000000" strokeWidth="8" />

          {/* Bosque de cuchillas de penitentes inclinadas al sol (Plano 3) */}
          <g transform={`translate(${windDrift}, 0)`}>
            {[
              { x: 40, y: 1240, h: 260, w: 45 },
              { x: 120, y: 1200, h: 320, w: 55 },
              { x: 210, y: 1260, h: 280, w: 50 },
              { x: 310, y: 1180, h: 360, w: 60 },
              { x: 420, y: 1250, h: 310, w: 50 },
              { x: 530, y: 1190, h: 390, w: 65 },
              { x: 650, y: 1240, h: 340, w: 55 },
              { x: 760, y: 1180, h: 370, w: 60 },
              { x: 880, y: 1220, h: 330, w: 55 },
              { x: 990, y: 1250, h: 290, w: 50 },
            ].map((p, i) => (
              <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(12)`}>
                <ellipse cx={-p.w * 0.8} cy={p.h * 0.1} rx={p.w * 1.4} ry={14} fill="#1E293B" opacity="0.45" />
                <polygon
                  points={`0,-${p.h} ${p.w * 0.5},0 -${p.w * 0.5},0`}
                  fill="url(#hieloPenitente)"
                  stroke="#000000"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                <polygon points={`0,-${p.h} ${p.w * 0.45},0 0,0`} fill="#BAE6FD" opacity="0.75" />
                <line x1="0" y1={-p.h} x2="0" y2="0" stroke="#0284C7" strokeWidth="4" />
                <line x1={-p.w * 0.2} y1={-p.h * 0.4} x2={-p.w * 0.1} y2="0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </g>
            ))}
          </g>

          {/* Rótulo de ubicación / altitud */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="360" height="68" rx="12" fill="#020617" stroke="#FFE600" strokeWidth="5" />
            <text x="24" y="44" fill="#FFE600" fontSize="26" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ALTURA: 4,500 M
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "laberinto_penitentes_cerrado") {
    const f = frame;
    const wobble = Math.sin(f / 25) * 6;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="hieloCerrado" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#E0F2FE" />
              <stop offset="80%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="sueloPedregoso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#573014" />
              <stop offset="100%" stopColor="#2A1408" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="#0C4A6E" />
          <rect x="0" y="1380" width="1080" height="540" fill="url(#sueloPedregoso)" stroke="#000000" strokeWidth="8" />

          {/* Cuchilla de hielo colosal a la izquierda */}
          <g transform={`translate(${wobble - 60}, 1440) rotate(10)`}>
            <polygon
              points="140,-1150 360,60 -80,60"
              fill="url(#hieloCerrado)"
              stroke="#000000"
              strokeWidth="9"
              strokeLinejoin="round"
            />
            <polygon points="140,-1150 340,60 140,60" fill="#38BDF8" opacity="0.6" />
            <line x1="140" y1="-1150" x2="150" y2="60" stroke="#0284C7" strokeWidth="7" />
            <line x1="80" y1="-700" x2="100" y2="60" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            <line x1="220" y1="-850" x2="250" y2="60" stroke="#0369A1" strokeWidth="5" />
          </g>

          {/* Cuchilla de hielo colosal a la derecha */}
          <g transform={`translate(${1020 - wobble}, 1440) rotate(-14)`}>
            <polygon
              points="-120,-1180 100,60 -340,60"
              fill="url(#hieloCerrado)"
              stroke="#000000"
              strokeWidth="9"
              strokeLinejoin="round"
            />
            <polygon points="-120,-1180 80,60 -120,60" fill="#0284C7" opacity="0.6" />
            <line x1="-120" y1="-1180" x2="-130" y2="60" stroke="#0369A1" strokeWidth="7" />
            <line x1="-60" y1="-750" x2="-40" y2="60" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          </g>

          {/* Rótulo de advertencia física */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="460" height="68" rx="12" fill="#DC2626" stroke="#000000" strokeWidth="5" />
            <text x="24" y="44" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              FILO DE ROCA CRISTALINA
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "macro_sublimacion_fosforo") {
    const f = frame;
    const vaporDrift1 = Math.sin(f / 15) * 14;
    const vaporDrift2 = Math.cos(f / 18) * 18;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#082F49]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloMacro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0369A1" />
              <stop offset="60%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="hieloMacro" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#cieloMacro)" />
          <rect x="0" y="1420" width="1080" height="500" fill="#451A03" stroke="#000000" strokeWidth="8" />
          <text x="540" y="1520" textAnchor="middle" fill="#FDE047" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
            SUELO 100% SECO · CERO GOTAS DE AGUA
          </text>

          {/* Punta afilada macro del penitente */}
          <g transform="translate(680, 1420)">
            <polygon
              points="0,-820 180,40 -180,40"
              fill="url(#hieloMacro)"
              stroke="#000000"
              strokeWidth="8"
              strokeLinejoin="round"
            />
            <polygon points="0,-820 160,40 0,40" fill="#7DD3FC" opacity="0.6" />
            <line x1="0" y1="-820" x2="0" y2="40" stroke="#0284C7" strokeWidth="5" />
            <line x1="-50" y1="-400" x2="-40" y2="40" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

            <circle cx="0" cy="-820" r="28" fill="#FDE047" opacity="0.4" />
            <g transform={`translate(${vaporDrift1}, -900)`}>
              <circle cx="0" cy="-40" r="26" fill="#FFFFFF" opacity="0.8" />
              <circle cx="-25" cy="-80" r="34" fill="#F8FAFC" opacity="0.7" />
              <circle cx="20" cy="-140" r="42" fill="#F1F5F9" opacity="0.6" />
              <circle cx="-10" cy="-210" r="50" fill="#E2E8F0" opacity="0.5" />
            </g>
            <g transform={`translate(${vaporDrift2}, -920)`}>
              <path d="M 0 -20 Q 30 -80 -20 -150 Q 40 -220 0 -300" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" opacity="0.75" />
              <path d="M 15 -30 Q -25 -90 25 -160 Q -30 -230 15 -310" fill="none" stroke="#E0F2FE" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            </g>
          </g>

          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="480" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              SUBE DIRECTO EN VAPOR
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "diagrama_sublimacion_fases") {
    const f = frame;
    const pulse = 1 + Math.sin(f / 20) * 0.04;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="gridSublimacion" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1E293B" strokeWidth="2" />
            </pattern>
          </defs>

          <rect width="1080" height="1920" fill="#020617" />
          <rect width="1080" height="1920" fill="url(#gridSublimacion)" opacity="0.6" />

          {/* Rótulo superior */}
          <g transform="translate(180, 180)">
            <rect x="0" y="0" width="720" height="90" rx="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="6" />
            <text x="360" y="58" textAnchor="middle" fill="#38BDF8" fontSize="38" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              FENÓMENO: SUBLIMACIÓN
            </text>
          </g>

          {/* Medidores de presión barométrica y humedad */}
          <g transform="translate(120, 320)">
            <rect x="0" y="0" width="380" height="74" rx="10" fill="#1E293B" stroke="#EF4444" strokeWidth="4" />
            <text x="24" y="46" fill="#FCA5A5" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              PRESIÓN: 0.5 ATM (MUY BAJA)
            </text>
          </g>
          <g transform="translate(580, 320)">
            <rect x="0" y="0" width="380" height="74" rx="10" fill="#1E293B" stroke="#F59E0B" strokeWidth="4" />
            <text x="24" y="46" fill="#FDE047" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              HUMEDAD: 0% (AIRE SECO)
            </text>
          </g>

          {/* 1. SÓLIDO */}
          <g transform="translate(200, 780)">
            <rect x="-80" y="-80" width="160" height="160" rx="16" fill="#38BDF8" stroke="#000000" strokeWidth="6" />
            <polygon points="-80,-80 0,-120 160,-120 80,-80" fill="#BAE6FD" stroke="#000000" strokeWidth="5" />
            <polygon points="80,-80 160,-120 160,40 80,80" fill="#0284C7" stroke="#000000" strokeWidth="5" />
            <text x="0" y="125" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              SÓLIDO (HIELO)
            </text>
          </g>

          {/* 2. LÍQUIDO TACHADO */}
          <g transform="translate(540, 780)">
            <polygon points="-60,-70 60,-70 45,70 -45,70" fill="#E0F2FE" opacity="0.3" stroke="#000000" strokeWidth="5" />
            <ellipse cx="0" cy="20" rx="42" ry="16" fill="#0284C7" />
            <text x="0" y="125" textAnchor="middle" fill="#94A3B8" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              LÍQUIDO
            </text>
            <g transform={`scale(${pulse})`}>
              <line x1="-90" y1="-90" x2="90" y2="90" stroke="#EF4444" strokeWidth="16" strokeLinecap="round" />
              <line x1="90" y1="-90" x2="-90" y2="90" stroke="#EF4444" strokeWidth="16" strokeLinecap="round" />
              <line x1="-90" y1="-90" x2="90" y2="90" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
              <line x1="90" y1="-90" x2="-90" y2="90" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            </g>
          </g>

          {/* 3. GAS */}
          <g transform="translate(880, 780)">
            <ellipse cx="0" cy="0" rx="75" ry="48" fill="#F8FAFC" stroke="#000000" strokeWidth="6" />
            <circle cx="-35" cy="-25" r="38" fill="#F8FAFC" stroke="#000000" strokeWidth="6" />
            <circle cx="35" cy="-25" r="38" fill="#F8FAFC" stroke="#000000" strokeWidth="6" />
            <circle cx="0" cy="-45" r="42" fill="#F8FAFC" />
            <text x="0" y="125" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              GAS (VAPOR)
            </text>
          </g>

          {/* FLECHA DIRECTA */}
          <g transform="translate(0, 520)">
            <path
              d="M 220 120 C 380 -40, 700 -40, 860 120"
              fill="none"
              stroke="#EF4444"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 220 120 C 380 -40, 700 -40, 860 120"
              fill="none"
              stroke="#FFE600"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <polygon points="880,140 850,90 820,130" fill="#EF4444" stroke="#000000" strokeWidth="4" />
            <rect x="360" y="-30" width="360" height="54" rx="10" fill="#EF4444" stroke="#000000" strokeWidth="4" />
            <text x="540" y="6" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              SALTA DIRECTO SIN AGUA
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "corte_geologico_timelapse_solar") {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="nieveCorte" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>
            <linearGradient id="rocaCorte" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#291002" />
            </linearGradient>
          </defs>

          <rect width="1080" height="900" fill="#0284C7" />
          <circle cx="540" cy="120" r="80" fill="#FDE047" stroke="#000000" strokeWidth="6" />

          <g transform="translate(0, 940)">
            <rect x="0" y="420" width="1080" height="560" fill="url(#rocaCorte)" stroke="#000000" strokeWidth="8" />

            <path
              d="M 0,0 
                 L 120,-180 Q 240,320 360,-220 
                 Q 480,340 600,-240 
                 Q 720,330 840,-200 
                 Q 960,350 1080,-190 
                 L 1080,420 L 0,420 Z"
              fill="url(#nieveCorte)"
              stroke="#000000"
              strokeWidth="8"
            />

            <g transform="translate(0, -200)">
              <line x1="220" y1="-300" x2="235" y2="380" stroke="#FACC15" strokeWidth="7" strokeDasharray="16 8" />
              <line x1="235" y1="380" x2="270" y2="300" stroke="#EF4444" strokeWidth="6" />
              <line x1="470" y1="-300" x2="480" y2="400" stroke="#FACC15" strokeWidth="7" strokeDasharray="16 8" />
              <line x1="480" y1="400" x2="520" y2="320" stroke="#EF4444" strokeWidth="6" />
              <line x1="710" y1="-300" x2="720" y2="390" stroke="#FACC15" strokeWidth="7" strokeDasharray="16 8" />
              <line x1="720" y1="390" x2="760" y2="310" stroke="#EF4444" strokeWidth="6" />
            </g>

            <circle cx="240" cy="240" r="24" fill="#FFFFFF" opacity="0.7" />
            <circle cx="480" cy="250" r="28" fill="#FFFFFF" opacity="0.7" />
            <circle cx="720" cy="245" r="26" fill="#FFFFFF" opacity="0.7" />
          </g>

          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#FFE600" strokeWidth="5" />
            <text x="24" y="46" fill="#FFE600" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              LOS HUECOS ATRAPAN CALOR Y CAVAN
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "ejercito_penitentes_sol") {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0C4A6E]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloSolAndino" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#082F49" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>
            <linearGradient id="hieloInclinado" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#cieloSolAndino)" />

          <g transform="translate(540, 240)">
            <circle cx="0" cy="0" r="160" fill="#FEF08A" opacity="0.3" />
            <circle cx="0" cy="0" r="110" fill="#FDE047" stroke="#000000" strokeWidth="7" />
            <circle cx="0" cy="0" r="80" fill="#FFFFFF" />
            {[...Array(16)].map((_, i) => {
              const ang = (i * 22.5 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={Math.cos(ang) * 120}
                  y1={Math.sin(ang) * 120}
                  x2={Math.cos(ang) * 180}
                  y2={Math.sin(ang) * 180}
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          <polygon points="-60,1320 1140,1260 1140,1920 -60,1920" fill="#451A03" stroke="#000000" strokeWidth="8" />

          {[
            { x: 80, y: 1360, h: 420, w: 70, rot: -18 },
            { x: 220, y: 1340, h: 460, w: 75, rot: -18 },
            { x: 380, y: 1320, h: 500, w: 80, rot: -18 },
            { x: 540, y: 1300, h: 540, w: 85, rot: -18 },
            { x: 700, y: 1320, h: 490, w: 80, rot: -18 },
            { x: 860, y: 1340, h: 450, w: 75, rot: -18 },
            { x: 1000, y: 1360, h: 410, w: 70, rot: -18 },
          ].map((p, i) => (
            <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(${p.rot})`}>
              <ellipse cx={-p.w * 0.9} cy={20} rx={p.w * 1.6} ry={16} fill="#020617" opacity="0.45" />
              <polygon
                points={`0,-${p.h} ${p.w * 0.5},0 -${p.w * 0.5},0`}
                fill="url(#hieloInclinado)"
                stroke="#000000"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <polygon points={`0,-${p.h} ${p.w * 0.45},0 0,0`} fill="#BAE6FD" opacity="0.8" />
              <line x1="0" y1={-p.h} x2="0" y2="0" stroke="#0369A1" strokeWidth="5" />
              <line x1={-p.w * 0.25} y1={-p.h * 0.6} x2={-p.w * 0.15} y2="0" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            </g>
          ))}

          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="520" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ALINEADOS CON EL SOL DEL MEDIODÍA
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "atardecer_andino_despedida") {
    const f = frame;
    const snowDust = Math.sin(f / 20) * 20;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#312E81]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="atardecerAndino" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="35%" stopColor="#831843" />
              <stop offset="70%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
            <linearGradient id="sueloAtardecer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#431407" />
              <stop offset="100%" stopColor="#1C0A00" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#atardecerAndino)" />
          <circle cx="340" cy="820" r="140" fill="#FEF08A" opacity="0.8" />
          <polygon points="-60,940 180,680 440,860 720,620 980,820 1140,700 1140,1400 -60,1400" fill="#2E1065" stroke="#000000" strokeWidth="8" />
          <polygon points="-60,1260 1140,1200 1140,1920 -60,1920" fill="url(#sueloAtardecer)" stroke="#000000" strokeWidth="8" />

          {[
            { x: 80, y: 1320, h: 320, w: 55 },
            { x: 220, y: 1280, h: 380, w: 60 },
            { x: 380, y: 1300, h: 350, w: 58 },
            { x: 560, y: 1260, h: 420, w: 68 },
            { x: 740, y: 1310, h: 360, w: 60 },
            { x: 920, y: 1270, h: 400, w: 65 },
          ].map((p, i) => (
            <g key={i} transform={`translate(${p.x}, ${p.y}) rotate(14)`}>
              <polygon
                points={`0,-${p.h} ${p.w * 0.5},0 -${p.w * 0.5},0`}
                fill="#4A044E"
                stroke="#FDE047"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <line x1="0" y1={-p.h} x2="0" y2="0" stroke="#FDE047" strokeWidth="3" />
            </g>
          ))}

          <g transform={`translate(${snowDust}, 0)`}>
            {[...Array(14)].map((_, i) => {
              const px = 100 + ((i * 73) % 900);
              const py = 600 + ((i * 89) % 700);
              const sz = 4 + (i % 5);
              return <circle key={i} cx={px} cy={py} r={sz} fill="#FFFFFF" opacity="0.8" />;
            })}
          </g>

          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="540" height="72" rx="12" fill="#020617" stroke="#FDE047" strokeWidth="5" />
            <text x="24" y="46" fill="#FDE047" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              CUCHILLOS DE VAPOR ETERNO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "crater_kawah_ijen_noche") {
    const f = frame;
    const flameWave = Math.sin(f / 12) * 10;
    const blueGlow = 0.5 + 0.3 * Math.sin(f / 16);
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloKawahNoche" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="60%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#1C2541" />
            </linearGradient>
            <linearGradient id="fuegoAzulElectrico" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#67E8F9" />
              <stop offset="60%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#4338CA" />
            </linearGradient>
            <linearGradient id="basaltoNegro" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>

          {/* Fondo nocturno */}
          <rect width="1080" height="1920" fill="url(#cieloKawahNoche)" />

          {/* Resplandor azul cobalto volumétrico en el fondo */}
          <ellipse cx="640" cy="1180" rx="480" ry="320" fill="#2563EB" opacity={blueGlow * 0.45} />
          <ellipse cx="680" cy="1240" rx="300" ry="180" fill="#38BDF8" opacity={blueGlow * 0.35} />

          {/* Paredes rocosas de basalto escarpadas del cráter */}
          <polygon points="-60,780 240,640 480,820 180,1400 -60,1400" fill="url(#basaltoNegro)" stroke="#000000" strokeWidth="8" />
          <polygon points="1140,620 740,780 620,1100 1140,1400" fill="url(#basaltoNegro)" stroke="#000000" strokeWidth="8" />

          {/* Cascada y río de fuego azul cobalto líquido que fluye y gotea */}
          <g transform={`translate(${flameWave}, 0)`}>
            {/* Veta principal de fuego azul */}
            <path
              d="M 680,680 
                 Q 620,840 720,980 
                 Q 800,1120 640,1280 
                 Q 560,1420 740,1580 
                 L 860,1540 
                 Q 700,1380 780,1240 
                 Q 880,1080 780,940 
                 Q 720,820 780,680 Z"
              fill="url(#fuegoAzulElectrico)"
              stroke="#000000"
              strokeWidth="6"
            />
            {/* Núcleo blanco brillante de alta temperatura */}
            <path
              d="M 700,740 Q 660,880 740,1000 Q 820,1140 680,1280 Q 640,1380 750,1480"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Gotas ardientes que se desprenden */}
            <circle cx="620" cy="1160" r="16" fill="#38BDF8" stroke="#000000" strokeWidth="3" />
            <circle cx="580" cy="1320" r="20" fill="#60A5FA" stroke="#000000" strokeWidth="3" />
            <circle cx="670" cy="1460" r="14" fill="#93C5FD" stroke="#000000" strokeWidth="2.5" />
          </g>

          {/* Suelo volcánico inferior */}
          <polygon points="-60,1380 1140,1300 1140,1920 -60,1920" fill="#0F172A" stroke="#000000" strokeWidth="8" />
          {/* Manchas de azufre sobre la roca */}
          <ellipse cx="320" cy="1540" rx="90" ry="24" fill="#CA8A04" opacity="0.6" stroke="#000000" strokeWidth="3" />
          <ellipse cx="880" cy="1620" rx="120" ry="32" fill="#CA8A04" opacity="0.6" stroke="#000000" strokeWidth="3" />

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="480" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              VOLCÁN KAWAH IJEN · NOCHE
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "crater_gas_toxico_azufre") {
    const f = frame;
    const smokePuff1 = Math.sin(f / 10) * 18;
    const smokePuff2 = Math.cos(f / 14) * 24;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="nubeSulfurosa" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#FACC15" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#E2E8F0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Fondo oscuro de cráter */}
          <rect width="1080" height="1920" fill="#090D16" />

          {/* Roca agrietada de donde emana el gas */}
          <polygon points="120,1360 480,940 860,1180 960,1920 -60,1920" fill="#1E293B" stroke="#000000" strokeWidth="8" />

          {/* Grieta volcánica abierta */}
          <path d="M 460 980 Q 420 1140 480 1340" stroke="#000000" strokeWidth="18" fill="none" />
          <path d="M 460 980 Q 420 1140 480 1340" stroke="#EAB308" strokeWidth="6" fill="none" opacity="0.8" />

          {/* Enorme nube de gas sulfuroso amarillo-blanquecino saliendo con violencia */}
          <g transform={`translate(${smokePuff1}, -60)`}>
            <ellipse cx="460" cy="980" rx="140" ry="110" fill="url(#nubeSulfurosa)" />
            <ellipse cx="560" cy="840" rx="220" ry="170" fill="url(#nubeSulfurosa)" />
            <ellipse cx="420" cy="700" rx="280" ry="210" fill="url(#nubeSulfurosa)" />
            <ellipse cx="580" cy="540" rx="340" ry="240" fill="url(#nubeSulfurosa)" />
          </g>

          <g transform={`translate(${smokePuff2}, 0)`}>
            <circle cx="360" cy="880" r="90" fill="#FEF08A" opacity="0.6" />
            <circle cx="580" cy="760" r="120" fill="#FDE047" opacity="0.5" />
            <circle cx="480" cy="620" r="140" fill="#E2E8F0" opacity="0.6" />
          </g>

          {/* Suelo pedregoso con costras amarillas */}
          <polygon points="-60,1440 1140,1400 1140,1920 -60,1920" fill="#020617" stroke="#000000" strokeWidth="8" />

          {/* Rótulo de alerta química */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#DC2626" stroke="#000000" strokeWidth="5" />
            <text x="24" y="46" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ¡PUÑETAZO TÓXICO: GAS DE AZUFRE!
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "corte_subsuelo_olla_presion") {
    const f = frame;
    const bubbleRise1 = (f * 5) % 400;
    const bubbleRise2 = ((f + 30) * 5) % 400;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="magmaRojoComun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="30%" stopColor="#F97316" />
              <stop offset="70%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>
            <linearGradient id="rocaSubsuelo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Fondo rocoso geológico */}
          <rect width="1080" height="1920" fill="url(#rocaSubsuelo)" />

          {/* Superficie exterior arriba */}
          <rect x="0" y="0" width="1080" height="380" fill="#020617" stroke="#000000" strokeWidth="8" />
          <path d="M 540 380 L 540 680" stroke="#000000" strokeWidth="24" strokeLinecap="round" />
          <path d="M 540 380 L 540 680" stroke="#EAB308" strokeWidth="12" strokeLinecap="round" />

          {/* Conducto estrecho a alta presión (efecto chimenea) */}
          <g transform="translate(540, 680)">
            <rect x="-40" y="0" width="80" height="580" fill="#0F172A" stroke="#000000" strokeWidth="6" />
            {/* Flechas rojas de presión extrema subiendo */}
            <path d="M 0 540 L 0 60 M -20 120 L 0 50 L 20 120" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 0 340 L 0 160 M -20 200 L 0 150 L 20 200" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" fill="none" />

            {/* Burbujas de gas azufrado disparadas hacia arriba */}
            <circle cx="-12" cy={540 - bubbleRise1} r="18" fill="#FACC15" stroke="#000000" strokeWidth="3" />
            <circle cx="14" cy={540 - bubbleRise2} r="22" fill="#FEF08A" stroke="#000000" strokeWidth="3" />
          </g>

          {/* Rótulo del conducto de gas */}
          <g transform="translate(620, 840)">
            <rect x="0" y="0" width="380" height="66" rx="10" fill="#020617" stroke="#FACC15" strokeWidth="4" />
            <text x="20" y="42" fill="#FACC15" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              GAS DE AZUFRE A &gt; 600 °C
            </text>
          </g>

          {/* Cámara magmática profunda abajo: LAVA ROJA HABITUAL */}
          <g transform="translate(0, 1260)">
            <rect x="0" y="0" width="1080" height="660" fill="url(#magmaRojoComun)" stroke="#000000" strokeWidth="10" />
            {/* Olas y burbujas de roca fundida roja */}
            <ellipse cx="260" cy="180" rx="90" ry="32" fill="#FEF08A" stroke="#000000" strokeWidth="4" />
            <ellipse cx="780" cy="240" rx="140" ry="40" fill="#FEF08A" stroke="#000000" strokeWidth="4" />
            <text x="540" y="100" textAnchor="middle" fill="#FFFFFF" fontSize="34" fontWeight="900" fontFamily="'Arial Black', sans-serif" stroke="#000000" strokeWidth="3">
              ROCA FUNDIDA: ROJA TRADICIONAL
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#EF4444" strokeWidth="5" />
            <text x="24" y="46" fill="#EF4444" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              LA LAVA NO ES AZUL · ES ROJA
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "macro_soplete_autoignicion") {
    const f = frame;
    const flameFlicker = Math.sin(f * 2.2) * 12;
    const flameScale = 1 + Math.sin(f / 6) * 0.08;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="llamaSopleteAzul" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#4338CA" />
              <stop offset="25%" stopColor="#2563EB" />
              <stop offset="55%" stopColor="#38BDF8" />
              <stop offset="85%" stopColor="#A5F3FC" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="#0B132B" />

          {/* Bloque de roca basáltica con la boquilla/fisura */}
          <polygon points="-60,1180 540,1120 1140,1180 1140,1920 -60,1920" fill="#0F172A" stroke="#000000" strokeWidth="10" />

          {/* Boquilla de la fisura por donde sale el gas */}
          <g transform="translate(540, 1120)">
            <ellipse cx="0" cy="0" rx="90" ry="34" fill="#000000" stroke="#713F12" strokeWidth="8" />

            {/* Chorro de gas transparente previo */}
            <path d="M -30 0 L -40 -120 L 40 -120 L 30 0 Z" fill="#FEF08A" opacity="0.3" />

            {/* LLAMA AZUL TIPO SOPLETE INDUSTRIAL GIGANTE */}
            <g transform={`translate(${flameFlicker}, -100) scale(${flameScale})`}>
              {/* Llama exterior azul intenso */}
              <path
                d="M -90,0 
                   Q -160,-240 -60,-480 
                   Q 0,-680 0,-760 
                   Q 0,-680 60,-480 
                   Q 160,-240 90,0 Z"
                fill="url(#llamaSopleteAzul)"
                stroke="#000000"
                strokeWidth="6"
              />
              {/* Núcleo cónico interior blanco-celeste de altísima temperatura */}
              <path
                d="M -40,0 
                   Q -70,-160 -25,-320 
                   Q 0,-440 0,-480 
                   Q 0,-440 25,-320 
                   Q 70,-160 40,0 Z"
                fill="#FFFFFF"
                opacity="0.95"
              />
              {/* Vértice violeta en la base */}
              <ellipse cx="0" cy="-20" rx="60" ry="24" fill="#A855F7" opacity="0.75" />
            </g>

            {/* Moléculas de Oxígeno (O2) que entran en contacto */}
            <g transform="translate(-240, -320)">
              <circle cx="-16" cy="0" r="22" fill="#0284C7" stroke="#000000" strokeWidth="3" />
              <circle cx="16" cy="0" r="22" fill="#0284C7" stroke="#000000" strokeWidth="3" />
              <text x="0" y="8" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900">O₂</text>
            </g>
            <g transform="translate(260, -360)">
              <circle cx="-16" cy="0" r="22" fill="#0284C7" stroke="#000000" strokeWidth="3" />
              <circle cx="16" cy="0" r="22" fill="#0284C7" stroke="#000000" strokeWidth="3" />
              <text x="0" y="8" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900">O₂</text>
            </g>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              AUTOIGNICIÓN EN CONTACTO CON O₂
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "ladera_azufre_liquido_flujo") {
    const f = frame;
    const dripY = (f * 6) % 320;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="azufreLiquidoAzul" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="40%" stopColor="#3B82F6" />
              <stop offset="80%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#581C87" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="#0B132B" />

          {/* Laderas basálticas escalonadas */}
          <polygon points="-60,840 440,780 380,1180 -60,1180" fill="#1E293B" stroke="#000000" strokeWidth="8" />
          <polygon points="360,1140 820,1080 760,1540 280,1540" fill="#1E293B" stroke="#000000" strokeWidth="8" />
          <polygon points="260,1500 1140,1440 1140,1920 -60,1920" fill="#0F172A" stroke="#000000" strokeWidth="8" />

          {/* Riachuelo de azufre líquido que gotea y corre ardiendo */}
          <path
            d="M 380,780 
               Q 440,940 380,1140 
               L 440,1140 
               Q 500,940 440,780 Z"
            fill="url(#azufreLiquidoAzul)"
            stroke="#000000"
            strokeWidth="5"
          />
          <path
            d="M 400,1140 
               Q 540,1320 740,1500 
               L 800,1500 
               Q 580,1300 440,1140 Z"
            fill="url(#azufreLiquidoAzul)"
            stroke="#000000"
            strokeWidth="5"
          />

          {/* Gotas de azufre fundido cayendo de la cornisa */}
          <g transform={`translate(390, ${1140 + dripY})`}>
            <ellipse cx="0" cy="0" rx="14" ry="24" fill="#60A5FA" stroke="#000000" strokeWidth="3" />
            <circle cx="0" cy="6" r="8" fill="#FFFFFF" />
          </g>

          {/* Llamitas azules sobre el líquido */}
          {[
            { x: 410, y: 920 },
            { x: 520, y: 1280 },
            { x: 680, y: 1440 },
          ].map((pt, i) => (
            <polygon
              key={i}
              points={`${pt.x},-25 ${pt.x + 12},0 ${pt.x - 12},0`}
              transform={`translate(0, ${pt.y})`}
              fill="#93C5FD"
              stroke="#2563EB"
              strokeWidth="2.5"
            />
          ))}

          {/* Rótulo explicativo */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="580" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              AZUFRE LÍQUIDO CONDENSADO ARDIENDO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "crater_kawah_ijen_dia") {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#38BDF8]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloDiaJava" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
            <linearGradient id="azufreSolidoCanario" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FACC15" />
              <stop offset="80%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>

          {/* Cielo tropical diurno brillante */}
          <rect width="1080" height="1920" fill="url(#cieloDiaJava)" />

          {/* Sol resplandeciente */}
          <circle cx="880" cy="240" r="120" fill="#FEF08A" opacity="0.4" />
          <circle cx="880" cy="240" r="85" fill="#FDE047" stroke="#000000" strokeWidth="6" />

          {/* Crestas del cráter bajo la luz diurna */}
          <polygon points="-60,940 280,680 620,880 1140,660 1140,1400 -60,1400" fill="#64748B" stroke="#000000" strokeWidth="8" />

          {/* ENORMES COSTRAMENTOS Y BLOQUES DE AZUFRE AMARILLO SÓLIDO */}
          <g transform="translate(0, 1180)">
            <polygon points="-60,240 380,80 720,160 1140,60 1140,740 -60,740" fill="#475569" stroke="#000000" strokeWidth="8" />

            {/* Rocas de azufre amarillo puro */}
            <polygon points="120,80 260,-120 380,80" fill="url(#azufreSolidoCanario)" stroke="#000000" strokeWidth="7" />
            <polygon points="340,140 480,-80 580,140" fill="url(#azufreSolidoCanario)" stroke="#000000" strokeWidth="7" />
            <polygon points="680,80 840,-140 980,80" fill="url(#azufreSolidoCanario)" stroke="#000000" strokeWidth="7" />

            {/* Columnas de fumarola blanca diurna */}
            <ellipse cx="260" cy="-180" rx="35" ry="70" fill="#FFFFFF" opacity="0.75" />
            <ellipse cx="480" cy="-140" rx="45" ry="85" fill="#FFFFFF" opacity="0.75" />
            <ellipse cx="840" cy="-210" rx="55" ry="100" fill="#FFFFFF" opacity="0.75" />
          </g>

          {/* Rótulo explicativo del misterio diurno */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#FACC15" strokeWidth="5" />
            <text x="24" y="46" fill="#FACC15" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              DE DÍA: LA LLAMA ES INVISIBLE
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "panoramica_kawah_ijen_cierre") {
    const f = frame;
    const glowPulse = 0.6 + 0.3 * Math.sin(f / 20);
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloCierreNoche" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="60%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
            <linearGradient id="lagoAcido" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#cieloCierreNoche)" />

          {/* Resplandor azul general en la caldera */}
          <circle cx="540" cy="1100" r="480" fill="#2563EB" opacity={glowPulse * 0.35} />

          {/* Silueta de la caldera completa de Kawah Ijen */}
          <polygon points="-60,780 240,640 520,780 840,620 1140,760 1140,1500 -60,1500" fill="#0F172A" stroke="#000000" strokeWidth="8" />

          {/* Lago de ácido sulfúrico turquesa en el fondo del cráter */}
          <ellipse cx="540" cy="1120" rx="360" ry="110" fill="url(#lagoAcido)" stroke="#000000" strokeWidth="6" />

          {/* Múltiples vetas de fuego azul cobalto serpenteando en la noche */}
          <path d="M 220 740 Q 300 900 340 1080" stroke="#38BDF8" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M 220 740 Q 300 900 340 1080" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" />

          <path d="M 760 700 Q 680 880 710 1060" stroke="#38BDF8" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M 760 700 Q 680 880 710 1060" stroke="#FFFFFF" strokeWidth="6" fill="none" strokeLinecap="round" />

          {/* Roca segura donde se sienta el Stickman en primer plano */}
          <polygon points="120,1460 740,1400 940,1920 -60,1920" fill="#1E293B" stroke="#000000" strokeWidth="8" />

          {/* Rótulo de cierre poético */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              EL SOPLETE NATURAL MÁS HERMOSO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "vertedero_botellas_pet") {
    const f = frame;
    const calendarFlap = (f * 1.8) % 360;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#334155]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloVertedero" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="60%" stopColor="#334155" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="botellaPlastico" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#cieloVertedero)" />

          {/* Calendario con páginas pasando a toda velocidad */}
          <g transform="translate(820, 340)">
            <rect x="-60" y="-80" width="120" height="160" rx="10" fill="#F8FAFC" stroke="#000000" strokeWidth="6" />
            <rect x="-60" y="-80" width="120" height="40" fill="#EF4444" stroke="#000000" strokeWidth="4" />
            <text x="0" y="-52" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">AÑOS</text>
            <text x="0" y="24" textAnchor="middle" fill="#0F172A" fontSize="42" fontWeight="900" fontFamily="'Arial Black', sans-serif">+400</text>
            {/* Hoja volando */}
            <g transform={`rotate(${calendarFlap})`}>
              <rect x="-50" y="-30" width="100" height="70" rx="4" fill="#E2E8F0" opacity="0.7" stroke="#000000" strokeWidth="2" />
            </g>
          </g>

          {/* Montaña asfixiante de botellas de plástico PET */}
          <g transform="translate(0, 880)">
            <polygon points="-60,400 320,120 720,260 1140,80 1140,1040 -60,1040" fill="#64748B" stroke="#000000" strokeWidth="8" />

            {/* Múltiples botellas apiladas */}
            {[
              { x: 120, y: 320, rot: 25 },
              { x: 260, y: 220, rot: -40 },
              { x: 420, y: 280, rot: 15 },
              { x: 580, y: 190, rot: -18 },
              { x: 740, y: 260, rot: 35 },
              { x: 880, y: 180, rot: -28 },
              { x: 200, y: 440, rot: 60 },
              { x: 480, y: 400, rot: -10 },
              { x: 780, y: 420, rot: -45 },
              { x: 960, y: 360, rot: 20 },
            ].map((b, i) => (
              <g key={i} transform={`translate(${b.x}, ${b.y}) rotate(${b.rot})`}>
                <rect x="-20" y="-45" width="40" height="90" rx="12" fill="url(#botellaPlastico)" stroke="#000000" strokeWidth="4.5" />
                <rect x="-10" y="-55" width="20" height="12" rx="3" fill="#0284C7" stroke="#000000" strokeWidth="3" />
                <rect x="-18" y="-10" width="36" height="24" fill="#38BDF8" opacity="0.75" />
              </g>
            ))}
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#EF4444" strokeWidth="5" />
            <text x="24" y="46" fill="#EF4444" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              UNA BOTELLA: +400 AÑOS VIVA
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "planta_reciclaje_petri_japon") {
    const f = frame;
    const petriePulse = 1 + Math.sin(f / 12) * 0.04;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="plantaIndustrial" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <radialGradient id="agarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#FACC15" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#EAB308" stopOpacity="0.5" />
            </radialGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#plantaIndustrial)" />

          {/* Silueta de silos industriales de reciclaje en Sakai, Japón */}
          <g transform="translate(0, 480)">
            <rect x="80" y="0" width="160" height="420" rx="20" fill="#334155" stroke="#000000" strokeWidth="6" />
            <rect x="300" y="80" width="180" height="340" rx="20" fill="#1E293B" stroke="#000000" strokeWidth="6" />
            <rect x="840" y="40" width="160" height="380" rx="20" fill="#334155" stroke="#000000" strokeWidth="6" />
            <line x1="0" y1="420" x2="1080" y2="420" stroke="#000000" strokeWidth="8" />
          </g>

          {/* Gran Placa de Petri iluminada en el centro */}
          <g transform={`translate(540, 1160) scale(${petriePulse})`}>
            {/* Borde exterior de vidrio */}
            <circle cx="0" cy="0" r="300" fill="#E0F2FE" fillOpacity="0.25" stroke="#000000" strokeWidth="10" />
            <circle cx="0" cy="0" r="260" fill="url(#agarGlow)" stroke="#000000" strokeWidth="6" />

            {/* Pedacitos de plástico PET en el cultivo */}
            <rect x="-120" y="-80" width="45" height="30" rx="4" fill="#38BDF8" opacity="0.8" stroke="#000000" strokeWidth="3" />
            <rect x="60" y="40" width="55" height="35" rx="5" fill="#38BDF8" opacity="0.8" stroke="#000000" strokeWidth="3" />
            <rect x="-40" y="100" width="40" height="25" rx="4" fill="#38BDF8" opacity="0.8" stroke="#000000" strokeWidth="3" />

            {/* Colonias de bacterias Ideonella sakaiensis multiplicándose */}
            {[
              { x: -90, y: -60, r: 24 },
              { x: 80, y: 60, r: 28 },
              { x: -20, y: 90, r: 22 },
              { x: 40, y: -110, r: 20 },
              { x: -140, y: 40, r: 26 },
              { x: 120, y: -40, r: 22 },
            ].map((col, i) => (
              <g key={i} transform={`translate(${col.x}, ${col.y})`}>
                <circle cx="0" cy="0" r={col.r} fill="#22C55E" stroke="#000000" strokeWidth="3.5" />
                <circle cx="-col.r * 0.3" cy="-col.r * 0.3" r={col.r * 0.3} fill="#86EFAC" />
              </g>
            ))}
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              DESCUBIERTA EN SAKAI, JAPÓN
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "parque_mascota_bacteria") {
    const f = frame;
    const petBounce = Math.sin(f / 8) * 14;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#38BDF8]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloParque" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="60%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
            <linearGradient id="cespedParque" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="40%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#cieloParque)" />

          {/* Sol brillante */}
          <circle cx="860" cy="260" r="90" fill="#FDE047" stroke="#000000" strokeWidth="6" />

          {/* Árboles en el horizonte */}
          <g transform="translate(0, 1020)">
            <ellipse cx="180" cy="80" rx="90" ry="120" fill="#15803D" stroke="#000000" strokeWidth="6" />
            <ellipse cx="880" cy="60" rx="110" ry="140" fill="#16A34A" stroke="#000000" strokeWidth="6" />
          </g>

          {/* Suelo verde del parque */}
          <polygon points="-60,1260 1140,1220 1140,1920 -60,1920" fill="url(#cespedParque)" stroke="#000000" strokeWidth="8" />

          {/* Bacteria mascota gigante sentada esperando su premio plástico */}
          <g transform={`translate(740, ${1340 + petBounce})`}>
            {/* Sombra en el césped */}
            <ellipse cx="0" cy="120" rx="160" ry="32" fill="#0F172A" opacity="0.3" />

            {/* Cuerpo ameboide verde */}
            <path
              d="M -130,60 
                 C -160,-60 -90,-160 0,-170 
                 C 90,-160 160,-60 130,60 
                 C 100,140 -100,140 -130,60 Z"
              fill="#22C55E"
              stroke="#000000"
              strokeWidth="9"
            />
            {/* Ojos saltones de cachorro */}
            <circle cx="-45" cy="-80" r="38" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
            <circle cx="-35" cy="-80" r="18" fill="#0F172A" />
            <circle cx="-30" cy="-86" r="6" fill="#FFFFFF" />

            <circle cx="45" cy="-80" r="38" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
            <circle cx="35" cy="-80" r="18" fill="#0F172A" />
            <circle cx="40" cy="-86" r="6" fill="#FFFFFF" />

            {/* Lengua gelatinosa alegre jadeando */}
            <ellipse cx="0" cy="18" rx="28" ry="42" fill="#F43F5E" stroke="#000000" strokeWidth="5" />
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="540" height="72" rx="12" fill="#020617" stroke="#FFE600" strokeWidth="5" />
            <text x="24" y="46" fill="#FFE600" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              MASCOTA DEVORADORA DE PET
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "microcosmos_polimero_petasa") {
    const f = frame;
    const cutSpark = (f * 3) % 20;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="bloquePET" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="#090D16" />

          {/* Muralla molecular de polímeros entrelazados (Ladrillos PET) */}
          <g transform="translate(0, 720)">
            {[...Array(6)].map((_, row) => (
              <g key={row} transform={`translate(0, ${row * 130})`}>
                {[...Array(5)].map((_, col) => {
                  const xOffset = row % 2 === 0 ? 0 : 110;
                  const bx = col * 230 - 60 + xOffset;
                  return (
                    <g key={col} transform={`translate(${bx}, 0)`}>
                      <rect x="0" y="0" width="200" height="100" rx="14" fill="url(#bloquePET)" stroke="#000000" strokeWidth="6" />
                      <line x1="20" y1="50" x2="180" y2="50" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="8 6" opacity="0.6" />
                      <text x="100" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">PET</text>
                    </g>
                  );
                })}
              </g>
            ))}

            {/* Tijera molecular gigante PETasa cortando un enlace en vivo */}
            <g transform="translate(480, 260) rotate(-25)">
              <circle cx="-35" cy="50" r="24" fill="none" stroke="#C084FC" strokeWidth="8" />
              <circle cx="35" cy="50" r="24" fill="none" stroke="#C084FC" strokeWidth="8" />
              <line x1="-28" y1="32" x2="35" y2="-55" stroke="#C084FC" strokeWidth="12" strokeLinecap="round" />
              <line x1="28" y1="32" x2="-35" y2="-55" stroke="#C084FC" strokeWidth="12" strokeLinecap="round" />
              <circle cx="0" cy="0" r="10" fill="#FACC15" stroke="#000000" strokeWidth="3" />
              {/* Chispas de corte */}
              <polygon points="0,-75 10,-60 25,-65 14,-50 20,-35 4,-45 -8,-35 -4,-50 -18,-60 -5,-65" fill="#FFE600" />
            </g>
          </g>

          {/* Rótulo explicativo */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#A855F7" strokeWidth="5" />
            <text x="24" y="46" fill="#C084FC" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ENZIMA PETASA: CORTA POLÍMEROS
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "metabolismo_mhetasa_powerup") {
    const f = frame;
    const powerLevel = Math.min(100, 15 + ((f * 2.5) % 100));
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="bateriaVerde" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="40%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="#061A2B" />

          {/* Medidor de Batería / Energía metabólica recargándose */}
          <g transform="translate(240, 420)">
            <rect x="0" y="0" width="600" height="110" rx="18" fill="#0F172A" stroke="#000000" strokeWidth="8" />
            <rect x="600" y="30" width="30" height="50" rx="8" fill="#64748B" stroke="#000000" strokeWidth="5" />
            {/* Barra interna */}
            <rect x="15" y="15" width={(570 * powerLevel) / 100} height="80" rx="12" fill="url(#bateriaVerde)" stroke="#000000" strokeWidth="4" />
            <text x="300" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontWeight="900" fontFamily="'Arial Black', sans-serif" stroke="#000000" strokeWidth="3">
              ENERGÍA: {Math.round(powerLevel)}%
            </text>
          </g>

          {/* Esferas doradas de nutrientes (ácido tereftálico y etilenglicol) */}
          <g transform="translate(0, 920)">
            {[
              { x: 220, y: 120 },
              { x: 380, y: 240 },
              { x: 540, y: 140 },
              { x: 700, y: 260 },
              { x: 860, y: 160 },
            ].map((n, i) => (
              <g key={i} transform={`translate(${n.x}, ${n.y})`}>
                <circle cx="0" cy="0" r="42" fill="#FACC15" stroke="#000000" strokeWidth="5" />
                <circle cx="-12" cy="-12" r="14" fill="#FEF08A" />
                <text x="0" y="8" textAnchor="middle" fill="#713F12" fontSize="16" fontWeight="900">NUTRIENTE</text>
              </g>
            ))}

            {/* Tijera MHETasa naranja */}
            <g transform="translate(540, 360) rotate(20)">
              <circle cx="-30" cy="45" r="22" fill="none" stroke="#FB923C" strokeWidth="7" />
              <circle cx="30" cy="45" r="22" fill="none" stroke="#FB923C" strokeWidth="7" />
              <line x1="-24" y1="28" x2="30" y2="-48" stroke="#FB923C" strokeWidth="10" strokeLinecap="round" />
              <line x1="24" y1="28" x2="-30" y2="-48" stroke="#FB923C" strokeWidth="10" strokeLinecap="round" />
            </g>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#22C55E" strokeWidth="5" />
            <text x="24" y="46" fill="#4ADE80" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              MHETASA: CONVERSIÓN EN ALIMENTO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "laboratorio_mutacion_x6") {
    const f = frame;
    const vortexRot = (f * 14) % 360;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <rect width="1080" height="1920" fill="#0B132B" />

          {/* Consola de aceleración genética */}
          <g transform="translate(120, 380)">
            <rect x="0" y="0" width="420" height="200" rx="16" fill="#1E293B" stroke="#000000" strokeWidth="6" />
            <circle cx="100" cy="100" r="60" fill="#0F172A" stroke="#22C55E" strokeWidth="6" />
            <text x="100" y="112" textAnchor="middle" fill="#4ADE80" fontSize="34" fontWeight="900" fontFamily="'Arial Black', sans-serif">x6</text>
            <rect x="200" y="50" width="180" height="45" rx="8" fill="#020617" stroke="#38BDF8" strokeWidth="4" />
            <text x="290" y="82" textAnchor="middle" fill="#38BDF8" fontSize="22" fontWeight="900">VELOCIDAD</text>
          </g>

          {/* Rayo láser excitador disparando a la criatura */}
          <line x1="540" y1="480" x2="720" y2="820" stroke="#22C55E" strokeWidth="12" strokeLinecap="round" />
          <line x1="540" y1="480" x2="720" y2="820" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />

          {/* Vórtice Pac-Man de consumo rápido devorando el vertedero */}
          <g transform={`translate(720, 1240) rotate(${vortexRot})`}>
            <circle cx="0" cy="0" r="220" fill="none" stroke="#22C55E" strokeWidth="18" strokeDasharray="90 40" />
            <circle cx="0" cy="0" r="160" fill="none" stroke="#4ADE80" strokeWidth="14" strokeDasharray="70 30" />
            <circle cx="0" cy="0" r="100" fill="#16A34A" stroke="#000000" strokeWidth="6" />
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#22C55E" strokeWidth="5" />
            <text x="24" y="46" fill="#4ADE80" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ENZIMAS MUTADAS: x6 MÁS RÁPIDAS
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (escenario === "calle_verde_paseo_final") {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#38BDF8]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloLimpio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="60%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#cieloLimpio)" />

          {/* Sol alegre */}
          <circle cx="860" cy="240" r="85" fill="#FDE047" stroke="#000000" strokeWidth="6" />

          {/* Ciudad verde con árboles modernos y edificios ecológicos */}
          <g transform="translate(0, 960)">
            <rect x="80" y="80" width="220" height="380" rx="14" fill="#94A3B8" stroke="#000000" strokeWidth="6" />
            <rect x="360" y="160" width="180" height="300" rx="14" fill="#CBD5E1" stroke="#000000" strokeWidth="6" />
            <rect x="800" y="60" width="240" height="400" rx="14" fill="#94A3B8" stroke="#000000" strokeWidth="6" />
            {/* Árboles verdes frondosos */}
            <circle cx="340" cy="240" r="75" fill="#22C55E" stroke="#000000" strokeWidth="6" />
            <circle cx="760" cy="220" r="85" fill="#16A34A" stroke="#000000" strokeWidth="6" />
          </g>

          {/* Acera y calle urbana impecable */}
          <polygon points="-60,1380 1140,1340 1140,1920 -60,1920" fill="#E2E8F0" stroke="#000000" strokeWidth="8" />

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#22C55E" strokeWidth="5" />
            <text x="24" y="46" fill="#4ADE80" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              EL FUTURO DEL RECICLAJE BIOLÓGICO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 1. AUTOPISTA EN FUGA (Líneas de velocidad, asfalto veloz, horizonte dinámico)
  if (escenario === "autopista_en_fuga") {
    const roadOffset = (frame * 24) % 120;
    const mountainDrift = Math.sin(frame / 60) * 10;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#38BDF8]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloAutopista" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
            <linearGradient id="asfaltoPerspectiva" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Cielo y sol brillante */}
          <rect width="1080" height="1920" fill="url(#cieloAutopista)" />
          <circle cx="920" cy="220" r="80" fill="#FDE047" stroke="#000000" strokeWidth="6" />

          {/* Montañas en horizonte con parallax suave */}
          <g transform={`translate(${mountainDrift}, 720)`}>
            <polygon points="-100,260 220,60 540,260" fill="#64748B" stroke="#000000" strokeWidth="6" />
            <polygon points="380,260 760,40 1180,260" fill="#475569" stroke="#000000" strokeWidth="6" />
            <polygon points="120,260 380,100 640,260" fill="#94A3B8" stroke="#000000" strokeWidth="5" opacity="0.6" />
          </g>

          {/* Suelo de autopista en fuga geométrica */}
          <polygon points="460,960 620,960 1180,1920 -100,1920" fill="url(#asfaltoPerspectiva)" stroke="#000000" strokeWidth="8" />
          
          {/* Quitamiedos metálicos laterales con rayas diagonales de advertencia */}
          <polygon points="440,960 460,960 -80,1920 -120,1920" fill="#CBD5E1" stroke="#000000" strokeWidth="6" />
          <polygon points="620,960 640,960 1200,1920 1160,1920" fill="#CBD5E1" stroke="#000000" strokeWidth="6" />

          {/* Línea divisoria central discontinua en perspectiva acelerada */}
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
            const yStart = 980 + Math.pow((idx * 130 + roadOffset) / 900, 2) * 880;
            const h = 40 + (yStart - 960) * 0.12;
            const w = 12 + (yStart - 960) * 0.04;
            if (yStart > 1920 || yStart < 960) return null;
            return (
              <rect
                key={idx}
                x={540 - w / 2}
                y={yStart}
                width={w}
                height={h}
                rx={w / 3}
                fill="#FDE047"
                stroke="#000000"
                strokeWidth={3}
              />
            );
          })}

          {/* Líneas horizontales de viento y velocidad supersónica */}
          {[1060, 1220, 1400, 1580, 1740].map((ly, i) => {
            const lineX = ((frame * 35 + i * 220) % 1400) - 200;
            return (
              <line
                key={i}
                x1={lineX}
                y1={ly}
                x2={lineX + 160}
                y2={ly}
                stroke="#FFFFFF"
                strokeWidth={6}
                strokeLinecap="round"
                opacity={0.7}
              />
            );
          })}

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="560" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              AUTOPISTA A 120 KM/H
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 2. ESTUDIO PAUSA FOTOGRAMAS (Congelado cinematográfico, tira de película, sombra flotante)
  if (escenario === "estudio_pausa_fotogramas") {
    const pulseGlow = 0.7 + 0.3 * Math.sin(frame / 6);
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0B0F19]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="estudioSpot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0B0F19" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Fondo cuadriculado técnico */}
          <rect width="1080" height="1920" fill="url(#estudioSpot)" />
          <g opacity="0.15">
            {[...Array(19)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 100} x2="1080" y2={i * 100} stroke="#38BDF8" strokeWidth="2" />
            ))}
            {[...Array(11)].map((_, i) => (
              <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="1920" stroke="#38BDF8" strokeWidth="2" />
            ))}
          </g>

          {/* Sombra elíptica suave bajo la rueda suspendida */}
          <ellipse cx="540" cy="1160" rx="180" ry="34" fill="#020617" opacity="0.75" />

          {/* Ícono gigante de PAUSA [ || ] brillante */}
          <g transform="translate(540, 460)">
            <circle cx="0" cy="0" r="85" fill="#020617" stroke="#FDE047" strokeWidth="8" opacity={pulseGlow} />
            <rect x="-35" y="-45" width="26" height="90" rx="8" fill="#FDE047" stroke="#000000" strokeWidth="4" />
            <rect x="9" y="-45" width="26" height="90" rx="8" fill="#FDE047" stroke="#000000" strokeWidth="4" />
            <text x="0" y="130" textAnchor="middle" fill="#FDE047" fontSize="26" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              TIEMPO CONGELADO
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="72" rx="12" fill="#020617" stroke="#FDE047" strokeWidth="5" />
            <text x="24" y="46" fill="#FDE047" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              EFECTO ESTROBOSCÓPICO: MUNDO DISCRETO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 3. ESTUDIO RELOJ ESTROBOSCÓPICO (Diagrama polar de grados, marcadores 12, 11, 10 y vector inverso)
  if (escenario === "estudio_reloj_estroboscopico") {
    const flashOpacity = Math.sin(frame * 0.8) > 0.7 ? 0.35 : 0.05;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Fondo radar óptico */}
          <rect width="1080" height="1920" fill="#020617" />
          
          {/* Flash estroboscópico intermitente de fondo */}
          <rect width="1080" height="1920" fill="#38BDF8" opacity={flashOpacity} />

          {/* Cuadrícula polar concéntrica */}
          <g transform="translate(540, 920)">
            {[180, 280, 380, 480].map((r, i) => (
              <circle key={i} cx="0" cy="0" r={r} fill="none" stroke="#1E293B" strokeWidth="4" strokeDasharray={i % 2 === 0 ? "8 6" : "none"} />
            ))}
            {/* Ejes ortogonales y diagonales */}
            <line x1="-500" y1="0" x2="500" y2="0" stroke="#1E293B" strokeWidth="3" />
            <line x1="0" y1="-500" x2="0" y2="500" stroke="#1E293B" strokeWidth="3" />
            
            {/* Números y marcas del reloj */}
            <circle cx="0" cy="-340" r="32" fill="#EF4444" stroke="#000000" strokeWidth="5" />
            <text x="0" y="-328" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">12</text>
            <text x="0" y="-390" textAnchor="middle" fill="#EF4444" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">FOTO 1</text>

            <circle cx="-170" cy="-295" r="32" fill="#F59E0B" stroke="#000000" strokeWidth="5" />
            <text x="-170" y="-283" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">11</text>
            <text x="-230" y="-330" textAnchor="middle" fill="#F59E0B" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">FOTO 2</text>

            <circle cx="-295" cy="-170" r="32" fill="#FBBF24" stroke="#000000" strokeWidth="5" />
            <text x="-295" y="-158" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">10</text>
            <text x="-370" y="-170" textAnchor="middle" fill="#FBBF24" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">FOTO 3</text>

            {/* Gran flecha curva punteada mostrando la ilusión de reversa */}
            <path
              d="M 0 -340 A 340 340 0 0 0 -295 -170"
              fill="none"
              stroke="#EF4444"
              strokeWidth="10"
              strokeDasharray="14 10"
              strokeLinecap="round"
            />
            {/* Punta de flecha en reversa */}
            <polygon points="-295,-170 -265,-210 -250,-165" fill="#EF4444" stroke="#000000" strokeWidth="4" />

            <text x="-180" y="-100" textAnchor="middle" fill="#EF4444" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ↺ GIRO APARENTE EN REVERSA
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="620" height="72" rx="12" fill="#020617" stroke="#EF4444" strokeWidth="5" />
            <text x="24" y="46" fill="#F87171" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              EL CEREBRO ELIGE EL CAMINO MÁS CORTO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 4. HELIPUERTO DESPEGUE EXTERIOR (Pista de concreto con H, manga de viento, ráfagas de aire)
  if (escenario === "helipuerto_despegue_exterior") {
    const windWiggle = Math.sin(frame / 6) * 12;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#38BDF8]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloHelipuerto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="60%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>

          {/* Cielo abierto */}
          <rect width="1080" height="1920" fill="url(#cieloHelipuerto)" />

          {/* Nubes flotantes */}
          <g transform="translate(0, 320)" opacity="0.85">
            <ellipse cx="240" cy="40" rx="140" ry="50" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />
            <ellipse cx="820" cy="80" rx="180" ry="60" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />
          </g>

          {/* Pista de helipuerto en concreto */}
          <polygon points="-100,1180 1180,1180 1180,1920 -100,1920" fill="#64748B" stroke="#000000" strokeWidth="8" />

          {/* Gran marca circular de helipuerto con H amarilla */}
          <g transform="translate(540, 1500)">
            <ellipse cx="0" cy="0" rx="360" ry="120" fill="#475569" stroke="#FDE047" strokeWidth="14" />
            <text x="0" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="130" fontWeight="900" fontFamily="'Arial Black', sans-serif" stroke="#000000" strokeWidth="8" paintOrder="stroke fill">
              H
            </text>
          </g>

          {/* Manga de viento ondeando al vendaval */}
          <g transform="translate(920, 1140)">
            <line x1="0" y1="0" x2="0" y2="-220" stroke="#000000" strokeWidth="8" />
            <g transform={`translate(0, -220) rotate(${windWiggle})`}>
              <polygon points="0,-18 140,-10 140,10 0,18" fill="#EF4444" stroke="#000000" strokeWidth="4" />
              <polygon points="35,-16 70,-14 70,14 35,16" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
              <polygon points="105,-12 140,-10 140,10 105,12" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
            </g>
          </g>

          {/* Gráfico de RPM en la esquina */}
          <g transform="translate(80, 460)">
            <rect x="0" y="0" width="240" height="90" rx="14" fill="#020617" stroke="#EF4444" strokeWidth="5" />
            <text x="18" y="38" fill="#EF4444" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ROTOR RPM:
            </text>
            <text x="18" y="74" fill="#FDE047" fontSize="32" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              {Math.min(950, 400 + Math.round(frame * 6.5))} RPM
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="580" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              HÉLICES A TODA VELOCIDAD
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 5. HELIPUERTO CÁMARA TRÍPODE (HUD de visor LCD, retícula REC, 60 FPS == 60 RPS, aspas congeladas)
  if (escenario === "helipuerto_camara_tripode") {
    const blinkRec = Math.sin(frame / 4) > 0;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0284C7]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Cielo y helipuerto de fondo */}
          <rect width="1080" height="1920" fill="#38BDF8" />
          <polygon points="-100,1260 1180,1260 1180,1920 -100,1920" fill="#64748B" stroke="#000000" strokeWidth="8" />

          {/* Superposición cinemática: Marco de visor de cámara LCD digital */}
          <rect x="50" y="270" width="980" height="1420" rx="24" fill="none" stroke="#22C55E" strokeWidth="6" opacity="0.8" />
          
          {/* Esquinas de enfoque estilo visor */}
          <path d="M 80 340 L 80 300 L 120 300" fill="none" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" />
          <path d="M 1000 340 L 1000 300 L 960 300" fill="none" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" />
          <path d="M 80 1620 L 80 1660 L 120 1660" fill="none" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" />
          <path d="M 1000 1620 L 1000 1660 L 960 1660" fill="none" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" />

          {/* Retícula central de enfoque */}
          <circle cx="540" cy="880" r="60" fill="none" stroke="#22C55E" strokeWidth="4" strokeDasharray="10 8" />
          <line x1="510" y1="880" x2="570" y2="880" stroke="#22C55E" strokeWidth="4" />
          <line x1="540" y1="850" x2="540" y2="910" stroke="#22C55E" strokeWidth="4" />

          {/* Indicador REC ● parpadeante */}
          <g transform="translate(100, 330)">
            <circle cx="20" cy="20" r="14" fill={blinkRec ? "#EF4444" : "#7F1D1D"} stroke="#000000" strokeWidth="3" />
            <text x="46" y="28" fill="#EF4444" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              REC
            </text>
          </g>

          {/* Datos técnicos de obturador y cuadro */}
          <g transform="translate(680, 330)">
            <rect x="0" y="0" width="310" height="74" rx="10" fill="#020617" stroke="#22C55E" strokeWidth="3" />
            <text x="18" y="32" fill="#4ADE80" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              60 FPS == 60 RPS
            </text>
            <text x="18" y="58" fill="#FDE047" fontSize="18" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              SHUTTER: 1/60s (LOCK)
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="620" height="72" rx="12" fill="#020617" stroke="#22C55E" strokeWidth="5" />
            <text x="24" y="46" fill="#4ADE80" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              SINCRONIZACIÓN: HÉLICES INMÓVILES
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 6. HABITACIÓN VENTILADOR POV (Efecto subjetivo con pestañas y persianas estroboscópicas)
  if (escenario === "habitacion_ventilador_pov") {
    // Parpadeo ultra-rápido de párpados simulando la visión estroboscópica humana
    const blinkCycle = Math.sin(frame * 1.4);
    const eyelidClose = Math.max(0, blinkCycle) * 320;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Pared interior con luz cálida de lámpara */}
          <rect width="1080" height="1920" fill="#1E293B" />
          
          {/* Patrón de pared interior */}
          <g opacity="0.12">
            {[...Array(20)].map((_, i) => (
              <line key={i} x1="0" y1={i * 90} x2="1080" y2={i * 90} stroke="#F8FAFC" strokeWidth="2" />
            ))}
          </g>

          {/* Mesa doméstica y piso */}
          <polygon points="-80,1360 1160,1360 1160,1920 -80,1920" fill="#78350F" stroke="#000000" strokeWidth="8" />

          {/* Párpado superior e inferior cerrándose a toda velocidad (POV Humano) */}
          <rect x="0" y="0" width="1080" height={eyelidClose} fill="#020617" />
          <rect x="0" y={1920 - eyelidClose} width="1080" height={eyelidClose} fill="#020617" />
          
          {/* Pestañas estilizadas del POV en el borde de los párpados */}
          {eyelidClose > 50 && (
            <g stroke="#000000" strokeWidth="6" strokeLinecap="round">
              {[...Array(14)].map((_, i) => (
                <line
                  key={`top-${i}`}
                  x1={80 + i * 70}
                  y1={eyelidClose}
                  x2={80 + i * 70 + (i % 2 === 0 ? 12 : -12)}
                  y2={eyelidClose + 24}
                />
              ))}
              {[...Array(14)].map((_, i) => (
                <line
                  key={`bot-${i}`}
                  x1={80 + i * 70}
                  y1={1920 - eyelidClose}
                  x2={80 + i * 70 + (i % 2 === 0 ? 12 : -12)}
                  y2={1920 - eyelidClose - 24}
                />
              ))}
            </g>
          )}

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="72" rx="12" fill="#020617" stroke="#FDE047" strokeWidth="5" />
            <text x="24" y="46" fill="#FDE047" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              PARPADEO: OBTURADOR BIOLÓGICO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 7. HABITACIÓN MAREO CIERRE (Viñeta circular Iris Out, estrellitas orbitando, remate cómico)
  if (escenario === "habitacion_mareo_cierre") {
    const rotStars = frame * 4;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Pared y piso de madera */}
          <rect width="1080" height="1920" fill="#334155" />
          <polygon points="-80,1320 1160,1320 1160,1920 -80,1920" fill="#92400E" stroke="#000000" strokeWidth="8" />

          {/* Estrellitas amarillas y pajaritos de caricatura orbitando en círculo de mareo */}
          <g transform={`translate(540, 780) rotate(${rotStars})`}>
            {[0, 72, 144, 216, 288].map((ang, i) => {
              const rad = (ang * Math.PI) / 180;
              const sx = Math.cos(rad) * 220;
              const sy = Math.sin(rad) * 90;
              return (
                <g key={i} transform={`translate(${sx}, ${sy}) rotate(${-rotStars})`}>
                  <polygon
                    points="0,-22 6,-6 22,-6 10,4 14,20 0,10 -14,20 -10,4 -22,-6 -6,-6"
                    fill="#FDE047"
                    stroke="#000000"
                    strokeWidth="3.5"
                  />
                </g>
              );
            })}
          </g>

          {/* Viñeta circular oscura tipo Iris-Out de caricatura clásica */}
          <defs>
            <mask id="irisOutMask">
              <rect width="1080" height="1920" fill="#FFFFFF" />
              <circle cx="540" cy="980" r="460" fill="#000000" />
            </mask>
          </defs>
          <rect width="1080" height="1920" fill="#020617" opacity="0.65" mask="url(#irisOutMask)" />
          <circle cx="540" cy="980" r="460" fill="none" stroke="#000000" strokeWidth="18" />

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="580" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              EL CEREBRO PROCESA FOTOGRAMAS
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 1. LAGO NATRON: ORILLA ROJA (Lago rojo escarlata, costras de salitre, vapor térmico)
  if (escenario === "lago_natron_orilla_roja") {
    const steamWave = Math.sin(frame / 14) * 15;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#7F1D1D]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloNatron" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C2410C" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#FED7AA" />
            </linearGradient>
            <linearGradient id="aguaRojaNatron" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#991B1B" />
              <stop offset="50%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>
          </defs>

          {/* Cielo árido y sol abrasador */}
          <rect width="1080" height="1920" fill="url(#cieloNatron)" />
          <circle cx="880" cy="240" r="90" fill="#FEF08A" stroke="#000000" strokeWidth="6" />

          {/* Cordillera volcánica lejana en el horizonte */}
          <polygon points="-80,880 260,680 620,880" fill="#7C2D12" stroke="#000000" strokeWidth="6" />
          <polygon points="480,880 840,640 1180,880" fill="#451A03" stroke="#000000" strokeWidth="6" />

          {/* Lago plano de agua roja sangre escarlata */}
          <rect x="-80" y="860" width="1240" height="520" fill="url(#aguaRojaNatron)" stroke="#000000" strokeWidth="8" />

          {/* Bruma / vapor térmico ondulante sobre el lago */}
          <g transform={`translate(${steamWave}, 0)`} opacity="0.35">
            {[200, 480, 760, 940].map((sx, i) => (
              <path
                key={i}
                d={`M ${sx} 900 Q ${sx + 40} 820 ${sx - 20} 740 T ${sx + 20} 660`}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="12"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Orilla cáustica agrietada de salitre blanco y minerales */}
          <polygon points="-80,1320 1160,1320 1160,1920 -80,1920" fill="#F1F5F9" stroke="#000000" strokeWidth="8" />
          
          {/* Costras geométricas de sal mineral poligonales */}
          <g stroke="#000000" strokeWidth="4" fill="#E2E8F0">
            <polygon points="60,1400 160,1360 220,1440 120,1480" />
            <polygon points="320,1440 440,1380 500,1460 400,1520" />
            <polygon points="680,1390 800,1360 860,1450 740,1490" />
            <polygon points="140,1580 280,1540 340,1660 200,1700" fill="#CBD5E1" />
            <polygon points="560,1580 720,1530 800,1650 640,1710" fill="#CBD5E1" />
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="580" height="72" rx="12" fill="#020617" stroke="#EF4444" strokeWidth="5" />
            <text x="24" y="46" fill="#F87171" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              LAGO NATRON: AGUAS ESCARLATAS
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 2. LAGO NATRON: MACRO CONTACTO (Rama retorcida, mapa con pin en Tanzania, orilla)
  if (escenario === "lago_natron_macro_contacto") {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#7F1D1D]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Fondo de agua roja escarlata y orilla salina */}
          <rect width="1080" height="1920" fill="#991B1B" />
          <polygon points="-80,1260 1160,1260 1160,1920 -80,1920" fill="#F8FAFC" stroke="#000000" strokeWidth="8" />

          {/* Gran rama seca retorcida leñosa en primer plano */}
          <g transform="translate(480, 1260)">
            <path
              d="M -560 80 Q -320 20 -100 0 Q 120 -20 340 -120 Q 440 -160 580 -200"
              fill="none"
              stroke="#78350F"
              strokeWidth="32"
              strokeLinecap="round"
            />
            {/* Rama secundaria bifurcada */}
            <path
              d="M 120 -20 Q 220 60 380 90"
              fill="none"
              stroke="#78350F"
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Costras blancas de cal en la corteza */}
            <path
              d="M -80 0 Q 120 -20 300 -110"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeDasharray="14 10"
            />
          </g>

          {/* Mapa miniatura estilizado de África en la esquina con pin en Tanzania */}
          <g transform="translate(740, 260)">
            <rect x="0" y="0" width="260" height="260" rx="20" fill="#020617" stroke="#FDE047" strokeWidth="5" />
            {/* Silueta vectorial esquemática de África */}
            <path
              d="M 60 40 L 180 40 L 220 90 L 190 140 L 140 220 L 100 220 L 60 120 Z"
              fill="#22C55E"
              stroke="#000000"
              strokeWidth="3.5"
            />
            {/* Pin rojo brillante en Tanzania (costa este) */}
            <circle cx="170" cy="120" r="12" fill="#EF4444" stroke="#000000" strokeWidth="3" />
            <polygon points="170,132 163,124 177,124" fill="#EF4444" />
            <text x="130" y="246" textAnchor="middle" fill="#FDE047" fontSize="16" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              TANZANIA
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="580" height="72" rx="12" fill="#020617" stroke="#FDE047" strokeWidth="5" />
            <text x="24" y="46" fill="#FDE047" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              CALCIFICACIÓN BIOLÓGICA REAL
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 3. LAGO NATRON: TEST pH ALCALINO (Escala cromática de pH morado, termómetro de 60°C)
  if (escenario === "lago_natron_test_ph_alcalino") {
    const boilBubbles = Math.sin(frame * 2.5) * 6;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#7F1D1D]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Fondo de agua cáustica y cielo humeante */}
          <rect width="1080" height="1920" fill="#991B1B" />
          <polygon points="-80,1340 1160,1340 1160,1920 -80,1920" fill="#E2E8F0" stroke="#000000" strokeWidth="8" />

          {/* Escala cromática vertical de pH (de neutro verde 7 a morado cáustico 12) */}
          <g transform="translate(80, 480)">
            <rect x="0" y="0" width="160" height="480" rx="16" fill="#020617" stroke="#000000" strokeWidth="6" />
            <rect x="15" y="20" width="130" height="70" fill="#A855F7" stroke="#000000" strokeWidth="3" />
            <text x="80" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">pH 12</text>
            
            <rect x="15" y="90" width="130" height="70" fill="#8B5CF6" stroke="#000000" strokeWidth="3" />
            <text x="80" y="135" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">pH 11</text>
            
            <rect x="15" y="160" width="130" height="70" fill="#3B82F6" stroke="#000000" strokeWidth="3" />
            <text x="80" y="205" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">pH 10</text>
            
            <rect x="15" y="230" width="130" height="70" fill="#06B6D4" stroke="#000000" strokeWidth="3" />
            <text x="80" y="275" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">pH 9</text>
            
            <rect x="15" y="300" width="130" height="70" fill="#10B981" stroke="#000000" strokeWidth="3" />
            <text x="80" y="345" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">pH 8</text>
            
            <rect x="15" y="370" width="130" height="85" fill="#22C55E" stroke="#000000" strokeWidth="3" />
            <text x="80" y="420" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">pH 7 (AGUA)</text>

            {/* Gran flecha indicadora en pH 11.5 */}
            <polygon points="160,55 195,35 195,75" fill="#EF4444" stroke="#000000" strokeWidth="4" />
          </g>

          {/* Termómetro gigante con mercurio caliente a 60 °C */}
          <g transform="translate(840, 520)">
            <rect x="25" y="0" width="40" height="340" rx="20" fill="#F8FAFC" stroke="#000000" strokeWidth="6" />
            <circle cx="45" cy="360" r="50" fill="#EF4444" stroke="#000000" strokeWidth="6" />
            <rect x="35" y={`calc(60px + ${boilBubbles}px)`} width="20" height="280" rx="10" fill="#EF4444" />
            <text x="45" y="460" textAnchor="middle" fill="#EF4444" fontSize="32" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              60 °C
            </text>
            <text x="45" y="495" textAnchor="middle" fill="#020617" fontSize="18" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ¡HIRVIENDO!
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="72" rx="12" fill="#020617" stroke="#A855F7" strokeWidth="5" />
            <text x="24" y="46" fill="#C084FC" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              QUÍMICA CÁUSTICA: pH 11 - 12
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 4. VOLCÁN OL DOINYO LENGAI (Estratovolcán negro, ceniza de carbonatita, cristales Na2CO3)
  if (escenario === "volcan_ol_doinyo_lengai") {
    const ashFall = (frame * 5) % 180;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#1E293B]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Cielo oscurecido por cenizas volcánicas */}
          <rect width="1080" height="1920" fill="#334155" />

          {/* Cono majestuoso del volcán Ol Doinyo Lengai */}
          <polygon points="120,1100 540,460 960,1100" fill="#0F172A" stroke="#000000" strokeWidth="8" />
          {/* Fumarolas y lava carbonatita negra oscura */}
          <polygon points="500,460 540,540 580,460" fill="#1E293B" />
          <path d="M 520 460 Q 540 580 530 720" stroke="#020617" strokeWidth="16" fill="none" />

          {/* Enorme penacho de ceniza mineral expandiéndose en el cielo */}
          <g transform="translate(540, 360)">
            <circle cx="0" cy="-60" r="160" fill="#475569" opacity="0.85" />
            <circle cx="-120" cy="-40" r="120" fill="#64748B" opacity="0.8" />
            <circle cx="120" cy="-40" r="120" fill="#64748B" opacity="0.8" />
          </g>

          {/* Lago rojo al pie del volcán */}
          <rect x="-80" y="1080" width="1240" height="320" fill="#991B1B" stroke="#000000" strokeWidth="8" />
          <polygon points="-80,1360 1160,1360 1160,1920 -80,1920" fill="#F1F5F9" stroke="#000000" strokeWidth="8" />

          {/* Lluvia de partículas de ceniza y cristales de natrón Na2CO3 cayendo */}
          {[...Array(16)].map((_, i) => {
            const cx = (i * 70 + (frame * 2)) % 1080;
            const cy = (i * 120 + ashFall) % 1920;
            return (
              <g key={i} transform={`translate(${cx}, ${cy})`}>
                <polygon points="0,-12 10,0 0,12 -10,0" fill="#F8FAFC" stroke="#000000" strokeWidth="2" opacity="0.75" />
              </g>
            );
          })}

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="620" height="72" rx="12" fill="#020617" stroke="#FDE047" strokeWidth="5" />
            <text x="24" y="46" fill="#FDE047" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              VOLCÁN OL DOINYO LENGAI: NATRÓN
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 5. LAGO NATRON: ESPEJO MORTAL (Plano cenital, reflejo perfecto de cielo, extracción H2O)
  if (escenario === "lago_natron_espejo_mortal") {
    const ripple = (frame * 3) % 240;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#991B1B]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Superficie líquida roja con reflejo de nubes celestes (espejo perfecto) */}
          <rect width="1080" height="1920" fill="#B91C1C" />

          {/* Reflejo idéntico del cielo en el agua quieta */}
          <g opacity="0.45">
            <ellipse cx="320" cy="540" rx="280" ry="90" fill="#E0F2FE" />
            <ellipse cx="760" cy="980" rx="340" ry="110" fill="#E0F2FE" />
          </g>

          {/* Ondas concéntricas de impacto en el centro del espejo */}
          <g transform="translate(540, 960)">
            {[ripple, (ripple + 80) % 240, (ripple + 160) % 240].map((r, idx) => (
              <circle
                key={idx}
                cx="0"
                cy="0"
                r={r}
                fill="none"
                stroke="#FEF08A"
                strokeWidth={5}
                opacity={Math.max(0, 1 - r / 240)}
              />
            ))}
          </g>

          {/* Vectores azules de deshidratación molecular (H2O saliendo del cuerpo) */}
          {[120, 240, 360, 480].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const vx = Math.cos(rad) * 220;
            const vy = Math.sin(rad) * 220;
            return (
              <g key={i} transform={`translate(${540 + vx}, ${960 + vy})`}>
                <line x1="0" y1="0" x2={Math.cos(rad) * 60} y2={Math.sin(rad) * 60} stroke="#38BDF8" strokeWidth="6" strokeDasharray="8 6" />
                <text x="10" y="24" fill="#38BDF8" fontSize="18" fontWeight="900" fontFamily="'Arial Black', sans-serif">H₂O</text>
              </g>
            );
          })}

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="620" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ESPEJO MORTAL: DESHIDRATACIÓN TOTAL
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 6. LAGO NATRON: CALCIFICACIÓN TIMELAPSE (Iluminación crepuscular rasante, pedestal mineral de sal)
  if (escenario === "lago_natron_calcificacion_timelapse") {
    const shimmer = 0.5 + 0.5 * Math.sin(frame / 5);
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#7C2D12]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="crepusculoNatron" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#451A03" />
              <stop offset="60%" stopColor="#991B1B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>

          {/* Cielo crepuscular dramático */}
          <rect width="1080" height="1920" fill="url(#crepusculoNatron)" />

          {/* Pedestal mineral de salitre endurecido en la orilla seca */}
          <polygon points="-80,1280 1160,1280 1160,1920 -80,1920" fill="#CBD5E1" stroke="#000000" strokeWidth="8" />

          {/* Pedestal central de sal caliza esculpida */}
          <g transform="translate(540, 1260)">
            <polygon points="-160,60 160,60 220,180 -220,180" fill="#F8FAFC" stroke="#000000" strokeWidth="6" />
            <polygon points="-120,0 120,0 160,60 -160,60" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />
            {/* Destellos de cristales de sal mineral brillante */}
            <circle cx="-60" cy="30" r="12" fill="#FDE047" opacity={shimmer} />
            <circle cx="80" cy="40" r="10" fill="#FDE047" opacity={shimmer} />
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="580" height="72" rx="12" fill="#020617" stroke="#FDE047" strokeWidth="5" />
            <text x="24" y="46" fill="#FDE047" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              CORAZA DE CAL Y MOMIFICACIÓN
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 7. LAGO NATRON: FLAMENCOS PARAÍSO (Atardecer rosado, colonia de flamencos felices en agua roja)
  if (escenario === "lago_natron_flamencos_paraiso") {
    const bobbing = Math.sin(frame / 10) * 8;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#F97316]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="atardecerFlamencos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C026D3" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
          </defs>

          {/* Cielo atardecer rosado y dorado */}
          <rect width="1080" height="1920" fill="url(#atardecerFlamencos)" />
          <circle cx="540" cy="620" r="140" fill="#FEF08A" stroke="#000000" strokeWidth="8" />

          {/* Lago escarlata con reflejos dorados */}
          <rect x="-80" y="940" width="1240" height="520" fill="#991B1B" stroke="#000000" strokeWidth="8" />
          <polygon points="-80,1420 1160,1420 1160,1920 -80,1920" fill="#F1F5F9" stroke="#000000" strokeWidth="8" />

          {/* Siluetas de flamencos menores en el lago de fondo */}
          <g transform={`translate(0, ${bobbing})`}>
            {[180, 320, 720, 880].map((fx, idx) => (
              <g key={idx} transform={`translate(${fx}, 1020)`}>
                {/* Cuerpo del flamenco rosado */}
                <ellipse cx="0" cy="0" rx="36" ry="24" fill="#FB7185" stroke="#000000" strokeWidth="4" />
                {/* Cuello largo en S */}
                <path d="M 24 -10 Q 40 -50 20 -80 Q 8 -100 24 -110" fill="none" stroke="#FB7185" strokeWidth="12" strokeLinecap="round" />
                {/* Cabeza y pico curvado */}
                <circle cx="28" cy="-110" r="14" fill="#FB7185" stroke="#000000" strokeWidth="3" />
                <path d="M 36 -112 Q 52 -112 48 -94" fill="none" stroke="#000000" strokeWidth="7" strokeLinecap="round" />
                {/* Patas largas zancudas */}
                <line x1="-10" y1="20" x2="-10" y2="120" stroke="#000000" strokeWidth="5" />
                <line x1="10" y1="20" x2="10" y2="120" stroke="#000000" strokeWidth="5" />
              </g>
            ))}
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="72" rx="12" fill="#020617" stroke="#FB7185" strokeWidth="5" />
            <text x="24" y="46" fill="#FDA4AF" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              FLAMENCOS: INMUNES AL INFIERNO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 1. SELVA ANT MILL CENITAL (Vista aérea del vórtice circular de miles de hormigas en masa)
  if (escenario === "selva_ant_mill_cenital") {
    const vortexRot = (frame * 2.8) % 360;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#14532D]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="sueloSelvaCenital" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#14532D" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#052E16" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Suelo húmedo de selva tropical */}
          <rect width="1080" height="1920" fill="url(#sueloSelvaCenital)" />

          {/* Hojarasca dispersa en el suelo */}
          <g opacity="0.35" fill="#78350F" stroke="#000000" strokeWidth="2">
            {[...Array(18)].map((_, i) => (
              <ellipse
                key={i}
                cx={(i * 65 + 40) % 1080}
                cy={(i * 110 + 200) % 1920}
                rx={18 + (i % 8)}
                ry={9 + (i % 4)}
                transform={`rotate(${(i * 35) % 180} ${(i * 65 + 40) % 1080} ${(i * 110 + 200) % 1920})`}
              />
            ))}
          </g>

          {/* Gran vórtice circular de hormigas (Ant Mill) en rotación continua */}
          <g transform={`translate(540, 960) rotate(${vortexRot})`}>
            {/* Anillos concéntricos de marcha biológica */}
            {[220, 260, 300, 340, 380].map((radius, rIdx) => (
              <circle
                key={rIdx}
                cx="0"
                cy="0"
                r={radius}
                fill="none"
                stroke="#0F172A"
                strokeWidth={14 + (rIdx % 2) * 4}
                strokeDasharray="18 12 8 10"
              />
            ))}
            {/* Hormigas individuales en la corona del vórtice */}
            {[...Array(24)].map((_, i) => {
              const ang = (i * 15 * Math.PI) / 180;
              const rad = 280 + (i % 3) * 40;
              const hx = Math.cos(ang) * rad;
              const hy = Math.sin(ang) * rad;
              return (
                <circle key={i} cx={hx} cy={hy} r="6" fill="#000000" stroke="#334155" strokeWidth="2" />
              );
            })}
          </g>

          {/* Centro vacío del remolino con tierra pisoteada */}
          <circle cx="540" cy="960" r="160" fill="#1C1917" stroke="#000000" strokeWidth="8" opacity="0.75" />
          <text x="540" y="972" textAnchor="middle" fill="#FDE047" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
            CENTRO VACÍO
          </text>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="580" height="72" rx="12" fill="#020617" stroke="#EF4444" strokeWidth="5" />
            <text x="24" y="46" fill="#F87171" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              EL MOLINO DE LA MUERTE
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 2. SELVA SUELO MACRO FILA (Plano a ras de suelo, hojarasca, marcha imparable)
  if (escenario === "selva_suelo_macro_fila") {
    const marchX = (frame * 18) % 120;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#15803D]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Vegetación de fondo y suelo selvático */}
          <rect width="1080" height="1920" fill="#14532D" />
          <polygon points="-80,1280 1160,1280 1160,1920 -80,1920" fill="#365314" stroke="#000000" strokeWidth="8" />

          {/* Hojas grandes y raíces retorcidas en el suelo */}
          <g stroke="#000000" strokeWidth="6" fill="#713F12">
            <path d="M -80 1380 Q 240 1340 540 1440 T 1160 1400" fill="none" strokeWidth="28" strokeLinecap="round" />
            <ellipse cx="280" cy="1540" rx="160" ry="60" fill="#A16207" />
            <ellipse cx="840" cy="1620" rx="200" ry="70" fill="#854D0E" />
          </g>

          {/* Fila india acelerada de hormigas soldado en marcha continua */}
          <g transform={`translate(${marchX}, 0)`}>
            {[...Array(12)].map((_, i) => {
              const antX = i * 110 - 80;
              return (
                <g key={i} transform={`translate(${antX}, 1310)`}>
                  {/* Cuerpo de hormiga: cabeza, tórax, abdomen */}
                  <ellipse cx="-16" cy="0" rx="12" ry="8" fill="#0F172A" stroke="#000000" strokeWidth="3" />
                  <ellipse cx="0" cy="0" rx="8" ry="6" fill="#1E293B" stroke="#000000" strokeWidth="2.5" />
                  <ellipse cx="18" cy="0" rx="14" ry="10" fill="#0F172A" stroke="#000000" strokeWidth="3" />
                  {/* Mandíbulas en hoz */}
                  <path d="M -26 -4 Q -36 0 -26 4" fill="none" stroke="#FDE047" strokeWidth="3" />
                  {/* Patas en movimiento */}
                  <line x1="-6" y1="4" x2="-12" y2="16" stroke="#000000" strokeWidth="3" />
                  <line x1="2" y1="4" x2="2" y2="16" stroke="#000000" strokeWidth="3" />
                  <line x1="10" y1="4" x2="16" y2="16" stroke="#000000" strokeWidth="3" />
                </g>
              );
            })}
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="580" height="72" rx="12" fill="#020617" stroke="#FDE047" strokeWidth="5" />
            <text x="24" y="46" fill="#FDE047" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              MARCHA CIEGA IMPARABLE
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 3. MACRO ANATOMÍA CABEZA HORMIGA (Fondo oscuro, haz de luz de linterna, antenas sensoriales)
  if (escenario === "macro_anatomia_cabeza_hormiga") {
    const beamAngle = Math.sin(frame / 12) * 8;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#022C22]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Fondo macro oscuro de jungla nocturna */}
          <rect width="1080" height="1920" fill="#022C22" />

          {/* Haz de luz cónico brillante de linterna táctica barriendo la escena */}
          <g transform={`translate(180, 520) rotate(${beamAngle})`}>
            <polygon points="0,-20 860,-240 860,240 0,20" fill="#FEF08A" opacity="0.3" />
            <line x1="0" y1="0" x2="860" y2="0" stroke="#FFFFFF" strokeWidth="8" opacity="0.5" strokeDasharray="14 10" />
          </g>

          {/* Rótulos explicativos anatómicos */}
          <g transform="translate(620, 760)">
            <rect x="0" y="0" width="380" height="85" rx="14" fill="#020617" stroke="#EF4444" strokeWidth="4" />
            <text x="20" y="36" fill="#EF4444" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              OJOS VESTIGIALES:
            </text>
            <text x="20" y="68" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ¡100% CIEGAS A LA LUZ!
            </text>
          </g>

          <g transform="translate(620, 1100)">
            <rect x="0" y="0" width="380" height="85" rx="14" fill="#020617" stroke="#22C55E" strokeWidth="4" />
            <text x="20" y="36" fill="#22C55E" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ANTENAS TÁCTILES:
            </text>
            <text x="20" y="68" fill="#4ADE80" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              QUIMIORRECEPTORES
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="72" rx="12" fill="#020617" stroke="#22C55E" strokeWidth="5" />
            <text x="24" y="46" fill="#4ADE80" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              CEGUERA Y OLFATO QUÍMICO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 4. DIAGRAMA QUÍMICO FEROMONAS (Rastro verde neón brillante sobre tierra oscura, flechas vectoriales)
  if (escenario === "diagrama_quimico_feromonas") {
    const pulseTrail = 0.7 + 0.3 * Math.sin(frame / 6);
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Fondo oscuro técnico */}
          <rect width="1080" height="1920" fill="#020617" />
          
          {/* Cuadrícula sutil de seguimiento biológico */}
          <g opacity="0.12" stroke="#22C55E" strokeWidth="2">
            {[...Array(20)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 96} x2="1080" y2={i * 96} />
            ))}
            {[...Array(12)].map((_, i) => (
              <line key={`v-${i}`} x1={i * 96} y1="0" x2={i * 96} y2="1920" />
            ))}
          </g>

          {/* Gran rastro brillante de feromona verde neón en el suelo */}
          <g transform="translate(0, 1180)">
            <path
              d="M -60 0 Q 280 -80 540 0 T 1140 0"
              fill="none"
              stroke="#22C55E"
              strokeWidth="24"
              strokeLinecap="round"
              opacity={pulseTrail}
            />
            <path
              d="M -60 0 Q 280 -80 540 0 T 1140 0"
              fill="none"
              stroke="#86EFAC"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Flechas vectoriales de seguimiento químico paso a paso */}
            {[180, 420, 680, 920].map((ax, idx) => (
              <polygon
                key={idx}
                points={`${ax},-16 ${ax + 24},0 ${ax},16`}
                fill="#22C55E"
                stroke="#000000"
                strokeWidth="3"
              />
            ))}
            <text x="540" y="80" textAnchor="middle" fill="#4ADE80" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ESTELA DE FEROMONAS: GUÍA CIEGA
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="72" rx="12" fill="#020617" stroke="#22C55E" strokeWidth="5" />
            <text x="24" y="46" fill="#4ADE80" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              SEGUIMIENTO DE FEROMONAS
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 5. DIAGRAMA BUCLE CERRADO GLITCH (Círculo cerrado, bucle infinito, alerta roja parpadeante)
  if (escenario === "diagrama_bucle_cerrado_glitch") {
    const glitchBlink = Math.sin(frame * 1.8) > 0.3;
    const ringRot = (frame * 3.5) % 360;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Fondo radar de advertencia */}
          <rect width="1080" height="1920" fill="#0F172A" />

          {/* Círculo cerrado de retroalimentación infinita */}
          <g transform={`translate(540, 960) rotate(${ringRot})`}>
            <circle
              cx="0"
              cy="0"
              r="340"
              fill="none"
              stroke={glitchBlink ? "#EF4444" : "#22C55E"}
              strokeWidth="28"
              strokeDasharray="40 20"
            />
            <circle
              cx="0"
              cy="0"
              r="340"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeDasharray="20 40"
            />
          </g>

          {/* Alerta central de glitch y bucle infinito */}
          <g transform="translate(540, 960)">
            <circle cx="0" cy="0" r="160" fill="#020617" stroke="#EF4444" strokeWidth="8" />
            <text x="0" y="-20" textAnchor="middle" fill="#EF4444" fontSize="34" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              BUCLE CERRADO
            </text>
            <text x="0" y="30" textAnchor="middle" fill="#FDE047" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              RETROALIMENTACIÓN
            </text>
            <text x="0" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              INFINITA
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="72" rx="12" fill="#020617" stroke="#EF4444" strokeWidth="5" />
            <text x="24" y="46" fill="#F87171" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              COLAPSO EN BUCLE INFINITO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 6. SELVA ATOMIZADOR CORTE QUÍMICO (Ángulo holandés inclinado, nube de espuma blanca borrando rastro)
  if (escenario === "selva_atomizador_corte_quimico") {
    const foamWobble = Math.sin(frame * 2) * 8;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#14532D]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          {/* Suelo selvático con ángulo holandés (inclinado a 12°) */}
          <g transform="rotate(-12 540 960)">
            <rect x="-200" y="-200" width="1480" height="2320" fill="#15803D" />
            <polygon points="-200,1260 1280,1260 1280,2200 -200,2200" fill="#365314" stroke="#000000" strokeWidth="8" />

            {/* Rastro químico que se corta transversalmente */}
            <path d="M -100 1340 L 460 1340" fill="none" stroke="#22C55E" strokeWidth="20" strokeLinecap="round" />
            <path d="M 680 1340 L 1200 1340" fill="none" stroke="#22C55E" strokeWidth="20" strokeLinecap="round" />

            {/* Gran franja transversal de espuma blanca jabonosa borrando la estela */}
            <g transform={`translate(${foamWobble}, 0)`}>
              <polygon points="460,1180 680,1180 620,1520 400,1520" fill="#F8FAFC" stroke="#000000" strokeWidth="6" />
              {/* Burbujas de jabón */}
              <circle cx="500" cy="1260" r="28" fill="#E0F2FE" stroke="#000000" strokeWidth="3" />
              <circle cx="580" cy="1320" r="34" fill="#E0F2FE" stroke="#000000" strokeWidth="3" />
              <circle cx="480" cy="1420" r="38" fill="#E0F2FE" stroke="#000000" strokeWidth="3.5" />
              <circle cx="570" cy="1440" r="26" fill="#E0F2FE" stroke="#000000" strokeWidth="3" />
            </g>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="580" height="72" rx="12" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="46" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              CORTE QUÍMICO CON JABÓN
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 7. SELVA COLONIA LIBERADA CIERRE (Luz solar cálida entre las copas, dispersión libre, mareo cómico)
  if (escenario === "selva_colonia_liberada_cierre") {
    const sunBeam = Math.sin(frame / 10) * 15;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#22C55E]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cieloSelvaLimpia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15803D" />
              <stop offset="60%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#86EFAC" />
            </linearGradient>
          </defs>

          {/* Copas de árboles y cielo radiante */}
          <rect width="1080" height="1920" fill="url(#cieloSelvaLimpia)" />

          {/* Rayos de sol dorados penetrando entre las hojas */}
          <g transform={`translate(${sunBeam}, 0)`} opacity="0.45">
            <polygon points="120,0 240,0 480,1920 180,1920" fill="#FEF08A" />
            <polygon points="620,0 760,0 980,1920 700,1920" fill="#FEF08A" />
          </g>

          {/* Suelo vegetal y hojas despejadas */}
          <polygon points="-80,1360 1160,1360 1160,1920 -80,1920" fill="#3F6212" stroke="#000000" strokeWidth="8" />

          {/* Hormigas marchando libres y dispersándose en abanico hacia los bordes */}
          {[120, 260, 420, 680, 840, 980].map((hx, idx) => (
            <g key={idx} transform={`translate(${hx}, 1440)`}>
              <circle cx="0" cy="0" r="6" fill="#0F172A" />
              <circle cx="8" cy="-4" r="5" fill="#0F172A" />
              <line x1="0" y1="0" x2="6" y2="10" stroke="#000000" strokeWidth="2.5" />
              <line x1="8" y1="-4" x2="14" y2="6" stroke="#000000" strokeWidth="2.5" />
            </g>
          ))}

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="72" rx="12" fill="#020617" stroke="#22C55E" strokeWidth="5" />
            <text x="24" y="46" fill="#4ADE80" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              COLONIA DISPERSADA A SALVO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // ==========================================
  // ESCENARIOS: CUEVA DE CRISTALES DE NAICA
  // ==========================================

  // 1. CUEVA NAICA MEGACRISTALES CALOR (Vigas colosales de selenita translúcida, vapor infernal y condensación)
  if (escenario === "cueva_naica_megacristales_calor") {
    const steamWobble = Math.sin(frame / 12) * 18;
    const heatGlow = 0.75 + Math.sin(frame / 8) * 0.2;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#180A0A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cuevaCalorFondo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A0808" />
              <stop offset="50%" stopColor="#450A0A" />
              <stop offset="100%" stopColor="#1C0404" />
            </linearGradient>
            <linearGradient id="gradSelenita1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#E2E8F0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="gradSelenita2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#CBD5E1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Atmósfera cavernosa rojiza asfixiante */}
          <rect width="1080" height="1920" fill="url(#cuevaCalorFondo)" />

          {/* Vapor de agua hirviente y ondas de calor */}
          <g opacity={heatGlow}>
            <circle cx="200" cy="1200" r="300" fill="#EF4444" opacity="0.15" />
            <circle cx="850" cy="1100" r="350" fill="#F97316" opacity="0.12" />
            <circle cx="540" cy="1500" r="400" fill="#DC2626" opacity="0.2" />
          </g>

          {/* Fondo lejano: vigas de selenita en penumbra (parallax leve) */}
          <g opacity="0.5" transform={`translate(0, ${Math.sin(frame / 20) * 6})`}>
            <polygon points="120,400 320,1600 240,1600 60,400" fill="#94A3B8" stroke="#000000" strokeWidth="4" />
            <polygon points="900,300 700,1500 780,1500 960,300" fill="#94A3B8" stroke="#000000" strokeWidth="4" />
            <polygon points="450,200 650,1700 580,1700 380,200" fill="#64748B" stroke="#000000" strokeWidth="4" />
          </g>

          {/* Vigas monumentales de selenita en plano medio */}
          {/* Cristal gigante diagonal izquierda-derecha */}
          <g transform="rotate(-28 350 1100)">
            <polygon points="50,600 850,600 830,760 30,760" fill="url(#gradSelenita1)" stroke="#000000" strokeWidth="7" />
            {/* Arista facetada prismática */}
            <line x1="50" y1="600" x2="830" y2="760" stroke="#FFFFFF" strokeWidth="5" />
            <line x1="50" y1="680" x2="840" y2="680" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" />
          </g>

          {/* Cristal gigante diagonal opuesta */}
          <g transform="rotate(38 720 1250)">
            <polygon points="200,650 1050,650 1020,830 170,830" fill="url(#gradSelenita2)" stroke="#000000" strokeWidth="7" />
            <line x1="200" y1="650" x2="1020" y2="830" stroke="#FFFFFF" strokeWidth="6" />
            <polygon points="300,650 600,650 550,730 250,730" fill="#FFFFFF" opacity="0.4" />
          </g>

          {/* Suelo cavernoso de roca caliza y estalagmitas cristalinas */}
          <polygon points="-100,1460 1180,1460 1180,1920 -100,1920" fill="#2B0B0B" stroke="#000000" strokeWidth="8" />
          {/* Cristales emergentes del suelo */}
          <polygon points="120,1460 190,1280 250,1460" fill="url(#gradSelenita1)" stroke="#000000" strokeWidth="5" />
          <polygon points="240,1460 330,1200 410,1460" fill="url(#gradSelenita2)" stroke="#000000" strokeWidth="6" />
          <polygon points="780,1460 860,1190 940,1460" fill="url(#gradSelenita1)" stroke="#000000" strokeWidth="6" />
          <polygon points="920,1460 990,1290 1050,1460" fill="url(#gradSelenita2)" stroke="#000000" strokeWidth="5" />

          {/* Nubes de vapor denso ondulando */}
          <g transform={`translate(${steamWobble}, 0)`} opacity="0.4">
            <path d="M 100,1400 Q 250,1250 400,1400 T 700,1350 T 1000,1420" fill="none" stroke="#FFFFFF" strokeWidth="38" strokeLinecap="round" />
            <path d="M 50,1500 Q 300,1380 550,1520 T 950,1460" fill="none" stroke="#FEE2E2" strokeWidth="48" strokeLinecap="round" />
          </g>

          {/* HUD de Alerta Ambiental en esquina */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="620" height="74" rx="14" fill="#020617" stroke="#EF4444" strokeWidth="5" />
            <circle cx="36" cy="37" r="14" fill="#EF4444" />
            <text x="64" y="47" fill="#FCA5A5" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              TEMP: 58°C | HUMEDAD: 95% (HORNO DE VAPOR)
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 2. CUEVA NAICA ESCALA PANORÁMICA (Perspectiva colosal de 11 metros que empequeñece al ser humano)
  if (escenario === "cueva_naica_escala_panoramica") {
    const shine = Math.sin(frame / 14) * 30;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F0404]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="naicaGradPano" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E0707" />
              <stop offset="60%" stopColor="#350A0A" />
              <stop offset="100%" stopColor="#110202" />
            </linearGradient>
            <linearGradient id="vigaSelenitaPano" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="45%" stopColor="#E2E8F0" />
              <stop offset="80%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#naicaGradPano)" />

          {/* Rejilla de perspectiva geológica en el fondo */}
          <g stroke="#7F1D1D" strokeWidth="2" opacity="0.3">
            <line x1="540" y1="600" x2="0" y2="1920" />
            <line x1="540" y1="600" x2="270" y2="1920" />
            <line x1="540" y1="600" x2="810" y2="1920" />
            <line x1="540" y1="600" x2="1080" y2="1920" />
          </g>

          {/* Viga colosal cruzando todo el eje vertical/diagonal (11 metros de selenita) */}
          <g transform="rotate(-42 540 960)">
            <polygon points="-200,820 1400,820 1400,1040 -200,1040" fill="url(#vigaSelenitaPano)" stroke="#000000" strokeWidth="8" />
            {/* Aristas y facetas brillantes */}
            <line x1="-200" y1="880" x2="1400" y2="880" stroke="#FFFFFF" strokeWidth="6" />
            <line x1="-200" y1="970" x2="1400" y2="970" stroke="#CBD5E1" strokeWidth="4" />
            {/* Destello de luz recorriendo la viga */}
            <circle cx={400 + shine * 4} cy="910" r="30" fill="#FFFFFF" opacity="0.75" />
          </g>

          {/* Segunda viga colosal vertical de fondo */}
          <polygon points="680,-100 860,-100 780,2100 600,2100" fill="url(#vigaSelenitaPano)" stroke="#000000" strokeWidth="7" opacity="0.85" />
          <line x1="730" y1="-100" x2="690" y2="2100" stroke="#FFFFFF" strokeWidth="5" />

          {/* Plataforma de paso para el explorador */}
          <polygon points="-50,1480 1130,1480 1130,1920 -50,1920" fill="#250909" stroke="#000000" strokeWidth="8" />

          {/* Cartel de escala monumental */}
          <g transform="translate(680, 520)">
            <rect x="0" y="0" width="340" height="90" rx="10" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="20" y="38" fill="#38BDF8" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              LONGITUD: 11.4 METROS
            </text>
            <text x="20" y="70" fill="#F8FAFC" fontSize="18" fontWeight="800" fontFamily="'Arial Black', sans-serif">
              PESO: 55 TONELADAS
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="74" rx="14" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="47" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              MONUMENTO GEOLÓGICO NATURAL
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 3. CORTE GEOLÓGICO MAGMA SUBMARINO (Corte de capas: superficie, acuífero caliente saturado y bolsa de magma a 3 km)
  if (escenario === "corte_geologico_magma_submarino") {
    const magmaPulse = Math.sin(frame / 6) * 12;
    const arrowFlow = (frame * 5) % 80;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="corteSuperficie" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
            <linearGradient id="corteAguaTermal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0369A1" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
            <linearGradient id="corteMagma" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>
          </defs>

          {/* Capa 1: Superficie y mina exterior (-0 a 300m) */}
          <rect x="0" y="0" width="1080" height="420" fill="url(#corteSuperficie)" />
          <line x1="0" y1="420" x2="1080" y2="420" stroke="#000000" strokeWidth="8" />
          {/* Montacargas exterior */}
          <polygon points="500,420 540,240 580,420" fill="#334155" stroke="#000000" strokeWidth="4" />
          <text x="50" y="260" fill="#FEF08A" fontSize="26" fontWeight="900" fontFamily="'Arial Black', sans-serif">
            SUPERFICIE (DESIERTO DE NAICA)
          </text>

          {/* Capa 2: Cámara sellada con agua saturada a 50°C (El caldo de yeso original) */}
          <rect x="0" y="420" width="1080" height="780" fill="url(#corteAguaTermal)" />
          <line x1="0" y1="1200" x2="1080" y2="1200" stroke="#000000" strokeWidth="8" />

          {/* Cristales sumergidos creciendo lentamente durante 500,000 años */}
          <g opacity="0.85">
            <polygon points="180,1200 240,780 300,1200" fill="#F8FAFC" stroke="#000000" strokeWidth="5" />
            <polygon points="420,1200 480,680 560,1200" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
            <polygon points="720,1200 780,720 860,1200" fill="#F8FAFC" stroke="#000000" strokeWidth="5" />
            <polygon points="340,420 390,750 440,420" fill="#E2E8F0" stroke="#000000" strokeWidth="5" />
          </g>

          {/* Flechas térmicas de circulación convectiva */}
          <g fill="#FBBF24" opacity="0.8">
            <polygon points={`300,${1100 - arrowFlow} 320,${1060 - arrowFlow} 340,${1100 - arrowFlow}`} />
            <polygon points={`600,${1050 - arrowFlow} 620,${1010 - arrowFlow} 640,${1050 - arrowFlow}`} />
            <polygon points={`850,${1100 - arrowFlow} 870,${1060 - arrowFlow} 890,${1100 - arrowFlow}`} />
          </g>
          <text x="50" y="520" fill="#E0F2FE" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
            ACUÍFERO TERMAL SATURADO EN SULFATO (CaSO4)
          </text>
          <text x="50" y="565" fill="#38BDF8" fontSize="22" fontWeight="800" fontFamily="'Arial Black', sans-serif">
            CRECIMIENTO SOSTENIDO DURANTE 500,000 AÑOS
          </text>

          {/* Capa 3: Cámara de Magma activa a 3-5 km de profundidad */}
          <rect x="0" y="1200" width="1080" height="720" fill="url(#corteMagma)" />
          {/* Ondulaciones de magma incandescente */}
          <path
            d={`M 0,1240 Q 270,${1200 + magmaPulse} 540,1240 T 1080,${1220 - magmaPulse} L 1080,1920 L 0,1920 Z`}
            fill="#B91C1C"
            stroke="#000000"
            strokeWidth="6"
            opacity="0.6"
          />
          <text x="50" y="1320" fill="#FEF08A" fontSize="32" fontWeight="900" fontFamily="'Arial Black', sans-serif">
            CÁMARA DE MAGMA A 3-5 KM DE PROFUNDIDAD
          </text>
          <text x="50" y="1365" fill="#FFFFFF" fontSize="22" fontWeight="800" fontFamily="'Arial Black', sans-serif">
            FUENTE CALÓRICA CONSTANTE (SISTEMA HIDROTERMAL ACTIVO)
          </text>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="74" rx="14" fill="#020617" stroke="#F59E0B" strokeWidth="5" />
            <text x="24" y="47" fill="#FBBF24" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ORIGEN GEOLÓGICO: CALDO DE YESO Y FUEGO
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 4. CUEVA NAICA DRENAJE HORNO (Bombas industriales extrayendo agua y dejando un horno de vapor a 58°C)
  if (escenario === "cueva_naica_drenaje_horno") {
    const pipeShake = Math.sin(frame / 4) * 4;
    const waterLevel = 1580 + Math.sin(frame / 10) * 15;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#1F0707]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="drenajeFondo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E0A0A" />
              <stop offset="60%" stopColor="#4A1010" />
              <stop offset="100%" stopColor="#1C0505" />
            </linearGradient>
            <linearGradient id="tuboMetal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#drenajeFondo)" />

          {/* Cristales descubiertos en la roca */}
          <polygon points="100,500 280,1400 160,1400 20,500" fill="#E2E8F0" stroke="#000000" strokeWidth="6" opacity="0.75" />
          <polygon points="980,450 780,1350 870,1350 1060,450" fill="#CBD5E1" stroke="#000000" strokeWidth="6" opacity="0.75" />

          {/* Tuberías mineras gigantes de succión que extraen 1,000 litros/seg */}
          <g transform={`translate(${pipeShake}, 0)`}>
            {/* Tubería horizontal superior */}
            <rect x="-40" y="620" width="1160" height="120" rx="16" fill="url(#tuboMetal)" stroke="#000000" strokeWidth="8" />
            {/* Remaches de alta presión */}
            {[60, 200, 360, 520, 680, 840, 1000].map((rx, idx) => (
              <circle key={idx} cx={rx} cy="680" r="10" fill="#020617" />
            ))}

            {/* Tuberías verticales de bombeo masivo */}
            <rect x="220" y="740" width="130" height="880" fill="url(#tuboMetal)" stroke="#000000" strokeWidth="8" />
            <rect x="740" y="740" width="130" height="880" fill="url(#tuboMetal)" stroke="#000000" strokeWidth="8" />

            {/* Manómetros industriales */}
            <g transform="translate(480, 540)">
              <circle cx="50" cy="50" r="48" fill="#F8FAFC" stroke="#000000" strokeWidth="6" />
              <line x1="50" y1="50" x2="78" y2="30" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
              <circle cx="50" cy="50" r="8" fill="#000000" />
            </g>
          </g>

          {/* Nivel de agua hirviente descendiendo a toda velocidad */}
          <rect x="-20" y={waterLevel} width="1120" height="400" fill="#0284C7" stroke="#000000" strokeWidth="7" opacity="0.85" />
          <text x="340" y={waterLevel + 80} fill="#E0F2FE" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
            AGUA EVACUADA AL DESCUBIERTO
          </text>

          {/* Chorro de vapor fugándose de un empalme de presión */}
          <ellipse cx="740" cy="740" rx="70" ry="25" fill="#FFFFFF" opacity="0.65" />

          {/* Cartel técnico de extracción */}
          <g transform="translate(80, 1380)">
            <rect x="0" y="0" width="560" height="80" rx="12" fill="#020617" stroke="#F59E0B" strokeWidth="5" />
            <text x="24" y="48" fill="#FBBF24" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              BOMBEO MINERO: 1,000 LITROS/SEG
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="620" height="74" rx="14" fill="#020617" stroke="#EF4444" strokeWidth="5" />
            <text x="24" y="47" fill="#FCA5A5" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              EL DRENAJE DESTAPA UN HORNO DE VAPOR
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 5. DIAGRAMA CONDENSACIÓN LATA PULMÓN (La comparación biofísica letal: lata a 5°C vs pulmón a 37°C bajo aire a 58°C)
  if (escenario === "diagrama_condensacion_lata_pulmon") {
    const dropSlide = (frame * 6) % 180;
    const lungDropSlide = (frame * 5) % 120;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#090E1A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="splitFondo" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="50%" stopColor="#1C2541" />
              <stop offset="100%" stopColor="#2E0B0B" />
            </linearGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#splitFondo)" />

          {/* Línea divisoria central con advertencia */}
          <line x1="540" y1="280" x2="540" y2="1750" stroke="#F59E0B" strokeWidth="6" strokeDasharray="16 12" />

          {/* PANEL IZQUIERDO: LA LATA FRÍA SUDANDO */}
          <g transform="translate(80, 420)">
            <rect x="0" y="0" width="400" height="980" rx="20" fill="#0F172A" stroke="#38BDF8" strokeWidth="6" />
            <text x="40" y="60" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              LATA FRÍA (5°C)
            </text>
            <text x="40" y="95" fill="#94A3B8" fontSize="18" fontWeight="800" fontFamily="'Arial Black', sans-serif">
              EN AIRE CALIENTE (30°C)
            </text>

            {/* Ilustración de lata de aluminio */}
            <rect x="80" y="160" width="240" height="420" rx="30" fill="#0284C7" stroke="#000000" strokeWidth="7" />
            <ellipse cx="200" cy="160" rx="120" ry="30" fill="#38BDF8" stroke="#000000" strokeWidth="6" />
            <ellipse cx="200" cy="580" rx="120" ry="30" fill="#0369A1" stroke="#000000" strokeWidth="6" />

            {/* Gotas de agua resbalando por la superficie de la lata */}
            <circle cx="130" cy={260 + dropSlide} r="12" fill="#E0F2FE" stroke="#000000" strokeWidth="3" />
            <circle cx="240" cy={310 + dropSlide * 0.9} r="14" fill="#E0F2FE" stroke="#000000" strokeWidth="3" />
            <circle cx="180" cy={380 + dropSlide * 1.1} r="10" fill="#E0F2FE" stroke="#000000" strokeWidth="3" />

            {/* Charco bajo la lata */}
            <ellipse cx="200" cy="620" rx="130" ry="24" fill="#38BDF8" opacity="0.6" />

            <rect x="30" y="700" width="340" height="120" rx="12" fill="#020617" stroke="#000000" strokeWidth="4" />
            <text x="50" y="745" fill="#F8FAFC" fontSize="18" fontWeight="800" fontFamily="'Arial Black', sans-serif">
              El vapor de la sala toca
            </text>
            <text x="50" y="775" fill="#38BDF8" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              el metal frío y se condensa
            </text>
          </g>

          {/* PANEL DERECHO: PULMÓN HUMANO ACTUANDO COMO LATA FRÍA */}
          <g transform="translate(600, 420)">
            <rect x="0" y="0" width="400" height="980" rx="20" fill="#1A0A0A" stroke="#EF4444" strokeWidth="6" />
            <text x="40" y="60" fill="#EF4444" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              PULMÓN HUMANO (37°C)
            </text>
            <text x="40" y="95" fill="#FCA5A5" fontSize="18" fontWeight="800" fontFamily="'Arial Black', sans-serif">
              EN AIRE DE NAICA (58°C, 95%)
            </text>

            {/* Ilustración de los pulmones con tráquea */}
            {/* Tráquea */}
            <rect x="180" y="160" width="40" height="90" rx="8" fill="#F43F5E" stroke="#000000" strokeWidth="5" />
            {/* Pulmón Izquierdo */}
            <path d="M 180,240 C 90,260 70,420 120,530 C 160,560 200,500 200,420 Z" fill="#E11D48" stroke="#000000" strokeWidth="7" />
            {/* Pulmón Derecho */}
            <path d="M 220,240 C 310,260 330,420 280,530 C 240,560 200,500 200,420 Z" fill="#E11D48" stroke="#000000" strokeWidth="7" />

            {/* Agua líquida llenando la base de los alvéolos */}
            <path d="M 95,490 Q 150,470 200,490 Q 170,555 120,530 Z" fill="#38BDF8" stroke="#000000" strokeWidth="4" />
            <path d="M 205,490 Q 250,470 305,490 Q 280,555 280,530 Z" fill="#38BDF8" stroke="#000000" strokeWidth="4" />

            {/* Gotas condensándose en el interior del árbol bronquial */}
            <circle cx="160" cy={320 + lungDropSlide} r="10" fill="#38BDF8" stroke="#000000" strokeWidth="3" />
            <circle cx="240" cy={350 + lungDropSlide * 0.9} r="10" fill="#38BDF8" stroke="#000000" strokeWidth="3" />

            <rect x="30" y="700" width="340" height="150" rx="12" fill="#020617" stroke="#EF4444" strokeWidth="4" />
            <text x="50" y="745" fill="#FCA5A5" fontSize="18" fontWeight="800" fontFamily="'Arial Black', sans-serif">
              ¡Eres la superficie fría!
            </text>
            <text x="50" y="775" fill="#EF4444" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              EL VAPOR SE CONDENSA
            </text>
            <text x="50" y="805" fill="#38BDF8" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              DENTRO DE TUS ALVÉOLOS
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="74" rx="14" fill="#020617" stroke="#EF4444" strokeWidth="5" />
            <text x="24" y="47" fill="#FCA5A5" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              LA TRAMPA: TE AHOGAS EN TUS PULMONES
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 6. CUEVA NAICA RESCATE TRAJE HIELO (Traje espacial Tolomea con 20 kg de hielo y respirador frío a 5°C)
  if (escenario === "cueva_naica_rescate_traje_hielo") {
    const coldGlow = 0.8 + Math.sin(frame / 10) * 0.2;
    const iceMist = Math.sin(frame / 8) * 12;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#031526]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="trajeHieloFondo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#082F49" />
              <stop offset="50%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#0B132B" />
            </linearGradient>
            <radialGradient id="glosHielo">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1080" height="1920" fill="url(#trajeHieloFondo)" />

          {/* Destellos y halo de frío en la cueva */}
          <circle cx="540" cy="960" r="450" fill="url(#glosHielo)" opacity={coldGlow} />

          {/* Selenita de fondo pero con tono escarchado azulino */}
          <polygon points="150,300 320,1650 220,1650 50,300" fill="#E0F2FE" stroke="#000000" strokeWidth="6" opacity="0.65" />
          <polygon points="950,250 780,1600 870,1600 1040,250" fill="#BAE6FD" stroke="#000000" strokeWidth="6" opacity="0.65" />

          {/* Diagrama técnico de la armadura refrigerada Tolomea */}
          <g transform="translate(180, 520)">
            <rect x="0" y="0" width="720" height="740" rx="24" fill="#020617" stroke="#38BDF8" strokeWidth="6" opacity="0.9" />
            <text x="40" y="60" fill="#38BDF8" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              SISTEMA REFRIGERADO "TOLOMEA"
            </text>

            {/* Mochila con placas de hielo (20 kg) */}
            <rect x="60" y="120" width="260" height="460" rx="16" fill="#0284C7" stroke="#F8FAFC" strokeWidth="5" />
            <text x="80" y="180" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              MOCHILA 20 KG
            </text>
            <text x="80" y="215" fill="#BAE6FD" fontSize="20" fontWeight="800" fontFamily="'Arial Black', sans-serif">
              BLOQUES DE HIELO
            </text>

            {/* Serpentines y tubos de recirculación */}
            <path d="M 120,260 L 260,260 L 260,320 L 120,320 L 120,380 L 260,380 L 260,440 L 120,440 L 120,500 L 260,500" fill="none" stroke="#67E8F9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

            {/* Manguera de aire frío hacia la mascarilla */}
            <path d="M 320,240 C 440,240 440,360 520,360" fill="none" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" />

            {/* Especificaciones clave */}
            <g transform="translate(360, 160)">
              <rect x="0" y="0" width="310" height="80" rx="10" fill="#0F172A" stroke="#22C55E" strokeWidth="4" />
              <text x="20" y="38" fill="#4ADE80" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                AIRE INHALADO: 15°C
              </text>
              <text x="20" y="66" fill="#F8FAFC" fontSize="16" fontWeight="700" fontFamily="'Arial Black', sans-serif">
                Sin condensación pulmonar
              </text>

              <rect x="0" y="110" width="310" height="80" rx="10" fill="#0F172A" stroke="#EF4444" strokeWidth="4" />
              <text x="20" y="148" fill="#FCA5A5" fontSize="20" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                LÍMITE MÁXIMO: 30 MIN
              </text>
              <text x="20" y="176" fill="#F8FAFC" fontSize="16" fontWeight="700" fontFamily="'Arial Black', sans-serif">
                El hielo se funde en vapor
              </text>
            </g>
          </g>

          {/* Piso de roca caliza refrigerada */}
          <polygon points="-50,1500 1130,1500 1130,1920 -50,1920" fill="#0B132B" stroke="#000000" strokeWidth="8" />

          {/* Vaho frío ondulante */}
          <g transform={`translate(${iceMist}, 0)`} opacity="0.45">
            <path d="M 100,1460 Q 300,1380 500,1460 T 900,1440" fill="none" stroke="#BAE6FD" strokeWidth="32" strokeLinecap="round" />
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="74" rx="14" fill="#020617" stroke="#38BDF8" strokeWidth="5" />
            <text x="24" y="47" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ARMADURA CRIOGÉNICA DE RESCATE
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 7. MINA NAICA COMPUERTA ESCAPE (Ascenso veloz, portazo de escotilla blindada y seguridad en superficie)
  if (escenario === "mina_naica_compuerta_escape") {
    const lightBlink = frame % 24 < 12;
    const cableVibe = Math.sin(frame / 3) * 6;
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F172A]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="escotillaAcero" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="40%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="luzSuperficie" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Pozo minero oscuro con cables de acero tensados */}
          <rect width="1080" height="1920" fill="#090E17" />

          {/* Cables de tracción del elevador vertical */}
          <g transform={`translate(${cableVibe}, 0)`}>
            <line x1="280" y1="0" x2="280" y2="1920" stroke="#334155" strokeWidth="12" />
            <line x1="800" y1="0" x2="800" y2="1920" stroke="#334155" strokeWidth="12" />
          </g>

          {/* Franja de vigas estructurales amarillas y negras (seguridad industrial) */}
          <g>
            <rect x="0" y="320" width="1080" height="60" fill="#FACC15" stroke="#000000" strokeWidth="6" />
            {[0, 120, 240, 360, 480, 600, 720, 840, 960, 1080].map((hx, idx) => (
              <polygon key={idx} points={`${hx},320 ${hx + 50},320 ${hx + 10},380 ${hx - 40},380`} fill="#000000" />
            ))}
          </g>

          {/* Gran compuerta de acero hermética con rueda de cierre central */}
          <g transform="translate(140, 480)">
            <rect x="0" y="0" width="800" height="920" rx="30" fill="url(#escotillaAcero)" stroke="#000000" strokeWidth="10" />

            {/* Marco interior biselado */}
            <rect x="50" y="50" width="700" height="820" rx="20" fill="#1E293B" stroke="#000000" strokeWidth="6" />

            {/* Rueda de sellado de presión */}
            <g transform="translate(400, 460)">
              <circle cx="0" cy="0" r="140" fill="#334155" stroke="#000000" strokeWidth="8" />
              <circle cx="0" cy="0" r="50" fill="#CBD5E1" stroke="#000000" strokeWidth="6" />
              {/* Radios de la rueda */}
              <line x1="-130" y1="0" x2="130" y2="0" stroke="#000000" strokeWidth="10" />
              <line x1="0" y1="-130" x2="0" y2="130" stroke="#000000" strokeWidth="10" />
              <line x1="-92" y1="-92" x2="92" y2="92" stroke="#000000" strokeWidth="10" />
              <line x1="92" y1="-92" x2="-92" y2="92" stroke="#000000" strokeWidth="10" />
            </g>

            {/* Candados y cerrojos hidráulicos */}
            <rect x="700" y="200" width="45" height="100" rx="10" fill="#F59E0B" stroke="#000000" strokeWidth="5" />
            <rect x="700" y="620" width="45" height="100" rx="10" fill="#F59E0B" stroke="#000000" strokeWidth="5" />
            <rect x="-40" y="200" width="45" height="100" rx="10" fill="#F59E0B" stroke="#000000" strokeWidth="5" />
            <rect x="-40" y="620" width="45" height="100" rx="10" fill="#F59E0B" stroke="#000000" strokeWidth="5" />
          </g>

          {/* Luces de emergencia en el pozo */}
          <circle cx="200" cy="400" r="28" fill={lightBlink ? "#22C55E" : "#15803D"} stroke="#000000" strokeWidth="6" />
          <circle cx="880" cy="400" r="28" fill={lightBlink ? "#22C55E" : "#15803D"} stroke="#000000" strokeWidth="6" />

          {/* Piso de cabina del montacargas */}
          <polygon points="-50,1480 1130,1480 1130,1920 -50,1920" fill="#334155" stroke="#000000" strokeWidth="8" />

          {/* Banner de status */}
          <g transform="translate(180, 1420)">
            <rect x="0" y="0" width="720" height="74" rx="12" fill="#020617" stroke="#22C55E" strokeWidth="5" />
            <text x="30" y="47" fill="#4ADE80" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              COMPUERTA SELLADA: RETORNO A SUPERFICIE
            </text>
          </g>

          {/* Rótulo superior */}
          <g transform="translate(80, 160)">
            <rect x="0" y="0" width="600" height="74" rx="14" fill="#020617" stroke="#22C55E" strokeWidth="5" />
            <text x="24" y="47" fill="#4ADE80" fontSize="24" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              EVACUACIÓN COMPLETADA CON ÉXITO
            </text>
          </g>
        </svg>
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
