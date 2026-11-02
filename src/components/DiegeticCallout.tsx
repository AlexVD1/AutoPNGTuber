import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CotaVectorial,
  PalabraTiming,
  PersonajeEscena,
  PlanoCamara,
} from "../types";
import { resolveTimeRangeFrames } from "../stickman/actionSequences";

interface DiegeticCalloutProps {
  cotas?: CotaVectorial[];
  personajes?: PersonajeEscena[];
  palabras?: PalabraTiming[];
}

export const DiegeticCalloutsLayer: React.FC<DiegeticCalloutProps> = ({
  cotas = [],
  personajes = [],
  palabras,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const floorTrajectories = personajes.filter((p) => p.trayectoriaSuelo);

  if (cotas.length === 0 && floorTrajectories.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 34,
      }}
    >
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" fill="none">
        {/* Vectores tácticos de trayectoria en el suelo (9:16) */}
        {floorTrajectories.map((p, idx) => {
          const { startFrame, endFrame } = resolveTimeRangeFrames(
            p,
            durationInFrames,
            fps,
            palabras
          );
          if (frame < startFrame || frame > endFrame) return null;

          const tr = p.trayectoriaSuelo!;
          const x1 = 540 + tr.desdeX;
          const x2 = 540 + tr.hastaX;
          const y = tr.y ?? 1240;
          const color = tr.color ?? "#22D3EE";
          const drawP = interpolate(
            frame,
            [startFrame, startFrame + 18],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const curX = x1 + (x2 - x1) * drawP;
          const dashOffset = -(frame * 3.5);

          return (
            <g key={`traj-${p.id}-${idx}`}>
              <ellipse
                cx={x1}
                cy={y}
                rx="26"
                ry="8"
                fill="rgba(34,211,238,0.2)"
                stroke={color}
                strokeWidth="3"
              />
              <line
                x1={x1}
                y1={y}
                x2={curX}
                y2={y}
                stroke={color}
                strokeWidth="5"
                strokeDasharray="16 10"
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
              <ellipse
                cx={curX}
                cy={y}
                rx="32"
                ry="10"
                fill="rgba(34,211,238,0.25)"
                stroke={color}
                strokeWidth="3.5"
              />
              {tr.etiqueta && (
                <text
                  x={(x1 + curX) * 0.5}
                  y={y + 32}
                  textAnchor="middle"
                  fill={color}
                  fontSize="22"
                  fontWeight="900"
                  fontFamily="Inter, system-ui, sans-serif"
                  style={{
                    filter: "drop-shadow(0px 3px 6px rgba(0,0,0,0.85))",
                  }}
                >
                  {tr.etiqueta}
                </text>
              )}
            </g>
          );
        })}

        {/* Cotas vectoriales diegéticas en el espacio del escenario (9:16) */}
        {cotas.map((cota, idx) => {
          const { startFrame, endFrame } = resolveTimeRangeFrames(
            cota,
            durationInFrames,
            fps,
            palabras
          );
          if (frame < startFrame || frame > endFrame) return null;

          const drawProgress = interpolate(
            frame,
            [startFrame, startFrame + 14],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const fadeOut = interpolate(
            frame,
            [Math.max(startFrame + 15, endFrame - 10), endFrame],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const safeDestX = Math.max(120, Math.min(960, cota.destinoX));
          const safeDestY = Math.max(380, Math.min(1360, cota.destinoY));
          const curX =
            cota.origenX + (safeDestX - cota.origenX) * drawProgress;
          const curY =
            cota.origenY + (safeDestY - cota.origenY) * drawProgress;
          const color = cota.color ?? "#22D3EE";
          const dashOffset = -(frame * 2.2);
          const isTopBanner = safeDestY <= 520;
          const alignRight = safeDestX >= cota.origenX;
          const textAnchor = isTopBanner ? "middle" : alignRight ? "start" : "end";
          const textOffsetX = isTopBanner ? 0 : alignRight ? 16 : -16;
          const textOffsetY = isTopBanner ? -18 : 14;
          const labelOffsetY = isTopBanner ? -56 : -28;

          return (
            <g key={cota.id ?? `cota-${idx}`} opacity={fadeOut}>
              <circle
                cx={cota.origenX}
                cy={cota.origenY}
                r={7}
                fill={color}
                stroke="#0F172A"
                strokeWidth="3"
              />
              <circle
                cx={cota.origenX}
                cy={cota.origenY}
                r={13 + Math.sin(frame / 4) * 3}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                opacity="0.65"
              />

              <line
                x1={cota.origenX}
                y1={cota.origenY}
                x2={curX}
                y2={curY}
                stroke="#0F172A"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1={cota.origenX}
                y1={cota.origenY}
                x2={curX}
                y2={curY}
                stroke={color}
                strokeWidth="4"
                strokeDasharray="10 8"
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />

              {drawProgress > 0.65 && (
                <g
                  transform={`translate(${safeDestX}, ${safeDestY})`}
                  opacity={interpolate(drawProgress, [0.65, 1], [0, 1])}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r={5}
                    fill="#FFFFFF"
                    stroke={color}
                    strokeWidth="3"
                  />
                  {cota.etiqueta && (
                    <text
                      x={textOffsetX}
                      y={labelOffsetY}
                      textAnchor={textAnchor}
                      fill="#E2E8F0"
                      fontSize="21"
                      fontWeight="800"
                      letterSpacing="2"
                      fontFamily="Inter, system-ui, sans-serif"
                      style={{
                        filter:
                          "drop-shadow(0px 2px 4px rgba(0,0,0,0.95)) drop-shadow(0px 0px 8px rgba(0,0,0,0.85))",
                      }}
                    >
                      {cota.etiqueta.toUpperCase()}
                    </text>
                  )}
                  <text
                    x={textOffsetX}
                    y={textOffsetY}
                    textAnchor={textAnchor}
                    fill={color}
                    fontSize="44"
                    fontWeight="900"
                    fontFamily="Inter, system-ui, sans-serif"
                    style={{
                      filter:
                        "drop-shadow(0px 4px 8px rgba(0,0,0,0.95)) drop-shadow(0px 0px 14px rgba(0,0,0,0.85))",
                    }}
                  >
                    {cota.valor}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Silueta desenfocada en primerísimo plano para encuadres "sobre_hombro" (Over-The-Shoulder) en 9:16.
 */
export const OverTheShoulderForeground: React.FC<{
  lado: "izquierda" | "derecha";
  colorRim?: string;
}> = ({ lado, colorRim = "#38BDF8" }) => {
  const frame = useCurrentFrame();
  const breathY = Math.sin(frame / 10) * 4;
  const isLeft = lado === "izquierda";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 42,
        overflow: "hidden",
      }}
    >
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{
          filter: "blur(10px)",
          transform: `translateY(${breathY}px)`,
        }}
      >
        {isLeft ? (
          <g>
            <path
              d="M -60 1560 Q 100 1200 320 1320 L 380 1560 Z"
              fill="#090D16"
              stroke={colorRim}
              strokeWidth="8"
            />
            <circle
              cx="95"
              cy="1010"
              r="185"
              fill="#090D16"
              stroke={colorRim}
              strokeWidth="7"
            />
          </g>
        ) : (
          <g>
            <path
              d="M 1140 1560 Q 980 1200 760 1320 L 700 1560 Z"
              fill="#090D16"
              stroke={colorRim}
              strokeWidth="8"
            />
            <circle
              cx="985"
              cy="1010"
              r="185"
              fill="#090D16"
              stroke={colorRim}
              strokeWidth="7"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

/**
 * Insert Cinemático de Mano Articulada en Primer Plano (Macro Detail Shot 9:16).
 */
export const HandInsertOverlay: React.FC<{
  plano: PlanoCamara;
  localFrame: number;
  durationFrames: number;
}> = ({ plano, localFrame, durationFrames }) => {
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.7 },
  });
  const exit = interpolate(
    localFrame,
    [Math.max(1, durationFrames - 8), durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const progress = Math.min(1, Math.max(0, localFrame / Math.max(1, durationFrames)));
  const accion = plano.accionMano ?? "verter_acido";

  const wristAngle = Math.sin(progress * Math.PI) * 14;
  const fingerCurl = Math.sin(localFrame / 4) * 6;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 44,
        pointerEvents: "none",
        opacity: Math.min(enter, exit),
        background:
          "radial-gradient(circle at 50% 45%, rgba(15,23,42,0.52) 0%, rgba(2,6,23,0.88) 100%)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" fill="none">
        {/* Trasladamos el centro de (960, 520) a (540, 880) para formato vertical 9:16 */}
        <g transform="translate(-420, 360)">
          <circle
            cx="960"
            cy="520"
            r="360"
            fill="#0F172A"
            stroke="#38BDF8"
            strokeWidth="6"
            opacity="0.92"
          />
          <circle
            cx="960"
            cy="520"
            r="342"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="2"
            strokeDasharray="12 10"
            opacity="0.35"
          />

          {accion === "verter_acido" && (
            <g>
              <rect x="760" y="620" width="400" height="160" rx="22" fill="#1E293B" stroke="#000" strokeWidth="7" />
              <path d="M 780 680 Q 860 650 960 680 Q 1060 705 1140 675 L 1140 765 L 780 765 Z" fill="#84CC16" opacity="0.85" />
              <circle cx="940" cy={470 + ((localFrame * 11) % 180)} r="11" fill="#A3E635" stroke="#000" strokeWidth="3" />
              <circle cx="965" cy={510 + ((localFrame * 11 + 85) % 160)} r="9" fill="#BEF264" stroke="#000" strokeWidth="3" />
              <g transform={`translate(${1180 - enter * 120}, 390) rotate(${-18 - wristAngle})`}>
                <path d="M 120 -40 L 380 -110 L 410 -10 L 145 55 Z" fill="#0284C7" stroke="#000" strokeWidth="7" />
                <rect x="45" y="-32" width="92" height="78" rx="24" fill="#0F172A" stroke="#38BDF8" strokeWidth="4" />
                <rect x="18" y="-26" width="54" height="18" rx="9" fill="#0F172A" stroke="#38BDF8" strokeWidth="3.5" transform={`rotate(${fingerCurl})`} />
                <rect x="14" y="-4" width="58" height="18" rx="9" fill="#0F172A" stroke="#38BDF8" strokeWidth="3.5" />
                <rect x="18" y="18" width="52" height="18" rx="9" fill="#0F172A" stroke="#38BDF8" strokeWidth="3.5" />
                <path d="M -65 -55 L -15 -55 L 15 45 L -95 45 Z" fill="rgba(226,232,240,0.3)" stroke="#F8FAFC" strokeWidth="5" />
                <path d="M -82 10 L 4 10 L 12 40 L -90 40 Z" fill="#84CC16" />
              </g>
            </g>
          )}

          {accion === "prensar_palanca" && (
            <g>
              <circle cx="830" cy="530" r="95" fill="#1E293B" stroke="#000" strokeWidth="8" />
              <circle cx="830" cy="530" r="72" fill="#FEF2F2" stroke="#EF4444" strokeWidth="5" />
              <line
                x1="830"
                y1="530"
                x2={830 + Math.cos(-1.8 + progress * 2.6) * 56}
                y2={530 + Math.sin(-1.8 + progress * 2.6) * 56}
                stroke="#DC2626"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <g transform={`translate(930, 530) rotate(${-28 + progress * 56})`}>
                <rect x="0" y="-14" width="260" height="28" rx="12" fill="#94A3B8" stroke="#000" strokeWidth="6" />
                <circle cx="250" cy="0" r="26" fill="#EF4444" stroke="#000" strokeWidth="6" />
                <g transform="translate(230, -35)">
                  <path d="M 45 -5 L 220 -65 L 245 25 L 65 75 Z" fill="#0284C7" stroke="#000" strokeWidth="6" />
                  <rect x="-10" y="0" width="74" height="66" rx="22" fill="#0F172A" stroke="#38BDF8" strokeWidth="4" />
                  <rect x="-18" y="10" width="36" height="16" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
                  <rect x="-18" y="28" width="38" height="16" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
                </g>
              </g>
            </g>
          )}

          {accion === "estirar_cadena" && (
            <g>
              {[-2, -1, 0, 1, 2].map((i) => {
                const stretch = 1 + progress * 0.16;
                const cx = 960 + i * 76 * stretch;
                return (
                  <rect
                    key={i}
                    x={cx - 38}
                    y={496}
                    width={76}
                    height={42}
                    rx="20"
                    fill="none"
                    stroke={i === 0 ? "#FFE600" : "#38BDF8"}
                    strokeWidth="10"
                  />
                );
              })}
              <g transform={`translate(${660 - progress * 34}, 485)`}>
                <path d="M -190 -20 L -20 0 L -20 68 L -190 55 Z" fill="#0284C7" stroke="#000" strokeWidth="6" />
                <rect x="-30" y="-4" width="76" height="72" rx="20" fill="#0F172A" stroke="#22D3EE" strokeWidth="4" />
              </g>
              <g transform={`translate(${1260 + progress * 34}, 485)`}>
                <path d="M 190 -20 L 20 0 L 20 68 L 190 55 Z" fill="#0284C7" stroke="#000" strokeWidth="6" />
                <rect x="-46" y="-4" width="76" height="72" rx="20" fill="#0F172A" stroke="#22D3EE" strokeWidth="4" />
              </g>
            </g>
          )}

          {accion === "girar_valvula" && (
            <g>
              <g transform={`translate(960, 520) rotate(${progress * 165})`}>
                <circle cx="0" cy="0" r="135" fill="none" stroke="#EF4444" strokeWidth="24" />
                <circle cx="0" cy="0" r="135" fill="none" stroke="#000" strokeWidth="6" />
                <line x1="-125" y1="0" x2="125" y2="0" stroke="#EF4444" strokeWidth="18" />
                <line x1="0" y1="-125" x2="0" y2="125" stroke="#EF4444" strokeWidth="18" />
                <circle cx="0" cy="0" r="34" fill="#F59E0B" stroke="#000" strokeWidth="6" />
              </g>
              <g
                transform={`translate(${960 + Math.cos(-1.57 + progress * 2.8) * 125}, ${520 + Math.sin(-1.57 + progress * 2.8) * 125})`}
              >
                <path d="M 35 -35 L 240 -140 L 275 -55 L 65 30 Z" fill="#F8FAFC" stroke="#000" strokeWidth="6" />
                <rect x="-36" y="-36" width="74" height="68" rx="22" fill="#0F172A" stroke="#F97316" strokeWidth="4" />
              </g>
            </g>
          )}

          {accion === "tocar_esfera" && (
            <g>
              <circle cx="910" cy="540" r="110" fill="#FACC15" stroke="#000" strokeWidth="8" />
              <circle cx="875" cy="500" r="32" fill="#FEF08A" opacity="0.9" />
              <g transform={`translate(${1080 - progress * 45}, 490)`}>
                <path d="M 110 -10 L 340 -60 L 360 30 L 125 68 Z" fill="#0284C7" stroke="#000" strokeWidth="6" />
                <rect x="28" y="-12" width="90" height="74" rx="22" fill="#0F172A" stroke="#38BDF8" strokeWidth="4" />
                <rect x="-38" y="2" width="76" height="20" rx="10" fill="#0F172A" stroke="#38BDF8" strokeWidth="4" />
              </g>
            </g>
          )}

          {accion === "apilar_bloques" && (
            <g>
              <rect x="760" y="620" width="400" height="90" rx="10" fill="#475569" stroke="#000" strokeWidth="7" />
              <rect x="800" y="535" width="320" height="85" rx="8" fill="#64748B" stroke="#000" strokeWidth="7" />
              <path d="M 920 620 L 940 665 L 915 708 M 1020 620 L 1000 670 L 1030 708" stroke="#EF4444" strokeWidth="6" fill="none" opacity={0.4 + progress * 0.6} />
              <g transform={`translate(960, ${410 + progress * 68})`}>
                <rect x="-120" y="-45" width="240" height="80" rx="8" fill="#94A3B8" stroke="#000" strokeWidth="7" />
                <text x="0" y="5" textAnchor="middle" fill="#0F172A" fontSize="24" fontWeight="900">
                  CARGA +10 t
                </text>
                <path d="M 80 -80 L 280 -160 L 310 -75 L 110 -15 Z" fill="#0284C7" stroke="#000" strokeWidth="6" />
                <rect x="30" y="-70" width="84" height="60" rx="18" fill="#0F172A" stroke="#38BDF8" strokeWidth="4" />
              </g>
            </g>
          )}

          {accion === "medir_compas" && (
            <g>
              <rect x="730" y="420" width="460" height="220" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="5" />
              <rect x="775" y="510" width="70" height="70" fill="#0284C7" stroke="#000" strokeWidth="5" />
              <rect x="920" y="445" width="140" height="140" fill="#F59E0B" stroke="#000" strokeWidth="6" />
              <line x1="990" y1="445" x2="990" y2="585" stroke="#000" strokeWidth="4" />
              <line x1="920" y1="515" x2="1060" y2="515" stroke="#000" strokeWidth="4" />
              <g transform={`translate(${1080 - progress * 40}, 430)`}>
                <line x1="0" y1="0" x2={-60 - progress * 50} y2="130" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" />
                <line x1="0" y1="0" x2="30" y2="130" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" />
                <circle cx="0" cy="0" r="14" fill="#F59E0B" stroke="#000" strokeWidth="4" />
                <path d="M 30 -30 L 220 -90 L 245 -10 L 50 35 Z" fill="#0284C7" stroke="#000" strokeWidth="6" />
                <rect x="-15" y="-28" width="74" height="62" rx="18" fill="#0F172A" stroke="#FFE600" strokeWidth="4" />
              </g>
            </g>
          )}

          {accion === "tensar_cable_acero" && (
            <g>
              <line x1="660" y1="520" x2="1260" y2="520" stroke="#64748B" strokeWidth={28 - progress * 10} strokeLinecap="round" />
              <line x1="660" y1="520" x2="1260" y2="520" stroke="#EF4444" strokeWidth="8" strokeDasharray="18 12" opacity={progress} />
              {progress > 0.45 && (
                <path d="M 940 505 L 915 470 M 980 535 L 1010 570 M 960 500 L 965 460" stroke="#FFE600" strokeWidth="5" strokeLinecap="round" />
              )}
              <g transform={`translate(${680 - progress * 35}, 485)`}>
                <rect x="-30" y="-4" width="76" height="72" rx="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="4" />
              </g>
              <g transform={`translate(${1240 + progress * 35}, 485)`}>
                <rect x="-46" y="-4" width="76" height="72" rx="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="4" />
              </g>
            </g>
          )}

          {accion === "bajar_interruptor" && (
            <g>
              <rect x="760" y="380" width="400" height="300" rx="18" fill="#1E293B" stroke="#000000" strokeWidth="7" />
              <rect x="920" y="420" width="80" height="40" rx="6" fill="#F59E0B" stroke="#000" strokeWidth="4" />
              <rect x="920" y="580" width="80" height="40" rx="6" fill="#F59E0B" stroke="#000" strokeWidth="4" />
              <g transform={`translate(960, 440) rotate(${progress * 72})`}>
                <rect x="-14" y="0" width="28" height="150" rx="10" fill="#EF4444" stroke="#000" strokeWidth="5" />
                <circle cx="0" cy="150" r="22" fill="#DC2626" stroke="#000" strokeWidth="5" />
              </g>
              {progress < 0.6 && (
                <g>
                  <line x1="930" y1="440" x2="905" y2="415" stroke="#FFE600" strokeWidth="4" />
                  <line x1="990" y1="440" x2="1025" y2="420" stroke="#38BDF8" strokeWidth="4" />
                  <circle cx="960" cy="440" r="14" fill="#FEF08A" opacity="0.7" />
                </g>
              )}
              <g transform={`translate(${1020 + progress * 60}, ${540 + progress * 70})`}>
                <path d="M 0 -20 L 160 -50 L 180 15 L 20 40 Z" fill="#0284C7" stroke="#000" strokeWidth="6" />
                <rect x="-40" y="-18" width="75" height="65" rx="18" fill="#0F172A" stroke="#38BDF8" strokeWidth="4" />
              </g>
            </g>
          )}

          {accion === "ajustar_telescopio" && (
            <g>
              <rect x="680" y="470" width="480" height="110" rx="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="6" />
              <line x1="840" y1="470" x2="840" y2="580" stroke="#FFE600" strokeWidth="5" />
              <line x1="980" y1="470" x2="980" y2="580" stroke="#FFE600" strokeWidth="5" />
              <g transform={`translate(910, 525) rotate(${localFrame * 4})`}>
                <circle cx="0" cy="0" r="44" fill="#334155" stroke="#000" strokeWidth="5" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                  <line
                    key={`sp-${ang}`}
                    x1="0"
                    y1="0"
                    x2={Math.cos((ang * Math.PI) / 180) * 44}
                    y2={Math.sin((ang * Math.PI) / 180) * 44}
                    stroke="#94A3B8"
                    strokeWidth="3.5"
                  />
                ))}
              </g>
              <g transform={`translate(970, 505)`}>
                <path d="M 40 -10 L 190 -35 L 205 25 L 50 45 Z" fill="#0284C7" stroke="#000" strokeWidth="6" />
                <rect x="-24" y="-2" width="70" height="55" rx="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="4" />
              </g>
            </g>
          )}

          <text
            x="960"
            y="835"
            textAnchor="middle"
            fill="#FFE600"
            fontSize="34"
            fontWeight="900"
            letterSpacing="3"
            fontFamily="Inter, system-ui, sans-serif"
            style={{
              filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.95))",
            }}
          >
            {plano.etiquetaInsert ?? "DETALLE DE ACCIÓN"}
          </text>
        </g>
      </svg>
    </div>
  );
};
