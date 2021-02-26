import {ManagerMethods} from "./service";
import {ProductionAgent} from "./types";
import {Base} from "./base";

export class Production extends Base implements ManagerMethods<ProductionAgent> {

    public add(agent: Omit<ProductionAgent, "lastUptime" | "availability">) {
        return super.baseAdd<ProductionAgent>(agent, "production");
    }

    public update(agent: ProductionAgent | ProductionAgent["uri"], newAgent: Partial<ProductionAgent>) {
        return super.baseUpdate<ProductionAgent>(agent, newAgent, "production");
    }

    public delete(agent: ProductionAgent | ProductionAgent["uri"],) {
        super.baseDelete<ProductionAgent>(agent, "production");
    }

    public list(): ProductionAgent[] {
        return this.baseList<ProductionAgent>("production");
    }

    public keepAlive(agent: ProductionAgent["uri"] | ProductionAgent): void {
        this.update(agent, {availability: "free", lastUptime: new Date()});
    }
}


