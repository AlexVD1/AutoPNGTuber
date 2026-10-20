import React from "react";
import { AbsoluteFill } from "remotion";
import { FESTIVE_COMPOSITES } from "../stickman/festiveLibrary";
import { Stickman } from "./Stickman";

export const ShowcasePoses: React.FC = () => {
  const festiveItems = Object.values(FESTIVE_COMPOSITES);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F9FAFB",
        padding: 36,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div className="mb-4 flex items-center justify-between border-b-4 border-gray-900 pb-3">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase">
            Hoja de Contacto — Poses y Props Festivos (AutoPNGTuber v2.0)
          </h1>
          <p className="text-xl text-gray-600 font-semibold mt-1">
            20 combinaciones festivas con accesorios y efectos de ambiente (Total catálogo: 352 recursos)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 flex-1">
        {festiveItems.map((comp) => (
          <div
            key={comp.id}
            className="bg-white border-2 border-gray-200 rounded-2xl p-2 flex flex-col items-center justify-between shadow-sm"
          >
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
              <Stickman
                poseId={comp.id}
                escala={0.42}
                animacionEntrada="ninguna"
              />
            </div>
            <div className="text-center w-full mt-1">
              <div className="text-xs font-mono font-bold text-pink-700 bg-pink-50 rounded px-2 py-0.5 inline-block">
                {comp.id}
              </div>
              <div className="text-sm font-bold text-gray-900 truncate mt-0.5">
                {comp.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
