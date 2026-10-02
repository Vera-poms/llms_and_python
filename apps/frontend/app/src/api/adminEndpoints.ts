import { adminApi } from "./adminClient";
import { createResourceApi } from "./resourceManagement";
import { createUserApi } from "./userManagement";

export const adminUserApi = createUserApi(adminApi);
export const adminResourceApi = createResourceApi(adminApi);
