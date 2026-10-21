import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TipoComposicionVisual, TipoTransicion } from "../types";

export interface CameraRigProps {
  children: React.ReactNode;
  transicion?: TipoTransicion;
  efectosCamara?: ("shake" | "punch" | "drift")[];
  composicionVisual?: TipoComposicionVisual;
  impactFrame?: number;
  durationInFrames: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  transicion = "zoom_in",
  efectosCamara = ["drift"],
  composicionVisual = "minimalista",
  impactFrame,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Escala base según tipo de encuadre y composición visual
  let baseCompositionScale = 1.0;
  let baseCompositionOffsetY = 0;

  if (composicionVisual === "primer_plano") {
    // Zoom pronunciado al 142% enfocado en expresiones y torso
    baseCompositionScale = 1.42;
    baseCompositionOffsetY = 80;
  } else if (composicionVisual === "plano_general") {
    // Encuadre amplio para mostrar contexto y distancia entre personajes
    baseCompositionScale = 0.95;
    baseCompositionOffsetY = -20;
  }

  // 2. Micro-zoom cinematográfico continuo (push-in suave)
  const isDrift = efectosCamara.includes("drift");
  const pushInScale = isDrift
    ? interpolate(frame, [0, Math.max(1, durationInFrames)], [1.0, 1.038], {
        extrapolateRight: "clamp",
      })
    : 1.0;

  // 2. Transición de entrada determinista
  let transX = 0;
  let transY = 0;
  let transScale = 1;
  let flashOpacity = 0;

  const transitionSpring = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 180,
      mass: 0.6,
    },
  });

  if (transicion === "zoom_in") {
    transScale = interpolate(transitionSpring, [0, 1], [1.14, 1.0]);
  } else if (transicion === "whip_right") {
    transX = interpolate(transitionSpring, [0, 1], [140, 0]);
  } else if (transicion === "whip_left") {
    transX = interpolate(transitionSpring, [0, 1], [-140, 0]);
  } else if (transicion === "flash") {
    flashOpacity = interpolate(frame, [0, 6], [0.65, 0], {
      extrapolateRight: "clamp",
    });
  }

  // 3. Trauma Shake cinemático (impactos, peligro, frenado brusco o momento de contacto)
  let shakeX = 0;
  let shakeY = 0;
  let shakeRotate = 0;

  const hasImpactShake =
    impactFrame !== undefined && frame >= impactFrame && frame < impactFrame + 20;

  if (efectosCamara.includes("shake") || hasImpactShake) {
    const activeFrame = hasImpactShake ? frame - impactFrame : frame;
    const shakeDuration = 22;
    if (activeFrame < shakeDuration && activeFrame >= 0) {
      const shakeDecay = interpolate(activeFrame, [0, shakeDuration], [1, 0], {
        extrapolateRight: "clamp",
      });
      // Amplitud de vibración pseudo-aleatoria pero 100% determinista
      shakeX = Math.sin(activeFrame * 2.3) * 18 * shakeDecay;
      shakeY = Math.cos(activeFrame * 1.9) * 14 * shakeDecay;
      shakeRotate = Math.sin(activeFrame * 1.5) * 1.8 * shakeDecay;
    }
  }

  // 4. Punch zoom rápido
  let punchScale = 1;
  const hasImpactPunch =
    impactFrame !== undefined && frame >= impactFrame && frame < impactFrame + 14;

  if (efectosCamara.includes("punch") || hasImpactPunch) {
    const activeFrame = hasImpactPunch ? frame - impactFrame : frame;
    punchScale = interpolate(
      activeFrame,
      [0, 3, 14],
      [1.0, 1.08, 1.0],
      { extrapolateRight: "clamp" }
    );
  }

  const finalScale = baseCompositionScale * pushInScale * transScale * punchScale;
  const finalX = transX + shakeX;
  const finalY = transY + shakeY + baseCompositionOffsetY;

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        transform: `translate3d(${finalX}px, ${finalY}px, 0px) scale(${finalScale}) rotate(${shakeRotate}deg)`,
        transformOrigin: "center center",
      }}
    >
      {children}

      {/* Capa de destello blanco para transición 'flash' */}
      {flashOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none z-50 bg-white"
          style={{ opacity: flashOpacity }}
        />
      )}
    </div>
  );
};
