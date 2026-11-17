import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { EscenaGuion } from "../../types";
import { CartoonCharacter } from "../CartoonCharacter";
import { KingfisherBirdSvg, ShinkansenProfileSvg } from "./ShinkansenElements";

export interface ShinkansenSceneProps {
  escena: EscenaGuion;
  frame: number;
  fps: number;
  durationFrames: number;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const BackgroundPlate: React.FC<{
  src: string;
  scaleFrom?: number;
  scaleTo?: number;
  panXFrom?: number;
  panXTo?: number;
  panYFrom?: number;
  panYTo?: number;
  progress: number;
  tintOverlay?: string;
}> = ({
  src,
  scaleFrom = 1.03,
  scaleTo = 1.1,
  panXFrom = 0,
  panXTo = 0,
  panYFrom = 0,
  panYTo = 0,
  progress,
  tintOverlay,
}) => {
  const s = interpolate(progress, [0, 1], [scaleFrom, scaleTo]);
  const tx = interpolate(progress, [0, 1], [panXFrom, panXTo]);
  const ty = interpolate(progress, [0, 1], [panYFrom, panYTo]);
  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-950">
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
        }}
      />
      {tintOverlay && (
        <div
          className="absolute inset-0"
          style={{ background: tintOverlay, pointerEvents: "none" }}
        />
      )}
    </div>
  );
};

