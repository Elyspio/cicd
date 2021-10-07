import * as Apis from "../api";
import { DockerConfigModelPlatformsEnum } from "../api";
import * as path from "path";

const port = 4000;

const buildParam = {
	docker: {
		dockerfiles: [
			{
				path: "Dockerfile",
				wd: ".",
				image: "cicd",
				tag: "test",
			},
		],
		platforms: [DockerConfigModelPlatformsEnum.Amd64, DockerConfigModelPlatformsEnum.Arm64],
		username: "elyspio",
	},
	github: {
		remote: "https://github.com/Elyspio/automatize-github-docker.git",
		branch: "test-unit",
	},
};
const deployParam = {
	docker: {
		compose: { path: path.resolve(__dirname, "..", "..", "..", "..", "..", "agent-prod", "deployed", "test", "docker-compose.yml") },
	},
	uri: "http://localhost:4200",
};

describe("Rest", () => {
	beforeAll(async () => {
		// const platform = await PlatformExpress.bootstrap(Server, {httpPort: port, port});
		// await platform.listen();
	});

	describe("POST /core/operation/automate/deployment", () => {
		it("No Content", async () => {
			const data: Apis.DeployConfigModel = deployParam;
			const ret = await new Apis.OperationApi(undefined, "http://localhost:" + port).operationDeploy(data);
			expect(ret.status).toEqual(204);
		});
	});

	describe("POST /core/operation/automate/build", () => {
		it("No Content", async () => {
			const data: Apis.BuildConfigModel = buildParam;
			const ret = await new Apis.OperationApi(undefined, "http://localhost:" + port).operationStart(data);
			expect(ret.status).toEqual(204);
		});
	});

	describe("POST /core/operation/automate/register", () => {
		it("Success", async () => {
			const data: Apis.InlineObject2 = {
				build: buildParam,
				deploy: deployParam,
			};
			const ret = await new Apis.OperationApi(undefined, "http://localhost:" + port).operationRegister(data);
			expect(ret.status).toEqual(200);
		});
	});
});
