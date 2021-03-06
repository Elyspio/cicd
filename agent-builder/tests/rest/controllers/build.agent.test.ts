import {Server} from "../../../src/web/server"
import {BuildConfigModel, DockerConfigModelPlatformsEnum} from "../../../../manager/back/tests/rest/api";
import {BuildAgentApi} from "../api";
import {PlatformExpress} from "@tsed/platform-express";


const port = 7001;

describe("Rest", () => {

    beforeAll(async () => {
        const platform = await PlatformExpress.bootstrap(Server, {httpPort: port, port});
        await platform.listen();
    }, 10000);

    describe("POST /core/build-agent/build", () => {

        it("Success", async () => {
            const data: BuildConfigModel = {
                docker: {
                    dockerfiles: [{
                        path: "Dockerfile",
                        wd: ".",
                        image: "automatize-github-docker",
                        tag: "test"
                    }],
                    platforms: [
                        DockerConfigModelPlatformsEnum.Amd64,
                        DockerConfigModelPlatformsEnum.Arm64
                    ],
                    username: "elyspio"
                },
                github: {
                    remote: "https://github.com/Elyspio/automatize-github-docker.git",
                    branch: "test-unit"
                }
            }

            const ret = await new BuildAgentApi(undefined, "http://localhost:" + port).buildAgentBuild(data)
            for (const str of ret.data) {
                expect(str).toMatch(new RegExp("docker.io/elyspio/automatize-github-docker:test .+s done", "g"))
            }
            expect(ret.status).toEqual(200)

        }, 10000);
    });

});
