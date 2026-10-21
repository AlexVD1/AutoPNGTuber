import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PalabraTiming } from "../types";

export interface WordSubtitlesProps {
  palabras: PalabraTiming[];
}

interface PalabraConIndice extends PalabraTiming {
  index: number;
}

function agruparEnBloques(palabras: PalabraTiming[]): PalabraConIndice[][] {
  const conIndice: PalabraConIndice[] = palabras.map((p, index) => ({
    ...p,
    index,
  }));

  const bloques: PalabraConIndice[][] = [];
  let i = 0;

  while (i < conIndice.length) {
    const restantes = conIndice.length - i;
    if (restantes === 4) {
      bloques.push(conIndice.slice(i, i + 2));
      bloques.push(conIndice.slice(i + 2, i + 4));
      break;
    } else if (restantes === 2) {
      bloques.push(conIndice.slice(i, i + 2));
      break;
    } else {
      bloques.push(conIndice.slice(i, i + 3));
      i += 3;
    }
  }

  return bloques;
}

export const WordSubtitles: React.FC<WordSubtitlesProps> = ({ palabras }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bloques = useMemo(() => agruparEnBloques(palabras), [palabras]);

  if (!palabras || palabras.length === 0) {
    return null;
  }

  const currentTimeMs = (frame / fps) * 1000;

  // Encontrar la palabra activa según su tiempo de inicio
  let activeWordIndex = 0;
  for (let i = 0; i < palabras.length; i++) {
    if (currentTimeMs >= palabras[i].inicioMs) {
      activeWordIndex = i;
    } else {
      break;
    }
  }

  const bloqueActual =
    bloques.find((b) => b.some((p) => p.index === activeWordIndex)) ??
    bloques[0];

  return (
    <div className="w-full px-8 flex items-center justify-center">
      {/* Contenedor flex flex-wrap con separación limpia para evitar solapamiento de trazos */}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-center">
        {bloqueActual.map((item) => {
          const isActive =
            item.index === activeWordIndex && currentTimeMs >= item.inicioMs;

          // Frame exacto en que arranca esta palabra para animar el spring del 'pop'
          const wordStartFrame = Math.round((item.inicioMs / 1000) * fps);
          const frameSinceStart = Math.max(0, frame - wordStartFrame);

          const popSpring = spring({
            frame: frameSinceStart,
            fps,
            config: {
              damping: 12,
              stiffness: 240,
              mass: 0.5,
            },
          });

          // Efecto de escala animado con spring para la palabra activa
          const wordScale = isActive
            ? interpolate(popSpring, [0, 1], [0.95, 1.12])
            : 1.0;

          return (
            <div
              key={item.index}
              className="inline-flex items-center justify-center px-2 py-1 select-none"
              style={{
                transform: `scale(${wordScale})`,
                transformOrigin: "center center",
              }}
            >
              <span
                className="inline-block uppercase tracking-wide select-none"
                style={{
                  fontFamily:
                    "'Arial Black', 'Impact', 'Inter', system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: "76px",
                  lineHeight: 1.1,
                  color: isActive ? "#FFE600" : "#FFFFFF",
                  WebkitTextStroke: "16px #000000",
                  paintOrder: "stroke fill",
                  textShadow: "0px 8px 0px #000000",
                }}
              >
                {item.palabra}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
