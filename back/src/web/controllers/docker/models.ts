import {ArrayOf, Enum} from "@tsed/schema";


export enum Preset {
    webFront = "web-front",
    webBack = "web-back",
}

export class GetDockerFileModel {
    @Enum(Preset)
    preset: Preset[]
}
