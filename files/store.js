// Milestone 2 - in-memory data store.
// MongoDB/Mongoose (Milestone 3) will replace this module without changing
// the controllers, since controllers only call the functions exported here.

const bcrypt = require("bcryptjs");

const TASK_STATUSES = ["todo", "doing", "done"];

// Seeded so the API behaves like the Stage 1 mock data the frontend already knows.
const users = [
  {
    id: "u1",
    name: "John Silva",
    email: "student@collabboard.com",
    // password123
    passwordHash: bcrypt.hashSync("password123", 10),
    bio: "",
    avatarUrl: "",
  },
];

let boards = [
  { id: "b1", title: "Website Redesign" },
  { id: "b2", title: "Mobile App Project" },
  { id: "b3", title: "University Assignment" },
];

let tasks = [
  { id: "t1", boardId: "b1", title: "Create wireframe", description: "Create homepage wireframe", status: "todo", assignedTo: "John Silva" },
  { id: "t2", boardId: "b1", title: "Build login page", description: "Implement login UI", status: "doing", assignedTo: "Amal" },
  { id: "t3", boardId: "b1", title: "Create repository", description: "Initialize GitHub repository", status: "done", assignedTo: "Nimal" },
  { id: "t4", boardId: "b1", title: "Design Homepage", description: "Create the initial homepage layout.", status: "todo", assignedTo: "Alex" },
  { id: "t5", boardId: "b2", title: "Set up navigation", description: "Add bottom tab navigation to the app.", status: "todo", assignedTo: "Amal" },
  { id: "t6", boardId: "b2", title: "Design app icon", description: "Create the app icon and splash screen.", status: "doing", assignedTo: "" },
  { id: "t7", boardId: "b3", title: "Write project proposal", description: "Draft the initial proposal document for review.", status: "done", assignedTo: "John Silva" },
];

let nextBoardId = boards.length + 1;
let nextTaskId = tasks.length + 1;
let nextUserId = users.length + 1;

module.exports = {
  TASK_STATUSES,

  // --- users ---
  findUserByEmail(email) {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById(id) {
    return users.find((u) => u.id === id);
  },
  createUser({ name, email, passwordHash }) {
    const user = { id: `u${nextUserId++}`, name, email, passwordHash, bio: "", avatarUrl: "" };
    users.push(user);
    return user;
  },
  updateUser(id, updates) {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    return users[idx];
  },

  // --- boards ---
  getBoards() {
    return [...boards];
  },
  getBoardById(id) {
    return boards.find((b) => b.id === id);
  },
  createBoard({ title }) {
    const board = { id: `b${nextBoardId++}`, title };
    boards.push(board);
    return board;
  },
  updateBoard(id, updates) {
    boards = boards.map((b) => (b.id === id ? { ...b, ...updates } : b));
    return this.getBoardById(id);
  },
  deleteBoard(id) {
    boards = boards.filter((b) => b.id !== id);
    tasks = tasks.filter((t) => t.boardId !== id);
  },

  // --- tasks ---
  getTasks() {
    return [...tasks];
  },
  getTasksByBoard(boardId) {
    return tasks.filter((t) => t.boardId === boardId);
  },
  getTaskById(id) {
    return tasks.find((t) => t.id === id);
  },
  createTask(task) {
    const newTask = { id: `t${nextTaskId++}`, assignedTo: "", ...task };
    tasks.push(newTask);
    return newTask;
  },
  updateTask(id, updates) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    return this.getTaskById(id);
  },
  deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
  },
};
