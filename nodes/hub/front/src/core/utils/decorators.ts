import { toast } from "react-toastify";
import { getArgsStr } from "./functions";

type ToastOnTypes = "error" | "success" | "pending";

type ToastOnParam = { [key in ToastOnTypes]?: string };

export function ToastOn(
	on: ToastOnParam,
	config?: { concatArgs?: boolean | string[] },
) {
	return function(
		target: any,
		prop: string,
		descriptor?: PropertyDescriptor,
	) {
		if (descriptor?.value) {
			const originalMethod = descriptor.value;

			// Redefine the method value with our own
			descriptor.value = function(...args: any[]) {
				// Execute the method with its initial context and arguments
				// Return value is stored into a variable instead of being passed to the execution stack
				function handleError(err: Error) {
					if (on.error) {
						let msg = `${on.error}`;

						if (process.env.NODE_ENV === "development") {
							msg += `: ${prop}`;
							if (config?.concatArgs && args.length > 0) {
								msg += `\nArguments: ${getArgsStr(
									originalMethod,
									args,
								)}`;
							}
							msg += `\n${err.name}: ${err.message}`;
						}
						toast.error(msg, { autoClose: 7000 });
						console.error(msg, err);
					}
				}

				function handleSuccess() {
					if (on.success) {
						let msg = `${on.success}`;
						if (process.env.NODE_ENV === "development") {
							msg += `: ${prop}`;
							if (config?.concatArgs && args.length > 0) {
								msg += `\nArguments: ${getArgsStr(
									originalMethod,
									args,
								)}`;
							}
						}
						toast.success(msg);
					}
				}

				try {
					let result = originalMethod.apply(this, args);

					if (
						typeof result === "object" &&
						typeof result.then === "function"
					) {
						const promise = result.then((ret: any) => {
							handleSuccess();
							return ret;
						});
						if (typeof promise.catch === "function") {
							promise.catch((e: Error) => {
								handleError(e);
								return e;
							});
						}
					} else {
						handleSuccess();
					}
					return result;
				} catch (e: any) {
					handleError(e);
				}
			};
		}

		return descriptor;
	};
}
