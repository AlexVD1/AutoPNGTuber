import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  staticFile,
  useVideoConfig,
} from "remotion";
import { EscenaGuion } from "../types";
import { AnimatedIcon } from "./AnimatedIcon";
import { CameraRig } from "./CameraRig";
import { NarrativeElements } from "./NarrativeElements";
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
      return true;
    }
    const normalizedTarget = targetRelativePath
      .replace(/\\/g, "/")
      .toLowerCase();
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
  const { fps } = useVideoConfig();
  const sceneDurationFrames = Math.max(
    1,
    Math.round((escena.duracionSegundos ?? 4) * fps)
  );

  // SFX inteligente: busca escena.sfx o recurre al pop.mp3 clásico
  const sfxPath = escena.sfx || "sfx/pop.mp3";
  const sfxVolume = escena.volumenSfx ?? (escena.sfx ? 0.24 : 0.18);
  const hasSfx = useMemo(() => fileExistsInStatic(sfxPath), [sfxPath]);

  // Detección de layout adaptativo según presencia de elementos narrativos
  const isNarrativeMode =
    escena.layout === "narrativo" ||
    escena.layout === "compacto" ||
    Boolean(
      escena.elementosNarrativos && escena.elementosNarrativos.length > 0
    );

  return (
    <CameraRig
      transicion={escena.transicion ?? "zoom_in"}
      efectosCamara={escena.efectosCamara ?? ["drift"]}
      durationInFrames={sceneDurationFrames}
    >
      <AbsoluteFill className="flex flex-col justify-between items-center bg-transparent">
        {/* Audio de locución de la escena (prioridad 1.0) */}
        <Audio src={staticFile(`audios/escena_${escena.id}.mp3`)} volume={1.0} />

        {/* Efecto de sonido sincronizado (prioridad subordinada 0.18 - 0.25) */}
        {hasSfx && <Audio src={staticFile(sfxPath)} volume={sfxVolume} />}

        {/* Elementos narrativos vectoriales interactivos */}
        <NarrativeElements elementos={escena.elementosNarrativos} />

        {/* Encabezado: Tarjeta compacta o clásica según el layout de la escena */}
        {isNarrativeMode ? (
          <div className="w-full flex items-center justify-center pt-4 z-30">
            <AnimatedIcon
              icono={escena.icono}
              colorIcono={escena.colorIcono}
              tituloVisual={escena.tituloVisual}
              compacto={true}
            />
          </div>
        ) : (
          <div className="w-full h-[660px] flex items-center justify-center z-10">
            <AnimatedIcon
              icono={escena.icono}
              colorIcono={escena.colorIcono}
              tituloVisual={escena.tituloVisual}
              compacto={false}
            />
          </div>
        )}

        {/* Centro: Stickman con vida continua, lip-sync y gesticulación */}
        <div
          className={`w-full flex-1 flex items-center justify-center z-20 ${
            isNarrativeMode ? "mt-4" : "-mt-8"
          }`}
        >
          <Stickman
            pose={escena.pose}
            poseId={escena.poseId}
            expresion={escena.expresion}
            prop={escena.prop}
            props={escena.props}
            efectoAmbiente={escena.efectoAmbiente}
            orientacion={escena.orientacion}
            escala={escena.escala ?? (isNarrativeMode ? 1.08 : 1.0)}
            posicion={escena.posicion}
            animacionEntrada={escena.animacionEntrada}
            palabras={escena.palabras}
          />
        </div>

        {/* Abajo: Subtítulos de alto contraste con jerarquía en palabras clave y margen seguro */}
        <div className="w-full h-[360px] flex items-center justify-center pb-24 z-30">
          <WordSubtitles
            palabras={escena.palabras ?? []}
            palabrasClave={escena.palabrasClave}
          />
        </div>
      </AbsoluteFill>
    </CameraRig>
  );
};
