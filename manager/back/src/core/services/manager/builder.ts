import {ManagerMethods} from "./service";
import {BuildAgent, ProductionAgent} from "./types";
import {Base} from "./base";

export class Builder extends Base implements ManagerMethods<BuildAgent> {

    public add(agent: Omit<BuildAgent, "lastUptime" | "availability">) {
        return super.baseAdd<BuildAgent>(agent, "builder");
    }

    public update(agent: BuildAgent | BuildAgent["uri"], newAgent: Partial<BuildAgent>) {
        return super.baseUpdate<BuildAgent>(agent, newAgent, "builder");
    }

    public delete(agent: BuildAgent | BuildAgent["uri"],) {
        super.baseDelete<BuildAgent>(agent, "builder");
    }

    public list(): BuildAgent[] {
        return this.baseList<BuildAgent>("builder");
    }

    public keepAlive(agent: BuildAgent["uri"] | BuildAgent): void {
        this.update(agent, {availability: "free", lastUptime: new Date()});
    }
}

