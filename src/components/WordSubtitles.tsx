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
  palabrasClave?: string[];
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

export const WordSubtitles: React.FC<WordSubtitlesProps> = ({
  palabras,
  palabrasClave = [],
}) => {
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
      {/* Contenedor flex con espaciado generoso para evitar solapamiento entre palabras */}
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-center">
        {bloqueActual.map((item) => {
          const isActive =
            item.index === activeWordIndex && currentTimeMs >= item.inicioMs;

          // Limpiar signos para identificar si es número o palabra clave
          const cleanWord = item.palabra
            .replace(/[¿?¡!.,;:()"'«»]/g, "")
            .trim()
            .toLowerCase();
          const isNumeric = /\d/.test(item.palabra);
          const isKeyConcept =
            isNumeric ||
            palabrasClave.some((k) => k.toLowerCase() === cleanWord);

          // Frame exacto en que arranca esta palabra para animar el spring del 'pop'
          const wordStartFrame = Math.round((item.inicioMs / 1000) * fps);
          const frameSinceStart = Math.max(0, frame - wordStartFrame);

          const popSpring = spring({
            frame: frameSinceStart,
            fps,
            config: {
              damping: 12,
              stiffness: 260,
              mass: 0.5,
            },
          });

          // Efecto de escala animado con spring para la palabra activa
          const wordScale = isActive
            ? interpolate(popSpring, [0, 1], [0.94, isKeyConcept ? 1.16 : 1.1])
            : 1.0;

          // Color y jerarquía
          let textColor = "#FFFFFF";
          if (isActive) {
            textColor = isNumeric ? "#00F0FF" : "#FFE600";
          } else if (isKeyConcept) {
            textColor = "#E2E8F0";
          }

          return (
            <div
              key={item.index}
              className="inline-flex items-center justify-center px-3 py-1 select-none"
              style={{
                transform: `scale(${wordScale})`,
                transformOrigin: "center center",
              }}
            >
              <span
                className="inline-block uppercase tracking-wider select-none"
                style={{
                  fontFamily:
                    "'Arial Black', 'Impact', 'Inter', system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: isNumeric ? "78px" : "74px",
                  lineHeight: 1.15,
                  letterSpacing: "0.025em",
                  color: textColor,
                  WebkitTextStroke: isActive ? "9px #000000" : "8px #000000",
                  paintOrder: "stroke fill",
                  textShadow: isActive
                    ? "6px 6px 0px #000000, -2px -2px 0px #000000, 2px -2px 0px #000000, -2px 2px 0px #000000"
                    : "4px 4px 0px #000000, -2px -2px 0px #000000, 2px -2px 0px #000000, -2px 2px 0px #000000",
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
