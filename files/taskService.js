// Milestone 2 - calls the real Express API. Function names/signatures are
// unchanged from the Stage 1 mock version, so AppContext didn't need to change.

import { apiRequest } from "./apiClient";

export async function fetchTasks() {
  const { tasks } = await apiRequest("/tasks");
  return tasks;
}

export async function createTask(task) {
  const { task: created } = await apiRequest("/tasks", { method: "POST", body: task });
  return created;
}

export async function updateTask(taskId, updates) {
  const { task } = await apiRequest(`/tasks/${taskId}`, { method: "PATCH", body: updates });
  return task;
}

export async function deleteTask(taskId) {
  await apiRequest(`/tasks/${taskId}`, { method: "DELETE" });
  return { success: true };
}
