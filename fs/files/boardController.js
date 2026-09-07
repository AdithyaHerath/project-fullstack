const store = require("../data/store");

function listBoards(req, res) {
  return res.status(200).json({ boards: store.getBoards() });
}

function createBoard(req, res) {
  const { title } = req.body || {};
  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Board title is required." });
  }
  const board = store.createBoard({ title: title.trim() });
  return res.status(201).json({ board });
}

function updateBoard(req, res) {
  const { id } = req.params;
  const board = store.getBoardById(id);
  if (!board) return res.status(404).json({ message: "Board not found." });

  const { title } = req.body || {};
  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ message: "Board title cannot be empty." });
  }

  const updated = store.updateBoard(id, title !== undefined ? { title: title.trim() } : {});
  return res.status(200).json({ board: updated });
}

function deleteBoard(req, res) {
  const { id } = req.params;
  const board = store.getBoardById(id);
  if (!board) return res.status(404).json({ message: "Board not found." });

  store.deleteBoard(id);
  return res.status(204).send();
}

module.exports = { listBoards, createBoard, updateBoard, deleteBoard };
