import React from "react";
import { PalabraTiming } from "../types";

export type CartoonPersona = "niko" | "rival" | "dummy" | "eiji" | "kuroda";

export type CartoonExpression =
  | "neutral"
  | "determined"
  | "exhausted"
  | "shocked"
  | "panicked"
  | "evil_grin"
  | "laughing"
  | "relieved"
  | "amazed"
  | "focused";

export type CartoonHeldTool =
  | "none"
  | "sledgehammer"
  | "wrench"
  | "blueprint"
  | "crushed_dummy"
  | "sonometro"
  | "portapapeles"
  | "binoculares";

export interface CartoonPoseState {
  torsoLeanDeg?: number;
  headTiltDeg?: number;
  bodySquashX?: number;
  bodySquashY?: number;
  lookX?: number;
  lookY?: number;
  leftShoulderDeg?: number;
  leftElbowDeg?: number;
  rightShoulderDeg?: number;
  rightElbowDeg?: number;
  walkPhase?: number;
  sitting?: boolean;
  crushFactor?: number;
}

export interface CartoonCharacterProps {
  persona: CartoonPersona;
  expression?: CartoonExpression;
  facing?: "right" | "left";
  scale?: number;
  frame: number;
  fps?: number;
  palabras?: PalabraTiming[];
  isSpeaking?: boolean;
  pose?: CartoonPoseState;
  heldTool?: CartoonHeldTool;
  sweatDrops?: boolean;
  scarfWave?: boolean;
  neckBinoculars?: boolean;
}

function degToRad(d: number) {
  return (d * Math.PI) / 180;
}

function solveLimb(
  sx: number,
  sy: number,
  upperLen: number,
  lowerLen: number,
  shoulderDeg: number,
  elbowOffsetDeg: number
) {
  const a1 = degToRad(shoulderDeg);
  const ex = sx + Math.sin(a1) * upperLen;
  const ey = sy + Math.cos(a1) * upperLen;
  const a2Deg = shoulderDeg + elbowOffsetDeg;
  const a2 = degToRad(a2Deg);
  const hx = ex + Math.sin(a2) * lowerLen;
  const hy = ey + Math.cos(a2) * lowerLen;
  return { ex, ey, hx, hy, handAngleDeg: 180 - a2Deg };
}

