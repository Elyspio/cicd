import { Config, Job } from "../types";

export type JobIdentifier<T extends Job<Config>> = T["id"];
