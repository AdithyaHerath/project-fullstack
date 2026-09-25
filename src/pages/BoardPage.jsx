import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

import { useApp } from "../context/AppContext";

export default function BoardPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const {
    boards,
    tasks,
    boardsLoading,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  } = useApp();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);

  // Find the current board
  const board = boards.find((item) => item.id === boardId);

  // Only show tasks belonging to this board
  const boardTasks = tasks.filter((task) => task.boardId === boardId);

  const todoTasks = boardTasks.filter((task) => task.status === "todo");
  const doingTasks = boardTasks.filter((task) => task.status === "doing");
  const doneTasks = boardTasks.filter((task) => task.status === "done");

  // -------------------------
  // Task actions
  // -------------------------

  function handleCreateTask() {
    setTaskBeingEdited(null);
    setIsTaskModalOpen(true);
  }

  function handleEditTask(task) {
    setTaskBeingEdited(task);
    setIsTaskModalOpen(true);
  }

  async function handleSaveTask(taskData) {
    if (taskBeingEdited) {
      await updateTask({
        ...taskData,
        id: taskBeingEdited.id,
        boardId: taskBeingEdited.boardId,
      });
    } else {
      await createTask({
        ...taskData,
        boardId,
      });
    }

    setTaskBeingEdited(null);
    setIsTaskModalOpen(false);
  }

  function handleDeleteTask(taskId) {
    const task = boardTasks.find((item) => item.id === taskId);

    if (task) {
      setTaskPendingDelete(task);
    }
  }

  async function handleConfirmDelete() {
    if (!taskPendingDelete) return;

    await deleteTask(taskPendingDelete.id);
    setTaskPendingDelete(null);
  }

  async function handleStatusChange(taskId, newStatus) {
    await updateTaskStatus(taskId, newStatus);
  }

  // -------------------------
  // Loading / board not found
  // -------------------------

  if (boardsLoading) {
    return (
      <div className="page">
        <Navbar />
        <main className="board-page">
          <LoadingSpinner label="Loading board..." />
        </main>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="page">
        <Navbar />
        <main className="board-page">
          <EmptyState
            title="Board not found"
            message="The board you're looking for does not exist."
            isError
          />

          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="board-page">
        {/* Board header */}
        <div className="board-page__header">
          <div>
            <button
              type="button"
              className="board-page__back"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Boards
            </button>

            <p className="board-page__eyebrow">Project Board</p>

            <h1>{board.title}</h1>

            <p className="board-page__subtitle">
              {boardTasks.length}{" "}
              {boardTasks.length === 1 ? "task" : "tasks"} in this board.
            </p>
          </div>

          <button
            type="button"
            className="btn btn--primary"
            onClick={handleCreateTask}
          >
            + Add Task
          </button>
        </div>

        {/* Kanban board */}
        <div className="kanban-board">
          {/* TO DO */}
          <section className="kanban-column">
            <div className="kanban-column__header">
              <div>
                <h2>To Do</h2>
                <span>Tasks to be started</span>
              </div>

              <span className="kanban-column__count">
                {todoTasks.length}
              </span>
            </div>

            <div className="kanban-column__tasks">
              {todoTasks.length === 0 ? (
                <div className="kanban-column__empty">
                  No tasks here.
                </div>
              ) : (
                todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </section>

          {/* DOING */}
          <section className="kanban-column">
            <div className="kanban-column__header">
              <div>
                <h2>Doing</h2>
                <span>Currently in progress</span>
              </div>

              <span className="kanban-column__count">
                {doingTasks.length}
              </span>
            </div>

            <div className="kanban-column__tasks">
              {doingTasks.length === 0 ? (
                <div className="kanban-column__empty">
                  No tasks here.
                </div>
              ) : (
                doingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </section>

          {/* DONE */}
          <section className="kanban-column">
            <div className="kanban-column__header">
              <div>
                <h2>Done</h2>
                <span>Completed tasks</span>
              </div>

              <span className="kanban-column__count">
                {doneTasks.length}
              </span>
            </div>

            <div className="kanban-column__tasks">
              {doneTasks.length === 0 ? (
                <div className="kanban-column__empty">
                  No tasks here.
                </div>
              ) : (
                doneTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Create / Edit task modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskBeingEdited(null);
        }}
        task={taskBeingEdited}
        onSave={handleSaveTask}
      />

      {/* Delete task confirmation */}
      {taskPendingDelete && (
        <ConfirmModal
          isOpen={true}
          title="Delete this task?"
          message={`"${taskPendingDelete.title}" will be permanently removed.`}
          onClose={() => setTaskPendingDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}