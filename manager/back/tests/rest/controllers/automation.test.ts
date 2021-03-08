import * as Apis from "../api"
import {BuildAgentModelAddAbilitiesEnum, ProductionAgentModelAbilitiesEnum} from "../api"

const port = 4000
describe("Rest", () => {

    beforeAll(async () => {
        // const platform = await PlatformExpress.bootstrap(Server, {httpPort: port, port});
        // await platform.listen();
    });


    describe("POST /core/automate/agent/production", () => {

        it("No Content", async () => {
            const data: Apis.ProductionAgentModel = {
                "abilities": [
                    ProductionAgentModelAbilitiesEnum.Docker,
                    ProductionAgentModelAbilitiesEnum.DockerCompose
                ],
                "uri": "http://localhost:4002"
            };
            const ret = await new Apis.AutomationApi(undefined, "http://localhost:" + port).automationAddProductionAgent(data);
            expect(ret.status).toEqual(204);
        });
    });
    describe("GET /core/automate/agent/production", () => {

        it("Success", async () => {
            // const data: any = {};
            // const ret = await new Apis.AutomationApi(undefined, "http://localhost:" + port).automationGetProductionAgent(data);
            // expect(ret.status).toEqual(200);
        });
    });


    describe("POST /core/automate/agent/production/keep-alive", () => {

        it("No Content", async () => {
            // const data: any = {};
            // const ret = await new Apis.AutomationApi(undefined, "http://localhost:" + port).automationProductionAgentKeepAlive(data);
            // expect(ret.status).toEqual(204);
        });
    });


    describe("POST /core/automate/agent/build/keep-alive", () => {

        it("No Content", async () => {
            // const data: any = {};
            // const ret = await new Apis.AutomationApi(undefined, "http://localhost:" + port).automationBuilderAgentKeepAlive(data);
            // expect(ret.status).toEqual(204);
        });
    });


    describe("POST /core/automate/agent/build", () => {

        it("No Content", async () => {
            const data: Apis.BuildAgentModelAdd = {
                "abilities": [
                   BuildAgentModelAddAbilitiesEnum.Docker,
                   BuildAgentModelAddAbilitiesEnum.DockerBuildx
                ],
                "uri": "http://localhost:4002"
            };
            const ret = await new Apis.AutomationApi(undefined, "http://localhost:" + port).automationAddBuildAgent(data);
            expect(ret.status).toEqual(204);
        });
    });
    describe("GET /core/automate/agent/build", () => {

        it("Success", async () => {
            // const data: any = {};
            // const ret = await new Apis.AutomationApi(undefined, "http://localhost:" + port).automationGetBuilderAgent(data);
            // expect(ret.status).toEqual(200);
        });
    });

});
