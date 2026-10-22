import React, { useEffect, useMemo } from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AnimacionEntradaStickman,
  OrientacionStickman,
  PalabraTiming,
  Pose,
  StickmanPropsAttachment,
} from "../types";
import { EfectoAmbienteFestivo } from "../stickman/festiveLibrary";
import {
  buildDynamicStickmanSvgString,
  buildStickmanSvgString,
  resolveStickmanConfig,
} from "../stickman/composites";
import { obtenerRecursoPorId } from "../stickman/catalog";

export interface StickmanProps {
  /** Propiedad clásica compatible ('normal' | 'pensando' | 'sorprendido' | 'explicando') */
  pose?: Pose;
  /** Identificador del catálogo de poses o poses compuestas */
  poseId?: string;
  /** Identificador de expresión facial (ej. 'laugh', 'worried', 'eureka') */
  expresion?: string;
  /** Prop único opcional */
  prop?: string;
  /** Props asignados por ranura (derecha, izquierda, arriba, sombrero, cara, cuello, cintura) */
  props?: StickmanPropsAttachment;
  /** Efecto decorativo de ambiente opcional ('confeti', 'nieve', 'fuegos_artificiales', etc.) */
  efectoAmbiente?: EfectoAmbienteFestivo;
  /** Orientación del personaje ('derecha' por defecto, 'izquierda' invierte en X) */
  orientacion?: OrientacionStickman;
  /** Factor de escala (1 por defecto) */
  escala?: number;
  /** Ajuste de posición en píxeles */
  posicion?: { x?: number; y?: number };
  /** Animación determinista de entrada */
  animacionEntrada?: AnimacionEntradaStickman;
  /** Sincronía labial opcional con el audio de la escena */
  palabras?: PalabraTiming[];
  /** Inclinación o cabeceo de cabeza procedural */
  headTiltOffset?: number;
  /** Vibración o temblor horizontal procedural adicional */
  vibrationOffset?: number;
  /** Forzar si el personaje está hablando o en silencio */
  overrideIsSpeaking?: boolean;
  /** Halo blanco nítido para contrastar sobre escenarios oscuros (abismo, espacio, noche) */
  halo?: boolean;
}

const ALERT_KEYWORDS = [
  "sorprendido",
  "shock",
  "shocked",
  "scared",
  "fear",
  "trembling",
  "hiding",
  "danger",
  "warning",
  "backing_away",
  "tripping",
  "explosion",
  "worried",
  "surprised",
  "alert",
];