export const CartoonCharacter: React.FC<CartoonCharacterProps> = ({
  persona,
  expression = "neutral",
  facing = "right",
  scale = 1,
  frame,
  fps = 30,
  palabras,
  isSpeaking: isSpeakingProp,
  pose = {},
  heldTool = "none",
  sweatDrops = false,
  scarfWave = false,
  neckBinoculars = false,
}) => {
  const currentTimeMs = (frame / fps) * 1000;
  const isSpeaking =
    isSpeakingProp !== undefined
      ? isSpeakingProp
      : Boolean(
          palabras &&
            palabras.some(
              (p) => currentTimeMs >= p.inicioMs && currentTimeMs <= p.finMs + 50
            )
        );

  const isBlinking = (frame + (persona === "rival" ? 13 : 31)) % 84 < 3;
  const breathY = pose.sitting ? 0 : Math.sin(frame * 0.16) * 2.5;
  const lean = pose.torsoLeanDeg ?? 0;
  const headTilt = pose.headTiltDeg ?? 0;
  const sqX = pose.bodySquashX ?? 1;
  const sqY = pose.bodySquashY ?? 1;
  const lookX = pose.lookX ?? (facing === "right" ? 5 : 5);
  const lookY = pose.lookY ?? 0;
  const crush = Math.max(0, Math.min(1, pose.crushFactor ?? 0));

  // Color palette by persona
  const palette =
    persona === "eiji"
      ? {
          skin: "#FDE7D0",
          skinShadow: "#EFC8A5",
          shirt: "#FFFFFF", // White lab coat sleeves
          vest: "#38BDF8", // Sky-blue shirt under open coat
          vestDark: "#0284C7",
          coat: "#F8FAFC",
          coatHighlight: "#E2E8F0",
          pants: "#1E293B",
          boots: "#0F172A",
          outline: "#0F172A",
        }
      : persona === "kuroda"
      ? {
          skin: "#F5D9BC",
          skinShadow: "#DFB895",
          shirt: "#1E3A8A",
          vest: "#1E3A8A",
          vestDark: "#172554",
          coat: "#1E3A8A",
          coatHighlight: "#2563EB",
          pants: "#0F172A",
          boots: "#090D16",
          outline: "#0F172A",
        }
      : persona === "rival"
      ? {
          skin: "#FDEBD0",
          skinShadow: "#F5CBA7",
          shirt: "#FFFFFF",
          vest: "#7F1D1D",
          vestDark: "#450A0A",
          coat: "#1E293B",
          coatHighlight: "#334155",
          pants: "#0F172A",
          boots: "#090D16",
          outline: "#0F172A",
        }
      : persona === "dummy"
      ? {
          skin: "#FACC15",
          skinShadow: "#CA8A04",
          shirt: "#EAB308",
          vest: "#1E293B",
          vestDark: "#0F172A",
          coat: "#EAB308",
          coatHighlight: "#FDE047",
          pants: "#CA8A04",
          boots: "#1E293B",
          outline: "#0F172A",
        }
      : {
          skin: "#FFE4C4",
          skinShadow: "#F3C394",
          shirt: "#F59E0B",
          vest: "#2563EB",
          vestDark: "#1E40AF",
          coat: "#2563EB",
          coatHighlight: "#3B82F6",
          pants: "#1E3A8A",
          boots: "#78350F",
          outline: "#0F172A",
        };

  // Base torso / hip coordinates in character local SVG space (center x=220, ground y=500)
  const hipX = 220;
  const hipY = pose.sitting ? 390 : 372 + breathY + crush * 70;
  const torsoLen = 112 * (1 - crush * 0.55);
  const leanRad = degToRad(lean);
  const neckX = hipX + Math.sin(leanRad) * torsoLen;
  const neckY = hipY - Math.cos(leanRad) * torsoLen;

  // Arms anchored near upper torso
  const shoulderX = hipX + Math.sin(leanRad) * (torsoLen * 0.84);
  const shoulderY = hipY - Math.cos(leanRad) * (torsoLen * 0.84);

  const rightArm = solveLimb(
    shoulderX + 12,
    shoulderY,
    56,
    52,
    pose.rightShoulderDeg ?? 28,
    pose.rightElbowDeg ?? 35
  );
  const leftArm = solveLimb(
    shoulderX - 14,
    shoulderY,
    54,
    50,
    pose.leftShoulderDeg ?? -22,
    pose.leftElbowDeg ?? 25
  );

  // Legs
  const walk = pose.walkPhase ?? 0;
  const strideA = pose.walkPhase !== undefined ? Math.sin(walk) * 28 : 0;
  const strideB = pose.walkPhase !== undefined ? -Math.sin(walk) * 28 : 0;
  const liftA = pose.walkPhase !== undefined ? Math.max(0, -Math.cos(walk)) * 18 : 0;
  const liftB = pose.walkPhase !== undefined ? Math.max(0, Math.cos(walk)) * 18 : 0;

  const leftLegPath = pose.sitting
    ? `M ${hipX - 10} ${hipY} L ${hipX + 44} ${hipY + 8} L ${hipX + 54} ${hipY + 62}`
    : `M ${hipX - 12} ${hipY} Q ${hipX - 24 + strideA * 0.5} ${hipY + 65 - liftA} ${
        hipX - 24 + strideA
      } ${500 - liftA}`;
  const rightLegPath = pose.sitting
    ? `M ${hipX + 12} ${hipY} L ${hipX + 62} ${hipY + 8} L ${hipX + 70} ${hipY + 62}`
    : `M ${hipX + 12} ${hipY} Q ${hipX + 26 + strideB * 0.5} ${hipY + 65 - liftB} ${
        hipX + 26 + strideB
      } ${500 - liftB}`;

  const leftFootX = pose.sitting ? hipX + 54 : hipX - 24 + strideA;
  const leftFootY = pose.sitting ? hipY + 62 : 500 - liftA;
  const rightFootX = pose.sitting ? hipX + 70 : hipX + 26 + strideB;
  const rightFootY = pose.sitting ? hipY + 62 : 500 - liftB;

  const headX = neckX + Math.sin(leanRad) * 14;
  const headY = neckY - 56 * (1 - crush * 0.35);

  const flipDir = facing === "left" ? -1 : 1;

  // Mouth animation during speech
  const mouthOpenFrame = isSpeaking ? (Math.floor(frame / 3) % 3) : 0;

  const renderEyes = () => {
    if (persona === "dummy") {
      return (
        <g>
          {/* Crash test markings & X eyes */}
          <path d="M -26 -14 L -12 0 M -12 -14 L -26 0" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
          <path d="M 10 -14 L 24 0 M 24 -14 L 10 0" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    }

    if (isBlinking) {
      return (
        <g>
          <path d="M -24 -4 Q -14 -12 -4 -4" fill="none" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 8 -4 Q 18 -12 28 -4" fill="none" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      );
    }

    if (expression === "laughing" || expression === "relieved") {
      return (
        <g>
          <path d="M -25 -2 Q -14 -16 -3 -2" fill="none" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
          <path d="M 7 -2 Q 18 -16 29 -2" fill="none" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    }

    const eyeScale = expression === "shocked" || expression === "panicked" ? 1.28 : 1;
    const pupilR = expression === "shocked" || expression === "panicked" ? 3.5 : 5.5;

    return (
      <g>
        {/* Left Eye */}
        <g transform={`translate(-14, -4) scale(${eyeScale})`}>
          <ellipse cx="0" cy="0" rx="11" ry="13" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.8" />
          <circle cx={lookX * 0.55} cy={lookY * 0.5} r={pupilR} fill="#0F172A" />
          <circle cx={lookX * 0.55 - 2} cy={lookY * 0.5 - 2.5} r="2" fill="#FFFFFF" />
        </g>
        {/* Right Eye */}
        <g transform={`translate(18, -4) scale(${eyeScale})`}>
          <ellipse cx="0" cy="0" rx="11" ry="13" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.8" />
          <circle cx={lookX * 0.55} cy={lookY * 0.5} r={pupilR} fill="#0F172A" />
          <circle cx={lookX * 0.55 - 2} cy={lookY * 0.5 - 2.5} r="2" fill="#FFFFFF" />
          {persona === "rival" && (
            <g>
              <circle cx="0" cy="0" r="15" fill="rgba(186,230,253,0.28)" stroke="#FACC15" strokeWidth="3.2" />
              <line x1="-11" y1="-9" x2="-3" y2="-13" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M 14 4 Q 24 22 18 46" fill="none" stroke="#FACC15" strokeWidth="2" strokeDasharray="3 3" />
            </g>
          )}
        </g>

        {/* Expressive Eyebrows */}
        {expression === "determined" || expression === "focused" ? (
          <g>
            <path d="M -27 -23 L -4 -17" stroke="#0F172A" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M 6 -17 L 30 -23" stroke="#0F172A" strokeWidth="5.5" strokeLinecap="round" />
          </g>
        ) : expression === "evil_grin" ? (
          <g>
            <path d="M -27 -25 L -3 -15" stroke="#0F172A" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M 5 -15 L 31 -25" stroke="#0F172A" strokeWidth="5.5" strokeLinecap="round" />
          </g>
        ) : expression === "panicked" || expression === "exhausted" ? (
          <g>
            <path d="M -27 -18 Q -15 -28 -5 -24" fill="none" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
            <path d="M 7 -24 Q 18 -28 30 -18" fill="none" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <path d="M -25 -22 Q -14 -26 -4 -22" fill="none" stroke="#0F172A" strokeWidth="4.8" strokeLinecap="round" />
            <path d="M 7 -22 Q 18 -26 29 -22" fill="none" stroke="#0F172A" strokeWidth="4.8" strokeLinecap="round" />
          </g>
        )}
      </g>
    );
  };

  const renderMouth = () => {
    if (isSpeaking && mouthOpenFrame > 0) {
      return (
        <g>
          <ellipse
            cx="2"
            cy="24"
            rx={mouthOpenFrame === 1 ? 11 : 8}
            ry={mouthOpenFrame === 1 ? 9 : 6}
            fill="#7F1D1D"
            stroke="#0F172A"
            strokeWidth="3.8"
          />
          <path d="M -4 29 Q 2 25 8 29" fill="#FB7185" />
        </g>
      );
    }

    switch (expression) {
      case "shocked":
      case "panicked":
        return (
          <ellipse
            cx="2"
            cy="25"
            rx="12"
            ry="15"
            fill="#7F1D1D"
            stroke="#0F172A"
            strokeWidth="4"
          />
        );
      case "determined":
        return (
          <path
            d="M -11 23 L 15 21 L 13 30 L -9 30 Z"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="3.8"
            strokeLinejoin="round"
          />
        );
      case "exhausted":
        return (
          <path
            d="M -10 27 Q 2 18 14 27"
            fill="none"
            stroke="#0F172A"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        );
      case "evil_grin":
      case "laughing":
        return (
          <path
            d="M -16 19 Q 2 38 20 19 Z"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="3.8"
            strokeLinejoin="round"
          />
        );
      case "amazed":
      case "relieved":
        return (
          <path
            d="M -12 20 Q 2 34 16 20"
            fill="none"
            stroke="#0F172A"
            strokeWidth="4.8"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <path
            d="M -10 23 Q 2 30 14 23"
            fill="none"
            stroke="#0F172A"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        );
    }
  };

  const renderHand = (x: number, y: number, angleDeg: number) => (
    <g transform={`translate(${x}, ${y}) rotate(${angleDeg})`}>
      <circle
        cx="0"
        cy="0"
        r="13"
        fill={persona === "rival" || persona === "kuroda" ? "#F8FAFC" : palette.skin}
        stroke={palette.outline}
        strokeWidth="4.5"
      />
      <ellipse
        cx="8"
        cy="-4"
        rx="6"
        ry="4.5"
        fill={persona === "rival" || persona === "kuroda" ? "#F8FAFC" : palette.skin}
        stroke={palette.outline}
        strokeWidth="3.5"
      />
    </g>
  );

  const renderHeldTool = () => {
    if (heldTool === "none") return null;

    if (heldTool === "sledgehammer") {
      return (
        <g
          transform={`translate(${rightArm.hx}, ${rightArm.hy}) rotate(${rightArm.handAngleDeg})`}
        >
          {/* Heavy wooden handle */}
          <rect
            x="-6"
            y="-108"
            width="12"
            height="128"
            rx="5"
            fill="#B45309"
            stroke="#0F172A"
            strokeWidth="4.5"
          />
          <line x1="0" y1="-100" x2="0" y2="10" stroke="#D97706" strokeWidth="3" opacity="0.65" />
          {/* Heavy forged iron sledgehammer head */}
          <rect
            x="-36"
            y="-128"
            width="72"
            height="36"
            rx="7"
            fill="#475569"
            stroke="#0F172A"
            strokeWidth="5"
          />
          <rect x="-32" y="-124" width="64" height="10" rx="3" fill="#94A3B8" opacity="0.65" />
          <rect x="-38" y="-125" width="10" height="30" rx="2" fill="#CBD5E1" stroke="#0F172A" strokeWidth="3" />
          <rect x="28" y="-125" width="10" height="30" rx="2" fill="#CBD5E1" stroke="#0F172A" strokeWidth="3" />
        </g>
      );
    }

    if (heldTool === "wrench") {
      return (
        <g
          transform={`translate(${rightArm.hx}, ${rightArm.hy}) rotate(${rightArm.handAngleDeg})`}
        >
          <rect x="-7" y="-82" width="14" height="96" rx="5" fill="#64748B" stroke="#0F172A" strokeWidth="4.5" />
          <path
            d="M -20 -86 C -20 -114 20 -114 20 -86 L 10 -86 L 10 -97 L -10 -97 L -10 -86 Z"
            fill="#94A3B8"
            stroke="#0F172A"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
        </g>
      );
    }

    if (heldTool === "blueprint") {
      return (
        <g transform={`translate(${rightArm.hx + 12}, ${rightArm.hy - 10})`}>
          {/* Blueprint paper rolled slightly */}
          <rect x="-42" y="-32" width="88" height="64" rx="6" fill="#1D4ED8" stroke="#0F172A" strokeWidth="4.5" />
          <rect x="-36" y="-26" width="76" height="52" rx="3" fill="none" stroke="#93C5FD" strokeWidth="2" strokeDasharray="4 3" />
          {/* Loop sketch without any mirrorable text */}
          <circle cx="0" cy="0" r="18" fill="none" stroke="#FFFFFF" strokeWidth="3.5" />
          <line x1="-30" y1="18" x2="30" y2="18" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="-46" y="-34" width="10" height="68" rx="4" fill="#DBEAFE" stroke="#0F172A" strokeWidth="3.5" />
        </g>
      );
    }

    if (heldTool === "crushed_dummy") {
      return (
        <g transform={`translate(${rightArm.hx + 18}, ${rightArm.hy + 12})`}>
          {/* Accordion crushed crash-test dummy */}
          <path
            d="M -22 10 L 22 16 L -20 26 L 20 34 L -18 44 L 18 52 L -14 60 L 14 60"
            fill="none"
            stroke="#0F172A"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="-24" y="6" width="48" height="18" rx="6" fill="#FACC15" stroke="#0F172A" strokeWidth="4" />
          <circle cx="0" cy="-16" r="19" fill="#FACC15" stroke="#0F172A" strokeWidth="4.5" />
          {/* X dizzy eyes */}
          <path d="M -11 -21 L -3 -13 M -3 -21 L -11 -13" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 3 -21 L 11 -13 M 11 -21 L 3 -13" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M -7 -5 Q 0 -9 7 -5" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    }

    if (heldTool === "sonometro") {
      const needleAng = 35 + Math.sin(frame * 0.9) * 18;
      return (
        <g transform={`translate(${rightArm.hx + 16}, ${rightArm.hy - 18})`}>
          {/* Mic antenna */}
          <rect x="-4" y="-68" width="8" height="32" rx="3" fill="#64748B" stroke="#0F172A" strokeWidth="3.5" />
          <circle cx="0" cy="-70" r="8" fill="#1E293B" stroke="#0F172A" strokeWidth="3.5" />
          {/* Yellow industrial decibel body */}
          <rect x="-24" y="-38" width="48" height="72" rx="10" fill="#FACC15" stroke="#0F172A" strokeWidth="4.5" />
          {/* Analog dial */}
          <rect x="-17" y="-28" width="34" height="26" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
          <path d="M -12 -8 A 14 14 0 0 1 12 -8" fill="none" stroke="#EF4444" strokeWidth="5" />
          <line
            x1="0"
            y1="-5"
            x2={Math.sin((needleAng * Math.PI) / 180) * 14}
            y2={-5 - Math.cos((needleAng * Math.PI) / 180) * 14}
            stroke="#0F172A"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="0" cy="18" r="7" fill="#EF4444" stroke="#0F172A" strokeWidth="3" />
        </g>
      );
    }

    if (heldTool === "portapapeles") {
      return (
        <g transform={`translate(${rightArm.hx + 14}, ${rightArm.hy - 12}) rotate(-10)`}>
          <rect x="-26" y="-42" width="52" height="72" rx="6" fill="#64748B" stroke="#0F172A" strokeWidth="4.5" />
          <rect x="-12" y="-48" width="24" height="12" rx="4" fill="#CBD5E1" stroke="#0F172A" strokeWidth="3.5" />
          <rect x="-20" y="-32" width="40" height="54" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          {/* Abstract checklist lines + red warning bars (never mirrors text) */}
          <line x1="-13" y1="-20" x2="13" y2="-20" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
          <line x1="-13" y1="-8" x2="10" y2="-8" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <line x1="-13" y1="4" x2="14" y2="4" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <line x1="-13" y1="14" x2="8" y2="14" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    }

    if (heldTool === "binoculares") {
      return (
        <g transform={`translate(${rightArm.hx + 10}, ${rightArm.hy - 8})`}>
          <rect x="-22" y="-14" width="44" height="28" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="4.5" />
          <circle cx="14" cy="0" r="13" fill="#0F172A" stroke="#000" strokeWidth="3" />
          <circle cx="14" cy="0" r="8" fill="#38BDF8" />
          <line x1="10" y1="-4" x2="15" y2="-1" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    }

    return null;
  };

  return (
    <svg
      width={440 * scale}
      height={540 * scale}
      viewBox="0 0 440 540"
      style={{ overflow: "visible" }}
    >
      <g
        transform={`translate(220, 500) scale(${flipDir * sqX}, ${sqY}) translate(-220, -500)`}
      >
        {/* Ground shadow */}
        {!pose.sitting && (
          <ellipse
            cx={hipX}
            cy="504"
            rx={64 * sqX}
            ry="13"
            fill="rgba(2, 6, 23, 0.35)"
          />
        )}

        {/* Scarf blowing in wind (if riding coaster) */}
        {scarfWave && (
          <path
            d={`M ${neckX - 10} ${neckY} Q ${neckX - 55} ${
              neckY - 12 + Math.sin(frame * 0.55) * 14
            } ${neckX - 96} ${neckY - 4 + Math.cos(frame * 0.55) * 18}`}
            fill="none"
            stroke="#EF4444"
            strokeWidth="16"
            strokeLinecap="round"
          />
        )}

        {/* Back Arm */}
        <path
          d={`M ${shoulderX - 14} ${shoulderY} L ${leftArm.ex} ${leftArm.ey} L ${leftArm.hx} ${leftArm.hy}`}
          fill="none"
          stroke={palette.outline}
          strokeWidth="23"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${shoulderX - 14} ${shoulderY} L ${leftArm.ex} ${leftArm.ey}`}
          fill="none"
          stroke={persona === "rival" ? palette.coat : palette.shirt}
          strokeWidth="13.5"
          strokeLinecap="round"
        />
        <path
          d={`M ${leftArm.ex} ${leftArm.ey} L ${leftArm.hx} ${leftArm.hy}`}
          fill="none"
          stroke={persona === "rival" ? palette.coat : palette.skin}
          strokeWidth="12.5"
          strokeLinecap="round"
        />
        {renderHand(leftArm.hx, leftArm.hy, leftArm.handAngleDeg)}

        {/* Legs (with dark outline + pant color + boots) */}
        <path
          d={leftLegPath}
          fill="none"
          stroke={palette.outline}
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={leftLegPath}
          fill="none"
          stroke={palette.pants}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={rightLegPath}
          fill="none"
          stroke={palette.outline}
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={rightLegPath}
          fill="none"
          stroke={palette.pants}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Boots */}
        {!pose.sitting && (
          <g>
            <ellipse
              cx={leftFootX + 10}
              cy={leftFootY + 2}
              rx="22"
              ry="11"
              fill={palette.boots}
              stroke={palette.outline}
              strokeWidth="5"
            />
            <ellipse
              cx={rightFootX + 12}
              cy={rightFootY + 2}
              rx="22"
              ry="11"
              fill={palette.boots}
              stroke={palette.outline}
              strokeWidth="5"
            />
          </g>
        )}

        {/* Volumetric Clothed Torso */}
        <g
          transform={`translate(${hipX}, ${hipY}) rotate(${lean}) translate(${-hipX}, ${-hipY})`}
        >
          {/* Base Torso shape */}
          <rect
            x={hipX - 30}
            y={hipY - torsoLen}
            width="60"
            height={torsoLen + 10}
            rx="24"
            fill={persona === "rival" ? palette.coat : palette.shirt}
            stroke={palette.outline}
            strokeWidth="6"
          />

          {persona === "niko" && (
            <g>
              {/* Overalls bib & straps */}
              <rect
                x={hipX - 27}
                y={hipY - torsoLen * 0.65}
                width="54"
                height={torsoLen * 0.65 + 8}
                rx="14"
                fill={palette.vest}
                stroke={palette.outline}
                strokeWidth="5"
              />
              {/* Left/right suspender straps */}
              <rect x={hipX - 21} y={hipY - torsoLen + 4} width="10" height={torsoLen * 0.45} fill={palette.vest} stroke={palette.outline} strokeWidth="3.5" />
              <rect x={hipX + 11} y={hipY - torsoLen + 4} width="10" height={torsoLen * 0.45} fill={palette.vest} stroke={palette.outline} strokeWidth="3.5" />
              {/* Brass buttons */}
              <circle cx={hipX - 16} cy={hipY - torsoLen * 0.6} r="4" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
              <circle cx={hipX + 16} cy={hipY - torsoLen * 0.6} r="4" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
              {/* Front bib pocket */}
              <rect x={hipX - 13} y={hipY - torsoLen * 0.44} width="26" height="20" rx="4" fill={palette.vestDark} stroke={palette.outline} strokeWidth="3" />
              {/* Tool belt */}
              <rect x={hipX - 31} y={hipY - 22} width="62" height="14" rx="4" fill="#78350F" stroke={palette.outline} strokeWidth="4" />
              <rect x={hipX - 8} y={hipY - 23} width="16" height="16" rx="3" fill="#FACC15" stroke={palette.outline} strokeWidth="3" />
            </g>
          )}

          {persona === "rival" && (
            <g>
              {/* White shirt V-neck & Crimson cravat */}
              <polygon
                points={`${hipX - 16},${hipY - torsoLen + 4} ${hipX + 16},${hipY - torsoLen + 4} ${hipX},${hipY - torsoLen * 0.52}`}
                fill="#FFFFFF"
                stroke={palette.outline}
                strokeWidth="3.5"
              />
              <polygon
                points={`${hipX - 10},${hipY - torsoLen + 10} ${hipX + 10},${hipY - torsoLen + 10} ${hipX},${hipY - torsoLen * 0.66}`}
                fill="#DC2626"
                stroke={palette.outline}
                strokeWidth="3"
              />
              {/* Gold coat buttons */}
              <circle cx={hipX - 14} cy={hipY - 46} r="4" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
              <circle cx={hipX + 14} cy={hipY - 46} r="4" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
            </g>
          )}

          {persona === "dummy" && (
            <g>
              {/* Crash test quadrant chest badge */}
              <circle cx={hipX + 2} cy={hipY - torsoLen * 0.55} r="18" fill="#FACC15" stroke="#0F172A" strokeWidth="4" />
              <path d={`M ${hipX + 2} ${hipY - torsoLen * 0.55 - 18} L ${hipX + 2} ${hipY - torsoLen * 0.55} L ${hipX + 20} ${hipY - torsoLen * 0.55} A 18 18 0 0 0 ${hipX + 2} ${hipY - torsoLen * 0.55 - 18}`} fill="#0F172A" />
              <path d={`M ${hipX + 2} ${hipY - torsoLen * 0.55 + 18} L ${hipX + 2} ${hipY - torsoLen * 0.55} L ${hipX - 16} ${hipY - torsoLen * 0.55} A 18 18 0 0 0 ${hipX + 2} ${hipY - torsoLen * 0.55 + 18}`} fill="#0F172A" />
            </g>
          )}

          {persona === "eiji" && (
            <g>
              {/* Sky-blue inner shirt V-panel + dark tie under open white lab coat */}
              <rect x={hipX - 14} y={hipY - torsoLen + 4} width="28" height={torsoLen} rx="6" fill="#38BDF8" stroke={palette.outline} strokeWidth="3" />
              <polygon
                points={`${hipX - 4},${hipY - torsoLen + 6} ${hipX + 4},${hipY - torsoLen + 6} ${hipX + 6},${hipY - torsoLen * 0.45} ${hipX},${hipY - torsoLen * 0.35} ${hipX - 6},${hipY - torsoLen * 0.45}`}
                fill="#0F172A"
              />
              {/* Lab coat lapels & pocket */}
              <path d={`M ${hipX - 14} ${hipY - torsoLen + 6} L ${hipX - 24} ${hipY - torsoLen + 36} L ${hipX - 14} ${hipY - torsoLen + 48}`} fill="#E2E8F0" stroke={palette.outline} strokeWidth="3.5" strokeLinejoin="round" />
              <path d={`M ${hipX + 14} ${hipY - torsoLen + 6} L ${hipX + 24} ${hipY - torsoLen + 36} L ${hipX + 14} ${hipY - torsoLen + 48}`} fill="#E2E8F0" stroke={palette.outline} strokeWidth="3.5" strokeLinejoin="round" />
              <rect x={hipX + 13} y={hipY - 46} width="14" height="16" rx="2" fill="#E2E8F0" stroke={palette.outline} strokeWidth="2.5" />
              {/* Optional hanging binoculars around neck */}
              {neckBinoculars && (
                <g>
                  <path d={`M ${hipX - 14} ${hipY - torsoLen + 4} Q ${hipX} ${hipY - torsoLen + 46} ${hipX + 14} ${hipY - torsoLen + 4}`} fill="none" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
                  <rect x={hipX - 16} y={hipY - torsoLen + 36} width="32" height="22" rx="6" fill="#0F172A" stroke="#000" strokeWidth="3" />
                  <circle cx={hipX - 8} cy={hipY - torsoLen + 56} r="7" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.5" />
                  <circle cx={hipX + 8} cy={hipY - torsoLen + 56} r="7" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.5" />
                </g>
              )}
            </g>
          )}

          {persona === "kuroda" && (
            <g>
              {/* Navy railway uniform collar, gold stripe & double-breasted brass buttons */}
              <polygon points={`${hipX - 12},${hipY - torsoLen + 4} ${hipX + 12},${hipY - torsoLen + 4} ${hipX},${hipY - torsoLen * 0.65}`} fill="#FFFFFF" stroke={palette.outline} strokeWidth="3" />
              <polygon points={`${hipX - 5},${hipY - torsoLen + 6} ${hipX + 5},${hipY - torsoLen + 6} ${hipX},${hipY - torsoLen * 0.68}`} fill="#0F172A" />
              <circle cx={hipX - 14} cy={hipY - 58} r="4.2" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
              <circle cx={hipX + 14} cy={hipY - 58} r="4.2" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
              <circle cx={hipX - 14} cy={hipY - 34} r="4.2" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
              <circle cx={hipX + 14} cy={hipY - 34} r="4.2" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
              <rect x={hipX - 28} y={hipY - 22} width="56" height="9" rx="3" fill="#0F172A" />
            </g>
          )}
        </g>

        {/* Neck */}
        <rect
          x={neckX - 9}
          y={neckY - 20}
          width="18"
          height="24"
          rx="6"
          fill={palette.skinShadow}
          stroke={palette.outline}
          strokeWidth="5"
        />

        {/* Expressive Cartoon Head */}
        <g
          transform={`translate(${headX}, ${headY}) rotate(${headTilt}) scale(1, ${
            1 - crush * 0.35
          })`}
        >
          {/* Head sphere with cel-shading */}
          <circle cx="0" cy="0" r="56" fill={palette.skin} stroke={palette.outline} strokeWidth="6.5" />
          {/* Inner bottom jaw shadow */}
          <path
            d="M -48 22 A 54 54 0 0 0 48 22 A 56 50 0 0 1 -48 22 Z"
            fill={palette.skinShadow}
            opacity="0.7"
          />

          {/* Ear */}
          <circle cx="-54" cy="4" r="11" fill={palette.skinShadow} stroke={palette.outline} strokeWidth="5" />

          {/* Facial Features */}
          <g transform={`translate(${lookX}, ${lookY})`}>
            {renderEyes()}
            {renderMouth()}

            {/* Rival's signature curled villain mustache */}
            {persona === "rival" && (
              <path
                d="M 2 10 Q -14 2 -28 14 Q -20 22 -4 16 Q 2 14 6 16 Q 24 22 32 12 Q 16 2 2 10 Z"
                fill="#0F172A"
              />
            )}

            {/* Kuroda's trimmed grey/silver inspector mustache */}
            {persona === "kuroda" && (
              <path
                d="M -18 14 Q 2 8 22 14 L 18 19 Q 2 15 -14 19 Z"
                fill="#64748B"
                stroke="#0F172A"
                strokeWidth="2.5"
              />
            )}

            {/* Eiji's rectangular thin eyeglasses */}
            {persona === "eiji" && (
              <g>
                <rect x="-27" y="-17" width="24" height="22" rx="4" fill="rgba(224,242,254,0.22)" stroke="#1E293B" strokeWidth="3.5" />
                <rect x="6" y="-17" width="24" height="22" rx="4" fill="rgba(224,242,254,0.22)" stroke="#1E293B" strokeWidth="3.5" />
                <line x1="-3" y1="-8" x2="6" y2="-8" stroke="#1E293B" strokeWidth="3.5" />
              </g>
            )}
          </g>

          {/* Hair / Hat */}
          {persona === "eiji" && (
            <g>
              {/* Sleek slightly tousled dark Japanese hair with bangs */}
              <path
                d="M -54 -14 C -58 -52 -22 -68 12 -64 C 44 -60 58 -36 53 -12 C 42 -26 30 -32 18 -20 C 12 -32 -2 -34 -12 -18 C -20 -30 -38 -26 -54 -14 Z"
                fill="#0F172A"
                stroke="#000000"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
            </g>
          )}

          {persona === "kuroda" && (
            <g>
              {/* Combed-back silver hair + navy peaked Japanese railway inspector cap */}
              <path
                d="M -54 -12 C -54 -40 -26 -54 0 -54 C 28 -54 54 -40 54 -12 Z"
                fill="#94A3B8"
                stroke="#0F172A"
                strokeWidth="4"
              />
              <g transform="translate(0, -36)">
                <path d="M -50 2 L -40 -34 L 44 -34 L 50 2 Z" fill="#1E3A8A" stroke="#0F172A" strokeWidth="5" strokeLinejoin="round" />
                <rect x="-46" y="-6" width="92" height="10" fill="#FACC15" stroke="#0F172A" strokeWidth="3" />
                {/* Gold railway crest */}
                <circle cx="4" cy="-19" r="9" fill="#FACC15" stroke="#0F172A" strokeWidth="3" />
                {/* Shiny black peaked visor */}
                <path d="M -30 4 Q 8 18 58 6 Q 30 -2 -30 4 Z" fill="#0F172A" stroke="#000000" strokeWidth="4" />
              </g>
            </g>
          )}
          {persona === "niko" && (
            <g>
              {/* Tousled brown inventor hair */}
              <path
                d="M -54 -14 C -58 -52 -24 -68 12 -64 C 42 -60 58 -36 52 -16 C 36 -30 16 -34 -6 -32 C -26 -30 -40 -22 -54 -14 Z"
                fill="#78350F"
                stroke={palette.outline}
                strokeWidth="5.5"
                strokeLinejoin="round"
              />
              {/* Goggles strap */}
              <rect x="-56" y="-44" width="112" height="13" rx="6" fill="#451A03" stroke={palette.outline} strokeWidth="4" />
              {/* Brass goggles */}
              <circle cx="-12" cy="-38" r="18" fill="#B45309" stroke={palette.outline} strokeWidth="4.5" />
              <circle cx="-12" cy="-38" r="12" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.5" />
              <line x1="-18" y1="-44" x2="-10" y2="-36" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />

              <circle cx="24" cy="-38" r="18" fill="#B45309" stroke={palette.outline} strokeWidth="4.5" />
              <circle cx="24" cy="-38" r="12" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.5" />
              <line x1="18" y1="-44" x2="26" y2="-36" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
            </g>
          )}

          {persona === "rival" && (
            <g transform="translate(0, -44)">
              {/* Victorian Top Hat */}
              <path
                d="M -38 0 L -30 -56 L 34 -56 L 40 0 Z"
                fill="#0F172A"
                stroke="#000000"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <rect x="-36" y="-14" width="74" height="12" fill="#DC2626" stroke="#000000" strokeWidth="3" />
              <ellipse cx="2" cy="2" rx="58" ry="11" fill="#1E293B" stroke="#000000" strokeWidth="5" />
            </g>
          )}

          {/* Sweat drops if panicked/exhausted */}
          {sweatDrops && (
            <g transform={`translate(-46, ${-26 + ((frame * 3) % 18)})`}>
              <path
                d="M 0 -10 C 7 0 7 9 0 11 C -7 9 -7 0 0 -10 Z"
                fill="#38BDF8"
                stroke="#0F172A"
                strokeWidth="3"
              />
            </g>
          )}
        </g>

        {/* Front Arm + Held Tool */}
        <path
          d={`M ${shoulderX + 12} ${shoulderY} L ${rightArm.ex} ${rightArm.ey} L ${rightArm.hx} ${rightArm.hy}`}
          fill="none"
          stroke={palette.outline}
          strokeWidth="23"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${shoulderX + 12} ${shoulderY} L ${rightArm.ex} ${rightArm.ey}`}
          fill="none"
          stroke={persona === "rival" ? palette.coat : palette.shirt}
          strokeWidth="13.5"
          strokeLinecap="round"
        />
        <path
          d={`M ${rightArm.ex} ${rightArm.ey} L ${rightArm.hx} ${rightArm.hy}`}
          fill="none"
          stroke={persona === "rival" ? palette.coat : palette.skin}
          strokeWidth="12.5"
          strokeLinecap="round"
        />
        {renderHeldTool()}
        {renderHand(rightArm.hx, rightArm.hy, rightArm.handAngleDeg)}
      </g>
    </svg>
  );
};
