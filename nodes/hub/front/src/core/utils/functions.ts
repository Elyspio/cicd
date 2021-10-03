import { inspect } from "util";

export function getFunctionArgs(func: Function) {
	return (func + "")
		.replace(/[/][/].*$/gm, "") // strip single-line comments
		.replace(/\s+/g, "") // strip white space
		.replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments
		.split("){", 1)[0]
		.replace(/^[^(]*[(]/, "") // extract the parameters
		.replace(/=[^,]+/g, "") // strip any ES6 defaults
		.split(",")
		.filter(Boolean); // split & filter [""]
}

export function getArgsStr(originalMethod: any, args: any[]) {
	const argsName = getFunctionArgs(originalMethod);
	return argsName.reduce((previousValue, currentValue, currentIndex) => {
		return `${previousValue} ${currentValue}=${inspect(args[currentIndex])}`;
	}, "");
}
