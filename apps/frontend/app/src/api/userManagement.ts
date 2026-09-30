import type { AxiosInstance } from "axios";

export interface UserSummary {
  id: number;
  email: string;
  is_admin: boolean;
  created_at: string;
  labs_done: number;
  total_labs: number;
  hints_used: number;
  last_activity: string | null;
}

export interface LabProgress {
  lab_id: number;
  title: string;
  done: boolean;
  hint_count: number;
  updated_at: string | null;
}

export interface UserDetail extends UserSummary {
  current_lab_index: number;
  labs: LabProgress[];
}

// The /admin/users endpoints accept either an admin or an owner token, so the same calls
// are bound to whichever client (adminApi / ownerApi) the dashboard is signed in with.
export function createUserApi(client: AxiosInstance) {
  return {
    listUsers: (search: string) =>
      client.get<UserSummary[]>("/admin/users", { params: { search: search || undefined } }).then((r) => r.data),
    getUser: (id: number) => client.get<UserDetail>(`/admin/users/${id}`).then((r) => r.data),
    updateUser: (id: number, body: { is_admin?: boolean; new_password?: string }) =>
      client.patch<UserDetail>(`/admin/users/${id}`, body).then((r) => r.data),
    deleteUser: (id: number) => client.delete(`/admin/users/${id}`),
    resetProgress: (id: number) => client.delete(`/admin/users/${id}/progress`),
    setLabDone: (userId: number, labId: number, done: boolean) =>
      client
        .patch<LabProgress>(`/admin/users/${userId}/labs/${labId}`, null, { params: { done } })
        .then((r) => r.data),
  };
}

export type UserApi = ReturnType<typeof createUserApi>;

export function errorMessage(err: unknown, fallback = "Something went wrong."): string {
  const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  return typeof detail === "string" ? detail : fallback;
}