export const Stickman: React.FC<StickmanProps> = ({
  pose,
  poseId,
  expresion,
  prop,
  props,
  efectoAmbiente,
  orientacion = "derecha",
  escala = 1,
  posicion,
  animacionEntrada = "rebote",
  palabras,
  headTiltOffset = 0,
  vibrationOffset = 0,
  overrideIsSpeaking,
  halo = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const targetPoseKey = poseId || pose || "normal";

  // Detección determinista de si el personaje está hablando activamente
  const currentTimeMs = (frame / fps) * 1000;
  const isSpeaking = useMemo(() => {
    if (overrideIsSpeaking !== undefined) {
      return overrideIsSpeaking;
    }
    if (!palabras || palabras.length === 0) {
      return frame > 4;
    }
    return palabras.some(
      (p) => currentTimeMs >= p.inicioMs && currentTimeMs <= p.finMs + 60
    );
  }, [overrideIsSpeaking, palabras, currentTimeMs, frame]);

  const resolved = useMemo(
    () =>
      resolveStickmanConfig({
        poseId: targetPoseKey,
        expressionId: expresion,
        rightProp: props?.derecha ?? prop,
        leftProp: props?.izquierda,
        overheadProp: props?.arriba,
        hatProp: props?.sombrero,
        faceProp: props?.cara,
        neckProp: props?.cuello,
        waistProp: props?.cintura,
        efectoAmbiente,
      }),
    [
      targetPoseKey,
      expresion,
      prop,
      props?.derecha,
      props?.izquierda,
      props?.arriba,
      props?.sombrero,
      props?.cara,
      props?.cuello,
      props?.cintura,
      efectoAmbiente,
    ]
  );

  useEffect(() => {
    if (resolved.usedFallback && resolved.warningMessage) {
      console.warn(resolved.warningMessage);
    }
  }, [resolved.usedFallback, resolved.warningMessage]);

  const catalogItem = useMemo(
    () => obtenerRecursoPorId(targetPoseKey),
    [targetPoseKey]
  );

  // Animación determinista de entrada
  const entranceProgress = spring({
    frame,
    fps,
    config: {
      damping: 10,
      stiffness: 170,
      mass: 0.7,
    },
  });

  let animTranslateX = 0;
  let animTranslateY = 0;
  let animScaleX = 1;
  let animScaleY = 1;

  if (animacionEntrada === "rebote") {
    animTranslateY = interpolate(entranceProgress, [0, 1], [45, 0]);
    animScaleY = interpolate(entranceProgress, [0, 0.6, 1], [0.85, 1.06, 1]);
    animScaleX = interpolate(entranceProgress, [0, 0.6, 1], [1.12, 0.96, 1]);
  } else if (animacionEntrada === "zoom") {
    animScaleX = interpolate(entranceProgress, [0, 1], [0.2, 1]);
    animScaleY = interpolate(entranceProgress, [0, 1], [0.2, 1]);
  } else if (animacionEntrada === "deslizar") {
    animTranslateX = interpolate(entranceProgress, [0, 1], [-160, 0]);
  }

  // 1. Vida Continua: Animación de respiración determinista (Math.sin(frame / 8))
  const breathCycle = Math.sin(frame / 8);
  const breathTranslateY = -breathCycle * 3.5;
  const breathScaleY = 1 + breathCycle * 0.022;

  // 2. Vibración rápida en primeros 20 frames si la pose o expresión es de alerta/sorpresa/peligro
  const isAlertPose = ALERT_KEYWORDS.some(
    (k) =>
      targetPoseKey.toLowerCase().includes(k) ||
      (expresion && expresion.toLowerCase().includes(k))
  );

  let vibrationX = 0;
  if (isAlertPose && frame < 20) {
    const vibrationDecay = interpolate(frame, [0, 20], [1, 0], {
      extrapolateRight: "clamp",
    });
    // Vibración horizontal rápida de alta frecuencia
    vibrationX = Math.sin(frame * 1.8) * 8 * vibrationDecay;
  }

  const flipMultiplier = orientacion === "izquierda" ? -1 : 1;
  const finalTranslateX =
    (posicion?.x ?? 0) + animTranslateX + vibrationX + vibrationOffset;
  const finalTranslateY =
    (posicion?.y ?? 0) + animTranslateY + breathTranslateY;
  const finalScaleX = animScaleX * escala * flipMultiplier;
  const finalScaleY = animScaleY * escala * breathScaleY;

  const svgMarkup = useMemo(
    () =>
      buildDynamicStickmanSvgString({
        poseId: targetPoseKey,
        expressionId: expresion,
        rightProp: props?.derecha ?? prop,
        leftProp: props?.izquierda,
        overheadProp: props?.arriba,
        hatProp: props?.sombrero,
        faceProp: props?.cara,
        neckProp: props?.cuello,
        waistProp: props?.cintura,
        efectoAmbiente,
        frame,
        fps,
        isSpeaking,
        headTiltOffset,
      }),
    [
      targetPoseKey,
      expresion,
      prop,
      props?.derecha,
      props?.izquierda,
      props?.arriba,
      props?.sombrero,
      props?.cara,
      props?.cuello,
      props?.cintura,
      efectoAmbiente,
      frame,
      fps,
      isSpeaking,
      headTiltOffset,
    ]
  );

  const usePngFile = catalogItem?.formato === "png";

  return (
    <div
      className="flex items-center justify-center select-none"
      style={{
        width: 500 * escala,
        height: 620 * escala,
        transform: `translate(${finalTranslateX}px, ${finalTranslateY}px)`,
      }}
    >
      <div
        style={{
          width: 500,
          height: 620,
          transform: `scale(${finalScaleX}, ${finalScaleY})`,
          transformOrigin: "center bottom",
          flexShrink: 0,
          filter: halo
            ? "drop-shadow(0px 0px 4px #FFFFFF) drop-shadow(0px 0px 2px #FFFFFF)"
            : undefined,
        }}
      >
        {usePngFile && catalogItem ? (
          <Img
            src={staticFile(catalogItem.ruta)}
            style={{
              height: 620,
              width: 500,
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{ width: 500, height: 620 }}
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        )}
      </div>
    </div>
  );
};
