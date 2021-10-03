import { Config, Job } from "../types";

export type QueueIdentifier<T extends Job<Config>> = T["id"];
