import React from "react";
import { TrackPoint, sampleTrackAt } from "./trackMath";

export interface CoasterCartProps {
  x: number;
  y: number;
  angleDeg: number;
  scale?: number;
  variant?: "niko" | "rival" | "dummy" | "empty";
  squashY?: number;
  wheelAngleDeg?: number;
  speedBlur?: boolean;
  sparks?: boolean;
  frame?: number;
}

export const CoasterCartSvg: React.FC<CoasterCartProps> = ({
  x,
  y,
  angleDeg,
  scale = 1,
  variant = "empty",
  squashY = 1,
  wheelAngleDeg = 0,
  speedBlur = false,
  sparks = false,
  frame = 0,
}) => {
  return (
    <g
      transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)}) rotate(${angleDeg.toFixed(
        1
      )}) scale(${scale})`}
    >
      {/* Motion speed lines behind cart */}
      {speedBlur && (
        <g opacity="0.75">
          <line x1="-130" y1="-22" x2="-52" y2="-22" stroke="#FEF08A" strokeWidth="5" strokeLinecap="round" />
          <line x1="-155" y1="-44" x2="-60" y2="-44" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
          <line x1="-115" y1="-8" x2="-48" y2="-8" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {/* Wheel sparks on high-G turn */}
      {sparks && (
        <g>
          {[0, 1, 2, 3].map((i) => {
            const p = ((frame * 1.4 + i * 7) % 14) / 14;
            return (
              <circle
                key={`cspk_${i}`}
                cx={-26 - p * 55}
                cy={-2 - Math.sin(p * Math.PI) * (15 + i * 5)}
                r={4.5 * (1 - p) + 1.5}
                fill={i % 2 === 0 ? "#FACC15" : "#EF4444"}
              />
            );
          })}
        </g>
      )}

      {/* Passenger head/shoulders sitting inside cart (scales with squashY under G-force!) */}
      {variant !== "empty" && (
        <g transform={`translate(0, -34) scale(${1 + (1 - squashY) * 0.35}, ${squashY})`}>
          {variant === "dummy" && (
            <g>
              <rect x="-15" y="-26" width="30" height="28" rx="6" fill="#FACC15" stroke="#0F172A" strokeWidth="4" />
              <circle cx="2" cy="-42" r="18" fill="#FACC15" stroke="#0F172A" strokeWidth="4" />
              <path d="M -5 -48 L 10 -48" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="-4" cy="-42" r="3" fill="#0F172A" />
              <circle cx="9" cy="-42" r="3" fill="#0F172A" />
            </g>
          )}
          {variant === "niko" && (
            <g>
              {/* Torso & arms gripping front safety bar */}
              <rect x="-16" y="-22" width="32" height="26" rx="8" fill="#2563EB" stroke="#0F172A" strokeWidth="4" />
              {/* Flying red scarf */}
              <path
                d={`M -12 -18 Q -42 ${-26 + Math.sin(frame * 0.5) * 9} -74 ${
                  -18 + Math.cos(frame * 0.5) * 11
                }`}
                fill="none"
                stroke="#EF4444"
                strokeWidth="9"
                strokeLinecap="round"
              />
              {/* Head + brass goggles + expressive worried/excited face */}
              <circle cx="4" cy="-38" r="20" fill="#FFE4C4" stroke="#0F172A" strokeWidth="4.2" />
              <path d="M -14 -44 C -14 -60 18 -60 22 -44 Z" fill="#78350F" stroke="#0F172A" strokeWidth="3.5" />
              {/* Eyes looking forward */}
              <circle cx="7" cy="-37" r="3.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <circle cx="8" cy="-37" r="1.7" fill="#0F172A" />
              <circle cx="17" cy="-37" r="3.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <circle cx="18" cy="-37" r="1.7" fill="#0F172A" />
              {/* Mouth */}
              <ellipse cx="13" cy="-27" rx="4.5" ry="3.5" fill="#7F1D1D" stroke="#0F172A" strokeWidth="2" />
              {/* Sweat drop */}
              <path d="M -9 -39 C -6 -34 -6 -29 -9 -28 C -12 -29 -12 -34 -9 -39 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" />
              {/* Brass goggles */}
              <circle cx="4" cy="-49" r="7" fill="#B45309" stroke="#0F172A" strokeWidth="2.5" />
              <circle cx="4" cy="-49" r="4" fill="#38BDF8" />
              <circle cx="15" cy="-49" r="7" fill="#B45309" stroke="#0F172A" strokeWidth="2.5" />
              <circle cx="15" cy="-49" r="4" fill="#38BDF8" />
              {/* Gripping arm */}
              <path d="M 8 -14 L 28 -18" stroke="#0F172A" strokeWidth="11" strokeLinecap="round" />
              <path d="M 8 -14 L 28 -18" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
            </g>
          )}
          {variant === "rival" && (
            <g>
              <rect x="-16" y="-22" width="32" height="26" rx="8" fill="#7F1D1D" stroke="#0F172A" strokeWidth="4" />
              <circle cx="4" cy="-38" r="20" fill="#FDEBD0" stroke="#0F172A" strokeWidth="4.2" />
              {/* Top hat */}
              <g transform="translate(4, -56)">
                <rect x="-15" y="-22" width="30" height="22" fill="#0F172A" stroke="#000000" strokeWidth="3" />
                <rect x="-15" y="-6" width="30" height="5" fill="#DC2626" />
                <ellipse cx="0" cy="0" rx="22" ry="5" fill="#1E293B" stroke="#000000" strokeWidth="3" />
              </g>
            </g>
          )}
        </g>
      )}

      {/* Wooden / Vintage Coaster Body (centered above axle) */}
      <g transform="translate(0, -14)">
        <path
          d="M -42 -26 L 38 -26 L 48 -4 L 42 4 L -44 4 Z"
          fill={variant === "rival" ? "#DC2626" : "#B45309"}
          stroke="#0F172A"
          strokeWidth="4.8"
          strokeLinejoin="round"
        />
        {/* Decorative brass trim */}
        <path
          d="M -36 -18 L 32 -18 L 36 -8 L -38 -8 Z"
          fill={variant === "rival" ? "#991B1B" : "#D97706"}
          stroke="#0F172A"
          strokeWidth="2.5"
        />
        {/* Front iron safety bar */}
        <path d="M 22 -26 L 32 -38 L 40 -36" fill="none" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
        {/* Brass rivets */}
        <circle cx="-30" cy="-3" r="3" fill="#FACC15" />
        <circle cx="0" cy="-3" r="3" fill="#FACC15" />
        <circle cx="30" cy="-3" r="3" fill="#FACC15" />
      </g>

      {/* Iron Wheels sitting flush on y = -8 above rail center */}
      {[-28, 28].map((wx, idx) => (
        <g key={`wheel_${idx}`} transform={`translate(${wx}, -10) rotate(${wheelAngleDeg})`}>
          <circle cx="0" cy="0" r="10" fill="#475569" stroke="#0F172A" strokeWidth="4" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#CBD5E1" strokeWidth="2.5" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="3" fill="#FACC15" />
        </g>
      ))}
    </g>
  );
};

export interface ModernCoasterTrainProps {
  track: TrackPoint[];
  headProgress: number;
  scale?: number;
}

export const ModernCoasterTrain: React.FC<ModernCoasterTrainProps> = ({
  track,
  headProgress,
  scale = 1,
}) => {
  const offsets = [0, -0.055, -0.11];
  return (
    <g>
      {offsets.map((off, idx) => {
        const u = Math.max(0.01, Math.min(0.99, headProgress + off));
        const pt = sampleTrackAt(track, u);
        return (
          <g
            key={`mcar_${idx}`}
            transform={`translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${pt.angleDeg.toFixed(
              1
            )}) scale(${scale})`}
          >
            {/* Glowing aerodynamic steel body */}
            <path
              d={
                idx === 0
                  ? "M -34 -30 L 22 -30 C 38 -30 46 -18 46 -6 L -34 -6 Z"
                  : "M -34 -30 L 32 -30 L 34 -6 L -34 -6 Z"
              }
              fill={idx === 0 ? "#0284C7" : "#0EA5E9"}
              stroke="#0F172A"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Gold stripe */}
            <rect x="-28" y="-18" width={idx === 0 ? 64 : 56} height="6" rx="3" fill="#FACC15" />
            {/* Tiny stylized passenger heads cheering */}
            <circle cx="-12" cy="-37" r="9" fill="#FFE4C4" stroke="#0F172A" strokeWidth="3" />
            <circle cx="10" cy="-37" r="9" fill="#FFE4C4" stroke="#0F172A" strokeWidth="3" />
            {/* Bogie wheels */}
            <circle cx="-18" cy="-6" r="7" fill="#1E293B" stroke="#F8FAFC" strokeWidth="2.5" />
            <circle cx="18" cy="-6" r="7" fill="#1E293B" stroke="#F8FAFC" strokeWidth="2.5" />
          </g>
        );
      })}
    </g>
  );
};
