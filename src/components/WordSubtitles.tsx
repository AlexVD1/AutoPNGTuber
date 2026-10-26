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

  // Bloques de hasta 3 palabras y ~20 caracteres: con fontSize 74px caben en 2 líneas
  // dentro de la zona segura (tres palabras largas se partían en 3 líneas y se desbordaban).
  const MAX_PALABRAS = 3;
  const MAX_CARACTERES = 20;
  const bloques: PalabraConIndice[][] = [];
  let actual: PalabraConIndice[] = [];
  let caracteres = 0;

  for (const p of conIndice) {
    if (
      actual.length > 0 &&
      (actual.length >= MAX_PALABRAS || caracteres + p.palabra.length > MAX_CARACTERES)
    ) {
      bloques.push(actual);
      actual = [];
      caracteres = 0;
    }
    actual.push(p);
    caracteres += p.palabra.length;
  }
  if (actual.length > 0) bloques.push(actual);

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

  // 1. Determinar el bloque actual de forma monótona (evita saltos hacia atrás o re-disparos)
  let currentBlockIndex = 0;
  for (let b = 0; b < bloques.length; b++) {
    const primerInicio = bloques[b][0]?.inicioMs ?? 0;
    if (currentTimeMs >= primerInicio) {
      currentBlockIndex = b;
    } else {
      break;
    }
  }

  // El bloque actual nunca cae al primero por error: se mantiene fijo en el último bloque al terminar
  const bloqueActual =
    bloques[currentBlockIndex] ?? bloques[bloques.length - 1] ?? bloques[0];

  // 2. Determinar palabra activa sólo dentro de su ventana de pronunciación (+80ms de gracia natural)
  let activeWordIndex = -1;
  for (let i = 0; i < palabras.length; i++) {
    const p = palabras[i];
    if (currentTimeMs >= p.inicioMs && currentTimeMs <= p.finMs + 80) {
      activeWordIndex = i;
      break;
    }
  }

  return (
    // Margen derecho +120px: los botones de la interfaz de TikTok/Shorts cubren ese borde.
    <div
      className="w-full flex items-center justify-center"
      style={{ paddingLeft: 32, paddingRight: 152 }}
    >
      {/* Contenedor flex con espaciado generoso para evitar solapamiento entre palabras */}
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-center">
        {bloqueActual.map((item) => {
          const isActive =
            item.index === activeWordIndex &&
            currentTimeMs >= item.inicioMs &&
            currentTimeMs <= item.finMs + 80;

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
                  fontSize: `${Math.min(
                    isNumeric ? 78 : 74,
                    Math.floor(800 / (Math.max(1, item.palabra.length) * 0.74))
                  )}px`,
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
