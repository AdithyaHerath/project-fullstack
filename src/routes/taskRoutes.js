const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { listTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");

const router = express.Router();

router.use(requireAuth);

// GET /api/tasks?boardId=b1
router.get("/", listTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
