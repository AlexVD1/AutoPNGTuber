import React from "react";
import { WordSubtitles, WordSubtitlesProps } from "./WordSubtitles";

export type SubtitlesProps = WordSubtitlesProps;
export const Subtitles: React.FC<SubtitlesProps> = (props) => {
  return <WordSubtitles {...props} />;
};

export { WordSubtitles };
