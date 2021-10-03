import { EventManager } from "../../../utils/events";
import { Job } from "../types";

export class AgentBase extends EventManager<{ jobfinished: (id: Job["id"]) => void }> {
	public finishJob(id: Job["id"]) {
		super.emit("jobfinished", id);
	}

	public waitForJob(id: Job["id"]) {
		return new Promise<void>((resolve) => {
			this.on("jobfinished", (finishedId) => {
				if (finishedId === id) resolve();
			});
		});
	}
}
