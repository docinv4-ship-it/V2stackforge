import { registerEcosystem } from "./registry";
import { parallelsEcosystem } from "./parallels";

registerEcosystem(parallelsEcosystem);

export { parallelsEcosystem } from "./parallels";
export * from "./registry";
export * from "./types";
