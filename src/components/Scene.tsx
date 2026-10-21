import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  staticFile,
} from "remotion";
import { EscenaGuion } from "../types";
import { AnimatedIcon } from "./AnimatedIcon";
import { Stickman } from "./Stickman";
import { WordSubtitles } from "./WordSubtitles";

interface SceneProps {
  escena: EscenaGuion;
}

/**
 * Comprueba de forma segura si un archivo estático existe en public/ sin lanzar error.
 */
function fileExistsInStatic(targetRelativePath: string): boolean {
  try {
    const files = getStaticFiles();
    if (!files || files.length === 0) {
      // Durante compilaciones fuera del navegador o si no hay lista estática
      return true;
    }
    const normalizedTarget = targetRelativePath.replace(/\\/g, "/").toLowerCase();
    return files.some((f) => {
      const name = (f.name || "").replace(/\\/g, "/").toLowerCase();
      const src = (f.src || "").replace(/\\/g, "/").toLowerCase();
      return name.endsWith(normalizedTarget) || src.includes(normalizedTarget);
    });
  } catch {
    return false;
  }
}

export const Scene: React.FC<SceneProps> = ({ escena }) => {
  // Comprobación segura de SFX pop.mp3 al inicio de cada escena
  const hasPopSfx = useMemo(() => fileExistsInStatic("sfx/pop.mp3"), []);

  return (
    <AbsoluteFill className="flex flex-col justify-between items-center bg-transparent">
      {/* Audio de locución de la escena */}
      <Audio src={staticFile(`audios/escena_${escena.id}.mp3`)} />

      {/* Efecto de sonido opcional al inicio de la escena */}
      {hasPopSfx && <Audio src={staticFile("sfx/pop.mp3")} volume={0.3} />}

      {/* Mitad superior: Tarjeta Neo-Brutalista con Ícono animado continuo y título */}
      <div className="w-full h-[740px] flex items-center justify-center">
        <AnimatedIcon
          icono={escena.icono}
          colorIcono={escena.colorIcono}
          tituloVisual={escena.tituloVisual}
        />
      </div>

      {/* Centro: Stickman con vida continua (respiración y reacción de alerta) */}
      <div className="w-full flex-1 flex items-center justify-center -mt-6">
        <Stickman
          pose={escena.pose}
          poseId={escena.poseId}
          expresion={escena.expresion}
          prop={escena.prop}
          props={escena.props}
          efectoAmbiente={escena.efectoAmbiente}
          orientacion={escena.orientacion}
          escala={escena.escala}
          posicion={escena.posicion}
          animacionEntrada={escena.animacionEntrada}
        />
      </div>

      {/* Abajo: Subtítulos dinámicos con bloques independientes y pop spring */}
      <div className="w-full h-[400px] flex items-center justify-center pb-16">
        <WordSubtitles palabras={escena.palabras ?? []} />
      </div>
    </AbsoluteFill>
  );
};
