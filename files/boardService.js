// Milestone 2 - calls the real Express API. Function names/signatures are
// unchanged from the Stage 1 mock version, so AppContext didn't need to change.

import { apiRequest } from "./apiClient";

export async function fetchBoards() {
  const { boards } = await apiRequest("/boards");
  return boards;
}

export async function createBoard({ title }) {
  const { board } = await apiRequest("/boards", { method: "POST", body: { title } });
  return board;
}

export async function updateBoard(boardId, updates) {
  const { board } = await apiRequest(`/boards/${boardId}`, { method: "PATCH", body: updates });
  return board;
}

export async function deleteBoard(boardId) {
  await apiRequest(`/boards/${boardId}`, { method: "DELETE" });
  return { success: true };
}
