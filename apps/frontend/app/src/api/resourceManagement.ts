import type { AxiosInstance } from "axios";

import type { RunResult } from "../components/NotebookRunner";

export type ResourceBlock =
  | { type: "text"; markdown: string }
  | { type: "code"; code: string; runnable: boolean }
  | { type: "link"; url: string; title?: string | null; note?: string | null };

export interface Resource {
  id: number;
  week: number;
  title: string;
  summary: string;
  position: number;
  blocks: ResourceBlock[];
  released_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceDraft {
  week: number;
  title: string;
  summary: string;
  position: number;
  blocks: ResourceBlock[];
}

// Admin or owner token: full access including drafts. Preview code runs in a scratch kernel.
export function createResourceApi(client: AxiosInstance) {
  return {
    list: () => client.get<Resource[]>("/admin/resources").then((r) => r.data),
    create: (body: ResourceDraft) => client.post<Resource>("/admin/resources", body).then((r) => r.data),
    update: (id: number, body: ResourceDraft) =>
      client.put<Resource>(`/admin/resources/${id}`, body).then((r) => r.data),
    remove: (id: number) => client.delete(`/admin/resources/${id}`),
    release: (id: number) => client.post<Resource>(`/admin/resources/${id}/release`).then((r) => r.data),
    unrelease: (id: number) => client.post<Resource>(`/admin/resources/${id}/unrelease`).then((r) => r.data),
    run: (source: string) => client.post<RunResult>("/admin/resources/run", { source }).then((r) => r.data),
  };
}

export type ResourceApi = ReturnType<typeof createResourceApi>;
