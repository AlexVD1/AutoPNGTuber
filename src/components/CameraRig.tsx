import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FocoCamaraKeyframe,
  PalabraTiming,
  PlanoCamara,
  TipoComposicionVisual,
  TipoTransicion,
} from "../types";
import {
  getEasingFunction,
  resolveTimeRangeFrames,
} from "../stickman/actionSequences";

export interface EvaluatedCameraShot {
  offsetX: number;
  offsetY: number;
  scale: number;
  blurFondo: number;
  activePlano?: PlanoCamara;
  planoLocalFrame: number;
  planoDurationFrames: number;
}

export function evaluateActiveCameraShot(
  planos: PlanoCamara[] | undefined,
  focoCamara: FocoCamaraKeyframe[] | undefined,
  frame: number,
  durationInFrames: number,
  fps: number,
  palabras?: PalabraTiming[]
): EvaluatedCameraShot {
  // 1. Prioridad a micro-planos cinemáticos (corte/snap rápido de 5 frames)
  if (planos && planos.length > 0) {
    for (const plano of planos) {
      const { startFrame, endFrame } = resolveTimeRangeFrames(
        plano,
        durationInFrames,
        fps,
        palabras
      );
      if (frame >= startFrame && frame <= endFrame) {
        const snap = interpolate(
          frame,
          [startFrame, startFrame + 5],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        let defaultZoom = 1.0;
        let defaultBlur = 0;
        if (plano.tipo === "primer_plano") {
          defaultZoom = 1.38;
          defaultBlur = 6.0;
        } else if (plano.tipo === "sobre_hombro") {
          defaultZoom = 1.28;
          defaultBlur = 4.5;
        } else if (plano.tipo === "plano_medio") {
          defaultZoom = 1.18;
          defaultBlur = 2.2;
        } else if (plano.tipo === "detalle_mano") {
          defaultZoom = 1.26;
          defaultBlur = 7.5;
        }

        const targetZoom = plano.zoom ?? defaultZoom;
        const targetBlur = plano.blurFondo ?? defaultBlur;
        const targetX = -(plano.x ?? 0) * 0.45;
        const targetY = -(plano.y ?? 0) * 0.45;

        return {
          offsetX: targetX * snap,
          offsetY: targetY * snap,
          scale: 1 + (targetZoom - 1) * snap,
          blurFondo: targetBlur * snap,
          activePlano: plano,
          planoLocalFrame: frame - startFrame,
          planoDurationFrames: Math.max(1, endFrame - startFrame),
        };
      }
    }
  }

  // 2. Fallback / seguimiento continuo mediante focoCamara
  let focusOffsetX = 0;
  let focusOffsetY = 0;
  let focusScale = 1.0;

  if (focoCamara && focoCamara.length > 0) {
    let prevX = 0;
    let prevY = 0;
    let prevScale = 1.0;

    for (const kf of focoCamara) {
      const { startFrame, endFrame } = resolveTimeRangeFrames(
        kf,
        durationInFrames,
        fps,
        palabras
      );
      const targetX = -kf.x * 0.42;
      const targetY = -kf.y * 0.42;
      const targetScale = kf.escala ?? 1.0;

      if (frame >= startFrame && frame <= endFrame) {
        const p =
          endFrame > startFrame
            ? Math.min(1, Math.max(0, (frame - startFrame) / (endFrame - startFrame)))
            : 1;
        const eased = getEasingFunction(kf.curva ?? "suave")(p);
        focusOffsetX = interpolate(eased, [0, 1], [prevX, targetX]);
        focusOffsetY = interpolate(eased, [0, 1], [prevY, targetY]);
        focusScale = interpolate(eased, [0, 1], [prevScale, targetScale]);
        break;
      } else if (frame > endFrame) {
        prevX = targetX;
        prevY = targetY;
        prevScale = targetScale;
        focusOffsetX = targetX;
        focusOffsetY = targetY;
        focusScale = targetScale;
      }
    }
  }

  const autoBlur = interpolate(
    focusScale,
    [1.16, 1.38],
    [0, 4.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    offsetX: focusOffsetX,
    offsetY: focusOffsetY,
    scale: focusScale,
    blurFondo: autoBlur,
    activePlano: undefined,
    planoLocalFrame: 0,
    planoDurationFrames: durationInFrames,
  };
}

export interface CameraRigProps {
  children: React.ReactNode;
  transicion?: TipoTransicion;
  efectosCamara?: ("shake" | "punch" | "drift" | "pan_left" | "pan_right")[];
  focoCamara?: FocoCamaraKeyframe[];
  planos?: PlanoCamara[];
  palabras?: PalabraTiming[];
  composicionVisual?: TipoComposicionVisual;
  impactFrame?: number;
  durationInFrames: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  transicion = "zoom_in",
  efectosCamara = ["drift"],
  focoCamara,
  planos,
  palabras,
  composicionVisual = "minimalista",
  impactFrame,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Escala y encuadre base según la composición visual de la escena (9:16)
  let baseCompositionScale = 1.0;
  let baseCompositionOffsetY = 0;

  if (composicionVisual === "primer_plano") {
    baseCompositionScale = 1.24;
    baseCompositionOffsetY = 90;
  } else if (composicionVisual === "plano_medio") {
    baseCompositionScale = 1.12;
    baseCompositionOffsetY = 30;
  } else if (composicionVisual === "plano_general") {
    baseCompositionScale = 1.0;
    baseCompositionOffsetY = 0;
  }

  // 1b. Seguimiento de micro-planos cinemáticos y foco narrativo
  const shot = evaluateActiveCameraShot(
    planos,
    focoCamara,
    frame,
    durationInFrames,
    fps,
    palabras
  );
  const focusOffsetX = shot.offsetX;
  const focusOffsetY = shot.offsetY;
  const focusScale = shot.scale;

  // 2. Micro-zoom suave (push-in) a lo largo de la escena para mantener dinamismo
  const isDrift = efectosCamara.includes("drift");
  const pushInScale = isDrift
    ? interpolate(frame, [0, Math.max(1, durationInFrames)], [1.0, 1.045], {
        extrapolateRight: "clamp",
      })
    : 1.0;

  // 3. Paneo horizontal opcional
  let panX = 0;
  if (efectosCamara.includes("pan_right")) {
    panX = interpolate(frame, [0, Math.max(1, durationInFrames)], [-45, 45], {
      extrapolateRight: "clamp",
    });
  } else if (efectosCamara.includes("pan_left")) {
    panX = interpolate(frame, [0, Math.max(1, durationInFrames)], [45, -45], {
      extrapolateRight: "clamp",
    });
  }

  // 4. Transición de entrada
  let transX = 0;
  let transScale = 1;
  let flashOpacity = 0;
  let fadeBlackOpacity = 0;

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
    transScale = interpolate(transitionSpring, [0, 1], [1.18, 1.0]);
  } else if (transicion === "whip_right") {
    transX = interpolate(transitionSpring, [0, 1], [320, 0]);
  } else if (transicion === "whip_left") {
    transX = interpolate(transitionSpring, [0, 1], [-320, 0]);
  } else if (transicion === "flash") {
    flashOpacity = interpolate(frame, [0, 8], [0.85, 0], {
      extrapolateRight: "clamp",
    });
  } else if (transicion === "fundido_negro") {
    fadeBlackOpacity = interpolate(frame, [0, 10], [1.0, 0], {
      extrapolateRight: "clamp",
    });
  }

  // 5. Trauma Shake cinemático (alerta o colisión de contacto)
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
      shakeX = Math.sin(activeFrame * 2.5) * 18 * shakeDecay;
      shakeY = Math.cos(activeFrame * 2.1) * 14 * shakeDecay;
      shakeRotate = Math.sin(activeFrame * 1.8) * 1.8 * shakeDecay;
    }
  }

  // 6. Punch zoom inicial (golpe de impacto en los primeros 15 frames)
  let punchScale = 1.0;
  if (efectosCamara.includes("punch") && frame < 15) {
    const punchProgress = interpolate(frame, [0, 15], [1, 0], {
      extrapolateRight: "clamp",
    });
    punchScale = 1.0 + 0.1 * punchProgress;
  }

  const rawScale =
    baseCompositionScale * pushInScale * transScale * punchScale * focusScale;
  const finalScale = Math.max(1.0, rawScale);
  const finalX = transX + shakeX + panX + focusOffsetX;
  const finalY = baseCompositionOffsetY + shakeY + focusOffsetY;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div
        className="w-full h-full"
        style={{
          transform: `translate(${finalX}px, ${finalY}px) rotate(${shakeRotate}deg) scale(${finalScale})`,
          transformOrigin: "center 52%",
          willChange: "transform",
        }}
      >
        {children}
      </div>

      {/* Overlay de flash blanco de transición si aplica */}
      {flashOpacity > 0 && (
        <div
          className="absolute inset-0 bg-white pointer-events-none z-50"
          style={{ opacity: flashOpacity }}
        />
      )}

      {/* Overlay de fundido a negro */}
      {fadeBlackOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black pointer-events-none z-50"
          style={{ opacity: fadeBlackOpacity }}
        />
      )}
    </div>
  );
};
