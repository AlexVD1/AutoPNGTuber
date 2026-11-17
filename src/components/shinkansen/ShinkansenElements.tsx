import React from "react";

export interface ShinkansenProfileProps {
  x: number;
  y: number;
  variant: "blunt" | "cone" | "serie500";
  scale?: number;
  rotationDeg?: number;
  wingBlur?: boolean;
}

export const ShinkansenProfileSvg: React.FC<ShinkansenProfileProps> = ({
  x,
  y,
  variant,
  scale = 1,
  rotationDeg = 0,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotationDeg}) scale(${scale})`}>
      {variant === "blunt" && (
        <g>
          {/* Classic 1990s blunt nose bullet train side profile */}
          <path
            d="M -150 -48 L 65 -48 C 122 -48 148 -24 148 12 L 148 34 L -150 34 Z"
            fill="#F8FAFC"
            stroke="#0F172A"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <rect x="-150" y="-4" width="296" height="18" fill="#0284C7" stroke="#0F172A" strokeWidth="3.5" />
          {/* Cockpit glass */}
          <path d="M 70 -40 C 102 -40 122 -28 126 -10 L 66 -10 Z" fill="#0F172A" />
          {/* Passenger windows */}
          {[-120, -80, -40, 0].map((wx, i) => (
            <rect key={`bw_${i}`} x={wx} y="-30" width="26" height="16" rx="4" fill="#1E293B" />
          ))}
          {/* Wheels */}
          <circle cx="-100" cy="38" r="11" fill="#334155" stroke="#0F172A" strokeWidth="4" />
          <circle cx="-65" cy="38" r="11" fill="#334155" stroke="#0F172A" strokeWidth="4" />
          <circle cx="85" cy="38" r="11" fill="#334155" stroke="#0F172A" strokeWidth="4" />
        </g>
      )}

      {variant === "cone" && (
        <g>
          {/* Sharp straight-cone wind tunnel test model */}
          <path
            d="M -140 -42 L 20 -42 L 160 18 L 160 28 L -140 28 Z"
            fill="#E2E8F0"
            stroke="#0F172A"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <line x1="-140" y1="0" x2="112" y2="0" stroke="#EF4444" strokeWidth="8" />
          <polygon points="50,-34 100,-12 52,-12" fill="#0F172A" />
        </g>
      )}

      {variant === "serie500" && (
        <g>
          {/* Iconic Shinkansen 500 Series parabolic kingfisher-beak 15m nose */}
          <path
            d="M -170 -44 L -15 -44 C 55 -44 125 -8 185 24 L 185 32 L -170 32 Z"
            fill="#F8FAFC"
            stroke="#0F172A"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Signature metallic blue canopy & belly stripe */}
          <path
            d="M -170 -44 L -15 -44 C 25 -44 65 -30 98 -12 L -170 -12 Z"
            fill="#1D4ED8"
            stroke="#0F172A"
            strokeWidth="3.5"
          />
          <rect x="-170" y="12" width="352" height="12" fill="#0284C7" stroke="#0F172A" strokeWidth="3" />
          {/* Sleek flush canopy cockpit */}
          <path
            d="M 10 -34 C 38 -34 62 -24 76 -12 L 8 -12 Z"
            fill="#0F172A"
            stroke="#38BDF8"
            strokeWidth="2.5"
          />
          {/* Passenger windows */}
          {[-145, -110, -75, -40].map((wx, i) => (
            <rect key={`s5w_${i}`} x={wx} y="-6" width="24" height="13" rx="4" fill="#0F172A" />
          ))}
          <circle cx="-120" cy="35" r="10" fill="#334155" stroke="#0F172A" strokeWidth="3.5" />
          <circle cx="-88" cy="35" r="10" fill="#334155" stroke="#0F172A" strokeWidth="3.5" />
          <circle cx="95" cy="35" r="10" fill="#334155" stroke="#0F172A" strokeWidth="3.5" />
        </g>
      )}
    </g>
  );
};

export interface KingfisherProps {
  x: number;
  y: number;
  scale?: number;
  pose: "perched" | "diving" | "flying";
  frame: number;
  rotationDeg?: number;
}

export const KingfisherBirdSvg: React.FC<KingfisherProps> = ({
  x,
  y,
  scale = 1,
  pose,
  frame,
  rotationDeg = 0,
}) => {
  const wingFlap = pose === "flying" ? Math.sin(frame * 0.65) * 28 : 0;

  if (pose === "diving") {
    // Sleek streamlined dart pointing downward/forward (wings folded!)
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotationDeg}) scale(${scale})`}>
        {/* Folded aerodynamic dart body */}
        <path
          d="M -55 -20 C -20 -34 25 -22 45 -4 L 18 18 C -15 24 -42 12 -55 -20 Z"
          fill="#0284C7"
          stroke="#0F172A"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        {/* Copper orange chest belly */}
        <path
          d="M -25 14 C -5 22 18 18 32 4 L 8 -4 C -10 -4 -20 4 -25 14 Z"
          fill="#EA580C"
        />
        {/* Long straight conical black Kingfisher beak */}
        <polygon
          points="42,-10 108,0 40,8"
          fill="#0F172A"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Crisp white cheek patch & focused eye */}
        <circle cx="24" cy="-6" r="7" fill="#FFFFFF" />
        <circle cx="32" cy="-7" r="4.5" fill="#0F172A" />
        <circle cx="33" cy="-8.5" r="1.6" fill="#FFFFFF" />
      </g>
    );
  }

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotationDeg}) scale(${scale})`}>
      {/* Tail feathers */}
      <polygon points="-38,8 -68,20 -62,28 -32,16" fill="#1D4ED8" stroke="#0F172A" strokeWidth="3.5" />
      {/* Copper orange chest */}
      <ellipse cx="0" cy="8" rx="28" ry="22" fill="#EA580C" stroke="#0F172A" strokeWidth="4.5" />
      {/* White throat patch */}
      <ellipse cx="14" cy="0" rx="11" ry="8" fill="#FFFFFF" />
      {/* Cobalt blue back & head */}
      <path
        d="M -38 4 C -36 -22 -12 -32 14 -28 C 34 -24 42 -12 38 -2 C 20 0 0 -2 -38 4 Z"
        fill="#0284C7"
        stroke="#0F172A"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      {/* Flapping or folded wing */}
      {pose === "flying" ? (
        <path
          d={`M -14 -8 Q -6 ${-52 + wingFlap} 18 ${-42 + wingFlap} Q 14 -12 4 -4 Z`}
          fill="#1D4ED8"
          stroke="#0F172A"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M -32 4 Q -8 -10 14 4 Q -6 22 -32 4 Z"
          fill="#1D4ED8"
          stroke="#0F172A"
          strokeWidth="3.5"
        />
      )}
      {/* Long conical black beak */}
      <polygon
        points="36,-16 86,-8 35,-3"
        fill="#0F172A"
        stroke="#000000"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Focused eye */}
      <circle cx="23" cy="-14" r="4.5" fill="#0F172A" />
      <circle cx="24" cy="-15.5" r="1.8" fill="#FFFFFF" />
    </g>
  );
};
