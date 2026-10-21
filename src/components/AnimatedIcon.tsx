import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as LucideIcons from "lucide-react";

/**
 * Registro explícito de iconos principales y fallbacks conocidos.
 */
export const ICON_REGISTRY: Record<
  string,
  React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>
> = {
  Sparkles: LucideIcons.Sparkles,
  Scale: LucideIcons.Scale,
  ArrowDownCircle: LucideIcons.ArrowDownCircle,
  Zap: LucideIcons.Zap,
  Flame: LucideIcons.Flame,
  Skull: LucideIcons.Skull,
  HelpCircle: LucideIcons.HelpCircle,
};

interface AnimatedIconProps {
  icono: string;
  colorIcono: string;
  tituloVisual: string;
  compacto?: boolean;
}

/**
 * Convierte un color HEX (ej. #3B82F6) a formato RGBA con la opacidad indicada.
 */
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(59, 130, 246, ${alpha})`;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icono,
  colorIcono,
  tituloVisual,
  compacto = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring de entrada de la tarjeta
  const cardSpring = spring({
    frame,
    fps,
    config: {
      damping: 11,
      stiffness: 150,
      mass: 0.8,
    },
  });

  const cardScale = interpolate(cardSpring, [0, 1], [0.82, 1]);
  const cardRotate = interpolate(cardSpring, [0, 1], [-4, 0]);

  // Movimiento continuo del ícono: flotación vertical y rotación oscilante
  const iconFloatY = Math.sin(frame / 10) * (compacto ? 4 : 8);
  const iconOscillateRotate = Math.sin(frame / 14) * 3.5;
  const initialRotate = interpolate(cardSpring, [0, 1], [-12, 0]);

  const IconComponent =
    ICON_REGISTRY[icono] ??
    (
      LucideIcons as unknown as Record<
        string,
        React.ComponentType<{
          size?: number;
          color?: string;
          strokeWidth?: number;
        }>
      >
    )[icono] ??
    LucideIcons.HelpCircle;

  const bgTint = hexToRgba(colorIcono, 0.1);

  if (compacto) {
    return (
      <div className="w-full flex items-center justify-center pt-8 px-8 z-30">
        <div
          className="flex items-center gap-4 py-3 px-6 rounded-2xl border-4 border-black"
          style={{
            backgroundColor: "#FFFFFF",
            backgroundImage: `linear-gradient(${bgTint}, ${bgTint})`,
            boxShadow: "6px 6px 0px #000000",
            transform: `scale(${cardScale})`,
            transformOrigin: "center center",
          }}
        >
          <div
            className="flex items-center justify-center select-none"
            style={{
              transform: `translateY(${iconFloatY}px) rotate(${initialRotate + iconOscillateRotate}deg)`,
            }}
          >
            <IconComponent size={64} color={colorIcono} strokeWidth={2.8} />
          </div>
          <h2
            className="text-center uppercase font-black tracking-tight select-none"
            style={{
              fontFamily:
                "'Arial Black', 'Impact', 'Inter', system-ui, sans-serif",
              fontSize: "36px",
              lineHeight: 1.1,
              color: "#111827",
              letterSpacing: "-0.01em",
            }}
          >
            {tituloVisual}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center pt-16 px-10">
      {/* Tarjeta Neo-Brutalista Clásica */}
      <div
        className="w-full max-w-[960px] flex flex-col items-center justify-center py-8 px-10 rounded-3xl border-4 border-black"
        style={{
          backgroundColor: "#FFFFFF",
          backgroundImage: `linear-gradient(${bgTint}, ${bgTint})`,
          boxShadow: "10px 10px 0px #000000",
          transform: `scale(${cardScale}) rotate(${cardRotate}deg)`,
          transformOrigin: "center center",
        }}
      >
        {/* Contenedor del ícono con movimiento continuo suave */}
        <div
          className="flex items-center justify-center p-4 select-none"
          style={{
            transform: `translateY(${iconFloatY}px) rotate(${initialRotate + iconOscillateRotate}deg)`,
            transformOrigin: "center center",
          }}
        >
          <IconComponent
            size={220}
            color={colorIcono}
            strokeWidth={2.4}
          />
        </div>

        {/* Título visual enérgico en estilo cómic neo-brutalista */}
        <h2
          className="mt-3 text-center uppercase font-black tracking-tight select-none"
          style={{
            fontFamily:
              "'Arial Black', 'Impact', 'Inter', system-ui, sans-serif",
            fontSize: "54px",
            lineHeight: 1.15,
            color: "#111827",
            WebkitTextStroke: "2px #111827",
            letterSpacing: "-0.02em",
          }}
        >
          {tituloVisual}
        </h2>
      </div>
    </div>
  );
};
