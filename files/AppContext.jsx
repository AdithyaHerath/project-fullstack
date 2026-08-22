import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";
import * as boardService from "../services/boardService";
import * as taskService from "../services/taskService";
import * as userService from "../services/userService";

// Central app state: current user, boards, and tasks.
// Components never touch services/mockData directly - they call the
// functions this context exposes. That is the seam Stage 2 will use
// to swap mock services for real API calls without touching components.

const AppContext = createContext(undefined);

const CURRENT_USER_KEY = "collabboard_mock_user";

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = sessionStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [boardsError, setBoardsError] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  // Boards/tasks live behind auth on the server, so only fetch them once a
  // user is logged in. Re-runs whenever currentUser changes (login/logout).
  useEffect(() => {
    let isMounted = true;

    if (!currentUser) {
      setBoards([]);
      setTasks([]);
      return;
    }

    setBoardsLoading(true);
    boardService
      .fetchBoards()
      .then((data) => {
        if (isMounted) setBoards(data);
      })
      .catch(() => {
        if (isMounted) setBoardsError("Unable to load boards.");
      })
      .finally(() => {
        if (isMounted) setBoardsLoading(false);
      });

    setTasksLoading(true);
    taskService
      .fetchTasks()
      .then((data) => {
        if (isMounted) setTasks(data);
      })
      .catch(() => {
        if (isMounted) setTasksError("Unable to load tasks.");
      })
      .finally(() => {
        if (isMounted) setTasksLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const login = useCallback(async (credentials) => {
    const { user } = await authService.login(credentials);
    setCurrentUser(user);
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }, []);

  const register = useCallback(async (details) => {
    const { user } = await authService.register(details);
    return user;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    sessionStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  // Applies a fresh user object (from a profile update or avatar upload) to
  // both state and the sessionStorage copy, so the Navbar etc. update
  // immediately without requiring a re-login.
  const applyCurrentUser = useCallback((user) => {
    setCurrentUser(user);
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      const user = await userService.updateProfile(updates);
      applyCurrentUser(user);
      return user;
    },
    [applyCurrentUser]
  );

  const uploadAvatar = useCallback(
    async (file) => {
      const user = await userService.uploadAvatar(file);
      applyCurrentUser(user);
      return user;
    },
    [applyCurrentUser]
  );

  const createBoard = useCallback(async (title) => {
    const newBoard = await boardService.createBoard({ title });
    setBoards((prev) => [...prev, newBoard]);
    return newBoard;
  }, []);

  const updateBoard = useCallback(async (boardId, updates) => {
    const updated = await boardService.updateBoard(boardId, updates);
    setBoards((prev) => prev.map((b) => (b.id === boardId ? updated : b)));
    return updated;
  }, []);

  const deleteBoard = useCallback(async (boardId) => {
    await boardService.deleteBoard(boardId);
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    setTasks((prev) => prev.filter((t) => t.boardId !== boardId));
  }, []);

  const createTask = useCallback(async (task) => {
    const newTask = await taskService.createTask(task);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    const updated = await taskService.updateTask(taskId, updates);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    await taskService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const changeTaskStatus = useCallback(
    async (taskId, status) => {
      return updateTask(taskId, { status });
    },
    [updateTask]
  );

  const value = useMemo(
    () => ({
      currentUser,
      login,
      register,
      logout,
      updateProfile,
      uploadAvatar,
      boards,
      boardsLoading,
      boardsError,
      createBoard,
      updateBoard,
      deleteBoard,
      tasks,
      tasksLoading,
      tasksError,
      createTask,
      updateTask,
      deleteTask,
      changeTaskStatus,
    }),
    [
      currentUser,
      login,
      register,
      logout,
      updateProfile,
      uploadAvatar,
      boards,
      boardsLoading,
      boardsError,
      createBoard,
      updateBoard,
      deleteBoard,
      tasks,
      tasksLoading,
      tasksError,
      createTask,
      updateTask,
      deleteTask,
      changeTaskStatus,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
}
