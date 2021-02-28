import {Any, Description, Enum, Property} from "@tsed/schema";
import {BuildConfig} from "../../../core/services/manager/types";

export enum Preset {
    webFront = "web-front",
    webBack = "web-back",
}

export class GetDockerFileModel {
    @Enum(Preset)
    preset: Preset[]
}

