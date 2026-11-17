import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { EscenaGuion } from "../../types";
import { CartoonCharacter } from "../CartoonCharacter";
import { CoasterCartSvg, ModernCoasterTrain } from "./CoasterElements";
import {
  buildMorphableLoopSegments,
  buildSampledTrack,
  sampleTrackAt,
  segmentsToSvgPath,
} from "./trackMath";

export interface CoasterSceneProps {
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
  scaleFrom = 1.04,
  scaleTo = 1.12,
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

const IronLoopTrackSvg: React.FC<{
  cx: number;
  groundY: number;
  radius: number;
  bottomFlare?: number;
  sideSqueeze?: number;
  railColor?: string;
  accentColor?: string;
  includeRamp?: boolean;
  cracked?: boolean;
  steelSupports?: boolean;
}> = ({
  cx,
  groundY,
  radius,
  bottomFlare = 0,
  sideSqueeze = 0,
  railColor = "#334155",
  accentColor = "#94A3B8",
  includeRamp = true,
  cracked = false,
  steelSupports = false,
}) => {
  const segs = buildMorphableLoopSegments(
    cx,
    groundY,
    radius,
    bottomFlare,
    sideSqueeze,
    includeRamp
  );
  const d = segmentsToSvgPath(segs);
  const topY = groundY - radius * (2.0 + sideSqueeze * 0.58);
  const halfW = radius * (1.0 - sideSqueeze * 0.34 + bottomFlare * 0.12);

  return (
    <g>
      {/* Support A-frames / tubular columns grounded cleanly onto boardwalk/plaza */}
      {[-0.88, -0.45, 0.45, 0.88].map((mult, i) => {
        const px = cx + halfW * mult;
        const pyTop = groundY - radius * (1.55 + sideSqueeze * 0.42);
        const footX = px + mult * 38;
        const footY = groundY + (steelSupports ? 125 : 72);
        return (
          <g key={`supp_${i}`} opacity={cracked && Math.abs(mult) < 0.6 ? 0.35 : 0.94}>
            <line
              x1={px}
              y1={pyTop}
              x2={footX}
              y2={footY}
              stroke={steelSupports ? "#0F172A" : "#291203"}
              strokeWidth={steelSupports ? 22 : 18}
              strokeLinecap="round"
            />
            <line
              x1={px}
              y1={pyTop}
              x2={footX}
              y2={footY}
              stroke={steelSupports ? "#1E293B" : "#92400E"}
              strokeWidth={steelSupports ? 12 : 9}
              strokeLinecap="round"
            />
            <rect
              x={footX - 20}
              y={footY - 6}
              width="40"
              height="14"
              rx="4"
              fill={steelSupports ? "#334155" : "#451A03"}
              stroke="#0F172A"
              strokeWidth="3.5"
            />
          </g>
        );
      })}
      {/* Cross beams (for timber coasters) */}
      {!steelSupports && (
        <g>
          <line
            x1={cx - halfW * 0.92}
            y1={groundY - radius * 0.95}
            x2={cx + halfW * 0.92}
            y2={groundY - radius * 0.95}
            stroke="#451A03"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <line
            x1={cx - halfW * 0.72}
            y1={topY + radius * 0.48}
            x2={cx + halfW * 0.72}
            y2={topY + radius * 0.48}
            stroke="#451A03"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Main steel/iron track with dark cel outline */}
      <path
        d={d}
        fill="none"
        stroke="#0F172A"
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke={railColor}
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke={accentColor}
        strokeWidth="6"
        strokeDasharray="16 14"
        strokeLinecap="round"
      />
    </g>
  );
};

const ImpactStar: React.FC<{ x: number; y: number; scale: number; alpha: number }> = ({
  x,
  y,
  scale,
  alpha,
}) => {
  if (alpha <= 0.02) return null;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={alpha}>
      <path
        d="M 0 -58 L 14 -18 L 54 -36 L 26 0 L 60 24 L 18 28 L 28 66 L 0 36 L -28 62 L -20 22 L -60 12 L -24 -10 L -46 -44 L -12 -22 Z"
        fill="#FEF08A"
        stroke="#EF4444"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="0" cy="0" r="18" fill="#FFFFFF" />
    </g>
  );
};

export const CoasterCinematicScenes: React.FC<CoasterSceneProps> = ({
  escena,
  frame,
  fps,
  durationFrames,
}) => {
  const tSec = frame / fps;
  const p = clamp01(frame / Math.max(1, durationFrames));

  // ============================================================================
  // ESCENA 1 (8.58s): Niko martilleando el bucle hasta deformarlo (3 golpes reales)
  // ============================================================================
  if (escena.id === 1) {
    const isBeat2 = tSec >= 4.25;
    // 3 hammer swings at ~0.55s, 1.75s, 2.95s
    const strikeTimes = [0.65, 1.85, 3.05];
    let swingPhase = -0.3;
    let impactIntensity = 0;
    let strikeCount = 0;

    for (const st of strikeTimes) {
      if (tSec >= st) strikeCount++;
      const dt = tSec - st;
      if (dt >= -0.45 && dt <= 0.45) {
        if (dt < 0) {
          // Wind-up backward overhead
          swingPhase = interpolate(dt, [-0.45, -0.08, 0], [-0.4, -1.0, 1.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        } else {
          swingPhase = interpolate(dt, [0, 0.35], [1.0, -0.2], {
            extrapolateRight: "clamp",
          });
          impactIntensity = Math.max(0, 1 - dt / 0.28);
        }
      }
    }

    const shakeX = impactIntensity > 0 ? Math.sin(frame * 2.3) * 16 * impactIntensity : 0;
    const shakeY = impactIntensity > 0 ? Math.cos(frame * 2.9) * 12 * impactIntensity : 0;
    const deformLevel = clamp01(
      strikeTimes.reduce((acc, st) => acc + (tSec >= st ? 0.25 : 0), 0)
    );

    const shoulderDeg = interpolate(swingPhase, [-1, 0, 1], [202, 112, 62]);
    const elbowDeg = interpolate(swingPhase, [-1, 0, 1], [22, 34, 12]);
    const torsoLean = interpolate(swingPhase, [-1, 0, 1], [-18, 5, 34]);

    const camZoom = isBeat2
      ? interpolate(tSec, [4.25, 4.9, 8.58], [1.02, 1.24, 1.3], { extrapolateRight: "clamp" })
      : 1.0;
    const camY = isBeat2
      ? interpolate(tSec, [4.25, 4.9], [0, -110], { extrapolateRight: "clamp" })
      : 0;

    return (
      <div className="absolute inset-0 overflow-hidden bg-slate-950">
        <BackgroundPlate
          src="backgrounds/coaster/taller_1895.jpg"
          progress={p}
          scaleFrom={1.03}
          scaleTo={1.1}
        />

        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${shakeX}px, ${shakeY + camY}px) scale(${camZoom})`,
            transformOrigin: "center 58%",
          }}
        >
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            {/* Iron coaster loop visibly deforming */}
            <IronLoopTrackSvg
              cx={650}
              groundY={1305}
              radius={235}
              bottomFlare={deformLevel * 0.72}
              sideSqueeze={deformLevel * 0.15}
              includeRamp={true}
            />

            {/* Impact flash & flying sparks right at sledgehammer head strike point */}
            {impactIntensity > 0 && (
              <g>
                <ImpactStar x={575} y={1215} scale={0.95 + impactIntensity * 0.55} alpha={impactIntensity} />
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const spP = 1 - impactIntensity;
                  const ang = -2.8 + i * 0.55;
                  return (
                    <line
                      key={`s1_spk_${i}`}
                      x1={575 + Math.cos(ang) * spP * 110}
                      y1={1215 + Math.sin(ang) * spP * 110}
                      x2={575 + Math.cos(ang) * (spP * 110 + 26)}
                      y2={1215 + Math.sin(ang) * (spP * 110 + 26)}
                      stroke={i % 2 === 0 ? "#FACC15" : "#F97316"}
                      strokeWidth="7"
                      strokeLinecap="round"
                      opacity={impactIntensity}
                    />
                  );
                })}
              </g>
            )}

            {/* Beat 2 proud vintage badge */}
            {isBeat2 && (
              <g
                transform={`translate(540, 340) scale(${interpolate(
                  tSec,
                  [4.25, 4.6],
                  [0.7, 1],
                  { extrapolateRight: "clamp" }
                )})`}
                opacity={interpolate(tSec, [4.25, 4.65], [0, 1], { extrapolateRight: "clamp" })}
              >
                <rect x="-250" y="-50" width="500" height="100" rx="18" fill="#1E293B" stroke="#FACC15" strokeWidth="6" />
                <text x="0" y="-6" textAnchor="middle" fill="#FACC15" fontSize="28" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                  PRIMER BUCLE 360°
                </text>
                <text x="0" y="30" textAnchor="middle" fill="#F8FAFC" fontSize="22" fontWeight="700" fontFamily="sans-serif">
                  Año 1895 · El sueño de su vida
                </text>
              </g>
            )}
          </svg>

          {/* Niko Actor positioned on left timber deck striking the rail */}
          <div
            className="absolute"
            style={{
              left: isBeat2 ? 290 : 35,
              top: 840,
            }}
          >
            <CartoonCharacter
              persona="niko"
              expression={isBeat2 ? "exhausted" : "determined"}
              facing="right"
              scale={1.08}
              frame={frame}
              fps={fps}
              palabras={escena.palabras}
              heldTool={isBeat2 ? "none" : "sledgehammer"}
              sweatDrops={isBeat2 || strikeCount >= 2}
              pose={
                isBeat2
                  ? {
                      torsoLeanDeg: 4,
                      headTiltDeg: -8,
                      rightShoulderDeg: 105,
                      rightElbowDeg: 112,
                      leftShoulderDeg: -18,
                      leftElbowDeg: 22,
                    }
                  : {
                      torsoLeanDeg: torsoLean,
                      bodySquashX: 1 + impactIntensity * 0.1,
                      bodySquashY: 1 - impactIntensity * 0.08,
                      rightShoulderDeg: shoulderDeg,
                      rightElbowDeg: elbowDeg,
                      leftShoulderDeg: shoulderDeg + 8,
                      leftElbowDeg: elbowDeg + 8,
                    }
              }
            />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 2 (8.24s): Rival espiando & copiando planos -> Feria robando al público
  // ============================================================================
  if (escena.id === 2) {
    const isBeat2 = tSec >= 4.15;

    if (!isBeat2) {
      // Beat A: Stealth spy over-the-shoulder in workshop
      const beatP = clamp01(tSec / 4.15);
      return (
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
          <BackgroundPlate
            src="backgrounds/coaster/taller_1895.jpg"
            progress={beatP}
            scaleFrom={1.05}
            scaleTo={1.12}
          />
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            <g opacity="0.88">
              <IronLoopTrackSvg cx={360} groundY={1295} radius={205} includeRamp={false} />
            </g>
            {/* Wooden shadow pillar framing Rival's sneakiness */}
            <rect x="760" y="0" width="320" height="1920" fill="#1E1B18" opacity="0.35" />
          </svg>
          {/* Distant Niko inspecting rail */}
          <div className="absolute" style={{ left: 55, top: 880, transform: "scale(0.84)" }}>
            <CartoonCharacter
              persona="niko"
              expression="focused"
              facing="right"
              frame={frame}
              fps={fps}
              isSpeaking={false}
              pose={{ rightShoulderDeg: 45, rightElbowDeg: 55, leftShoulderDeg: -15, leftElbowDeg: 18 }}
            />
          </div>
          {/* Foreground Rival peeking & sketching on blueprint */}
          <div
            className="absolute"
            style={{
              left: 520,
              top: 840,
              transform: `translateY(${Math.sin(frame * 0.25) * 4}px)`,
            }}
          >
            <CartoonCharacter
              persona="rival"
              expression="evil_grin"
              facing="left"
              scale={1.18}
              frame={frame}
              fps={fps}
              palabras={escena.palabras}
              heldTool="blueprint"
              pose={{
                torsoLeanDeg: 8,
                headTiltDeg: -6,
                rightShoulderDeg: 38,
                rightElbowDeg: 62,
                leftShoulderDeg: -22,
                leftElbowDeg: 28,
              }}
            />
          </div>
        </div>
      );
    }

    // Beat B: Sunny Fairground — Rival's flashy red coaster stealing all the crowd
    const beatP = clamp01((tSec - 4.15) / 4.1);
    const crowdWalk = Math.sin(frame * 0.25);

    return (
      <div className="absolute inset-0 overflow-hidden bg-sky-200">
        <BackgroundPlate
          src="backgrounds/coaster/feria_victoriana_1895.jpg"
          progress={beatP}
          scaleFrom={1.06}
          scaleTo={1.14}
        />
        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          {/* Rival's flashy red circular coaster loop */}
          <IronLoopTrackSvg
            cx={640}
            groundY={1230}
            radius={220}
            railColor="#DC2626"
            accentColor="#FEF08A"
          />
          {/* Grand Opening Banner */}
          <g transform="translate(640, 440)">
            <rect x="-250" y="-42" width="500" height="84" rx="14" fill="#DC2626" stroke="#0F172A" strokeWidth="6" />
            <text x="0" y="10" textAnchor="middle" fill="#FEF08A" fontSize="34" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ★ GRAN INAUGURACIÓN ★
            </text>
          </g>
          {/* Animated fairground spectators grounded on boardwalk */}
          {[140, 230, 320, 420, 510].map((cx, i) => {
            const walkX = cx + beatP * 110;
            const bob = Math.abs(Math.sin(frame * 0.22 + i * 1.1)) * 10;
            return (
              <g key={`spec_${i}`} transform={`translate(${walkX}, ${1230 - bob})`}>
                <ellipse cx="0" cy={bob} rx="22" ry="7" fill="rgba(0,0,0,0.28)" />
                <line x1="-8" y1="-25" x2="-12" y2="0" stroke="#0F172A" strokeWidth="9" strokeLinecap="round" />
                <line x1="8" y1="-25" x2="12" y2="0" stroke="#0F172A" strokeWidth="9" strokeLinecap="round" />
                <rect x="-18" y="-82" width="36" height="62" rx="10" fill={["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"][i]} stroke="#0F172A" strokeWidth="4" />
                <circle cx="0" cy="-100" r="18" fill="#FFE4C4" stroke="#0F172A" strokeWidth="4" />
                {i % 2 === 0 && (
                  <rect x="-14" y="-128" width="28" height="16" fill="#0F172A" stroke="#000" strokeWidth="2.5" />
                )}
              </g>
            );
          })}
        </svg>

        {/* Rival welcoming the crowd smugly */}
        <div className="absolute" style={{ left: 610, top: 820, transform: `translateY(${crowdWalk * 3}px)` }}>
          <CartoonCharacter
            persona="rival"
            expression="laughing"
            facing="left"
            scale={1.06}
            frame={frame}
            fps={fps}
            palabras={escena.palabras}
            pose={{
              rightShoulderDeg: 118,
              rightElbowDeg: 22,
              leftShoulderDeg: -22,
              leftElbowDeg: 32,
            }}
          />
        </div>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 3 (8.89s): Prueba nocturna con muñeco -> carrito loop -> muñeco aplastado
  // ============================================================================
  if (escena.id === 3) {
    const isLaunch = tSec < 3.1;
    const isRide = tSec >= 3.1 && tSec < 6.0;
    const isReveal = tSec >= 6.0;

    const loopSegs = buildMorphableLoopSegments(560, 1300, 235, 0, 0, true);
    const loopTrack = buildSampledTrack(loopSegs);

    // Cart progress: sitting on launch ramp -> flying through loop -> parked at exit
    let cartU = 0.04;
    if (isRide) {
      cartU = interpolate(tSec, [3.1, 5.95], [0.05, 0.87], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (isReveal) {
      cartU = 0.87;
    }

    const cartPt = sampleTrackAt(loopTrack, cartU);
    // High G-force when entering bottom of loop (u ~ 0.18-0.28) or exiting bottom (u ~ 0.72-0.84)
    const highG = isRide && ((cartU > 0.16 && cartU < 0.30) || (cartU > 0.68 && cartU < 0.80));
    const camScale = isReveal
      ? interpolate(tSec, [6.0, 6.45], [1.02, 1.24], { extrapolateRight: "clamp" })
      : 1.0;

    return (
      <div className="absolute inset-0 overflow-hidden bg-slate-950">
        <BackgroundPlate
          src="backgrounds/coaster/noche_sabotaje_1895.jpg"
          progress={p}
          scaleFrom={1.03}
          scaleTo={1.1}
        />

        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${camScale}) translate(${isReveal ? -60 : 0}px, ${
              isReveal ? -65 : 0
            }px)`,
            transformOrigin: "center 65%",
          }}
        >
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            <IronLoopTrackSvg cx={560} groundY={1300} radius={235} />

            {/* Moving Cart with Crash Test Dummy */}
            <CoasterCartSvg
              x={cartPt.x}
              y={cartPt.y}
              angleDeg={cartPt.angleDeg}
              variant={isReveal ? "empty" : "dummy"}
              squashY={highG ? 0.55 : 1}
              wheelAngleDeg={cartU * 2600}
              speedBlur={isRide}
              sparks={highG}
              frame={frame}
              scale={1.05}
            />

            {/* Giant 12G warning arrow smashing bottom of circle during test ride */}
            {highG && (
              <g transform="translate(560, 1185)">
                <rect x="-150" y="-42" width="300" height="72" rx="14" fill="#EF4444" stroke="#0F172A" strokeWidth="5" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="32" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                  ¡12G APLASTANTES!
                </text>
              </g>
            )}

            {/* Launch lever beside Niko in Beat 1 */}
            {isLaunch && (
              <g transform="translate(260, 1300)">
                <rect x="-20" y="-30" width="40" height="30" rx="4" fill="#475569" stroke="#0F172A" strokeWidth="4" />
                <line
                  x1="0"
                  y1="-25"
                  x2={interpolate(tSec, [2.4, 3.0], [-24, 28], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}
                  y2="-95"
                  stroke="#DC2626"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <circle
                  cx={interpolate(tSec, [2.4, 3.0], [-24, 28], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}
                  cy="-95"
                  r="12"
                  fill="#EF4444"
                  stroke="#0F172A"
                  strokeWidth="4"
                />
              </g>
            )}
          </svg>

          {/* Niko actor */}
          <div
            className="absolute"
            style={{
              left: isReveal ? 350 : 60,
              top: 845,
            }}
          >
            <CartoonCharacter
              persona="niko"
              expression={isReveal ? "panicked" : isRide ? "shocked" : "focused"}
              facing="right"
              scale={isReveal ? 1.1 : 1.0}
              frame={frame}
              fps={fps}
              palabras={escena.palabras}
              heldTool={isReveal ? "crushed_dummy" : "none"}
              sweatDrops={isReveal}
              pose={
                isReveal
                  ? {
                      torsoLeanDeg: -6,
                      rightShoulderDeg: 58,
                      rightElbowDeg: 52,
                      leftShoulderDeg: -20,
                      leftElbowDeg: 28,
                    }
                  : isRide
                  ? {
                      rightShoulderDeg: 135,
                      rightElbowDeg: 20,
                      leftShoulderDeg: 122,
                      leftElbowDeg: 18,
                    }
                  : {
                      rightShoulderDeg: 65,
                      rightElbowDeg: 15,
                      leftShoulderDeg: -18,
                      leftElbowDeg: 20,
                    }
              }
            />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 4 (10.74s): Peligro 12G -> Niko agarra el mazo y revienta la base afuera
  // ============================================================================
  if (escena.id === 4) {
    const isBeat1 = tSec < 4.4;
    const hitTimes = [5.1, 6.2, 7.3, 8.5, 9.6];
    let swingPhase = 0;
    let impactVal = 0;
    let flareProgress = 0;

    for (const ht of hitTimes) {
      if (tSec >= ht) flareProgress += 0.18;
      const dt = tSec - ht;
      if (dt >= -0.45 && dt <= 0.45) {
        if (dt < 0) {
          swingPhase = interpolate(dt, [-0.45, -0.08, 0], [-0.4, -1.0, 1.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        } else {
          swingPhase = interpolate(dt, [0, 0.35], [1.0, -0.25], {
            extrapolateRight: "clamp",
          });
          impactVal = Math.max(0, 1 - dt / 0.25);
        }
      }
    }

    const bottomFlare = clamp01(flareProgress);
    const shakeX = impactVal > 0 ? Math.sin(frame * 2.5) * 18 * impactVal : 0;
    const shakeY = impactVal > 0 ? Math.cos(frame * 3.1) * 14 * impactVal : 0;

    return (
      <div className="absolute inset-0 overflow-hidden bg-slate-950">
        <BackgroundPlate
          src="backgrounds/coaster/taller_1895.jpg"
          progress={p}
          scaleFrom={1.04}
          scaleTo={1.1}
          tintOverlay={isBeat1 ? "rgba(127, 29, 29, 0.28)" : undefined}
        />

        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${shakeX}px, ${shakeY}px)`,
          }}
        >
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            <IronLoopTrackSvg
              cx={560}
              groundY={1295}
              radius={235}
              bottomFlare={bottomFlare}
              railColor={isBeat1 ? "#B91C1C" : "#334155"}
            />

            {/* Beat 1: 12G Danger Stamp + Crushing Force Vectors */}
            {isBeat1 && (
              <g transform="translate(560, 420)">
                <rect x="-260" y="-58" width="520" height="116" rx="18" fill="#EF4444" stroke="#0F172A" strokeWidth="6" />
                <text x="0" y="-6" textAnchor="middle" fill="#FFFFFF" fontSize="40" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                  ⚠ 12 GRAVEDADES ⚠
                </text>
                <text x="0" y="34" textAnchor="middle" fill="#FEF08A" fontSize="24" fontWeight="800" fontFamily="sans-serif">
                  ¡FUERZA LETAL EN LA BASE!
                </text>
              </g>
            )}

            {/* Beat 2: Wide bottom arrows showing base flaring outward */}
            {!isBeat1 && bottomFlare > 0.2 && (
              <g opacity="0.9">
                <path d="M 390 1240 L 290 1240 L 315 1218 M 290 1240 L 315 1262" fill="none" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 730 1240 L 830 1240 L 805 1218 M 830 1240 L 805 1262" fill="none" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}

            {/* Hammer strike flashes at lower right steel base */}
            {impactVal > 0 && (
              <ImpactStar x={765} y={1225} scale={1.0 + impactVal * 0.6} alpha={impactVal} />
            )}
          </svg>

          <div
            className="absolute"
            style={{
              left: isBeat1 ? 150 : 250,
              top: 865,
            }}
          >
            <CartoonCharacter
              persona="niko"
              expression={isBeat1 ? "panicked" : "determined"}
              facing="right"
              scale={1.08}
              frame={frame}
              fps={fps}
              palabras={escena.palabras}
              heldTool={isBeat1 ? "none" : "sledgehammer"}
              sweatDrops={true}
              pose={
                isBeat1
                  ? {
                      headTiltDeg: -10,
                      rightShoulderDeg: 125,
                      rightElbowDeg: 95,
                      leftShoulderDeg: 115,
                      leftElbowDeg: 90,
                    }
                  : {
                      torsoLeanDeg: interpolate(swingPhase, [-1, 0, 1], [-15, 8, 36]),
                      rightShoulderDeg: interpolate(swingPhase, [-1, 0, 1], [202, 112, 62]),
                      rightElbowDeg: interpolate(swingPhase, [-1, 0, 1], [22, 34, 12]),
                      leftShoulderDeg: interpolate(swingPhase, [-1, 0, 1], [210, 120, 70]),
                      leftElbowDeg: interpolate(swingPhase, [-1, 0, 1], [28, 40, 18]),
                    }
              }
            />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 5 (11.43s): Rival se burla -> Infiltración nocturna apretando con manivelas
  // ============================================================================
  if (escena.id === 5) {
    const isBeat1 = tSec < 4.3;
    const squeezeP = isBeat1
      ? 0
      : interpolate(tSec, [4.6, 10.6], [0, 0.94], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

    const crankAngle = isBeat1 ? 0 : frame * 16;
    const laughBob = isBeat1 ? Math.abs(Math.sin(frame * 0.4)) * 10 : 0;

    return (
      <div className="absolute inset-0 overflow-hidden bg-slate-950">
        <BackgroundPlate
          src="backgrounds/coaster/noche_sabotaje_1895.jpg"
          progress={p}
          scaleFrom={1.03}
          scaleTo={1.11}
        />

        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          {/* Niko's flared base being squeezed taller and skinnier */}
          <IronLoopTrackSvg
            cx={560}
            groundY={1295}
            radius={225}
            bottomFlare={0.85}
            sideSqueeze={squeezeP}
            railColor="#38BDF8"
            accentColor="#E0F2FE"
          />

          {/* Beat 1: Comic JA JA JA laugh bubbles */}
          {isBeat1 && (
            <g transform={`translate(280, ${740 - laughBob})`}>
              <rect x="-110" y="-35" width="220" height="65" rx="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="5" />
              <text x="0" y="8" textAnchor="middle" fill="#DC2626" fontSize="34" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                ¡JA! ¡JA! ¡JA!
              </text>
            </g>
          )}

          {/* Beat 2: Tension cables & turnbuckle winches physically pulling loop sides inward */}
          {!isBeat1 && (
            <g>
              {/* Left & right turnbuckle cables pulling inward */}
              <line
                x1={230}
                y1={1265}
                x2={560 - 225 * (1 - squeezeP * 0.34)}
                y2={1295 - 225 * (1 + squeezeP * 0.34)}
                stroke="#FACC15"
                strokeWidth="7"
                strokeDasharray="14 8"
              />
              <line
                x1={890}
                y1={1265}
                x2={560 + 225 * (1 - squeezeP * 0.34)}
                y2={1295 - 225 * (1 + squeezeP * 0.34)}
                stroke="#FACC15"
                strokeWidth="7"
                strokeDasharray="14 8"
              />
              {/* Inward compression arrows */}
              <path d="M 270 960 L 365 960 L 340 940 M 365 960 L 340 980" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 850 960 L 755 960 L 780 940 M 755 960 L 780 980" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </svg>

        <div
          className="absolute"
          style={{
            left: isBeat1 ? 120 : 190,
            top: 865 - laughBob,
          }}
        >
          <CartoonCharacter
            persona="rival"
            expression={isBeat1 ? "laughing" : "evil_grin"}
            facing="right"
            scale={1.08}
            frame={frame}
            fps={fps}
            palabras={escena.palabras}
            heldTool={isBeat1 ? "none" : "wrench"}
            pose={
              isBeat1
                ? {
                    torsoLeanDeg: -12,
                    headTiltDeg: -14,
                    rightShoulderDeg: 45,
                    rightElbowDeg: 88,
                    leftShoulderDeg: -32,
                    leftElbowDeg: 40,
                  }
                : {
                    torsoLeanDeg: 14,
                    rightShoulderDeg: 75 + Math.sin(crankAngle * 0.1) * 28,
                    rightElbowDeg: 35 + Math.cos(crankAngle * 0.1) * 18,
                    leftShoulderDeg: 52,
                    leftElbowDeg: 42,
                  }
            }
          />
        </div>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 6 (11.39s): Multitud donde el rival -> Niko sube al carrito y ve la gota arriba
  // ============================================================================
  if (escena.id === 6) {
    const isCrowdBeat = tSec < 3.8;
    const isClimbBeat = tSec >= 3.8 && tSec < 7.8;
    const isCrestBeat = tSec >= 7.8;

    if (isCrowdBeat) {
      return (
        <div className="absolute inset-0 overflow-hidden bg-sky-200">
          <BackgroundPlate
            src="backgrounds/coaster/feria_victoriana_1895.jpg"
            progress={clamp01(tSec / 3.8)}
            scaleFrom={1.04}
            scaleTo={1.12}
          />
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            <IronLoopTrackSvg cx={720} groundY={1230} radius={225} railColor="#DC2626" accentColor="#FEF08A" />
            {/* Queue of spectators lined up at Rival's ride */}
            {[160, 260, 360, 460, 560].map((x, idx) => (
              <g key={`q_${idx}`} transform={`translate(${x}, ${1230 - Math.abs(Math.sin(frame * 0.16 + idx)) * 6})`}>
                <ellipse cx="0" cy="4" rx="22" ry="7" fill="rgba(0,0,0,0.28)" />
                <line x1="-8" y1="-25" x2="-10" y2="0" stroke="#0F172A" strokeWidth="9" strokeLinecap="round" />
                <line x1="8" y1="-25" x2="10" y2="0" stroke="#0F172A" strokeWidth="9" strokeLinecap="round" />
                <rect x="-18" y="-82" width="36" height="62" rx="10" fill="#1E293B" stroke="#0F172A" strokeWidth="4" />
                <circle cx="0" cy="-100" r="18" fill="#FFE4C4" stroke="#0F172A" strokeWidth="4" />
              </g>
            ))}
          </svg>
          <div className="absolute" style={{ left: 660, top: 825 }}>
            <CartoonCharacter
              persona="rival"
              expression="evil_grin"
              facing="left"
              scale={1.05}
              frame={frame}
              fps={fps}
              isSpeaking={false}
              pose={{ rightShoulderDeg: 112, rightElbowDeg: 22, leftShoulderDeg: -20, leftElbowDeg: 25 }}
            />
          </div>
        </div>
      );
    }

    if (isClimbBeat) {
      // Dynamic Ride-Along Shot: Niko sitting INSIDE cart climbing inclined wooden lift hill!
      const scrollOff = ((tSec - 3.8) * 190) % 140;
      const heartPulse = 1 + Math.abs(Math.sin(frame * 0.5)) * 0.3;

      return (
        <div className="absolute inset-0 overflow-hidden bg-sky-300">
          <BackgroundPlate
            src="backgrounds/coaster/feria_victoriana_1895.jpg"
            progress={clamp01((tSec - 3.8) / 4.0)}
            scaleFrom={1.18}
            scaleTo={1.25}
            panYFrom={60}
            panYTo={140}
          />
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            {/* Tilted climbing wooden track running diagonally upward right */}
            <g transform="translate(540, 1080) rotate(-26)">
              {/* Scrolling trestle support struts underneath the lift hill */}
              {Array.from({ length: 8 }).map((_, i) => (
                <rect
                  key={`trest_${i}`}
                  x={-720 + i * 260 - (scrollOff % 260)}
                  y="20"
                  width="24"
                  height="650"
                  fill="#451A03"
                  stroke="#0F172A"
                  strokeWidth="4"
                />
              ))}
              <rect x="-800" y="0" width="1600" height="24" fill="#334155" stroke="#0F172A" strokeWidth="5" />
              {/* Moving crossties scrolling backward to show motion */}
              {Array.from({ length: 14 }).map((_, i) => (
                <rect
                  key={`tie_${i}`}
                  x={-750 + i * 140 - scrollOff}
                  y="-6"
                  width="34"
                  height="38"
                  rx="4"
                  fill="#78350F"
                  stroke="#0F172A"
                  strokeWidth="4"
                />
              ))}
              {/* Enlarged Coaster Cart with Niko gripping safety bar */}
              <CoasterCartSvg
                x={0}
                y={0}
                angleDeg={0}
                variant="niko"
                wheelAngleDeg={frame * 14}
                frame={frame}
                scale={2.5}
              />
            </g>

            {/* Thumping heart pulse icon near Niko's chest */}
            <g transform={`translate(450, 790) scale(${heartPulse})`}>
              <path
                d="M 0 22 C -32 -2 -36 -30 -16 -38 C -4 -42 0 -30 0 -22 C 0 -30 4 -42 16 -38 C 36 -30 32 -2 0 22 Z"
                fill="#EF4444"
                stroke="#0F172A"
                strokeWidth="4.5"
              />
            </g>
          </svg>
        </div>
      );
    }

    // Beat C (7.8..11.39s): Crest at top looking down at the bizarre tall skinny teardrop loop ahead!
    const crestP = clamp01((tSec - 7.8) / 3.59);
    const tipAngle = interpolate(crestP, [0, 0.65, 1], [-8, 12, 42]);

    return (
      <div className="absolute inset-0 overflow-hidden bg-sky-200">
        <BackgroundPlate
          src="backgrounds/coaster/feria_victoriana_1895.jpg"
          progress={crestP}
          scaleFrom={1.08}
          scaleTo={1.22}
        />
        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          {/* Towering tall skinny sabotaged teardrop loop dead ahead on the right */}
          <IronLoopTrackSvg
            cx={680}
            groundY={1290}
            radius={225}
            bottomFlare={0.85}
            sideSqueeze={0.94}
            railColor="#0284C7"
            accentColor="#E0F2FE"
          />

          {/* Crest hill track on left leading straight down toward the teardrop */}
          <path
            d="M -40 720 Q 170 690 290 880 L 420 1280"
            fill="none"
            stroke="#0F172A"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M -40 720 Q 170 690 290 880 L 420 1280"
            fill="none"
            stroke="#475569"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Cart tipping over the edge with panicked Niko */}
          <CoasterCartSvg
            x={interpolate(crestP, [0, 1], [170, 275])}
            y={interpolate(crestP, [0, 1], [728, 865])}
            angleDeg={tipAngle}
            variant="niko"
            wheelAngleDeg={frame * 10}
            frame={frame}
            scale={1.45}
          />

          {/* Giant shock exclamation */}
          <g transform="translate(680, 420)">
            <rect x="-195" y="-44" width="390" height="88" rx="16" fill="#FACC15" stroke="#0F172A" strokeWidth="6" />
            <text x="0" y="12" textAnchor="middle" fill="#0F172A" fontSize="34" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              ¿¡QUÉ ES ESA FORMA?!
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 7 (12.35s): Laboratorio de Física Animado (5 vs 100 km/h + Círculo 12G)
  // ZERO personajes tapando texto, ZERO choque con subtítulos (todo arriba de y=1340)
  // ============================================================================
  if (escena.id === 7) {
    const isSpeedDemo = tSec < 5.4;

    if (isSpeedDemo) {
      const slowU = ((tSec * 0.14) % 1);
      const fastU = ((tSec * 0.72) % 1);
      const bendSeg = [
        { p0: [-220, 90] as [number, number], p1: [-70, 90] as [number, number], p2: [-15, -50] as [number, number], p3: [0, -70] as [number, number] },
        { p0: [0, -70] as [number, number], p1: [15, -50] as [number, number], p2: [70, 90] as [number, number], p3: [220, 90] as [number, number] },
      ];
      const bendTrack = buildSampledTrack(bendSeg);
      const bendPath = segmentsToSvgPath(bendSeg);
      const slowPt = sampleTrackAt(bendTrack, slowU);
      const fastPt = sampleTrackAt(bendTrack, fastU);
      const fastDanger = fastU > 0.35 && fastU < 0.65;

      return (
        <div className="absolute inset-0 overflow-hidden bg-[#0A0F1D]">
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="bp_grid_7" width="44" height="44" patternUnits="userSpaceOnUse">
                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#1E293B" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="1080" height="1920" fill="#0A0F1D" />
            <rect width="1080" height="1920" fill="url(#bp_grid_7)" opacity="0.8" />

            {/* Header */}
            <g transform="translate(540, 175)">
              <rect x="-410" y="-48" width="820" height="96" rx="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="5" />
              <text x="0" y="-4" textAnchor="middle" fill="#38BDF8" fontSize="30" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                LA FÍSICA DE LA CURVA: a = v² / r
              </text>
              <text x="0" y="30" textAnchor="middle" fill="#CBD5E1" fontSize="21" fontWeight="700" fontFamily="sans-serif">
                La fuerza crece al CUADRADO de la velocidad
              </text>
            </g>

            {/* Top Card: 5 km/h Safe */}
            <g transform="translate(540, 520)">
              <rect x="-440" y="-210" width="880" height="420" rx="22" fill="#062E27" stroke="#10B981" strokeWidth="6" />
              <rect x="-410" y="-185" width="320" height="54" rx="10" fill="#065F46" stroke="#10B981" strokeWidth="3" />
              <text x="-250" y="-149" textAnchor="middle" fill="#D1FAE5" fontSize="26" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                5 KM/H · SUAVE
              </text>
              <g transform="translate(0, 60)">
                <path d={bendPath} fill="none" stroke="#10B981" strokeWidth="16" strokeLinecap="round" />
                <CoasterCartSvg x={slowPt.x} y={slowPt.y} angleDeg={slowPt.angleDeg} scale={1.15} variant="niko" frame={frame} />
              </g>
              <rect x="170" y="-185" width="240" height="54" rx="10" fill="#10B981" stroke="#0F172A" strokeWidth="4" />
              <text x="290" y="-149" textAnchor="middle" fill="#0F172A" fontSize="26" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                0.2 G · SEGURO
              </text>
            </g>

            {/* Bottom Card: 100 km/h Lethal */}
            <g transform="translate(540, 1020)">
              <rect x="-440" y="-210" width="880" height="420" rx="22" fill="#2A0E17" stroke="#EF4444" strokeWidth="6" />
              <rect x="-410" y="-185" width="350" height="54" rx="10" fill="#7F1D1D" stroke="#EF4444" strokeWidth="3" />
              <text x="-235" y="-149" textAnchor="middle" fill="#FEE2E2" fontSize="26" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                100 KM/H · LETAL
              </text>
              <g transform="translate(0, 60)">
                <path d={bendPath} fill="none" stroke="#EF4444" strokeWidth="16" strokeLinecap="round" />
                <CoasterCartSvg
                  x={fastPt.x}
                  y={fastPt.y}
                  angleDeg={fastPt.angleDeg}
                  scale={1.15}
                  variant="dummy"
                  squashY={fastDanger ? 0.55 : 1}
                  speedBlur={true}
                  sparks={fastDanger}
                  frame={frame}
                />
              </g>
              <rect x="155" y="-185" width="255" height="54" rx="10" fill="#EF4444" stroke="#0F172A" strokeWidth="4" />
              <text x="282" y="-149" textAnchor="middle" fill="#FFFFFF" fontSize="26" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                12.0 G · MORTAL
              </text>
            </g>
          </svg>
        </div>
      );
    }

    // Beat B (5.4..12.35s): Live Circle Loop simulation with dynamic speed & real-time G-force spike at bottom!
    const simT = (tSec - 5.4) / 3.45; // ~2 full loops during Beat B
    const u = simT % 1;
    const circleSegs = buildMorphableLoopSegments(540, 1010, 225, 0, 0, true);
    const circleTrack = buildSampledTrack(circleSegs);
    const circlePath = segmentsToSvgPath(circleSegs);
    const pt = sampleTrackAt(circleTrack, u);

    // Physical speed v inversely related to height y!
    const minY = 560;
    const maxY = 1010;
    const heightFrac = clamp01((pt.y - minY) / (maxY - minY)); // 1 at bottom, 0 at top
    const speedKmh = Math.round(28 + heightFrac * 74); // 28 km/h at top -> 102 km/h at bottom!
    const gForce = Number((0.6 + heightFrac * heightFrac * 11.4).toFixed(1));
    const isBottomCrush = gForce >= 9.0;

    return (
      <div className="absolute inset-0 overflow-hidden bg-[#0A0F1D]">
        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="bp_grid_7b" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#1E293B" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="1080" height="1920" fill="#0A0F1D" />
          <rect width="1080" height="1920" fill="url(#bp_grid_7b)" opacity="0.8" />

          {/* Header */}
          <g transform="translate(540, 175)">
            <rect x="-410" y="-48" width="820" height="96" rx="16" fill="#2A0E17" stroke="#EF4444" strokeWidth="5" />
            <text x="0" y="-4" textAnchor="middle" fill="#FCA5A5" fontSize="30" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              EL PROBLEMA DEL CÍRCULO PERFECTO
            </text>
            <text x="0" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="21" fontWeight="700" fontFamily="sans-serif">
              Radio pequeño (r) abajo = Choque a máxima velocidad
            </text>
          </g>

          {/* Animated Circle Track */}
          <path d={circlePath} fill="none" stroke="#0F172A" strokeWidth="28" strokeLinecap="round" />
          <path d={circlePath} fill="none" stroke="#EF4444" strokeWidth="16" strokeLinecap="round" />
          <path d={circlePath} fill="none" stroke="#FCA5A5" strokeWidth="4" strokeDasharray="16 14" />

          {/* Radius r crosshair */}
          <line x1="540" y1="785" x2="540" y2="1010" stroke="#FACC15" strokeWidth="4" strokeDasharray="8 6" />
          <circle cx="540" cy="785" r="7" fill="#FACC15" />
          <text x="556" y="910" fill="#FACC15" fontSize="24" fontWeight="900">r constante</text>

          {/* Moving Coaster Car */}
          <CoasterCartSvg
            x={pt.x}
            y={pt.y}
            angleDeg={pt.angleDeg}
            variant="dummy"
            squashY={isBottomCrush ? 0.55 : 1}
            speedBlur={speedKmh > 75}
            sparks={isBottomCrush}
            frame={frame}
            scale={1.2}
          />

          {/* Live Telemetry HUD below track (y=1140..1310, cleanly above subtitles!) */}
          <g transform="translate(540, 1210)">
            <rect x="-440" y="-85" width="420" height="170" rx="18" fill="#0F172A" stroke="#38BDF8" strokeWidth="5" />
            <text x="-230" y="-28" textAnchor="middle" fill="#94A3B8" fontSize="22" fontWeight="800">VELOCIDAD ACTUAL</text>
            <text x="-230" y="42" textAnchor="middle" fill="#38BDF8" fontSize="62" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              {speedKmh} km/h
            </text>

            <rect
              x="20"
              y="-85"
              width="420"
              height="170"
              rx="18"
              fill={isBottomCrush ? "#7F1D1D" : "#0F172A"}
              stroke="#EF4444"
              strokeWidth="5"
            />
            <text x="230" y="-28" textAnchor="middle" fill="#FCA5A5" fontSize="22" fontWeight="800">FUERZA G SENTIDA</text>
            <text x="230" y="42" textAnchor="middle" fill={isBottomCrush ? "#FEF08A" : "#EF4444"} fontSize="64" fontWeight="900" fontFamily="'Arial Black', sans-serif">
              {gForce} G
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 8 (11.94s): Simulación viva Clotoide (3.2G verde) -> Niko flotando en la cima
  // ============================================================================
  if (escena.id === 8) {
    const isPhysicsBeat = tSec < 7.8;

    if (isPhysicsBeat) {
      const simT = tSec / 3.9;
      const u = simT % 1;
      const clotoSegs = buildMorphableLoopSegments(540, 1020, 210, 0.88, 0.92, true);
      const clotoTrack = buildSampledTrack(clotoSegs);
      const clotoPath = segmentsToSvgPath(clotoSegs);
      const pt = sampleTrackAt(clotoTrack, u);

      const minY = 485;
      const maxY = 1020;
      const heightFrac = clamp01((pt.y - minY) / (maxY - minY)); // 1 at bottom, 0 at apex
      const speedKmh = Math.round(16 + heightFrac * 84); // 16 km/h at top, 100 km/h at bottom!
      // Because bottom radius R is ~3x larger than circle and apex speed is 16 km/h, G stays gentle <= 3.3G!
      const gForce = Number((1.0 + heightFrac * 2.3).toFixed(1));

      return (
        <div className="absolute inset-0 overflow-hidden bg-[#0A0F1D]">
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="bp_grid_8" width="44" height="44" patternUnits="userSpaceOnUse">
                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#1E293B" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="1080" height="1920" fill="#0A0F1D" />
            <rect width="1080" height="1920" fill="url(#bp_grid_8)" opacity="0.8" />

            {/* Header */}
            <g transform="translate(540, 175)">
              <rect x="-410" y="-48" width="820" height="96" rx="16" fill="#062E27" stroke="#10B981" strokeWidth="5" />
              <text x="0" y="-4" textAnchor="middle" fill="#6EE7B7" fontSize="30" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                LA MAGIA DE LA CLOTOIDE (GOTA)
              </text>
              <text x="0" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="21" fontWeight="700" fontFamily="sans-serif">
                Base amplia abajo (100 km/h) · Curva cerrada arriba (16 km/h)
              </text>
            </g>

            {/* Clotoide Track */}
            <path d={clotoPath} fill="none" stroke="#0F172A" strokeWidth="28" strokeLinecap="round" />
            <path d={clotoPath} fill="none" stroke="#10B981" strokeWidth="16" strokeLinecap="round" />
            <path d={clotoPath} fill="none" stroke="#A7F3D0" strokeWidth="4" strokeDasharray="16 14" />

            {/* Top slow annotation */}
            <g transform="translate(540, 405)">
              <rect x="-185" y="-26" width="370" height="46" rx="10" fill="#065F46" stroke="#34D399" strokeWidth="3" />
              <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="800">
                Cima lenta (~16 km/h) → 1.0 G
              </text>
            </g>

            {/* Moving Coaster Car */}
            <CoasterCartSvg
              x={pt.x}
              y={pt.y}
              angleDeg={pt.angleDeg}
              variant="niko"
              squashY={1}
              speedBlur={speedKmh > 78}
              frame={frame}
              scale={1.2}
            />

            {/* Live Telemetry HUD below track */}
            <g transform="translate(540, 1210)">
              <rect x="-440" y="-85" width="420" height="170" rx="18" fill="#0F172A" stroke="#38BDF8" strokeWidth="5" />
              <text x="-230" y="-28" textAnchor="middle" fill="#94A3B8" fontSize="22" fontWeight="800">VELOCIDAD ACTUAL</text>
              <text x="-230" y="42" textAnchor="middle" fill="#38BDF8" fontSize="62" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                {speedKmh} km/h
              </text>

              <rect x="20" y="-85" width="420" height="170" rx="18" fill="#064E3B" stroke="#10B981" strokeWidth="5" />
              <text x="230" y="-28" textAnchor="middle" fill="#A7F3D0" fontSize="22" fontWeight="800">FUERZA G MÁXIMA</text>
              <text x="230" y="42" textAnchor="middle" fill="#4ADE80" fontSize="64" fontWeight="900" fontFamily="'Arial Black', sans-serif">
                {gForce} G ✓
              </text>
            </g>
          </svg>
        </div>
      );
    }

    // Beat B (7.8..11.94s): Niko gliding effortlessly upside down across the teardrop apex!
    const glideP = clamp01((tSec - 7.8) / 4.14);
    const clotoSegs = buildMorphableLoopSegments(540, 1260, 240, 0.85, 0.9, true);
    const clotoTrack = buildSampledTrack(clotoSegs);
    const pt = sampleTrackAt(clotoTrack, interpolate(glideP, [0, 1], [0.35, 0.72]));

    return (
      <div className="absolute inset-0 overflow-hidden bg-sky-200">
        <BackgroundPlate
          src="backgrounds/coaster/feria_victoriana_1895.jpg"
          progress={glideP}
          scaleFrom={1.12}
          scaleTo={1.2}
        />
        <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
          <IronLoopTrackSvg
            cx={540}
            groundY={1260}
            radius={240}
            bottomFlare={0.85}
            sideSqueeze={0.9}
            railColor="#0284C7"
            accentColor="#E0F2FE"
          />
          <CoasterCartSvg
            x={pt.x}
            y={pt.y}
            angleDeg={pt.angleDeg}
            variant="niko"
            wheelAngleDeg={frame * 8}
            frame={frame}
            scale={1.35}
          />
          {/* Floating sparkle stars celebrating Niko floating over intact */}
          {[
            [360, 480],
            [720, 490],
            [540, 390],
          ].map(([sx, sy], i) => (
            <circle
              key={`fstar_${i}`}
              cx={sx}
              cy={sy + Math.sin(frame * 0.25 + i) * 8}
              r={10 + Math.sin(frame * 0.4 + i) * 3}
              fill="#FACC15"
              stroke="#0F172A"
              strokeWidth="3.5"
            />
          ))}
        </svg>
      </div>
    );
  }

  // ============================================================================
  // ESCENA 9 (~11.5s): Choque del Rival -> Legado moderno al atardecer con megacoaster
  // ============================================================================
  const crashSplitSec = 4.35;
  const isCrashBeat = tSec < crashSplitSec;

  if (isCrashBeat) {
    const crashP = clamp01(tSec / crashSplitSec);
    const circleSegs = buildMorphableLoopSegments(540, 1230, 225, 0, 0, true);
    const circleTrack = buildSampledTrack(circleSegs);
    const cartU = Math.min(0.24, crashP * 0.44);
    const pt = sampleTrackAt(circleTrack, cartU);
    const crashed = crashP > 0.55;
    const crashAge = crashed ? (crashP - 0.55) / 0.45 : 0;
    const shakeX = crashed ? Math.sin(frame * 2.8) * 18 * (1 - crashAge) : 0;

    return (
      <div className="absolute inset-0 overflow-hidden bg-sky-200">
        <BackgroundPlate
          src="backgrounds/coaster/feria_victoriana_1895.jpg"
          progress={crashP}
          scaleFrom={1.06}
          scaleTo={1.16}
        />
        <div className="absolute inset-0" style={{ transform: `translateX(${shakeX}px)` }}>
          <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
            <IronLoopTrackSvg
              cx={540}
              groundY={1230}
              radius={225}
              railColor="#DC2626"
              accentColor="#FEF08A"
              cracked={crashed}
            />

            <CoasterCartSvg
              x={pt.x}
              y={pt.y}
              angleDeg={crashed ? pt.angleDeg - 22 : pt.angleDeg}
              variant="empty"
              speedBlur={!crashed}
              sparks={crashed}
              frame={frame}
              scale={1.15}
            />

            {/* Comic explosion cloud & flying wheels/planks on Rival's circle crash */}
            {crashed && (
              <g transform={`translate(${pt.x}, ${pt.y - 25})`}>
                <circle cx="0" cy="0" r={45 + crashAge * 85} fill="#E2E8F0" stroke="#0F172A" strokeWidth="5" opacity={1 - crashAge * 0.4} />
                <circle cx="-48" cy="-22" r={30 + crashAge * 45} fill="#CBD5E1" stroke="#0F172A" strokeWidth="4" opacity={1 - crashAge * 0.5} />
                <circle cx="52" cy="-28" r={28 + crashAge * 40} fill="#F8FAFC" stroke="#0F172A" strokeWidth="4" opacity={1 - crashAge * 0.5} />
                {/* Flying detached wheel & timber plank */}
                <circle cx={-80 - crashAge * 140} cy={-70 - crashAge * 120} r="14" fill="#475569" stroke="#0F172A" strokeWidth="4" />
                <rect
                  x={60 + crashAge * 110}
                  y={-80 - crashAge * 90}
                  width="54"
                  height="14"
                  fill="#92400E"
                  stroke="#0F172A"
                  strokeWidth="3.5"
                  transform={`rotate(${crashAge * 180})`}
                />
                <ImpactStar x={0} y={0} scale={1.4 - crashAge * 0.5} alpha={1 - crashAge} />
              </g>
            )}
          </svg>

          <div className="absolute" style={{ left: 100, top: 820 }}>
            <CartoonCharacter
              persona="rival"
              expression="shocked"
              facing="right"
              scale={1.04}
              frame={frame}
              fps={fps}
              isSpeaking={false}
              sweatDrops={true}
              pose={{ rightShoulderDeg: 135, rightElbowDeg: 20, leftShoulderDeg: 122, leftElbowDeg: 20 }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Beat B: Modern Steel Megacoaster at Sunset with Clotoide Loop!
  const legacyDurSec = Math.max(2, durationFrames / fps - crashSplitSec);
  const legacyP = clamp01((tSec - crashSplitSec) / legacyDurSec);
  const modSegs = buildMorphableLoopSegments(540, 1260, 240, 0.85, 0.9, true);
  const modTrack = buildSampledTrack(modSegs);
  const trainU = interpolate(legacyP, [0, 1], [0.15, 0.94]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-purple-950">
      <BackgroundPlate
        src="backgrounds/coaster/parque_moderno_sunset.jpg"
        progress={legacyP}
        scaleFrom={1.03}
        scaleTo={1.12}
      />
      <svg viewBox="0 0 1080 1920" className="absolute inset-0 w-full h-full">
        {/* Modern cyan steel coaster loop */}
        <IronLoopTrackSvg
          cx={540}
          groundY={1260}
          radius={240}
          bottomFlare={0.85}
          sideSqueeze={0.9}
          railColor="#0284C7"
          accentColor="#38BDF8"
          steelSupports={true}
        />

        {/* Sleek 3-car modern train racing smoothly around the clothoid! */}
        <ModernCoasterTrain track={modTrack} headProgress={trainU} scale={1.15} />

        {/* Glowing Clotoide Golden Title Plaque */}
        <g transform="translate(540, 290)">
          <rect x="-260" y="-52" width="520" height="104" rx="18" fill="#0F172A" stroke="#FACC15" strokeWidth="6" />
          <text x="0" y="-4" textAnchor="middle" fill="#FACC15" fontSize="38" fontWeight="900" fontFamily="'Arial Black', sans-serif">
            LA CURVA CLOTOIDE
          </text>
          <text x="0" y="34" textAnchor="middle" fill="#F8FAFC" fontSize="22" fontWeight="700" fontFamily="sans-serif">
            Seguridad en todas las montañas rusas
          </text>
        </g>
      </svg>

      {/* Proud Niko smiling in foreground plaza */}
      <div className="absolute" style={{ left: 110, top: 880 }}>
        <CartoonCharacter
          persona="niko"
          expression="relieved"
          facing="right"
          scale={1.02}
          frame={frame}
          fps={fps}
          palabras={escena.palabras}
          pose={{
            rightShoulderDeg: 135,
            rightElbowDeg: 25,
            leftShoulderDeg: -20,
            leftElbowDeg: 30,
          }}
        />
      </div>
    </div>
  );
};
