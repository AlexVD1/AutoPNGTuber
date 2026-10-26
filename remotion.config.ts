import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// CRF 22: MP4 mucho más ligeros sin pérdida visible (los de 30-68 MB bajan bastante).
Config.setCrf(22);
Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});
