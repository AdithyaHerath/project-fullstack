export const mockCredentials = {
  email: "demo@collabboard.com",
  password: "password123",
};

export const mockUsers = [
  {
    id: "user-1",
    name: "Demo User",
    email: "demo@collabboard.com",
    password: "password123",
  },
];

export const initialBoards = [
  {
    id: "board-1",
    title: "Website Redesign",
  },
  {
    id: "board-2",
    title: "Mobile App",
  },
];

export const initialTasks = [
  {
    id: "task-1",
    boardId: "board-1",
    title: "Design homepage",
    description: "Create the initial homepage design.",
    status: "todo",
    priority: "high",
  },
  {
    id: "task-2",
    boardId: "board-1",
    title: "Build navigation",
    description: "Implement the main navigation bar.",
    status: "doing",
    priority: "medium",
  },
  {
    id: "task-3",
    boardId: "board-1",
    title: "Test responsive layout",
    description: "Check the website on different screen sizes.",
    status: "done",
    priority: "low",
  },
  {
    id: "task-4",
    boardId: "board-2",
    title: "Create login screen",
    description: "Design and implement the mobile login screen.",
    status: "todo",
    priority: "high",
  },
];