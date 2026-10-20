import { Config } from "@remotion/cli/config";

// Chromium preinstalado en el contenedor; sin él Remotion intenta descargarlo.
if (process.env.REMOTION_CHROME) {
  Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
Config.setVideoImageFormat("jpeg");
