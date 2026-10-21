import { interpolate, spring, Easing } from "remotion";
import {
  AccionPersonaje,
  OrientacionStickman,
  PasoAccion,
  PersonajeEscena,
  StickmanPropsAttachment,
  TipoCurvaMovimiento,
} from "../types";

export interface EvaluatedCharacterState {
  poseId: string;
  expresion: string;
  x: number;
  y: number;
  escala: number;
  orientacion: OrientacionStickman;
  prop?: string;
  props?: StickmanPropsAttachment;
  headTilt: number;
  /** Impulso de impacto o contacto si ocurre en este frame */
  isContactImpact: boolean;
  /** Intensidad de vibración procedural */
  vibrationX: number;
  /** Si está en ciclo de caminata activo */
  isWalking: boolean;
}

/**
 * Mapeo de curvas de aceleración para movimientos orgánicos
 */
function getEasingFunction(curva?: TipoCurvaMovimiento): (t: number) => number {
  switch (curva) {
    case "suave":
      return Easing.bezier(0.25, 0.1, 0.25, 1);
    case "anticipacion":
      return Easing.bezier(0.4, -0.2, 0.2, 1);
    case "rebote":
      return Easing.bounce;
    case "impacto":
      return Easing.bezier(0.05, 0.9, 0.2, 1);
    case "lineal":
    default:
      return Easing.linear;
  }
}

/**
 * Convierte acciones predefinidas de alto nivel en una secuencia de pasos deterministas.
 */
