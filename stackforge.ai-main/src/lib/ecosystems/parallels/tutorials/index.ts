import { installWindows11OnMac } from "./install-windows-11-on-mac";
import { setupParallelsM3 } from "./setup-parallels-m3";
import { gamingOnMacGuide } from "./gaming-on-mac-guide";

export { installWindows11OnMac };
export { setupParallelsM3 };
export { gamingOnMacGuide };

export const parallelsTutorials = [
  installWindows11OnMac,
  setupParallelsM3,
  gamingOnMacGuide,
] as const;