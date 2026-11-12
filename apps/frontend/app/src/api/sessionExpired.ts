// Sends the user to a login page after their session ended. The app is served under a base path
// (e.g. /llms_and_python/ on GitHub Pages), so a bare "/owner/login" would land on a 404 page.
export function redirectToLogin(loginPath: string): void {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.replace(`${base}${loginPath}?expired=1`);
}

export function wasSessionExpired(): boolean {
  return new URLSearchParams(window.location.search).has("expired");
}

export const SESSION_EXPIRED_MESSAGE = "Your session expired. Please sign in again.";