export function expandActionToSteps(
  accion: AccionPersonaje,
  totalFrames: number,
  initialPos: { x: number; y: number }
): PasoAccion[] {
  if (accion.pasos && accion.pasos.length > 0) {
    return accion.pasos.map((p) => {
      let startF = p.inicioFrame;
      let endF = p.finFrame;
      if (startF === undefined && p.inicioProgreso !== undefined) {
        startF = Math.round(p.inicioProgreso * totalFrames);
      }
      if (endF === undefined && p.finProgreso !== undefined) {
        endF = Math.round(p.finProgreso * totalFrames);
      }
      return {
        ...p,
        inicioFrame: startF ?? 0,
        finFrame: endF ?? totalFrames,
      };
    });
  }

  const startFrame = accion.inicioFrame ?? 0;
  const dur = accion.duracionFrames ?? totalFrames - startFrame;
  const endFrame = startFrame + dur;
  const fromX = accion.desdeX ?? initialPos.x;
  const toX = accion.haciaX ?? fromX;
  const fromY = accion.desdeY ?? initialPos.y;
  const toY = accion.haciaY ?? fromY;

  switch (accion.tipo) {
    case "caminar_hacia": {
      const walkDuration = Math.round(dur * 0.82);
      const settleDuration = dur - walkDuration;
      return [
        {
          inicioFrame: startFrame,
          finFrame: startFrame + walkDuration,
          poseId: "walking",
          expresion: "talking",
          posicion: { x: toX, y: toY },
          curva: "suave",
          procedural: "caminar",
        },
        {
          inicioFrame: startFrame + walkDuration,
          finFrame: endFrame,
          poseId: "standing_relaxed",
          expresion: "talking",
          posicion: { x: toX, y: toY },
          curva: "suave",
          procedural: "estatico",
        },
      ];
    }

    case "sonambulo_avanzar": {
      return [
        {
          inicioFrame: startFrame,
          finFrame: endFrame,
          poseId: "walking",
          expresion: "bored",
          posicion: { x: toX, y: toY },
          curva: "lineal",
          procedural: "caminar",
        },
      ];
    }

    case "acercarse_y_tocar": {
      const walkDur = Math.round(dur * 0.55);
      const reachDur = Math.round(dur * 0.25);
      const holdDur = dur - walkDur - reachDur;

      const midX = fromX + (toX - fromX) * 0.88;

      return [
        // Fase 1: Caminata hacia el objetivo
        {
          inicioFrame: startFrame,
          finFrame: startFrame + walkDur,
          poseId: "walking",
          expresion: "talking_enthusiastic",
          posicion: { x: midX, y: fromY },
          curva: "suave",
          procedural: "caminar",
        },
        // Fase 2: Extensión de brazo y toque directo
        {
          inicioFrame: startFrame + walkDur,
          finFrame: startFrame + walkDur + reachDur,
          poseId: "pointing_right",
          expresion: "smile_soft",
          posicion: { x: toX, y: toY },
          curva: "impacto",
          procedural: "recoil",
        },
        // Fase 3: Detenerse y sostener la interacción
        {
          inicioFrame: startFrame + walkDur + reachDur,
          finFrame: endFrame,
          poseId: "pointing_right",
          expresion: "talking",
          posicion: { x: toX, y: toY },
          curva: "suave",
          procedural: "estatico",
        },
      ];
    }

    case "despertar_asustado":
    case "sorpresa_y_retroceso": {
      const reactionFrame = Math.round(dur * 0.35);
      const shockDur = Math.round(dur * 0.3);
      const settleDur = dur - reactionFrame - shockDur;

      const recoilX = toX + (toX > fromX ? 80 : -80);

      return [
        // Fase 1: Estado inicial (dormido o tranquilo antes del estímulo)
        {
          inicioFrame: startFrame,
          finFrame: startFrame + reactionFrame,
          poseId: "walking",
          expresion: "bored",
          posicion: { x: fromX, y: fromY },
          curva: "lineal",
          procedural: "caminar",
        },
        // Fase 2: IMPACTO Y SOBRESALTO INMEDIATO (Retroceso brusco + temblor)
        {
          inicioFrame: startFrame + reactionFrame,
          finFrame: startFrame + reactionFrame + shockDur,
          poseId: "shock_explosion",
          expresion: "shocked",
          posicion: { x: recoilX, y: fromY - 18 },
          curva: "impacto",
          procedural: "temblar",
        },
        // Fase 3: Desorientado y confundido recuperando balance
        {
          inicioFrame: startFrame + reactionFrame + shockDur,
          finFrame: endFrame,
          poseId: "backing_away_scared",
          expresion: "confused",
          posicion: { x: recoilX, y: fromY },
          curva: "suave",
          procedural: "estatico",
        },
      ];
    }

    case "guiar_amigo": {
      return [
        {
          inicioFrame: startFrame,
          finFrame: endFrame,
          poseId: "explaining_both_hands",
          expresion: "smile_soft",
          posicion: { x: toX, y: toY },
          curva: "suave",
          procedural: "caminar",
        },
      ];
    }

    case "mirar_y_reaccionar": {
      const turnFrame = Math.round(dur * 0.4);
      return [
        {
          inicioFrame: startFrame,
          finFrame: startFrame + turnFrame,
          poseId: "standing_relaxed",
          expresion: "thinking",
          posicion: { x: fromX, y: fromY },
          curva: "suave",
          procedural: "estatico",
        },
        {
          inicioFrame: startFrame + turnFrame,
          finFrame: endFrame,
          poseId: "scratching_head",
          expresion: "confused",
          posicion: { x: toX, y: toY },
          curva: "suave",
          procedural: "estatico",
        },
      ];
    }

    case "tropezar_y_reaccionar": {
      const tripFrame = Math.round(dur * 0.4);
      return [
        {
          inicioFrame: startFrame,
          finFrame: startFrame + tripFrame,
          poseId: "walking",
          expresion: "neutral",
          posicion: { x: fromX, y: fromY },
          curva: "lineal",
          procedural: "caminar",
        },
        {
          inicioFrame: startFrame + tripFrame,
          finFrame: endFrame,
          poseId: "tripping_falling",
          expresion: "scared",
          posicion: { x: toX, y: toY + 20 },
          curva: "impacto",
          procedural: "temblar",
        },
      ];
    }

    default:
      return [
        {
          inicioFrame: startFrame,
          finFrame: endFrame,
          poseId: "standing_relaxed",
          expresion: "talking",
          posicion: { x: toX, y: toY },
          curva: "lineal",
          procedural: "estatico",
        },
      ];
  }
}

/**
 * Evalúa deterministamente el estado cinemático de un personaje en un frame exacto.
 */
