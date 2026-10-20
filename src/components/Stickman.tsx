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
  Pose,
  StickmanPropsAttachment,
} from "../types";
import { EfectoAmbienteFestivo } from "../stickman/festiveLibrary";
import {
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
}

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
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const targetPoseKey = poseId || pose || "normal";

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

  const flipMultiplier = orientacion === "izquierda" ? -1 : 1;
  const finalTranslateX = (posicion?.x ?? 0) + animTranslateX;
  const finalTranslateY = (posicion?.y ?? 0) + animTranslateY;
  const finalScaleX = animScaleX * escala * flipMultiplier;
  const finalScaleY = animScaleY * escala;

  const svgMarkup = useMemo(
    () =>
      buildStickmanSvgString({
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

  const usePngFile = catalogItem?.formato === "png";

  return (
    <div
      className="flex items-center justify-center"
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
          transformOrigin: "center center",
          flexShrink: 0,
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
