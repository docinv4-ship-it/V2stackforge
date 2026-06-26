import { bestMacVirtualMachines } from "./best-mac-virtual-machines";
import { bestWindowsOnMacSolutions } from "./best-windows-on-mac-solutions";

export { bestMacVirtualMachines };
export { bestWindowsOnMacSolutions };

export const parallelsRankings = [
  bestMacVirtualMachines,
  bestWindowsOnMacSolutions,
] as const;