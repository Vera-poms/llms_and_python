import { expect, test, type Page } from "@playwright/test";

const OWNER_EMAIL = process.env.E2E_OWNER_EMAIL ?? "";
const OWNER_PASSWORD = process.env.E2E_OWNER_PASSWORD ?? "";
const ADMIN_PASSWORD = "a-long-admin-password-1";

async function createInviteLink(page: Page, email: string): Promise<string> {
  await page.goto("/owner/login");
  await page.getByLabel("Email").fill(OWNER_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(OWNER_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("tab", { name: /Admins/ }).click();
  await page.getByPlaceholder("Email").fill(email);
  await page.getByRole("button", { name: "Send invite" }).click();
  const link = await page.getByTestId("invite-link").innerText();
  await page.getByRole("button", { name: "Sign out" }).click();
  return link;
}

test.beforeEach(() => {
  test.skip(!OWNER_EMAIL || !OWNER_PASSWORD, "E2E_OWNER_EMAIL / E2E_OWNER_PASSWORD not set");
});

test("invite link prefills the form, toggles password visibility and signs the admin in", async ({ page }) => {
  const email = `admin-${Date.now()}@example.com`;
  const link = await createInviteLink(page, email);

  await page.goto(link);
  await expect(page.getByRole("heading", { name: "Admin sign up" })).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveValue(email);
  await expect(page.getByLabel("Invite code")).not.toHaveValue("");

  const password = page.getByLabel("Password", { exact: true });
  await password.fill(ADMIN_PASSWORD);
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).first().click();
  await expect(password).toHaveAttribute("type", "text");

  await page.getByLabel("Confirm password").fill("something-else-entirely");
  await page.getByRole("button", { name: "Create admin account" }).click();
  await expect(page.getByText("Passwords do not match.")).toBeVisible();

  await page.getByLabel("Password", { exact: true }).fill(ADMIN_PASSWORD);
  await page.getByLabel("Confirm password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Create admin account" }).click();
  await expect(page).toHaveURL(/\/admin$/);
});

test("a used invite is rejected", async ({ page }) => {
  const email = `admin-${Date.now()}@example.com`;
  const link = await createInviteLink(page, email);

  await page.goto(link);
  await page.getByLabel("Password", { exact: true }).fill(ADMIN_PASSWORD);
  await page.getByLabel("Confirm password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Create admin account" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.evaluate(() => sessionStorage.clear());
  await page.goto(link);
  await page.getByLabel("Password", { exact: true }).fill(ADMIN_PASSWORD);
  await page.getByLabel("Confirm password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Create admin account" }).click();
  await expect(page.getByText(/invalid, expired or already used/)).toBeVisible();
});

test("admin login names the specific failure", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(`nobody-${Date.now()}@example.com`);
  await page.getByLabel("Password", { exact: true }).fill("whatever-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("No admin account exists for that email")).toBeVisible();

  await page.getByRole("link", { name: "Sign up" }).click();
  await expect(page).toHaveURL(/\/admin\/signup$/);
});

test("student login names the specific failure", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(`nobody-${Date.now()}@example.com`);
  await page.getByLabel("Password", { exact: true }).fill("whatever-password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("No account exists for that email")).toBeVisible();
});
