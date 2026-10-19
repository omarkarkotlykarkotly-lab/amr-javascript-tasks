import { create } from "zustand";
import { persist } from "zustand/middleware";

export const CATEGORIES = {
  work: { label: "Work", icon: "▣" },
  personal: { label: "Personal", icon: "♡" },
  study: { label: "Study", icon: "▤" },
};

export const PRIORITIES = {
  high: { label: "High", icon: "↑" },
  medium: { label: "Medium", icon: "→" },
  low: { label: "Low", icon: "↓" },
};

const starterTasks = [
  {
    id: "starter-plan",
    title: "Plan today's priorities",
    description: "Choose the three most important tasks and start with the one that matters most.",
    category: "work",
    priority: "high",
    completed: false,
    pomodoros: 0,
    createdAt: "2026-10-20T08:00:00.000Z",
  },
  {
    id: "starter-study",
    title: "Review Zustand concepts",
    description: "Add a task, mark it complete, then refresh the page to check persistence.",
    category: "study",
    priority: "medium",
    completed: false,
    pomodoros: 1,
    createdAt: "2026-10-20T08:10:00.000Z",
  },
  {
    id: "starter-break",
    title: "Take a short break",
    description: "Step away from the screen for a few minutes, then return refreshed.",
    category: "personal",
    priority: "low",
    completed: true,
    pomodoros: 1,
    createdAt: "2026-10-20T08:20:00.000Z",
  },
];

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useTodoStore = create(
  persist(
    (set) => ({
      tasks: starterTasks,
      filter: "all",
      addTask: ({ title, description, category, priority }) => {
        const cleanTitle = String(title || "").trim();
        if (!cleanTitle) return;
        const newTask = {
          id: createId(),
          title: cleanTitle,
          description: String(description || "").trim(),
          category: CATEGORIES[category] ? category : "work",
          priority: PRIORITIES[priority] ? priority : "medium",
          completed: false,
          pomodoros: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      setFilter: (filter) => set({ filter }),
      addPomodoro: (id, amount) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, pomodoros: Math.max(0, task.pomodoros + (amount || 1)) }
              : task
          ),
        })),
      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
        })),
    }),
    {
      name: "amr-focusflow-todos-en",
      version: 2,
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
