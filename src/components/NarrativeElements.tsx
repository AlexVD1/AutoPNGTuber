import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ElementoNarrativo, PalabraTiming } from "../types";
import { resolveTimeRangeFrames } from "../stickman/actionSequences";

export interface NarrativeElementsProps {
  elementos?: ElementoNarrativo[];
  totalFrames?: number;
  palabras?: PalabraTiming[];
}

export const NarrativeElements: React.FC<NarrativeElementsProps> = ({
  elementos,
  totalFrames = 210,
  palabras,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!elementos || elementos.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {elementos.map((el, idx) => {
        const hasWindow =
          el.inicioProgreso !== undefined ||
          el.finProgreso !== undefined ||
          el.inicioSegundos !== undefined ||
          el.finSegundos !== undefined ||
          el.desdePalabra !== undefined ||
          el.hastaPalabra !== undefined;
        const { startFrame, endFrame } = hasWindow
          ? resolveTimeRangeFrames(el, totalFrames, fps, palabras)
          : { startFrame: 0, endFrame: totalFrames };

        if (frame < startFrame || frame > endFrame) {
          return null;
        }
        const relFrame = frame - startFrame;

        switch (el.tipo) {
          case "speed_counter":
            return <SpeedCounter key={idx} elemento={el} frame={relFrame} fps={fps} />;
          case "speed_lines":
            return <SpeedLines key={idx} elemento={el} frame={relFrame} />;
          case "flying_debris":
            return <FlyingDebris key={idx} frame={relFrame} fps={fps} />;
          case "giant_waves":
            return <GiantWaves key={idx} frame={relFrame} />;
          case "shockwave_burst":
            return <ShockwaveBurst key={idx} frame={relFrame} fps={fps} />;
          case "orbital_peace":
            return <OrbitalPeace key={idx} frame={relFrame} />;
          case "danger_vignette":
            return <DangerVignette key={idx} frame={relFrame} />;
          case "sparks_explosion":
            return <SparksExplosion key={idx} elemento={el} frame={relFrame} />;
          case "steam_vent":
            return <SteamVent key={idx} elemento={el} frame={relFrame} />;
          case "chemical_bubbles":
            return <ChemicalBubbles key={idx} elemento={el} frame={relFrame} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

/**
 * 1. Velocímetro y contador digital neo-brutalista de aceleración
 */
const SpeedCounter: React.FC<{
  elemento: ElementoNarrativo;
  frame: number;
  fps: number;
}> = ({ elemento, frame, fps }) => {
  const targetVal = elemento.valorNumerico ?? 1600;
  const unit = elemento.unidad ?? "KM/H";

  const countProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const currentNumber = Math.round(
    interpolate(countProgress, [0, 1], [0, targetVal])
  );

  const needleAngle = interpolate(countProgress, [0, 1], [-110, 85]);

  return (
    <div
      className="absolute top-[320px] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center p-6 bg-white border-4 border-black rounded-3xl"
      style={{
        boxShadow: "10px 10px 0px #000000",
        transform: `translate(-50%, ${Math.sin(frame / 6) * 4}px)`,
      }}
    >
      <div className="relative w-[340px] h-[170px] overflow-hidden flex items-end justify-center">
        {/* Arco del velocímetro */}
        <svg width="320" height="160" viewBox="0 0 320 160">
          <path
            d="M 20 150 A 140 140 0 0 1 300 150"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M 20 150 A 140 140 0 0 1 300 150"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="24"
            strokeDasharray="440"
            strokeDashoffset={interpolate(countProgress, [0, 1], [440, 60])}
            strokeLinecap="round"
          />
          {/* Aguja animada */}
          <g transform={`translate(160, 150) rotate(${needleAngle})`}>
            <polygon points="-6,0 6,0 0,-130" fill="#EF4444" stroke="#000000" strokeWidth="3" />
            <circle cx="0" cy="0" r="14" fill="#111827" />
          </g>
        </svg>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span
          className="font-black text-6xl tracking-tight text-black"
          style={{
            fontFamily: "'Arial Black', 'Impact', sans-serif",
            letterSpacing: "-0.03em",
          }}
        >
          {currentNumber.toLocaleString()}
        </span>
        <span
          className="px-3 py-1 bg-amber-400 border-2 border-black rounded-lg font-black text-xl text-black"
          style={{ fontFamily: "'Arial Black', sans-serif" }}
        >
          {unit}
        </span>
      </div>
      {elemento.subtitulo && (
        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
          {elemento.subtitulo}
        </span>
      )}
    </div>
  );
};

/**
 * 2. Líneas cinéticas de velocidad horizontal (estilo manga neo-brutalista)
 */
const SpeedLines: React.FC<{
  elemento: ElementoNarrativo;
  frame: number;
}> = ({ elemento, frame }) => {
  const dir = elemento.direccion ?? "este";
  const speed = (frame * 32) % 1080;
  const isEast = dir === "este";

  const lines = [
    { y: 320, width: 280, delay: 0 },
    { y: 560, width: 440, delay: 4 },
    { y: 780, width: 360, delay: 2 },
    { y: 990, width: 500, delay: 6 },
    { y: 1240, width: 320, delay: 1 },
    { y: 1450, width: 460, delay: 5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-45">
      {lines.map((l, i) => {
        const lineX = isEast
          ? ((frame * 42 + l.delay * 160) % 1400) - 400
          : 1080 - (((frame * 42 + l.delay * 160) % 1400) - 200);

        return (
          <div
            key={i}
            className="absolute h-3 bg-black rounded-full"
            style={{
              top: l.y,
              left: lineX,
              width: l.width,
              boxShadow: "0px 3px 0px rgba(0,0,0,0.15)",
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * 3. Escombros vectoriales voladores (edificios, autos, árboles disparados hacia el este)
 */
const FlyingDebris: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const debris = [
    {
      tipo: "car",
      baseY: 620,
      speedX: 38,
      rotSpeed: 8,
      scale: 0.9,
      color: "#EF4444",
      delay: 0,
    },
    {
      tipo: "building",
      baseY: 760,
      speedX: 28,
      rotSpeed: 4,
      scale: 1.1,
      color: "#3B82F6",
      delay: 8,
    },
    {
      tipo: "tree",
      baseY: 920,
      speedX: 34,
      rotSpeed: 10,
      scale: 0.85,
      color: "#10B981",
      delay: 16,
    },
    {
      tipo: "sign",
      baseY: 500,
      speedX: 44,
      rotSpeed: 14,
      scale: 0.8,
      color: "#F59E0B",
      delay: 4,
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden z-25">
      {debris.map((item, i) => {
        const itemFrame = Math.max(0, frame - item.delay);
        const posX = ((itemFrame * item.speedX) % 1600) - 300;
        const posY = item.baseY + Math.sin(itemFrame / 4) * 35;
        const rotation = itemFrame * item.rotSpeed;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: posY,
              left: posX,
              transform: `scale(${item.scale}) rotate(${rotation}deg)`,
              filter: "drop-shadow(6px 6px 0px #000000)",
            }}
          >
            {item.tipo === "car" && (
              <svg width="120" height="60" viewBox="0 0 120 60">
                <rect x="10" y="22" width="100" height="26" rx="6" fill={item.color} stroke="#000" strokeWidth="5" />
                <path d="M 30 22 L 44 6 L 76 6 L 90 22 Z" fill="#E2E8F0" stroke="#000" strokeWidth="5" />
                <circle cx="32" cy="48" r="12" fill="#111" stroke="#000" strokeWidth="4" />
                <circle cx="88" cy="48" r="12" fill="#111" stroke="#000" strokeWidth="4" />
              </svg>
            )}
            {item.tipo === "building" && (
              <svg width="80" height="130" viewBox="0 0 80 130">
                <rect x="8" y="8" width="64" height="114" rx="4" fill={item.color} stroke="#000" strokeWidth="6" />
                <rect x="20" y="24" width="14" height="16" fill="#FEF08A" stroke="#000" strokeWidth="3" />
                <rect x="46" y="24" width="14" height="16" fill="#FEF08A" stroke="#000" strokeWidth="3" />
                <rect x="20" y="54" width="14" height="16" fill="#FEF08A" stroke="#000" strokeWidth="3" />
                <rect x="46" y="54" width="14" height="16" fill="#FEF08A" stroke="#000" strokeWidth="3" />
                <rect x="20" y="84" width="14" height="16" fill="#FEF08A" stroke="#000" strokeWidth="3" />
                <rect x="46" y="84" width="14" height="16" fill="#FEF08A" stroke="#000" strokeWidth="3" />
              </svg>
            )}
            {item.tipo === "tree" && (
              <svg width="80" height="90" viewBox="0 0 80 90">
                <rect x="34" y="50" width="12" height="36" fill="#92400E" stroke="#000" strokeWidth="4" />
                <circle cx="40" cy="36" r="28" fill={item.color} stroke="#000" strokeWidth="5" />
              </svg>
            )}
            {item.tipo === "sign" && (
              <svg width="60" height="80" viewBox="0 0 60 80">
                <line x1="30" y1="36" x2="30" y2="78" stroke="#000" strokeWidth="6" />
                <polygon points="30,6 56,36 4,36" fill="#FACC15" stroke="#000" strokeWidth="5" />
                <line x1="30" y1="18" x2="30" y2="28" stroke="#000" strokeWidth="4" />
                <circle cx="30" cy="32" r="2" fill="#000" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * 4. Megatsunami vectorial con oleaje dinámico y espuma ascendente (sin solapar subtítulos)
 */
const GiantWaves: React.FC<{ frame: number }> = ({ frame }) => {
  const waveHeight = interpolate(frame, [0, 25], [140, 260], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute bottom-[360px] left-0 right-0 overflow-hidden pointer-events-none z-15"
      style={{ height: waveHeight + 40 }}
    >
      <svg
        width="1280"
        height="320"
        viewBox="0 0 1280 320"
        className="absolute bottom-0 -left-20"
      >
        {/* Ola trasera oscura */}
        <path
          d={`M 0 320 L 0 120 Q 240 ${80 + Math.sin(frame / 6) * 20} 480 120 T 960 120 T 1440 120 L 1440 320 Z`}
          fill="#0284C7"
          stroke="#000000"
          strokeWidth="8"
        />
        {/* Ola frontal con cresta neo-brutalista */}
        <path
          d={`M 0 320 L 0 160 Q 200 ${120 + Math.cos(frame / 6) * 25} 440 160 T 880 160 T 1320 160 L 1320 320 Z`}
          fill="#38BDF8"
          stroke="#000000"
          strokeWidth="8"
        />
        {/* Crestas de espuma flotante */}
        <circle cx={220 + Math.sin(frame / 5) * 40} cy="140" r="14" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
        <circle cx={460 + Math.cos(frame / 5) * 40} cy="155" r="10" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
        <circle cx={720 + Math.sin(frame / 4) * 40} cy="135" r="16" fill="#FFFFFF" stroke="#000" strokeWidth="5" />
        <circle cx={980 + Math.cos(frame / 4) * 40} cy="150" r="12" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
      </svg>
    </div>
  );
};

/**
 * 5. Onda de choque expansiva y destellos de impacto térmico
 */
const ShockwaveBurst: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const burstProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 90, mass: 0.6 },
  });

  const shockRadius = interpolate(burstProgress, [0, 1], [40, 480]);
  const shockOpacity = interpolate(frame, [0, 20], [1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <svg width="1080" height="1080" viewBox="-540 -540 1080 1080">
        {/* Anillo de choque primario */}
        <circle
          cx="0"
          cy="40"
          r={shockRadius}
          fill="none"
          stroke="#EF4444"
          strokeWidth="16"
          strokeDasharray="40 20"
          opacity={shockOpacity}
        />
        {/* Anillo secundario caliente */}
        <circle
          cx="0"
          cy="40"
          r={shockRadius * 0.72}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="10"
          opacity={shockOpacity * 0.8}
        />
      </svg>
    </div>
  );
};

/**
 * 6. Atmósfera de calma orbital con halo y estrellas parpadeantes
 */
const OrbitalPeace: React.FC<{ frame: number }> = ({ frame }) => {
  const stars = [
    { x: 180, y: 380, s: 18, delay: 0 },
    { x: 880, y: 420, s: 22, delay: 5 },
    { x: 260, y: 780, s: 16, delay: 8 },
    { x: 820, y: 860, s: 24, delay: 3 },
    { x: 540, y: 340, s: 20, delay: 11 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Halo de luz suave */}
      <div
        className="absolute top-[520px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)",
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame / 10) * 0.05})`,
        }}
      />
      {/* Estrellas brillantes animadas */}
      {stars.map((star, i) => {
        const starScale =
          0.8 + Math.sin((frame + star.delay * 8) / 6) * 0.35;
        return (
          <div
            key={i}
            className="absolute flex items-center justify-center"
            style={{
              top: star.y,
              left: star.x,
              transform: `scale(${starScale})`,
            }}
          >
            <svg width={star.s * 2} height={star.s * 2} viewBox="-20 -20 40 40">
              <polygon
                points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5"
                fill="#FACC15"
                stroke="#000000"
                strokeWidth="3"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

/**
 * 7. Viñeta de peligro con franjas diagonales de advertencia neo-brutalistas
 */
const DangerVignette: React.FC<{ frame: number }> = ({ frame }) => {
  const offset = (frame * 6) % 40;

  return (
    <div className="absolute inset-x-0 top-0 h-8 pointer-events-none z-40 overflow-hidden border-b-4 border-black">
      <div
        className="w-[120%] h-full -ml-8"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #EF4444, #EF4444 20px, #000000 20px, #000000 40px)",
          transform: `translateX(${offset}px)`,
        }}
      />
    </div>
  );
};

const SparksExplosion: React.FC<{
  elemento?: ElementoNarrativo;
  frame: number;
}> = ({ elemento, frame }) => {
  const cycle = frame % 30;
  if (cycle > 22) return null;

  const count = 18;
  const burstOpacity = interpolate(cycle, [0, 5, 22], [1, 0.9, 0], {
    extrapolateRight: "clamp",
  });
  const cx = 540 + (elemento?.x ?? 0);
  const cy = 960 + (elemento?.y ?? 40);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        <g transform={`translate(${cx}, ${cy})`}>
          <circle cx="0" cy="0" r={cycle * 7} fill="#FFE600" opacity={burstOpacity * 0.5} />
          <circle cx="0" cy="0" r={cycle * 3.5} fill="#FFFFFF" opacity={burstOpacity} />
          {Array.from({ length: count }).map((_, i) => {
            const angle = (i * (360 / count)) * (Math.PI / 180);
            const speed = 12 + ((i * 7) % 15);
            const dist = cycle * speed;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            const sparkLength = 10 + (i % 8);
            const color = i % 2 === 0 ? "#FFE600" : "#F97316";

            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={x + Math.cos(angle) * sparkLength}
                y2={y + Math.sin(angle) * sparkLength}
                stroke={color}
                strokeWidth={4}
                strokeLinecap="round"
                opacity={burstOpacity}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

const SteamVent: React.FC<{ elemento?: ElementoNarrativo; frame: number }> = ({
  elemento,
  frame,
}) => {
  const puffs = 10;
  const baseX = 540 + (elemento?.x ?? 0);
  const baseY = 960 + (elemento?.y ?? 140);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: puffs }).map((_, i) => {
        const offsetFrame = (frame + i * 16) % 110;
        const progress = offsetFrame / 110;
        const y = baseY - progress * 340;
        const x = baseX + Math.sin(progress * 4 + i) * 35 + ((i % 5) - 2) * 28;
        const radius = 16 + progress * 44;
        const opacity = Math.sin(progress * Math.PI) * 0.32;

        return (
          <div
            key={i}
            className="absolute rounded-full bg-white blur-sm border border-slate-200"
            style={{
              left: x,
              top: y,
              width: radius * 2,
              height: radius * 2,
              opacity,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
};

const ChemicalBubbles: React.FC<{
  elemento?: ElementoNarrativo;
  frame: number;
}> = ({ elemento, frame }) => {
  const bubbleCount = 14;
  const baseX = 540 + (elemento?.x ?? 0);
  const baseY = 960 + (elemento?.y ?? 180);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: bubbleCount }).map((_, i) => {
        const offset = (frame * 3 + i * 35) % 450;
        const progress = offset / 450;
        const y = baseY - progress * 320;
        const x = baseX - 90 + ((i * 29) % 180) + Math.sin(frame / 7 + i) * 14;
        const size = 10 + ((i * 5) % 16);
        const color = elemento?.color ?? (i % 2 === 0 ? "#10B981" : "#047857");
        const opacity = (1 - progress) * 0.75;

        return (
          <div
            key={i}
            className="absolute rounded-full border-2 border-black flex items-center justify-center"
            style={{
              left: x,
              top: y,
              width: size,
              height: size,
              backgroundColor: color,
              opacity,
              boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="rounded-full bg-white"
              style={{
                width: size * 0.3,
                height: size * 0.3,
                transform: "translate(-25%, -25%)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
