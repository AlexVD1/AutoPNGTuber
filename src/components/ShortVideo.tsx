import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ShortProps } from "../types";
import { Scene } from "./Scene";

/**
 * Comprueba de forma segura si un archivo estático existe en public/ sin lanzar error.
 */
function fileExistsInStatic(targetRelativePath: string): boolean {
  try {
    const files = getStaticFiles();
    if (!files || files.length === 0) {
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

export const ShortVideo: React.FC<ShortProps> = ({ escenas }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Comprobación segura de BGM en loop
  const hasBgm = useMemo(() => fileExistsInStatic("bgm/bgm.mp3"), []);

  // Progreso general del video del 0% al 100%
  const progressRatio = Math.min(
    1,
    Math.max(0, (frame + 1) / Math.max(1, durationInFrames))
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F8FAFC",
        backgroundImage: "radial-gradient(#cbd5e1 2px, transparent 2px)",
        backgroundSize: "36px 36px",
      }}
    >
      {/* Música de fondo ambiental continua en loop */}
      {hasBgm && <Audio src={staticFile("bgm/bgm.mp3")} volume={0.07} loop />}

      {/* Barra de progreso neo-brutalista superior de 10px */}
      <div
        className="absolute top-0 left-0 right-0 z-50 overflow-hidden"
        style={{
          height: 10,
          backgroundColor: "rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            width: `${progressRatio * 100}%`,
            height: 10,
            backgroundColor: "#FFE600",
            borderBottom: "2px solid #000000",
            borderRight: "2px solid #000000",
          }}
        />
      </div>

      {/* Secuencia cronológica de escenas */}
      <Series>
        {escenas.map((escena) => {
          const durationFrames = Math.max(
            1,
            Math.round((escena.duracionSegundos ?? 4) * fps)
          );

          return (
            <Series.Sequence
              key={escena.id}
              durationInFrames={durationFrames}
            >
              <Scene escena={escena} />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
