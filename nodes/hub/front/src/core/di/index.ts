import { Container } from "inversify";

export const container = new Container({ defaultScope: "Singleton" });

require("./di.api");
require("./di.service");
