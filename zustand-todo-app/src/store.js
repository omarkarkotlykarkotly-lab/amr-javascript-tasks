import { create } from "zustand";
import { persist } from "zustand/middleware";

export const CATEGORIES = {
  work: { label: "عمل", icon: "▣" },
  personal: { label: "شخصي", icon: "♡" },
  study: { label: "دراسة", icon: "▤" },
};

export const PRIORITIES = {
  high: { label: "عالية", icon: "↑" },
  medium: { label: "متوسطة", icon: "→" },
  low: { label: "منخفضة", icon: "↓" },
};

const starterTasks = [
  {
    id: "starter-plan",
    title: "تخطيط أولويات اليوم",
    description: "اختر أهم ثلاث مهام وابدأ بالأكثر تأثيراً.",
    category: "work",
    priority: "high",
    completed: false,
    pomodoros: 0,
    createdAt: "2026-10-20T08:00:00.000Z",
  },
  {
    id: "starter-study",
    title: "مراجعة مفاهيم Zustand",
    description: "جرّب إضافة مهمة وإكمالها، ثم حدّث الصفحة للتأكد من حفظ الحالة.",
    category: "study",
    priority: "medium",
    completed: false,
    pomodoros: 1,
    createdAt: "2026-10-20T08:10:00.000Z",
  },
  {
    id: "starter-walk",
    title: "استراحة قصيرة",
    description: "ابتعد عن الشاشة لبضع دقائق ثم ارجع بطاقة جديدة.",
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
      name: "amr-focusflow-todos",
      version: 1,
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
