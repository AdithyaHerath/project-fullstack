import { useNavigate } from "react-router-dom";
import "../styles/BoardCard.css";

export default function BoardCard({ board, taskCount, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="board-card">
      <h3 className="board-card__title">{board.title}</h3>
      <p className="board-card__count">
        {taskCount} {taskCount === 1 ? "task" : "tasks"}
      </p>
      <div className="board-card__actions">
        <button type="button" className="btn btn--primary" onClick={() => navigate(`/boards/${board.id}`)}>
          Open Board
        </button>
        <button
          type="button"
          className="btn btn--danger-outline"
          onClick={() => onDelete(board)}
          aria-label={`Delete board ${board.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
