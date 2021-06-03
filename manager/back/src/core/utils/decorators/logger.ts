import {$log} from "@tsed/common";

export function log(type: "service" | "controller") {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const method = descriptor.value;
		descriptor.value = function (...args: any[]) {
			$log.info(`${type.toLocaleUpperCase()} ${target.constructor.name} : ${propertyKey} ${JSON.stringify(args)}`)
			return method.apply(this, args)
		}

		return descriptor;
	}
}
