import { ownerApi } from "./ownerClient";
import { createUserApi } from "./userManagement";

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

export interface Review {
  id: number;
  lab_id: number;
  lab_title: string;
  topic: string;
  rating: number;
  comment: string;
  user_email: string;
  created_at: string;
  updated_at: string;
}

export const listReviews = () => ownerApi.get<Review[]>("/owner/reviews").then((r) => r.data);

export const ownerUserApi = createUserApi(ownerApi);

export const listInvites = () => ownerApi.get<Invite[]>("/owner/invites").then((r) => r.data);

export const createInvite = (email: string) =>
  ownerApi.post<InviteCreated>("/owner/invites", { email }).then((r) => r.data);

export const revokeInvite = (id: number) => ownerApi.delete(`/owner/invites/${id}`);

export const listAdmins = () => ownerApi.get<AdminAccount[]>("/owner/admins").then((r) => r.data);

export const revokeAdmin = (id: number) => ownerApi.delete(`/owner/admins/${id}`);

export { errorMessage } from "./userManagement";
