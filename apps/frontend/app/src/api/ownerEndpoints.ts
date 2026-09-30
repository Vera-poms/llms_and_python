import { ownerApi } from "./ownerClient";

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

export interface Invite {
  id: number;
  email: string;
  status: "pending" | "used" | "revoked" | "expired";
  expires_at: string;
  created_at: string;
}

export interface InviteCreated extends Invite {
  code: string;
  emailed: boolean;
}

export interface AdminAccount {
  id: number;
  email: string;
  created_at: string;
}

export const listUsers = (search: string) =>
  ownerApi.get<UserSummary[]>("/admin/users", { params: { search: search || undefined } }).then((r) => r.data);

export const getUser = (id: number) => ownerApi.get<UserDetail>(`/admin/users/${id}`).then((r) => r.data);

export const updateUser = (id: number, body: { is_admin?: boolean; new_password?: string }) =>
  ownerApi.patch<UserDetail>(`/admin/users/${id}`, body).then((r) => r.data);

export const deleteUser = (id: number) => ownerApi.delete(`/admin/users/${id}`);

export const resetProgress = (id: number) => ownerApi.delete(`/admin/users/${id}/progress`);

export const setLabDone = (userId: number, labId: number, done: boolean) =>
  ownerApi.patch<LabProgress>(`/admin/users/${userId}/labs/${labId}`, null, { params: { done } }).then((r) => r.data);

export const listInvites = () => ownerApi.get<Invite[]>("/owner/invites").then((r) => r.data);

export const createInvite = (email: string) =>
  ownerApi.post<InviteCreated>("/owner/invites", { email }).then((r) => r.data);

export const revokeInvite = (id: number) => ownerApi.delete(`/owner/invites/${id}`);

export const listAdmins = () => ownerApi.get<AdminAccount[]>("/owner/admins").then((r) => r.data);

export const revokeAdmin = (id: number) => ownerApi.delete(`/owner/admins/${id}`);

export function errorMessage(err: unknown, fallback = "Something went wrong."): string {
  const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  return typeof detail === "string" ? detail : fallback;
}
