// Milestone 2 - now calls the real Express/JWT backend instead of mock data.
// The function signatures are unchanged from Stage 1, so AppContext and the
// pages that call login()/register() did not need to change.

import { apiRequest, setToken } from "./apiClient";

export async function login({ email, password }) {
  const { user, token } = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(token);
  return { user };
}

export async function register({ name, email, password }) {
  const { user, token } = await apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
  setToken(token);
  return { user };
}

export function logout() {
  setToken(null);
}
