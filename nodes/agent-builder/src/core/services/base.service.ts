import { AxiosResponse } from "axios";
import { Logger } from "@tsed/logger";

export class BaseService {

	protected unwrap(data: AxiosResponse) {
		return data.data;
	}
}


export interface Loggable {
	logger: Logger;
}
