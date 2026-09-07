import { useState } from "react";
import Navbar from "../components/Navbar";
import BoardCard from "../components/BoardCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import { useApp } from "../context/AppContext";
import "../styles/DashboardPage.css";

export default function DashboardPage() {
  const { boards, boardsLoading, boardsError, tasks, createBoard, deleteBoard } = useApp();
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [boardPendingDelete, setBoardPendingDelete] = useState(null);

  async function handleCreateBoard(e) {
    e.preventDefault();
    if (!newBoardTitle.trim()) {
      setTitleError("Board title is required.");
      return;
    }
    setTitleError("");
    await createBoard(newBoardTitle.trim());
    setNewBoardTitle("");
  }

  async function handleConfirmDelete() {
    if (!boardPendingDelete) return;
    await deleteBoard(boardPendingDelete.id);
    setBoardPendingDelete(null);
  }

  return (
    <div className="page">
      <Navbar />
      <main className="dashboard">
        <div className="dashboard__header">
          <p className="dashboard__eyebrow">Workspace</p>
          <h1>Your Boards</h1>
          <p className="dashboard__subtitle">Pick a board to jump back into, or start a new one.</p>
        </div>

        <form className="dashboard__create-form" onSubmit={handleCreateBoard}>
          <div className="form-field form-field--inline">
            <label htmlFor="new-board-title" className="sr-only">
              New board title
            </label>
            <input
              id="new-board-title"
              type="text"
              placeholder="New board title"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              aria-invalid={Boolean(titleError)}
            />
            <button type="submit" className="btn btn--primary">
              + Create Board
            </button>
          </div>
          {titleError && (
            <span className="form-error" role="alert">
              {titleError}
            </span>
          )}
        </form>

        {boardsLoading && <LoadingSpinner label="Loading boards..." />}

        {!boardsLoading && boardsError && (
          <EmptyState title="Unable to load boards." isError />
        )}

        {!boardsLoading && !boardsError && boards.length === 0 && (
          <EmptyState
            title="No boards yet"
            message="Create your first board to start organizing tasks."
          />
        )}

        {!boardsLoading && !boardsError && boards.length > 0 && (
          <div className="dashboard__board-grid">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                taskCount={tasks.filter((t) => t.boardId === board.id).length}
                onDelete={setBoardPendingDelete}
              />
            ))}
          </div>
        )}
      </main>

      {boardPendingDelete && (
        <ConfirmModal
          title="Delete this board?"
          message={`"${boardPendingDelete.title}" and all of its tasks will be removed.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setBoardPendingDelete(null)}
        />
      )}
    </div>
  );
}
