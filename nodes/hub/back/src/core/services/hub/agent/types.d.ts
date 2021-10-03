import { Agent } from "../types";

export type AgentIdentifier<T extends Agent> = T["uri"];
