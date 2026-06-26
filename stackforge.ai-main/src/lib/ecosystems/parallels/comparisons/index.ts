import { parallelsVsVmware } from "./parallels-vs-vmware";
import { parallelsVsVirtualBox } from "./parallels-vs-virtualbox";
import { parallelsVsCrossOver } from "./parallels-vs-crossover";

export { parallelsVsVmware };
export { parallelsVsVirtualBox };
export { parallelsVsCrossOver };

export const parallelsComparisons = [
  parallelsVsVmware,
  parallelsVsVirtualBox,
  parallelsVsCrossOver,
] as const;