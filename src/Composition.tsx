import React from "react";
import { ShortVideo } from "./components/ShortVideo";
import { ShortProps } from "./types";

export const ShortComposition: React.FC<ShortProps> = (props) => {
  return <ShortVideo {...props} />;
};

export { ShortVideo };
