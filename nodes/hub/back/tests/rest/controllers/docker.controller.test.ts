import * as Apis from "../api";

const port = 4000;
describe("Rest", () => {

	beforeAll(async () => {
		// const platform = await PlatformExpress.bootstrap(Server, {httpPort: port, port});
		// await platform.listen();
	});


	describe("GET /core/docker/dockerfiles", () => {
		let ret;
		it("web-back & web-front", async () => {
			ret = await new Apis.DockerControllerApi(undefined, "http://localhost:" + port).dockerControllerGet(["web-back", "web-front"]);
			expect(ret.status).toEqual(200);
		});
		it("web-back", async () => {
			ret = await new Apis.DockerControllerApi(undefined, "http://localhost:" + port).dockerControllerGet(["web-back"]);
			expect(ret.status).toEqual(200);
		});
		it("web-front", async () => {
			ret = await new Apis.DockerControllerApi(undefined, "http://localhost:" + port).dockerControllerGet(["web-front"]);
			expect(ret.status).toEqual(200);

		});
	});

});
