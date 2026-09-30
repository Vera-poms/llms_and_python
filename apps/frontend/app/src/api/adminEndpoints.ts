import { adminApi } from "./adminClient";
import { createUserApi } from "./userManagement";

export const adminUserApi = createUserApi(adminApi);
