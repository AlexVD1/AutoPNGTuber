import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as LucideIcons from "lucide-react";
import { EscenaGuion } from "../types";
import { Stickman } from "./Stickman";
import { Subtitles } from "./Subtitles";

interface SceneProps {
  escena: EscenaGuion;
}

export const Scene: React.FC<SceneProps> = ({ escena }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconSpring = spring({
    frame,
    fps,
    config: {
      damping: 9,
      stiffness: 150,
      mass: 0.8,
    },
  });

  const titleSpring = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: {
      damping: 12,
      stiffness: 160,
    },
  });

  const iconRotate = interpolate(iconSpring, [0, 1], [-12, 0]);

  const IconComponent =
    (
      LucideIcons as unknown as Record<
        string,
        React.ComponentType<{
          size?: number;
          color?: string;
          strokeWidth?: number;
        }>
      >
    )[escena.icono] ?? LucideIcons.HelpCircle;

  return (
    <AbsoluteFill
      className="bg-white flex flex-col justify-between items-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <Audio src={staticFile(`audios/escena_${escena.id}.mp3`)} />

      {/* Mitad superior: Ícono grande con animación spring y tituloVisual */}
      <div className="w-full h-[760px] flex flex-col items-center justify-center pt-16 px-12">
        <div
          className="flex items-center justify-center rounded-3xl p-8"
          style={{
            transform: `scale(${iconSpring}) rotate(${iconRotate}deg)`,
          }}
        >
          <IconComponent
            size={260}
            color={escena.colorIcono}
            strokeWidth={2.4}
          />
        </div>

        <h2
          className="mt-4 text-center uppercase font-black tracking-tight"
          style={{
            fontFamily:
              "'Arial Black', 'Impact', 'Inter', system-ui, sans-serif",
            fontSize: "58px",
            color: "#111827",
            transform: `scale(${titleSpring})`,
          }}
        >
          {escena.tituloVisual}
        </h2>
      </div>

      {/* Centro/Abajo: Stickman expresivo con soporte de poses, expresiones y props */}
      <div className="w-full flex-1 flex items-center justify-center -mt-12">
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

      {/* Abajo: Subtítulos sincronizados */}
      <div className="w-full h-[380px] flex items-center justify-center pb-16">
        <Subtitles palabras={escena.palabras ?? []} />
      </div>
    </AbsoluteFill>
  );
};
