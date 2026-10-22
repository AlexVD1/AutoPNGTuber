import React from "react";
import { ObjetoEscena } from "../types";
import { findPropById } from "../stickman/composites";

export interface SceneObjectProps {
  objeto: ObjetoEscena;
  frame: number;
}

export const SceneObject: React.FC<SceneObjectProps> = ({ objeto, frame }) => {
  const propDef = findPropById(objeto.propId);

  if (!propDef) {
    return null;
  }

  const { animacion, posicion, escala = 1, rotacion = 0 } = objeto;

  let animDeltaY = 0;
  let animDeltaX = 0;
  let animScale = 1;
  let animRot = rotacion;

  if (animacion) {
    const startF = animacion.inicioFrame ?? 0;
    const endF = animacion.finFrame ?? 9999;

    if (frame >= startF && frame <= endF) {
      const relFrame = frame - startF;

      if (animacion.tipo === "flotar") {
        animDeltaY = Math.sin(relFrame / 8) * 12;
      } else if (animacion.tipo === "vibrar") {
        animDeltaX = Math.sin(relFrame * 2.5) * 6;
      } else if (animacion.tipo === "pulso") {
        animScale = 1 + Math.sin(relFrame / 6) * 0.12;
      } else if (animacion.tipo === "caer") {
        const fallDist = animacion.deltaY ?? 120;
        const t = Math.min(1, relFrame / Math.max(1, endF - startF));
        animDeltaY = t * fallDist;
        animRot += t * 15;
      }
    }
  }

  const finalX = posicion.x + animDeltaX;
  const finalY = posicion.y + animDeltaY;
  const finalScale = escala * animScale;

  return (
    <div
      className="absolute pointer-events-none select-none flex items-center justify-center"
      style={{
        left: 540 + finalX,
        top: 960 + finalY,
        width: 220,
        height: 220,
        transform: `translate(-50%, -50%) rotate(${animRot}deg) scale(${finalScale})`,
        zIndex: objeto.capaZ ?? 25,
        filter: "drop-shadow(8px 8px 0px #000000)",
      }}
    >
      <svg
        viewBox="-55 -55 110 110"
        width="220"
        height="220"
        style={{ overflow: "visible" }}
        dangerouslySetInnerHTML={{
          __html: "animatedSvg" in propDef && propDef.animatedSvg ? propDef.animatedSvg(frame) : propDef.svg,
        }}
      />
    </div>
  );
};
