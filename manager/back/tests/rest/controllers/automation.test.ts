import {Server} from "../../../src/web/server"
import {PlatformExpress} from "@tsed/platform-express";
import * as Apis from "../api"
const port = 7001
describe("Rest", () => {

    beforeAll(async () => {
        const platform = await PlatformExpress.bootstrap(Server, {httpPort: port, port});
        await platform.listen();
    });


    describe("POST /core/automate/agent/production", () => {

        it("No Content", async () => {
            const data: any = {
                uri: 'http://localhost:4001',
                ability: [ 'docker', 'docker-buildx' ]
            };
            const ret = await new Apis.AutomationApi(undefined, "http://localhost:" + port).automationAddBuildAgent(data);
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
            // const data: any = {};
            // const ret = await new Apis.AutomationApi(undefined, "http://localhost:" + port).automationAddBuildAgent(data);
            // expect(ret.status).toEqual(204);
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
