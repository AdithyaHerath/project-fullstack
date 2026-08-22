// Profile-related calls to the real Express API.

import { apiRequest, getToken } from "./apiClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export async function fetchProfile() {
  const { user } = await apiRequest("/users/me");
  return user;
}

export async function updateProfile(updates) {
  const { user } = await apiRequest("/users/me", { method: "PATCH", body: updates });
  return user;
}

// File uploads need multipart/form-data, not JSON, so this bypasses the
// shared apiRequest() helper and does its own fetch call.
export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);

  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Unable to upload avatar.");
  }
  return data.user;
}
