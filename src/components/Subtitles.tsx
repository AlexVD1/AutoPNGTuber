import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { PalabraTiming } from "../types";

interface SubtitlesProps {
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

export const Subtitles: React.FC<SubtitlesProps> = ({ palabras }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bloques = useMemo(() => agruparEnBloques(palabras), [palabras]);

  if (!palabras || palabras.length === 0) {
    return null;
  }

  const currentTimeMs = (frame / fps) * 1000;

  // Encontrar la palabra actual según inicioMs
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
    <div className="w-full px-10 flex items-center justify-center">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
        {bloqueActual.map((item) => {
          const isActive =
            item.index === activeWordIndex && currentTimeMs >= item.inicioMs;

          return (
            <span
              key={item.index}
              className="inline-block uppercase tracking-wide select-none"
              style={{
                fontFamily:
                  "'Arial Black', 'Impact', 'Inter', system-ui, sans-serif",
                fontWeight: 900,
                fontSize: "78px",
                lineHeight: 1.1,
                color: isActive ? "#FFE600" : "#FFFFFF",
                WebkitTextStroke: "18px #000000",
                paintOrder: "stroke fill",
                textShadow: "0px 8px 0px #000000",
                transform: isActive ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.06s ease-out",
              }}
            >
              {item.palabra}
            </span>
          );
        })}
      </div>
    </div>
  );
};
