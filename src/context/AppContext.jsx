import { createContext, useContext, useEffect, useState } from "react";
import {
  mockUsers,
  initialBoards,
  initialTasks,
} from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("collabboard_current_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("collabboard_users");

    return savedUsers ? JSON.parse(savedUsers) : mockUsers;
  });

  const [boards, setBoards] = useState(() => {
    const savedBoards = localStorage.getItem("collabboard_boards");

    return savedBoards ? JSON.parse(savedBoards) : initialBoards;
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("collabboard_tasks");

    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  const [boardsLoading, setBoardsLoading] = useState(true);
  const [boardsError, setBoardsError] = useState("");

  // Simulate loading boards
  useEffect(() => {
    const timer = setTimeout(() => {
      setBoardsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Save users whenever they change
  useEffect(() => {
    localStorage.setItem("collabboard_users", JSON.stringify(users));
  }, [users]);

  // Save current user whenever login state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "collabboard_current_user",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem("collabboard_current_user");
    }
  }, [currentUser]);

  // Save boards whenever they change
  useEffect(() => {
    localStorage.setItem("collabboard_boards", JSON.stringify(boards));
  }, [boards]);

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem("collabboard_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // -------------------------
  // Authentication
  // -------------------------

  async function login({ email, password }) {
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    setCurrentUser(safeUser);

    return safeUser;
  }

  async function register({ name, email, password }) {
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);

    return newUser;
  }

  function logout() {
    setCurrentUser(null);
  }

  // -------------------------
  // Boards
  // -------------------------

  async function createBoard(title) {
    const newBoard = {
      id: `board-${Date.now()}`,
      title,
    };

    setBoards((prevBoards) => [...prevBoards, newBoard]);

    return newBoard;
  }

  async function deleteBoard(boardId) {
    setBoards((prevBoards) =>
      prevBoards.filter((board) => board.id !== boardId)
    );

    // Delete all tasks belonging to the board
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.boardId !== boardId)
    );
  }

  // -------------------------
  // Tasks
  // -------------------------

  async function createTask(taskData) {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    return newTask;
  }

  async function updateTask(updatedTask) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );

    return updatedTask;
  }

  async function deleteTask(taskId) {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
  }

  async function updateTaskStatus(taskId, newStatus) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  }

  const value = {
    currentUser,

    login,
    register,
    logout,

    boards,
    boardsLoading,
    boardsError,

    createBoard,
    deleteBoard,

    tasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside an AppProvider");
  }

  return context;
}