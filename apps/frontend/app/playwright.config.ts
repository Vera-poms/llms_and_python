import { defineConfig } from "@playwright/test";

// End-to-end tests need the backend running (OWNER_EMAIL / OWNER_PASSWORD set, SMTP_HOST unset)
// and the Vite dev server on :5000 built with VITE_API_URL pointing at it. Owner credentials
// for the tests come from E2E_OWNER_EMAIL / E2E_OWNER_PASSWORD.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: process.env.E2E_BASE_URL ?? "http://localhost:5000" },
});
