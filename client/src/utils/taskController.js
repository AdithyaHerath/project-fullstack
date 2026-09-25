const store = require("../data/store");

function listTasks(req, res) {
  const { boardId } = req.query;
  const tasks = boardId ? store.getTasksByBoard(boardId) : store.getTasks();
  return res.status(200).json({ tasks });
}

function createTask(req, res) {
  const { boardId, title, description, status, assignedTo } = req.body || {};

  if (!boardId || !store.getBoardById(boardId)) {
    return res.status(400).json({ message: "A valid boardId is required." });
  }
  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task title is required." });
  }
  if (!status || !store.TASK_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${store.TASK_STATUSES.join(", ")}.` });
  }

  const task = store.createTask({
    boardId,
    title: title.trim(),
    description: (description || "").trim(),
    status,
    assignedTo: (assignedTo || "").trim(),
  });

  return res.status(201).json({ task });
}

function updateTask(req, res) {
  const { id } = req.params;
  const task = store.getTaskById(id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  const { title, description, status, assignedTo } = req.body || {};

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ message: "Task title cannot be empty." });
  }
  if (status !== undefined && !store.TASK_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${store.TASK_STATUSES.join(", ")}.` });
  }

  const updates = {};
  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description.trim();
  if (status !== undefined) updates.status = status;
  if (assignedTo !== undefined) updates.assignedTo = assignedTo.trim();

  const updated = store.updateTask(id, updates);
  return res.status(200).json({ task: updated });
}

function deleteTask(req, res) {
  const { id } = req.params;
  const task = store.getTaskById(id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  store.deleteTask(id);
  return res.status(204).send();
}

module.exports = { listTasks, createTask, updateTask, deleteTask };