export const ShinkansenCinematicScenes: React.FC<ShinkansenSceneProps> = ({
  escena,
  frame,
  fps,
  durationFrames,
}) => {
  const p = clamp01(frame / Math.max(1, durationFrames));

  // ============================================================================
  // ESCENA 1: Gancho In Media Res — Tren sale del túnel + explosión sónica + tejas + sonómetro en rojo
  // ============================================================================
  if (escena.id === 1) {
    const isBeatA = p < 0.36;
    const isBeatB = p >= 0.36 && p < 0.7;
    const isBeatC = p >= 0.7;

    // Boom shockwave starts around p=0.22
    const boomAge = p >= 0.2 ? clamp01((p - 0.2) / 0.32) : 0;
    const shakeAmp = boomAge > 0 && boomAge < 1 ? (1 - boomAge) * 18 : isBeatB ? Math.sin(frame * 1.4) * 5 : 0;
    const shakeX = Math.sin(frame * 2.5) * shakeAmp;
    const shakeY = Math.cos(frame * 3.1) * shakeAmp * 0.8;

    if (isBeatA) {
      const bp = clamp01(p / 0.36);
      // Train emerging from tunnel mouth (~x: 305, y: 1100) curving slightly right then down-left along rails
      const trainScale = interpolate(bp, [0, 1], [0.22, 1.32]);
      const trainX = interpolate(bp, [0, 0.55, 1], [305, 485, 410]);
      const trainY = interpolate(bp, [0, 0.55, 1], [1100, 1265, 1485]);
      const ringR = interpolate(boomAge, [0, 1], [30, 520]);

      return (
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
          <BackgroundPlate
            src="backgrounds/shinkansen/tunel_japon_dia.jpg"
            progress={bp}
            scaleFrom={1.03}
            scaleTo={1.12}
          />
          <div className="absolute inset-0" style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
            <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
              {/* Blunt nose Shinkansen bursting toward foreground on curving rails */}
              <g transform={`translate(${trainX}, ${trainY}) scale(${trainScale}) rotate(14)`}>
                <ellipse cx="0" cy="45" rx="95" ry="25" fill="rgba(15,23,42,0.45)" />
                <path
                  d="M -90 -90 L 90 -90 C 125 -90 140 -40 135 20 L 120 45 L -120 45 L -135 20 C -140 -40 -125 -90 -90 -90 Z"
                  fill="#F8FAFC"
                  stroke="#0F172A"
                  strokeWidth="8"
                />
                <rect x="-132" y="-12" width="264" height="24" fill="#0284C7" stroke="#0F172A" strokeWidth="5" />
                {/* Wrap-around cockpit windshield */}
                <path d="M -85 -74 L 85 -74 L 96 -28 L -96 -28 Z" fill="#0F172A" />
                {/* Glowing headlights */}
                <circle cx="-75" cy="18" r="14" fill="#FEF08A" stroke="#0F172A" strokeWidth="4" />
                <circle cx="75" cy="18" r="14" fill="#FEF08A" stroke="#0F172A" strokeWidth="4" />
              </g>

              {/* Expanding white-red sonic shockwave ring from tunnel mouth */}
              {boomAge > 0 && (
                <g transform="translate(335, 1055)" opacity={1 - boomAge * 0.75}>
                  <circle
                    cx="0"
                    cy="0"
                    r={ringR}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={34 * (1 - boomAge * 0.6)}
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r={ringR * 0.85}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={14 * (1 - boomAge * 0.5)}
                  />
                </g>
              )}
            </svg>
          </div>
        </div>
      );
    }

    if (isBeatB) {
      const bp = clamp01((p - 0.36) / 0.34);
      const tileBounce = Math.abs(Math.sin(frame * 1.1)) * 12;

      return (
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
          <BackgroundPlate
            src="backgrounds/shinkansen/tunel_japon_dia.jpg"
            progress={bp}
            scaleFrom={1.16}
            scaleTo={1.24}
            panXFrom={-60}
            panXTo={-90}
            panYFrom={-60}
            panYTo={-80}
          />
          <div className="absolute inset-0" style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
            <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
              {/* Rattling shockwave arcs hitting traditional country house roof */}
              <path
                d="M 420 960 Q 520 1050 480 1180"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="12"
                opacity="0.7"
                strokeLinecap="round"
              />
              {/* Vibrating loose ceramic roof tiles hopping above roof */}
              {[
                [770, 990],
                [840, 1015],
                [905, 995],
              ].map(([tx, ty], i) => (
                <rect
                  key={`tile_${i}`}
                  x={tx}
                  y={ty - tileBounce * (i % 2 === 0 ? 1 : 0.7)}
                  width="36"
                  height="16"
                  rx="4"
                  fill="#475569"
                  stroke="#0F172A"
                  strokeWidth="4"
                  transform={`rotate(${Math.sin(frame * 0.9 + i) * 12}, ${tx + 18}, ${ty})`}
                />
              ))}
            </svg>

            {/* Crouched Eiji bracing & holding vibrating sonometer facing tunnel */}
            <div className="absolute" style={{ left: 320, top: 880 }}>
              <CartoonCharacter
                persona="eiji"
                expression="panicked"
                facing="left"
                scale={1.08}
                frame={frame}
                fps={fps}
                palabras={escena.palabras}
                heldTool="sonometro"
                sweatDrops={true}
                pose={{
                  torsoLeanDeg: 14,
                  bodySquashY: 0.94,
                  rightShoulderDeg: 58,
                  rightElbowDeg: 45,
                  leftShoulderDeg: 48,
                  leftElbowDeg: 52,
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    // Beat C: Close-up of glowing analog Sonometer needle slamming into RED ZONE!
    const bp = clamp01((p - 0.7) / 0.3);
    const needleDeg = interpolate(bp, [0, 0.3, 0.6, 1], [-55, 68, 56, 66]) + Math.sin(frame * 1.8) * 6;
    const dbVal = Math.round(interpolate(bp, [0, 0.4, 1], [68, 98, 96]));

    return (
      <div className="absolute inset-0 overflow-hidden bg-slate-950">
        <BackgroundPlate
          src="backgrounds/shinkansen/tunel_japon_dia.jpg"
          progress={bp}
          scaleFrom={1.35}
          scaleTo={1.45}
          tintOverlay="rgba(127, 29, 29, 0.35)"
        />
        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          {/* Enlarged industrial Sonometer Gauge */}
          <g transform={`translate(540, 720) scale(${interpolate(bp, [0, 0.25], [0.85, 1.05], { extrapolateRight: "clamp" })})`}>
            <rect x="-280" y="-260" width="560" height="620" rx="44" fill="#FACC15" stroke="#0F172A" strokeWidth="14" />
            <rect x="-230" y="-210" width="460" height="320" rx="24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="10" />
            {/* Green safe arc vs Red danger arc (>70 dB) */}
            <path d="M -170 40 A 170 170 0 0 1 10 -130" fill="none" stroke="#10B981" strokeWidth="32" />
            <path d="M 10 -130 A 170 170 0 0 1 170 40" fill="none" stroke="#EF4444" strokeWidth="36" />
            {/* Analog needle */}
            <g transform={`translate(0, 40) rotate(${needleDeg})`}>
              <polygon points="-9,10 0,-185 9,10" fill="#0F172A" />
              <circle cx="0" cy="0" r="22" fill="#DC2626" stroke="#0F172A" strokeWidth="6" />
            </g>
            {/* Digital DB alarm display */}
            <rect x="-175" y="150" width="350" height="110" rx="18" fill="#7F1D1D" stroke="#0F172A" strokeWidth="8" />
            <text x="0" y="222" textAnchor="middle" fill="#FEF08A" fontSize="62" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              {dbVal} dB ⚠
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 2: Conflicto y Riesgo — Inspector Kuroda exige silencio + Reloj 48h
  // ============================================================================
  if (escena.id === 2) {
    const isBeatA = p < 0.42;
    const isBeatB = p >= 0.42 && p < 0.74;
    const isBeatC = p >= 0.74;

    if (isBeatA) {
      const bp = clamp01(p / 0.42);
      const kurodaX = interpolate(bp, [0, 0.45], [560, 470], { extrapolateRight: "clamp" });

      return (
        <div className="absolute inset-0 overflow-hidden bg-slate-900">
          <BackgroundPlate src="backgrounds/shinkansen/anden_estacion_japon.jpg" progress={bp} />
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            {/* Parked blunt Shinkansen on left track */}
            <ShinkansenProfileSvg x={105} y={1255} variant="blunt" scale={1.18} rotationDeg={-18} />
            {/* Crossed-out noise wave regulation sign */}
            <g transform="translate(830, 860)">
              <rect x="-14" y="0" width="28" height="420" fill="#475569" stroke="#0F172A" strokeWidth="6" />
              <circle cx="0" cy="0" r="105" fill="#FFFFFF" stroke="#EF4444" strokeWidth="18" />
              {/* Sound wave icon inside sign */}
              <path d="M -40 -15 L -15 -15 L 15 -38 L 15 38 L -15 15 L -40 15 Z" fill="#0F172A" />
              <path d="M 32 -24 Q 48 0 32 24" fill="none" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
              <line x1="-68" y1="-68" x2="68" y2="68" stroke="#EF4444" strokeWidth="16" strokeLinecap="round" />
            </g>
          </svg>
          {/* Inspector Kuroda slamming clipboard at sign */}
          <div className="absolute" style={{ left: kurodaX, top: 820 }}>
            <CartoonCharacter
              persona="kuroda"
              expression="determined"
              facing="right"
              scale={1.08}
              frame={frame}
              fps={fps}
              palabras={escena.palabras}
              heldTool="portapapeles"
              pose={{
                torsoLeanDeg: 6,
                rightShoulderDeg: 78,
                rightElbowDeg: 28,
                leftShoulderDeg: -18,
                leftElbowDeg: 24,
              }}
            />
          </div>
        </div>
      );
    }

    if (isBeatB) {
      const bp = clamp01((p - 0.42) / 0.32);
      return (
        <div className="absolute inset-0 overflow-hidden bg-slate-900">
          <BackgroundPlate
            src="backgrounds/shinkansen/anden_estacion_japon.jpg"
            progress={bp}
            scaleFrom={1.08}
            scaleTo={1.16}
          />
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            <ShinkansenProfileSvg x={115} y={1260} variant="blunt" scale={1.18} rotationDeg={-18} />
          </svg>
          {/* Eiji standing worried looking at train nose */}
          <div className="absolute" style={{ left: 260, top: 830 }}>
            <CartoonCharacter
              persona="eiji"
              expression="exhausted"
              facing="left"
              scale={1.08}
              frame={frame}
              fps={fps}
              palabras={escena.palabras}
              neckBinoculars={true}
              pose={{
                headTiltDeg: 10,
                rightShoulderDeg: 18,
                rightElbowDeg: 24,
                leftShoulderDeg: -16,
                leftElbowDeg: 22,
              }}
            />
          </div>
          {/* Kuroda walking sternly away toward back right */}
          <div
            className="absolute"
            style={{
              left: interpolate(bp, [0, 1], [590, 740]),
              top: 820,
              transform: "scale(0.92)",
            }}
          >
            <CartoonCharacter
              persona="kuroda"
              expression="determined"
              facing="right"
              frame={frame}
              fps={fps}
              isSpeaking={false}
              pose={{
                walkPhase: frame * 0.35,
                rightShoulderDeg: 18,
                leftShoulderDeg: -18,
              }}
            />
          </div>
        </div>
      );
    }

    // Beat C: Mechanical station wall clock spinning forward 2 days into night!
    const bp = clamp01((p - 0.74) / 0.26);
    const minuteAngle = bp * 2400;
    const hourAngle = bp * 200;

    return (
      <div className="absolute inset-0 overflow-hidden bg-slate-950">
        <BackgroundPlate
          src="backgrounds/shinkansen/anden_estacion_japon.jpg"
          progress={bp}
          scaleFrom={1.25}
          scaleTo={1.38}
          tintOverlay={`rgba(2, 6, 23, ${0.2 + bp * 0.55})`}
        />
        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          <g transform="translate(540, 650)">
            <circle cx="0" cy="0" r="240" fill="#F8FAFC" stroke="#0F172A" strokeWidth="18" />
            <circle cx="0" cy="0" r="212" fill="none" stroke="#94A3B8" strokeWidth="5" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
              <line
                key={`tick_${a}`}
                x1={Math.sin((a * Math.PI) / 180) * 182}
                y1={-Math.cos((a * Math.PI) / 180) * 182}
                x2={Math.sin((a * Math.PI) / 180) * 204}
                y2={-Math.cos((a * Math.PI) / 180) * 204}
                stroke="#0F172A"
                strokeWidth={a % 90 === 0 ? 12 : 6}
                strokeLinecap="round"
              />
            ))}
            {/* Hour & Minute hands */}
            <line
              x1="0"
              y1="0"
              x2={Math.sin((hourAngle * Math.PI) / 180) * 115}
              y2={-Math.cos((hourAngle * Math.PI) / 180) * 115}
              stroke="#0F172A"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="0"
              x2={Math.sin((minuteAngle * Math.PI) / 180) * 172}
              y2={-Math.cos((minuteAngle * Math.PI) / 180) * 172}
              stroke="#EF4444"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <circle cx="0" cy="0" r="18" fill="#0F172A" />

            {/* Deadline badge */}
            <rect x="-185" y="275" width="370" height="76" rx="16" fill="#DC2626" stroke="#0F172A" strokeWidth="6" />
            <text x="0" y="325" textAnchor="middle" fill="#FEF08A" fontSize="34" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              LÍMITE: VIERNES
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 3: Túnel de Viento — Nariz cónica comprime el aire -> Maqueta colapsa
  // ============================================================================
  if (escena.id === 3) {
    const isBeatA = p < 0.36;
    const isBeatB = p >= 0.36 && p < 0.72;
    const isBeatC = p >= 0.72;

    const smokeShift = (frame * 26) % 180;
    const shakeModel = isBeatB ? Math.sin(frame * 2.2) * 9 : 0;
    const fallAngle = isBeatC ? interpolate(clamp01((p - 0.72) / 0.16), [0, 1], [0, 38]) : 0;
    const fallY = isBeatC ? interpolate(clamp01((p - 0.72) / 0.16), [0, 1], [0, 185]) : 0;

    return (
      <div className="absolute inset-0 overflow-hidden bg-slate-900">
        <BackgroundPlate
          src="backgrounds/shinkansen/laboratorio_tunel_viento.jpg"
          progress={p}
          scaleFrom={isBeatB ? 1.18 : 1.04}
          scaleTo={isBeatB ? 1.26 : 1.1}
        />

        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          {/* Wind Tunnel Glass Test Chamber Frame */}
          <rect
            x="90"
            y="430"
            width="900"
            height="560"
            rx="24"
            fill="rgba(15, 23, 42, 0.65)"
            stroke="#38BDF8"
            strokeWidth="8"
          />

          {/* Mounted Cone Train Test Model */}
          <g transform={`translate(${480 + shakeModel}, ${730 + fallY}) rotate(${fallAngle})`}>
            {/* Steel test strut */}
            {!isBeatC && <rect x="-12" y="20" width="24" height="230" fill="#64748B" stroke="#0F172A" strokeWidth="5" />}
            <ShinkansenProfileSvg x={0} y={0} variant="cone" scale={1.25} />
          </g>

          {/* Animated white wind-tunnel airflow streamlines crashing into a RED compression piston wall! */}
          {!isBeatC && (
            <g>
              {[560, 620, 680, 740, 800].map((sy, idx) => (
                <line
                  key={`wf_${idx}`}
                  x1={950 - smokeShift - idx * 25}
                  y1={sy}
                  x2={830 - smokeShift - idx * 25}
                  y2={sy}
                  stroke="#F8FAFC"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              ))}
              {/* Red piston pressure wall piling up right in front of the nose */}
              {(isBeatB || p > 0.25) && (
                <g opacity={isBeatB ? 0.92 : 0.45}>
                  <ellipse cx={690} cy={725} rx={36 + Math.sin(frame * 0.8) * 8} ry={125} fill="rgba(239, 68, 68, 0.55)" stroke="#EF4444" strokeWidth="6" />
                  <text x="690" y="545" textAnchor="middle" fill="#FCA5A5" fontSize="28" fontWeight="900">
                    ¡MURO DE AIRE!
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Sparks on Beat C model collapse */}
          {isBeatC && (
            <g transform="translate(520, 960)">
              {[0, 1, 2, 3, 4].map((i) => {
                const sp = clamp01((p - 0.74) / 0.2);
                const ang = -2.6 + i * 0.55;
                return (
                  <line
                    key={`wt_spk_${i}`}
                    x1={Math.cos(ang) * sp * 95}
                    y1={Math.sin(ang) * sp * 95}
                    x2={Math.cos(ang) * (sp * 95 + 26)}
                    y2={Math.sin(ang) * (sp * 95 + 26)}
                    stroke="#FACC15"
                    strokeWidth="7"
                    strokeLinecap="round"
                    opacity={1 - sp}
                  />
                );
              })}
            </g>
          )}

          {/* Control console + lever on floor bottom-right */}
          <g transform="translate(860, 1280)">
            <rect x="-70" y="-120" width="140" height="120" rx="12" fill="#334155" stroke="#0F172A" strokeWidth="6" />
            <line x1="-25" y1="-120" x2={isBeatA ? -55 : -5} y2="-195" stroke="#EF4444" strokeWidth="12" strokeLinecap="round" />
            <circle cx={isBeatA ? -55 : -5} cy="-195" r="14" fill="#FACC15" stroke="#0F172A" strokeWidth="4" />
          </g>
        </svg>

        {/* Eiji at control console */}
        <div className="absolute" style={{ left: isBeatC ? 660 : 620, top: 840 }}>
          <CartoonCharacter
            persona="eiji"
            expression={isBeatC ? "shocked" : "focused"}
            facing="left"
            scale={1.04}
            frame={frame}
            fps={fps}
            palabras={escena.palabras}
            pose={
              isBeatA
                ? { rightShoulderDeg: 68, rightElbowDeg: 22, leftShoulderDeg: -16, leftElbowDeg: 22 }
                : isBeatC
                ? { torsoLeanDeg: -10, rightShoulderDeg: 118, rightElbowDeg: 24, leftShoulderDeg: 108, leftElbowDeg: 20 }
                : { rightShoulderDeg: 45, rightElbowDeg: 55, leftShoulderDeg: -14, leftElbowDeg: 20 }
            }
          />
        </div>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 4: Taller nocturno agotado -> Amanecer en el estanque -> Martín pescador en rama
  // ============================================================================
  if (escena.id === 4) {
    const isBeatA = p < 0.34;
    const isBeatB = p >= 0.34 && p < 0.68;
    const isBeatC = p >= 0.68;

    if (isBeatA) {
      const bp = clamp01(p / 0.34);
      return (
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
          <BackgroundPlate
            src="backgrounds/shinkansen/laboratorio_tunel_viento.jpg"
            progress={bp}
            tintOverlay="rgba(15, 23, 42, 0.62)"
          />
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            {/* Chalkboard with crossed-out train shapes */}
            <rect x="140" y="420" width="800" height="460" rx="16" fill="#064E3B" stroke="#78350F" strokeWidth="18" />
            <path d="M 240 600 L 420 600 L 470 650 L 240 650 Z" fill="none" stroke="#FFFFFF" strokeWidth="5" opacity="0.7" />
            <line x1="230" y1="580" x2="480" y2="670" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" />
            <path d="M 580 590 C 660 590 740 630 780 660 L 580 660 Z" fill="none" stroke="#FFFFFF" strokeWidth="5" opacity="0.7" />
            <line x1="570" y1="580" x2="800" y2="670" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" />
            {/* Crumpled paper sketches on floor */}
            {[260, 410, 720, 840].map((px, i) => (
              <circle key={`pap_${i}`} cx={px} cy={1310 + (i % 2) * 18} r="20" fill="#F8FAFC" stroke="#0F172A" strokeWidth="4" />
            ))}
          </svg>
          <div className="absolute" style={{ left: 320, top: 830 }}>
            <CartoonCharacter
              persona="eiji"
              expression="exhausted"
              facing="right"
              scale={1.08}
              frame={frame}
              fps={fps}
              palabras={escena.palabras}
              sweatDrops={true}
              pose={{
                headTiltDeg: 8,
                rightShoulderDeg: 115,
                rightElbowDeg: 95,
                leftShoulderDeg: -15,
                leftElbowDeg: 25,
              }}
            />
          </div>
        </div>
      );
    }

    if (isBeatB) {
      const bp = clamp01((p - 0.34) / 0.34);
      const walkX = interpolate(bp, [0, 1], [-20, 120]);
      return (
        <div className="absolute inset-0 overflow-hidden bg-amber-100">
          <BackgroundPlate src="backgrounds/shinkansen/estanque_amanecer.jpg" progress={bp} scaleFrom={1.04} scaleTo={1.12} />
          <div className="absolute" style={{ left: walkX, top: 870 }}>
            <CartoonCharacter
              persona="eiji"
              expression="exhausted"
              facing="right"
              scale={1.05}
              frame={frame}
              fps={fps}
              palabras={escena.palabras}
              neckBinoculars={true}
              pose={{
                walkPhase: frame * 0.25,
                rightShoulderDeg: 20,
                leftShoulderDeg: -20,
              }}
            />
          </div>
        </div>
      );
    }

    // Beat C: Kingfisher perched on upper-left overhanging branch watching fish; Eiji raises binoculars!
    const bp = clamp01((p - 0.68) / 0.32);
    const fishX = interpolate(bp, [0, 1], [620, 560]);

    return (
      <div className="absolute inset-0 overflow-hidden bg-amber-100">
        <BackgroundPlate
          src="backgrounds/shinkansen/estanque_amanecer.jpg"
          progress={bp}
          scaleFrom={1.12}
          scaleTo={1.24}
        />
        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          {/* Vibrant Kingfisher perched on overhanging branch */}
          <KingfisherBirdSvg x={460} y={535} scale={1.35} pose="perched" frame={frame} rotationDeg={12} />
          {/* Silver fish silhouette swimming calmly beneath pond water */}
          <g transform={`translate(${fishX}, 1090)`} opacity="0.75">
            <ellipse cx="0" cy="0" rx="34" ry="12" fill="#94A3B8" stroke="#0F172A" strokeWidth="3.5" />
            <polygon points="32,0 52,-12 52,12" fill="#94A3B8" stroke="#0F172A" strokeWidth="3.5" />
          </g>
        </svg>
        <div className="absolute" style={{ left: 60, top: 870 }}>
          <CartoonCharacter
            persona="eiji"
            expression="focused"
            facing="right"
            scale={1.04}
            frame={frame}
            fps={fps}
            palabras={escena.palabras}
            heldTool="binoculares"
            pose={{
              headTiltDeg: -14,
              rightShoulderDeg: 118,
              rightElbowDeg: 95,
              leftShoulderDeg: 105,
              leftElbowDeg: 90,
            }}
          />
        </div>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 5: Martín pescador en picado -> Corte submarino sin salpicar -> Epifanía de Eiji
  // ============================================================================
  if (escena.id === 5) {
    const isBeatA = p < 0.34;
    const isBeatB = p >= 0.34 && p < 0.72;
    const isBeatC = p >= 0.72;

    if (isBeatA) {
      const bp = clamp01(p / 0.34);
      const diveY = interpolate(bp, [0, 1], [340, 1020]);
      return (
        <div className="absolute inset-0 overflow-hidden bg-amber-100">
          <BackgroundPlate src="backgrounds/shinkansen/estanque_amanecer.jpg" progress={bp} scaleFrom={1.08} scaleTo={1.18} />
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            {/* Vertical speed streaks behind diving arrow-bird */}
            <line x1="505" y1={diveY - 260} x2="505" y2={diveY - 70} stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
            <line x1="575" y1={diveY - 220} x2="575" y2={diveY - 50} stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
            <KingfisherBirdSvg x={540} y={diveY} scale={1.45} pose="diving" frame={frame} rotationDeg={82} />
          </svg>
        </div>
      );
    }

    if (isBeatB) {
      // Stylized Slow-Motion Underwater Cutaway: Zero splash!
      const bp = clamp01((p - 0.34) / 0.38);
      const entryY = interpolate(bp, [0, 1], [540, 960]);

      return (
        <div className="absolute inset-0 overflow-hidden bg-sky-200">
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="sky_under_top" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="100%" stopColor="#FDE68A" />
              </linearGradient>
              <linearGradient id="water_under_deep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="50%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#082F49" />
              </linearGradient>
            </defs>
            {/* Above-water warm morning sky */}
            <rect width="1080" height="620" fill="url(#sky_under_top)" />
            {/* Deep underwater cutaway */}
            <rect y="620" width="1080" height="1300" fill="url(#water_under_deep)" />

            {/* Calm unbroken water surface line (tiny soft ripple, zero splash!) */}
            <path
              d="M 0 620 Q 270 614 540 620 Q 810 626 1080 620"
              fill="none"
              stroke="#E0F2FE"
              strokeWidth="10"
            />
            {bp > 0.25 && (
              <ellipse
                cx="540"
                cy="620"
                rx={interpolate(bp, [0.25, 1], [14, 95])}
                ry="8"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4"
                opacity={1 - (bp - 0.25)}
              />
            )}

            {/* Diving Kingfisher slicing cleanly into water */}
            <KingfisherBirdSvg x={540} y={entryY} scale={1.85} pose="diving" frame={frame} rotationDeg={86} />

            {/* Delicate tiny trailing micro-bubbles (no violent splash!) */}
            {bp > 0.3 &&
              [0, 1, 2, 3].map((i) => (
                <circle
                  key={`mbub_${i}`}
                  cx={525 + (i % 2 === 0 ? -18 : 22)}
                  cy={660 + i * 55}
                  r={5 + (i % 2) * 2}
                  fill="rgba(224,242,254,0.65)"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              ))}

            {/* Clean callout pill above water surface */}
            <g transform="translate(540, 260)">
              <rect x="-250" y="-45" width="500" height="90" rx="18" fill="#0F172A" stroke="#38BDF8" strokeWidth="5" />
              <text x="0" y="10" textAnchor="middle" fill="#38BDF8" fontSize="34" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                0% SALPICADURA
              </text>
            </g>
          </svg>
        </div>
      );
    }

    // Beat C: Close-up of Eiji lowering binoculars with bright Epiphany!
    const bp = clamp01((p - 0.72) / 0.28);
    return (
      <div className="absolute inset-0 overflow-hidden bg-amber-100">
        <BackgroundPlate
          src="backgrounds/shinkansen/estanque_amanecer.jpg"
          progress={bp}
          scaleFrom={1.2}
          scaleTo={1.32}
        />
        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          {/* Glowing Epiphany light rays behind Eiji */}
          <circle cx="540" cy="760" r={160 + Math.sin(frame * 0.4) * 14} fill="#FEF08A" opacity="0.45" />
        </svg>
        <div className="absolute" style={{ left: 320, top: 820 }}>
          <CartoonCharacter
            persona="eiji"
            expression="amazed"
            facing="right"
            scale={1.18}
            frame={frame}
            fps={fps}
            palabras={escena.palabras}
            neckBinoculars={true}
            pose={{
              headTiltDeg: -8,
              rightShoulderDeg: 145,
              rightElbowDeg: 22,
              leftShoulderDeg: -22,
              leftElbowDeg: 30,
            }}
          />
        </div>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 6: Simulación en Vivo (CERO personajes, CERO obstrucción, todo arriba de y=1340!)
  // ============================================================================
  if (escena.id === 6) {
    const isBeatA = p < 0.4;
    const isBeatB = p >= 0.4 && p < 0.72;
    const isBeatC = p >= 0.72;

    const flowOffset = (frame * 16) % 160;

    return (
      <div className="absolute inset-0 overflow-hidden bg-[#0A0F1D]">
        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="shink_grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#1E293B" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="1080" height="1920" fill="#0A0F1D" />
          <rect width="1080" height="1920" fill="url(#shink_grid)" opacity="0.85" />

          {/* Header Banner */}
          <g transform="translate(540, 165)">
            <rect x="-430" y="-48" width="860" height="96" rx="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="5" />
            <text x="0" y="-4" textAnchor="middle" fill="#38BDF8" fontSize="30" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              BIOMÍMESIS AERODINÁMICA (800× DENSIDAD)
            </text>
            <text x="0" y="30" textAnchor="middle" fill="#E2E8F0" fontSize="21" fontWeight="700">
              Transición gradual de área = Sin ola de choque
            </text>
          </g>

          {isBeatA && (
            <g>
              {/* Top Lane: Blunt Nose compressing RED particles */}
              <g transform="translate(540, 500)">
                <rect x="-440" y="-190" width="880" height="380" rx="22" fill="#2A0E17" stroke="#EF4444" strokeWidth="6" />
                <text x="-400" y="-135" fill="#FCA5A5" fontSize="26" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                  NARIZ CHATA → COMPRIME EL AIRE
                </text>
                <ShinkansenProfileSvg x={-60} y={25} variant="blunt" scale={1.15} />
                {/* Red shockwave pileup in front */}
                <ellipse cx={165} cy={20} rx={32 + Math.sin(frame * 0.7) * 6} ry={95} fill="rgba(239,68,68,0.65)" stroke="#EF4444" strokeWidth="6" />
                <rect x="235" y="-160" width="175" height="54" rx="10" fill="#EF4444" stroke="#0F172A" strokeWidth="4" />
                <text x="322" y="-124" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900">95 dB ⚠</text>
              </g>

              {/* Bottom Lane: Kingfisher Beak slicing smooth laminar flow */}
              <g transform="translate(540, 960)">
                <rect x="-440" y="-190" width="880" height="380" rx="22" fill="#062E27" stroke="#10B981" strokeWidth="6" />
                <text x="-400" y="-135" fill="#6EE7B7" fontSize="26" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                  PICO DE AVE → FLUJO SUAVE LAMINAR
                </text>
                {/* Kingfisher beak profile */}
                <g transform="translate(-50, 20)">
                  <path d="M -180 -65 C -60 -65 60 -28 210 0 C 60 28 -60 65 -180 65 Z" fill="#0284C7" stroke="#0F172A" strokeWidth="6" />
                  <path d="M 10 -18 L 210 0 L 10 18 Z" fill="#0F172A" />
                </g>
                {/* Smooth animated laminar streamlines sliding around */}
                {[-70, -35, 35, 70].map((oy, idx) => (
                  <path
                    key={`lam_${idx}`}
                    d={`M 260 ${oy * 0.4} Q 40 ${oy * 1.45} -260 ${oy * 1.6}`}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="6"
                    strokeDasharray="36 24"
                    strokeDashoffset={flowOffset}
                  />
                ))}
                <rect x="235" y="-160" width="175" height="54" rx="10" fill="#10B981" stroke="#0F172A" strokeWidth="4" />
                <text x="322" y="-124" textAnchor="middle" fill="#0F172A" fontSize="28" fontWeight="900">68 dB ✓</text>
              </g>
            </g>
          )}

          {isBeatB && (() => {
            const morphP = clamp01((p - 0.4) / 0.25);
            const curDb = Math.round(interpolate(morphP, [0, 1], [95, 68]));
            const barH = interpolate(morphP, [0, 1], [420, 160]);
            const isGreen = curDb <= 72;

            return (
              <g>
                {/* Morphing Blueprint Box (Left-Center) */}
                <g transform="translate(410, 740)">
                  <rect x="-330" y="-340" width="660" height="720" rx="22" fill="#0F172A" stroke="#38BDF8" strokeWidth="6" />
                  <text x="0" y="-280" textAnchor="middle" fill="#38BDF8" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                    PICO → NARIZ DE 15 METROS
                  </text>

                  {/* Ghost outline of Kingfisher beak morphing into Serie 500 */}
                  <g opacity={1 - morphP * 0.65} transform="translate(0, -110) scale(1.2)">
                    <KingfisherBirdSvg x={-30} y={0} scale={1.1} pose="flying" frame={frame} />
                  </g>
                  <g opacity={0.35 + morphP * 0.65} transform="translate(-10, 140) scale(1.3)">
                    <ShinkansenProfileSvg x={0} y={0} variant="serie500" />
                  </g>

                  {/* Dimension bracket */}
                  <line x1="-15" y1="240" x2="230" y2="240" stroke="#FACC15" strokeWidth="5" />
                  <text x="108" y="280" textAnchor="middle" fill="#FACC15" fontSize="24" fontWeight="900">
                    15 m parabólicos
                  </text>
                </g>

                {/* Live Vertical Decibel Bar Meter on Right (95 dB -> 68 dB!) */}
                <g transform="translate(895, 740)">
                  <rect x="-95" y="-340" width="190" height="720" rx="22" fill="#0F172A" stroke={isGreen ? "#10B981" : "#EF4444"} strokeWidth="6" />
                  <text x="0" y="-285" textAnchor="middle" fill="#E2E8F0" fontSize="24" fontWeight="900">RUIDO</text>
                  {/* Meter Track */}
                  <rect x="-32" y="-220" width="64" height="440" rx="14" fill="#1E293B" stroke="#475569" strokeWidth="4" />
                  {/* Live Animated Fill */}
                  <rect
                    x="-28"
                    y={220 - barH}
                    width="56"
                    height={barH}
                    rx="10"
                    fill={isGreen ? "#10B981" : "#EF4444"}
                  />
                  {/* Legal 70 dB threshold line */}
                  <line x1="-65" y1="30" x2="65" y2="30" stroke="#FACC15" strokeWidth="4" strokeDasharray="8 6" />
                  <text x="0" y="305" textAnchor="middle" fill={isGreen ? "#4ADE80" : "#FCA5A5"} fontSize="42" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                    {curDb} dB
                  </text>
                </g>
              </g>
            );
          })()}

          {isBeatC && (() => {
            const simP = clamp01((p - 0.72) / 0.28);
            const trainX = interpolate(simP, [0, 1], [-80, 1080]);
            return (
              <g>
                <g transform="translate(540, 740)">
                  <rect x="-460" y="-330" width="920" height="680" rx="22" fill="#062E27" stroke="#10B981" strokeWidth="6" />
                  <text x="0" y="-265" textAnchor="middle" fill="#6EE7B7" fontSize="30" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                    SIMULACIÓN EN TÚNEL (300 KM/H)
                  </text>
                  {/* Concrete Tunnel Cross-Section */}
                  <rect x="-240" y="-140" width="540" height="28" fill="#64748B" stroke="#0F172A" strokeWidth="4" />
                  <rect x="-240" y="135" width="540" height="28" fill="#64748B" stroke="#0F172A" strokeWidth="4" />
                  {/* Smooth air escaping behind instead of blocking in front */}
                  {[-50, 50].map((oy, i) => (
                    <line
                      key={`sl_${i}`}
                      x1={trainX - 540 + 180}
                      y1={oy}
                      x2={trainX - 540 - 40}
                      y2={oy}
                      stroke="#38BDF8"
                      strokeWidth="6"
                      strokeDasharray="24 16"
                    />
                  ))}
                  <ShinkansenProfileSvg x={trainX - 540} y={40} variant="serie500" scale={1.15} />
                  <rect x="-185" y="215" width="370" height="68" rx="14" fill="#10B981" stroke="#0F172A" strokeWidth="5" />
                  <text x="0" y="260" textAnchor="middle" fill="#0F172A" fontSize="28" fontWeight="900">
                    ✓ FLUJO SIN ONDA SÓNICA
                  </text>
                </g>
              </g>
            );
          })()}
        </svg>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 7: Clímax en Prueba Final — Shinkansen Serie 500 pasa en silencio + Verde
  // ============================================================================
  if (escena.id === 7) {
    const isBeatA = p < 0.36;
    const isBeatB = p >= 0.36 && p < 0.7;
    const isBeatC = p >= 0.7;

    if (isBeatA) {
      const bp = clamp01(p / 0.36);
      const tx = interpolate(bp, [0, 0.55, 1], [305, 485, 410]);
      const ty = interpolate(bp, [0, 0.55, 1], [1100, 1265, 1485]);
      const ts = interpolate(bp, [0, 1], [0.22, 1.35]);

      return (
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
          <BackgroundPlate src="backgrounds/shinkansen/tunel_japon_dia.jpg" progress={bp} />
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            {/* Sleek Serie 500 emerging smoothly without any shockwave ring! */}
            <g transform={`translate(${tx}, ${ty}) scale(${ts}) rotate(14)`}>
              {/* Long needle-like parabolic nose coming toward viewer */}
              <path
                d="M -70 -95 L 70 -95 L 110 -10 C 80 55 -80 55 -110 -10 Z"
                fill="#F8FAFC"
                stroke="#0F172A"
                strokeWidth="7"
              />
              <path d="M -55 -88 L 55 -88 L 80 -35 L -80 -35 Z" fill="#1D4ED8" stroke="#0F172A" strokeWidth="4" />
              {/* Sleek flush cockpit canopy */}
              <path d="M -38 -65 L 38 -65 L 48 -38 L -48 -38 Z" fill="#0F172A" />
              {/* Extended blue aerodynamic beak tip */}
              <polygon points="-42,-10 42,-10 0,72" fill="#0284C7" stroke="#0F172A" strokeWidth="6" />
              <circle cx="-46" cy="-14" r="10" fill="#FEF08A" stroke="#0F172A" strokeWidth="3" />
              <circle cx="46" cy="-14" r="10" fill="#FEF08A" stroke="#0F172A" strokeWidth="3" />
            </g>
            {/* Subtle blue laminar speed air streaks */}
            <line x1="250" y1="1120" x2="120" y2="1280" stroke="#38BDF8" strokeWidth="6" opacity="0.6" strokeLinecap="round" />
            <line x1="420" y1="1160" x2="310" y2="1320" stroke="#38BDF8" strokeWidth="6" opacity="0.6" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    if (isBeatB) {
      const bp = clamp01((p - 0.36) / 0.34);
      return (
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
          <BackgroundPlate
            src="backgrounds/shinkansen/tunel_japon_dia.jpg"
            progress={bp}
            scaleFrom={1.12}
            scaleTo={1.2}
          />
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            {/* Calm still country house badge & Sonometer locked safely in GREEN ZONE */}
            <g transform="translate(275, 580)">
              <rect x="-180" y="-175" width="360" height="390" rx="28" fill="#FACC15" stroke="#0F172A" strokeWidth="10" />
              <rect x="-150" y="-145" width="300" height="200" rx="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" />
              <path d="M -110 20 A 110 110 0 0 1 10 -90" fill="none" stroke="#10B981" strokeWidth="24" />
              <path d="M 10 -90 A 110 110 0 0 1 110 20" fill="none" stroke="#EF4444" strokeWidth="24" />
              {/* Needle resting steady in green zone */}
              <g transform="translate(0, 20) rotate(-32)">
                <polygon points="-7,6 0,-115 7,6" fill="#0F172A" />
                <circle cx="0" cy="0" r="14" fill="#10B981" stroke="#0F172A" strokeWidth="4" />
              </g>
              <rect x="-125" y="78" width="250" height="86" rx="14" fill="#064E3B" stroke="#0F172A" strokeWidth="6" />
              <text x="0" y="136" textAnchor="middle" fill="#4ADE80" fontSize="42" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                68 dB ✓
              </text>
            </g>
          </svg>
          <div className="absolute" style={{ left: 490, top: 850 }}>
            <CartoonCharacter
              persona="kuroda"
              expression="focused"
              facing="left"
              scale={1.06}
              frame={frame}
              fps={fps}
              isSpeaking={false}
              heldTool="sonometro"
              pose={{ rightShoulderDeg: 52, rightElbowDeg: 45, leftShoulderDeg: -16, leftElbowDeg: 20 }}
            />
          </div>
        </div>
      );
    }

    // Beat C: Kuroda nods respectfully while Eiji smiles raising binoculars in triumph!
    const bp = clamp01((p - 0.7) / 0.3);
    const nod = Math.sin(bp * Math.PI * 2) * 8;
    return (
      <div className="absolute inset-0 overflow-hidden bg-slate-950">
        <BackgroundPlate src="backgrounds/shinkansen/tunel_japon_dia.jpg" progress={bp} scaleFrom={1.16} scaleTo={1.24} />
        <div className="absolute" style={{ left: 160, top: 840 }}>
          <CartoonCharacter
            persona="eiji"
            expression="amazed"
            facing="right"
            scale={1.08}
            frame={frame}
            fps={fps}
            palabras={escena.palabras}
            neckBinoculars={true}
            pose={{
              rightShoulderDeg: 138,
              rightElbowDeg: 22,
              leftShoulderDeg: -20,
              leftElbowDeg: 28,
            }}
          />
        </div>
        <div className="absolute" style={{ left: 530, top: 830 }}>
          <CartoonCharacter
            persona="kuroda"
            expression="relieved"
            facing="left"
            scale={1.08}
            frame={frame}
            fps={fps}
            isSpeaking={false}
            heldTool="portapapeles"
            pose={{
              headTiltDeg: nod,
              rightShoulderDeg: 22,
              rightElbowDeg: 35,
              leftShoulderDeg: -18,
              leftElbowDeg: 22,
            }}
          />
        </div>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 8: Legado Universal — Tren veloz junto al río + Martín pescador volando al cielo
  // ============================================================================
  const trainProg = clamp01(p * 1.02);
  // Exact concrete viaduct curve in valle_rio_japon.jpg:
  // Valley bridge (~595, 675) -> rightmost bend (~915, 920) -> lower-mid (~780, 1210) -> foreground (~530, 1455)
  const mt = 1 - trainProg;
  const p0 = [595, 675];
  const p1 = [960, 840];
  const p2 = [940, 1140];
  const p3 = [495, 1485];
  const tx = mt * mt * mt * p0[0] + 3 * mt * mt * trainProg * p1[0] + 3 * mt * trainProg * trainProg * p2[0] + trainProg * trainProg * trainProg * p3[0];
  const ty = mt * mt * mt * p0[1] + 3 * mt * mt * trainProg * p1[1] + 3 * mt * trainProg * trainProg * p2[1] + trainProg * trainProg * trainProg * p3[1];
  const dx = 3 * mt * mt * (p1[0] - p0[0]) + 6 * mt * trainProg * (p2[0] - p1[0]) + 3 * trainProg * trainProg * (p3[0] - p2[0]);
  const dy = 3 * mt * mt * (p1[1] - p0[1]) + 6 * mt * trainProg * (p2[1] - p1[1]) + 3 * trainProg * trainProg * (p3[1] - p2[1]);
  const movingLeft = dx < 0;
  // Angle keeping train UPRIGHT on viaduct rails
  const rawAng = (Math.atan2(dy, dx) * 180) / Math.PI;
  const uprightAng = movingLeft ? rawAng - 180 : rawAng;
  const trainScale = interpolate(trainProg, [0, 1], [0.42, 1.15]);

  // Kingfisher flying alongside train nose then soaring upward into clear sky during Beat B (p >= 0.45)
  const birdSoar = p >= 0.45 ? clamp01((p - 0.45) / 0.55) : 0;
  const birdX = p < 0.45 ? tx - 25 : interpolate(birdSoar, [0, 1], [tx - 25, 320]);
  const birdY = p < 0.45 ? ty - 115 : interpolate(birdSoar, [0, 1], [ty - 115, 380]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-sky-200">
      <BackgroundPlate
        src="backgrounds/shinkansen/valle_rio_japon.jpg"
        progress={p}
        scaleFrom={1.03}
        scaleTo={1.12}
      />
      <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
        {/* Efficiency achievement badge near top */}
        <g transform="translate(540, 200)">
          <rect x="-290" y="-48" width="580" height="96" rx="18" fill="#0F172A" stroke="#38BDF8" strokeWidth="6" />
          <text x="0" y="-4" textAnchor="middle" fill="#38BDF8" fontSize="34" fontWeight="900" fontFamily="'Arial Black', sans-serif">
            SHINKANSEN SERIE 500
          </text>
          <text x="0" y="32" textAnchor="middle" fill="#4ADE80" fontSize="24" fontWeight="800">
            -15% Consumo Eléctrico · Cero Boom Sónico
          </text>
        </g>

        {/* Sleek Shinkansen 500 riding UPRIGHT directly along the curving concrete viaduct */}
        <g transform={`translate(${tx.toFixed(1)}, ${ty.toFixed(1)}) rotate(${uprightAng.toFixed(1)}) scale(${movingLeft ? -1 : 1}, 1)`}>
          <ShinkansenProfileSvg
            x={0}
            y={-28}
            variant="serie500"
            scale={trainScale}
            rotationDeg={0}
          />
        </g>

        {/* Kingfisher flying upright in formation above train nose then ascending gracefully */}
        <g transform={`translate(${birdX.toFixed(1)}, ${birdY.toFixed(1)}) scale(${movingLeft || birdSoar > 0 ? -1 : 1}, 1)`}>
          <KingfisherBirdSvg
            x={0}
            y={0}
            scale={interpolate(birdSoar, [0, 1], [1.15, 1.45])}
            pose="flying"
            frame={frame}
            rotationDeg={birdSoar > 0.2 ? 22 : 12}
          />
        </g>
      </svg>
    </div>
  );
};
