import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TipoTransicion } from "../types";

export interface CameraRigProps {
  children: React.ReactNode;
  transicion?: TipoTransicion;
  efectosCamara?: ("shake" | "punch" | "drift")[];
  durationInFrames: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  transicion = "zoom_in",
  efectosCamara = ["drift"],
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Micro-zoom cinematográfico continuo (push-in suave)
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

  // 3. Trauma Shake cinemático (impactos, peligro, frenado brusco)
  let shakeX = 0;
  let shakeY = 0;
  let shakeRotate = 0;

  if (efectosCamara.includes("shake")) {
    const shakeDuration = 22;
    if (frame < shakeDuration) {
      const shakeDecay = interpolate(frame, [0, shakeDuration], [1, 0], {
        extrapolateRight: "clamp",
      });
      // Amplitud de vibración pseudo-aleatoria pero 100% determinista
      shakeX = Math.sin(frame * 2.3) * 16 * shakeDecay;
      shakeY = Math.cos(frame * 1.9) * 12 * shakeDecay;
      shakeRotate = Math.sin(frame * 1.5) * 1.6 * shakeDecay;
    }
  }

  // 4. Punch zoom rápido
  let punchScale = 1;
  if (efectosCamara.includes("punch")) {
    punchScale = interpolate(
      frame,
      [0, 4, 16],
      [1.0, 1.06, 1.0],
      { extrapolateRight: "clamp" }
    );
  }

  const finalScale = pushInScale * transScale * punchScale;
  const finalX = transX + shakeX;
  const finalY = transY + shakeY;

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
