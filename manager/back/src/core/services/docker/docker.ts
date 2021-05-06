import {Preset} from "../../../web/controllers/docker/models";
import * as  path from "path";
import {readFile} from "fs-extra"

export class DockerService {
	public async getDockerFile(features: Preset[]) {
		let file = "";

		if (features.includes(Preset.webBack) && features.includes(Preset.webFront)) {
			file = "back-front.Dockerfile";
		}

		if (features.includes(Preset.webBack) && !features.includes(Preset.webFront)) {
			file = "back-only.Dockerfile";
		}

		if (!features.includes(Preset.webBack) && features.includes(Preset.webFront)) {
			file = "front-only.Dockerfile";
		}

		let p = path.resolve(__dirname, "dockerfiles", file);

		return await readFile(p).then(p => p.toString("utf-8"))
	}
}
