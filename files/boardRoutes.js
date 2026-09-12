const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { listBoards, createBoard, updateBoard, deleteBoard } = require("../controllers/boardController");

const router = express.Router();

router.use(requireAuth);

router.get("/", listBoards);
router.post("/", createBoard);
router.patch("/:id", updateBoard);
router.delete("/:id", deleteBoard);

module.exports = router;
