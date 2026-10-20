import React from "react";
import { Composition, CalculateMetadataFunction } from "remotion";
import { ShortComposition } from "./Composition";
import { ShowcasePoses } from "./components/ShowcasePoses";
import { EscenaGuion, ShortProps } from "./types";
import guionData from "./data/guion.json";
import "./style.css";

const FPS = 30;

const calculateMetadata: CalculateMetadataFunction<ShortProps> = async ({
  props,
}) => {
  const totalFrames = props.escenas.reduce((acc, escena) => {
    const segundos = escena.duracionSegundos ?? 4;
    return acc + Math.max(1, Math.round(segundos * FPS));
  }, 0);

  return {
    durationInFrames: Math.max(1, totalFrames),
    fps: FPS,
    width: 1080,
    height: 1920,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShortSabiasQue"
        component={ShortComposition}
        durationInFrames={30 * 20}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          escenas: guionData as EscenaGuion[],
        }}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="HojaDeContacto"
        component={ShowcasePoses}
        durationInFrames={150}
        fps={FPS}
        width={1920}
        height={1600}
      />
    </>
  );
};
