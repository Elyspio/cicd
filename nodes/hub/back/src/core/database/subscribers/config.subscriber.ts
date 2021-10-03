import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { Service } from "@tsed/common";
import { ConfigService } from "../../services/hub/config.service";

@EventSubscriber()
@Service()
export class ConfigSubscriber implements EntitySubscriberInterface {
	private static services: { config: ConfigService };

	constructor(config: ConfigService) {
		ConfigSubscriber.services = {
			config,
		};
	}

	/**
	 * Called after entity update.
	 */
	afterUpdate(event: UpdateEvent<any>) {
		ConfigSubscriber.services.config.export().then((conf) => {
			ConfigSubscriber.services.config.emit("update", conf);
		});
	}

	/**
	 * Called after entity update.
	 */
	afterInsert(event: InsertEvent<any>) {
		ConfigSubscriber.services.config.export().then((conf) => {
			ConfigSubscriber.services.config.emit("update", conf);
		});
	}

	/**
	 * Called after entity update.
	 */
	afterRemove(event: any) {
		ConfigSubscriber.services.config.export().then((conf) => {
			ConfigSubscriber.services.config.emit("update", conf);
		});
	}
}
