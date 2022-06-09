import { CicdApi } from "../apis/backend";
import { AuthenticationApi } from "../apis/authentication";
import { container } from "./index";

container.bind(CicdApi).toSelf();
container.bind(AuthenticationApi).toSelf();
