import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { useTodoStore, CATEGORIES, PRIORITIES } from "./store.js";

const h = React.createElement;
const FILTERS = [
  { value: "all", label: "All tasks" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

function StatCard({ label, value, icon, note }) {
  return h("article", { className: "stat-card" },
    h("div", { className: "stat-top" },
      h("span", null, label),
      h("span", { className: "stat-icon", "aria-hidden": "true" }, icon)
    ),
    h("strong", { className: "stat-number" }, value),
    h("span", { className: "stat-foot" }, note)
  );
}

function TaskCard({ task }) {
  const toggleTask = useTodoStore((state) => state.toggleTask);
  const deleteTask = useTodoStore((state) => state.deleteTask);
  const addPomodoro = useTodoStore((state) => state.addPomodoro);
  const category = CATEGORIES[task.category] || CATEGORIES.work;
  const priority = PRIORITIES[task.priority] || PRIORITIES.medium;

  return h("li", { className: "task-card priority-" + task.priority + (task.completed ? " is-complete" : "") },
    h("div", { className: "task-main" },
      h("button", {
        type: "button",
        className: "complete-button" + (task.completed ? " is-complete" : ""),
        onClick: () => toggleTask(task.id),
        "aria-label": task.completed ? "Mark task as active" : "Complete task",
        "aria-pressed": String(task.completed)
      }, task.completed ? "✓" : ""),
      h("div", { className: "task-content" },
        h("strong", { className: "task-title" }, task.title),
        task.description ? h("p", { className: "task-description" }, task.description) : null,
        h("div", { className: "task-badges" },
          h("span", { className: "badge " + task.category }, h("span", { "aria-hidden": "true" }, category.icon), category.label),
          h("span", { className: "badge priority-" + task.priority }, h("span", { "aria-hidden": "true" }, priority.icon), priority.label + " priority")
        )
      )
    ),
    h("div", { className: "task-actions" },
      h("span", { className: "focus-label" }, "◷ Focus sessions"),
      h("span", { className: "focus-count", "aria-label": task.pomodoros + " focus sessions" }, task.pomodoros),
      h("span", { className: "action-spacer" }),
      h("button", {
        type: "button",
        className: "mini-button",
        onClick: () => addPomodoro(task.id, -1),
        disabled: task.pomodoros === 0,
        "aria-label": "Remove a focus session"
      }, "−"),
      h("button", {
        type: "button",
        className: "mini-button",
        onClick: () => addPomodoro(task.id, 1),
        "aria-label": "Add a focus session"
      }, "+ Session"),
      h("button", {
        type: "button",
        className: "mini-button delete",
        onClick: () => deleteTask(task.id),
        "aria-label": "Delete " + task.title
      }, "Delete")
    )
  );
}

function App() {
  const tasks = useTodoStore((state) => state.tasks);
  const filter = useTodoStore((state) => state.filter);
  const addTask = useTodoStore((state) => state.addTask);
  const setFilter = useTodoStore((state) => state.setFilter);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("work");
  const [priority, setPriority] = useState("medium");
  const [search, setSearch] = useState("");

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;
  const focusSessions = tasks.reduce((sum, task) => sum + task.pomodoros, 0);
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed);
    const matchesSearch = (task.title + " " + task.description).toLowerCase().includes(search.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  }), [tasks, filter, search]);

  const dateLabel = new Intl.DateTimeFormat("en-US", { weekday: "short", day: "numeric", month: "short" }).format(new Date());

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    addTask({ title, description, category, priority });
    setTitle("");
    setDescription("");
    setCategory("work");
    setPriority("medium");
    document.getElementById("task-title")?.focus();
  }

  const emptyTitle = search.trim()
    ? "No matching tasks"
    : filter === "completed"
      ? "No completed tasks yet"
      : filter === "active"
        ? "You're all caught up!"
        : "Start with your first task";
  const emptyText = search.trim()
    ? "Try another keyword or clear your search."
    : filter === "active"
      ? "Great work! Add a new task whenever you're ready."
      : "Add a task using the form and it will appear here.";

  return h("main", { className: "app-shell", dir: "ltr", id: "top" },
    h("div", { className: "ambient ambient-a", "aria-hidden": "true" }),
    h("div", { className: "ambient ambient-b", "aria-hidden": "true" }),
    h("div", { className: "wrap" },
      h("header", { className: "topbar" },
        h("a", { className: "brand", href: "#top", "aria-label": "FocusFlow home" },
          h("span", { className: "brand-icon", "aria-hidden": "true" }, "F"),
          h("span", null,
            h("span", { className: "brand-name" }, "FocusFlow"),
            h("span", { className: "brand-caption" }, "Zustand task manager")
          )
        ),
        h("div", { className: "header-actions" },
          h("span", { className: "today-chip" }, dateLabel),
          h("span", { className: "avatar", title: "Your workspace" }, "AMR")
        )
      ),
      h("section", { className: "intro" },
        h("div", null,
          h("div", { className: "eyebrow" }, "YOUR DAILY FOCUS SPACE"),
          h("h1", null, "Make your day ", h("span", null, "clearer.")),
          h("p", null, "Organize your priorities, make progress one step at a time, and track what you accomplish. Your tasks are saved automatically in this browser.")
        ),
        h("div", { className: "progress-ring", role: "img", "aria-label": "Complete " + percentage + " percent" },
          h("span", { className: "ring-value" }, percentage + "%"),
          h("span", { className: "ring-caption" }, "complete")
        )
      ),
      h("section", { className: "stats", "aria-label": "Task statistics" },
        h(StatCard, { label: "Total tasks", value: total, icon: "▤", note: "Everything on your list" }),
        h(StatCard, { label: "Active tasks", value: active, icon: "◷", note: "Your next steps" }),
        h(StatCard, { label: "Focus sessions", value: focusSessions, icon: "✦", note: "Pomodoro sessions logged" })
      ),
      h("div", { className: "main-grid" },
        h("section", { className: "panel create-panel" },
          h("header", { className: "panel-head" },
            h("div", null,
              h("h2", { className: "panel-title" }, "Create a task"),
              h("p", { className: "panel-subtitle" }, "Write it down, organize it, and get started.")
            ),
            h("span", { className: "tiny-label" }, "ADD TASK")
          ),
          h("form", { className: "create-form", onSubmit: handleSubmit },
            h("label", { className: "field-label", htmlFor: "task-title" }, "Task title"),
            h("input", {
              className: "text-field",
              id: "task-title",
              type: "text",
              value: title,
              onChange: (event) => setTitle(event.target.value),
              placeholder: "e.g. Review a JavaScript lesson",
              maxLength: 120,
              required: true
            }),
            h("label", { className: "field-label", htmlFor: "task-description" }, "Description (optional)"),
            h("textarea", {
              className: "description-field",
              id: "task-description",
              value: description,
              onChange: (event) => setDescription(event.target.value),
              placeholder: "What is the next small step?",
              rows: 3,
              maxLength: 500
            }),
            h("div", { className: "form-row" },
              h("div", null,
                h("label", { className: "field-label", htmlFor: "task-category" }, "Category"),
                h("select", { className: "select-field", id: "task-category", value: category, onChange: (event) => setCategory(event.target.value) },
                  h("option", { value: "work" }, "Work"),
                  h("option", { value: "personal" }, "Personal"),
                  h("option", { value: "study" }, "Study")
                )
              ),
              h("div", null,
                h("label", { className: "field-label", htmlFor: "task-priority" }, "Priority"),
                h("select", { className: "select-field", id: "task-priority", value: priority, onChange: (event) => setPriority(event.target.value) },
                  h("option", { value: "high" }, "High"),
                  h("option", { value: "medium" }, "Medium"),
                  h("option", { value: "low" }, "Low")
                )
              )
            ),
            h("button", { type: "submit", className: "submit-button" }, h("span", { "aria-hidden": "true" }, "+"), " Add task"),
            h("p", { className: "form-hint" }, "One clear task is better than ten vague ones.")
          )
        ),
        h("section", { className: "panel list-panel" },
          h("header", { className: "panel-head" },
            h("div", null,
              h("h2", { className: "panel-title" }, "Your task list"),
              h("p", { className: "panel-subtitle" }, "Small steps. Steady progress.")
            ),
            h("span", { className: "tiny-label" }, String(filteredTasks.length).padStart(2, "0") + " ITEMS")
          ),
          h("div", { className: "list-toolbar" },
            h("div", { className: "filter-tabs", role: "group", "aria-label": "Filter tasks" },
              FILTERS.map((item) => h("button", {
                key: item.value,
                type: "button",
                className: "filter-tab" + (filter === item.value ? " is-active" : ""),
                onClick: () => setFilter(item.value),
                "aria-pressed": String(filter === item.value)
              }, item.label))
            ),
            h("button", { className: "clear-button", type: "button", onClick: clearCompleted, disabled: completed === 0 }, "Clear completed")
          ),
          h("div", { className: "search-wrap" },
            h("span", { className: "search-symbol", "aria-hidden": "true" }, "⌕"),
            h("label", { className: "visually-hidden", htmlFor: "task-search" }, "Search tasks"),
            h("input", {
              className: "search-field",
              id: "task-search",
              type: "search",
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Search tasks or descriptions..."
            })
          ),
          h("div", { className: "list-summary" },
            h("span", null, "Completed: " + completed + " / " + total),
            h("span", null, percentage + "% complete")
          ),
          h("ul", { className: "task-list", "aria-live": "polite" },
            filteredTasks.length
              ? filteredTasks.map((task) => h(TaskCard, { key: task.id, task }))
              : h("li", { className: "empty-state" },
                  h("span", { className: "empty-icon", "aria-hidden": "true" }, "✦"),
                  h("strong", null, emptyTitle),
                  h("p", null, emptyText)
                )
          )
        )
      ),
      h("footer", { className: "bottom-note" },
        h("span", null, h("strong", null, "FOCUSFLOW"), " · A practice project built with React and Zustand"),
        h("span", null, "Your tasks are saved locally in this browser."),
        h("a", { href: "https://github.com/omarkarkotlykarkotly-lab/amr-javascript-tasks/tree/main/zustand-todo-app", target: "_blank", rel: "noreferrer" }, "View project files ↗")
      )
    )
  );
}

createRoot(document.getElementById("root")).render(h(React.StrictMode, null, h(App)));
