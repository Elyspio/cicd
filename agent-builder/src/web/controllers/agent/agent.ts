import {BodyParams, Controller, Get, Post, Req,} from "@tsed/common";
import {Name, Required, Returns} from "@tsed/schema";
import {Services} from "../../../core/services";
import {BuildConfig} from "../../../../../manager/back/src/core/services/manager/types";
import {BuildConfigModel} from "./models";
@Controller("/build-agent")
@Name("BuildAgent")
export class AutomationController {

    @Post("/build")
    @Returns(204)
    async getBuilderAgent(@Required() @BodyParams(BuildConfigModel) conf: BuildConfig) {

    }

}