export function evaluateCharacterState(
  personaje: PersonajeEscena,
  frame: number,
  fps: number,
  totalFrames: number
): EvaluatedCharacterState {
  const basePos = personaje.posicion ?? { x: 0, y: 0 };
  const baseScale = personaje.escala ?? 1;
  const baseOrientation = personaje.orientacion ?? "derecha";
  const basePose = personaje.poseId ?? "standing_relaxed";
  const baseExpr = personaje.expresion ?? "talking";

  // Si no tiene acciones definidas, generar micro-dinamismo procedural comunicativo
  if (!personaje.acciones || personaje.acciones.length === 0) {
    const isSpeaking = personaje.habla !== false;
    const communicativeTilt = isSpeaking ? Math.sin(frame / 6) * 3.5 : 0;
    const weightShiftX = Math.sin(frame / 18) * 4;

    return {
      poseId: basePose,
      expresion: baseExpr,
      x: (basePos.x ?? 0) + weightShiftX,
      y: basePos.y ?? 0,
      escala: baseScale,
      orientacion: baseOrientation,
      prop: personaje.prop,
      props: personaje.props,
      headTilt: communicativeTilt,
      isContactImpact: false,
      vibrationX: 0,
      isWalking: false,
    };
  }

  // Aplanar todos los pasos de todas las acciones del personaje
  let currentPos = { x: basePos.x ?? 0, y: basePos.y ?? 0 };
  let currentPose = basePose;
  let currentExpr = baseExpr;
  let currentScale = baseScale;
  let currentOrientation = baseOrientation;
  let currentProp = personaje.prop;
  let currentProps = personaje.props;
  let headTilt = 0;
  let isContactImpact = false;
  let vibrationX = 0;
  let isWalking = false;

  for (const accion of personaje.acciones) {
    const steps = expandActionToSteps(accion, totalFrames, currentPos);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const startF = step.inicioFrame ?? 0;
      const endF = step.finFrame ?? totalFrames;

      if (frame >= startF && frame <= endF) {
        const stepProgress =
          endF > startF ? Math.min(1, Math.max(0, (frame - startF) / (endF - startF))) : 1;

        const easing = getEasingFunction(step.curva);
        const easedProgress = easing(stepProgress);

        // Interpolación de posición si se especificó destino
        if (step.posicion) {
          const prevX = currentPos.x;
          const prevY = currentPos.y;
          const targetX = step.posicion.x ?? prevX;
          const targetY = step.posicion.y ?? prevY;
          currentPos.x = interpolate(easedProgress, [0, 1], [prevX, targetX]);
          currentPos.y = interpolate(easedProgress, [0, 1], [prevY, targetY]);
        }

        if (step.poseId) currentPose = step.poseId;
        if (step.expresion) currentExpr = step.expresion;
        if (step.escala) currentScale = step.escala;
        if (step.orientacion) currentOrientation = step.orientacion;
        if (step.prop !== undefined) currentProp = step.prop;
        if (step.props) currentProps = step.props;

        // Modificadores cinemáticos y procedimentales
        if (step.procedural === "caminar") {
          isWalking = true;
          // Rebote sinusoidal del ciclo de paso natural (bobbing en Y)
          const strideSpeed = 5.2;
          const walkBob = Math.abs(Math.sin((frame - startF) / strideSpeed)) * 11;
          currentPos.y -= walkBob;
          // Inclinación corporal rítmica
          headTilt = Math.sin((frame - startF) / strideSpeed) * 3.5;
        } else if (step.procedural === "temblar") {
          const decay = interpolate(stepProgress, [0, 1], [1, 0.1]);
          vibrationX = Math.sin(frame * 2.8) * 9 * decay;
          headTilt = Math.sin(frame * 2.2) * 5 * decay;
        } else if (step.procedural === "recoil") {
          if (frame - startF < 6) {
            isContactImpact = true;
          }
          currentPos.y += Math.sin(stepProgress * Math.PI) * -8;
        }

        break;
      } else if (frame > endF && step.posicion) {
        // Actualizar posición acumulada tras terminar el paso
        currentPos.x = step.posicion.x ?? currentPos.x;
        currentPos.y = step.posicion.y ?? currentPos.y;
        if (step.poseId) currentPose = step.poseId;
        if (step.expresion) currentExpr = step.expresion;
      }
    }
  }

  return {
    poseId: currentPose,
    expresion: currentExpr,
    x: currentPos.x,
    y: currentPos.y,
    escala: currentScale,
    orientacion: currentOrientation,
    prop: currentProp,
    props: currentProps,
    headTilt,
    isContactImpact,
    vibrationX,
    isWalking,
  };
}
