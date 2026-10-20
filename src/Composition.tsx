import React from "react";
import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { ShortProps } from "./types";
import { Scene } from "./components/Scene";

export const ShortComposition: React.FC<ShortProps> = ({ escenas }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      <Series>
        {escenas.map((escena) => {
          const durationInFrames = Math.max(
            1,
            Math.round((escena.duracionSegundos ?? 4) * fps)
          );

          return (
            <Series.Sequence key={escena.id} durationInFrames={durationInFrames}>
              <Scene escena={escena} />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
