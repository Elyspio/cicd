const port = 4000
describe("Rest", () => {

	beforeAll(async () => {
		// const platform = await PlatformExpress.bootstrap(Server, {httpPort: port, port});
		// await platform.listen();
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


	describe("GET /core/automate/agent/build", () => {

		it("Success", async () => {
			// const data: any = {};
			// const ret = await new Apis.AutomationApi(undefined, "http://localhost:" + port).automationGetBuilderAgent(data);
			// expect(ret.status).toEqual(200);
		});
	});

});
