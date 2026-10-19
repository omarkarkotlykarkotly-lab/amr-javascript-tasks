import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { useTodoStore, CATEGORIES, PRIORITIES } from "./store.js";

const h = React.createElement;
const FILTERS = [
  { value: "all", label: "الكل" },
  { value: "active", label: "النشطة" },
  { value: "completed", label: "المكتملة" },
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
        "aria-label": task.completed ? "إعادة فتح المهمة" : "إكمال المهمة",
        "aria-pressed": String(task.completed)
      }, task.completed ? "✓" : ""),
      h("div", { className: "task-content" },
        h("strong", { className: "task-title" }, task.title),
        task.description ? h("p", { className: "task-description" }, task.description) : null,
        h("div", { className: "task-badges" },
          h("span", { className: "badge " + task.category }, h("span", { "aria-hidden": "true" }, category.icon), category.label),
          h("span", { className: "badge priority-" + task.priority }, h("span", { "aria-hidden": "true" }, priority.icon), "أولوية " + priority.label)
        )
      )
    ),
    h("div", { className: "task-actions" },
      h("span", { className: "focus-label" }, "◷ جلسات التركيز"),
      h("span", { className: "focus-count", "aria-label": task.pomodoros + " جلسات" }, task.pomodoros),
      h("span", { className: "action-spacer" }),
      h("button", {
        type: "button",
        className: "mini-button",
        onClick: () => addPomodoro(task.id, -1),
        disabled: task.pomodoros === 0,
        "aria-label": "إنقاص جلسة تركيز"
      }, "−"),
      h("button", {
        type: "button",
        className: "mini-button",
        onClick: () => addPomodoro(task.id, 1),
        "aria-label": "إضافة جلسة تركيز"
      }, "+ جلسة"),
      h("button", {
        type: "button",
        className: "mini-button delete",
        onClick: () => deleteTask(task.id),
        "aria-label": "حذف " + task.title
      }, "حذف")
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

  const dateLabel = new Intl.DateTimeFormat("ar", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    addTask({ title, description, category, priority });
    setTitle("");
    setDescription("");
    setCategory("work");
    setPriority("medium");
  }

  return h("main", { className: "app-shell", dir: "rtl" },
    h("div", { className: "ambient ambient-a", "aria-hidden": "true" }),
    h("div", { className: "ambient ambient-b", "aria-hidden": "true" }),
    h("div", { className: "wrap" },
      h("header", { className: "topbar" },
        h("a", { className: "brand", href: "#top", "aria-label": "FocusFlow الرئيسية" },
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
      h("section", { className: "intro", id: "top" },
        h("div", null,
          h("div", { className: "eyebrow" }, "مساحة تركيزك اليومية"),
          h("h1", null, "خلّي يومك ", h("span", null, "أوضح.")),
          h("p", null, "رتّب أولوياتك، أنجز خطوة بخطوة، وراقب تقدمك. مهامك محفوظة تلقائياً في هذا المتصفح.")
        ),
        h("div", { className: "progress-ring", role: "img", "aria-label": "إنجاز " + percentage + " بالمئة" },
          h("span", { className: "ring-value" }, percentage + "%"),
          h("span", { className: "ring-caption" }, "مكتمل")
        )
      ),
      h("section", { className: "stats", "aria-label": "إحصائيات المهام" },
        h(StatCard, { label: "كل المهام", value: total, icon: "▤", note: "كل ما تريد إنجازه" }),
        h(StatCard, { label: "المهام النشطة", value: active, icon: "◷", note: "الخطوات التالية" }),
        h(StatCard, { label: "جلسات التركيز", value: focusSessions, icon: "✦", note: "جلسات بومودورو المسجلة" })
      ),
      h("div", { className: "main-grid" },
        h("section", { className: "panel create-panel" },
          h("header", { className: "panel-head" },
            h("div", null,
              h("h2", { className: "panel-title" }, "مهمة جديدة"),
              h("p", { className: "panel-subtitle" }, "اكتبها، صنّفها، وابدأ.")
            ),
            h("span", { className: "tiny-label" }, "ADD TASK")
          ),
          h("form", { className: "create-form", onSubmit: handleSubmit },
            h("label", { className: "field-label", htmlFor: "task-title" }, "عنوان المهمة"),
            h("input", {
              className: "text-field",
              id: "task-title",
              type: "text",
              value: title,
              onChange: (event) => setTitle(event.target.value),
              placeholder: "مثلاً: مراجعة درس JavaScript",
              maxLength: 120,
              required: true
            }),
            h("label", { className: "field-label", htmlFor: "task-description" }, "وصف مختصر (اختياري)"),
            h("textarea", {
              className: "description-field",
              id: "task-description",
              value: description,
              onChange: (event) => setDescription(event.target.value),
              placeholder: "شو الخطوة الصغيرة اللي بدك تعملها؟",
              rows: 3,
              maxLength: 500
            }),
            h("div", { className: "form-row" },
              h("div", null,
                h("label", { className: "field-label", htmlFor: "task-category" }, "التصنيف"),
                h("select", { className: "select-field", id: "task-category", value: category, onChange: (event) => setCategory(event.target.value) },
                  h("option", { value: "work" }, "عمل"),
                  h("option", { value: "personal" }, "شخصي"),
                  h("option", { value: "study" }, "دراسة")
                )
              ),
              h("div", null,
                h("label", { className: "field-label", htmlFor: "task-priority" }, "الأولوية"),
                h("select", { className: "select-field", id: "task-priority", value: priority, onChange: (event) => setPriority(event.target.value) },
                  h("option", { value: "high" }, "عالية"),
                  h("option", { value: "medium" }, "متوسطة"),
                  h("option", { value: "low" }, "منخفضة")
                )
              )
            ),
            h("button", { type: "submit", className: "submit-button" }, h("span", { "aria-hidden": "true" }, "+"), " إضافة المهمة"),
            h("p", { className: "form-hint" }, "تذكّر: مهمة واحدة واضحة أفضل من عشر مهام مبهمة.")
          )
        ),
        h("section", { className: "panel list-panel" },
          h("header", { className: "panel-head" },
            h("div", null,
              h("h2", { className: "panel-title" }, "قائمة المهام"),
              h("p", { className: "panel-subtitle" }, "خطوات صغيرة، تقدّم مستمر.")
            ),
            h("span", { className: "tiny-label" }, String(filteredTasks.length).padStart(2, "0") + " ITEMS")
          ),
          h("div", { className: "list-toolbar" },
            h("div", { className: "filter-tabs", role: "group", "aria-label": "تصفية المهام" },
              FILTERS.map((item) => h("button", {
                key: item.value,
                type: "button",
                className: "filter-tab" + (filter === item.value ? " is-active" : ""),
                onClick: () => setFilter(item.value),
                "aria-pressed": String(filter === item.value)
              }, item.label))
            ),
            h("button", { className: "clear-button", type: "button", onClick: clearCompleted, disabled: completed === 0 }, "مسح المكتملة")
          ),
          h("div", { className: "search-wrap" },
            h("span", { className: "search-symbol", "aria-hidden": "true" }, "⌕"),
            h("label", { className: "visually-hidden", htmlFor: "task-search" }, "ابحث ضمن المهام"),
            h("input", {
              className: "search-field",
              id: "task-search",
              type: "search",
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "ابحث عن مهمة أو وصف..."
            })
          ),
          h("div", { className: "list-summary" },
            h("span", null, "المكتملة: " + completed + " / " + total),
            h("span", null, percentage + "% إنجاز")
          ),
          h("ul", { className: "task-list", "aria-live": "polite" },
            filteredTasks.length
              ? filteredTasks.map((task) => h(TaskCard, { key: task.id, task }))
              : h("li", { className: "empty-state" },
                  h("span", { className: "empty-icon", "aria-hidden": "true" }, "✦"),
                  h("strong", null, search.trim() ? "ما لقينا نتائج" : filter === "completed" ? "لسّا ما في مهام مكتملة" : filter === "active" ? "كل المهام منجزة!" : "بلّش بأول مهمة"),
                  h("p", null, search.trim() ? "جرّب كلمة ثانية أو امسح البحث." : filter === "active" ? "ممتاز! فيك تضيف مهمة جديدة وقت ما بدك." : "أضف مهمة من النموذج، ورح تظهر هون مباشرة.")
                )
          )
        )
      ),
      h("footer", { className: "bottom-note" },
        h("span", null, h("strong", null, "FOCUSFLOW"), " · تطبيق تدريبي باستخدام React و Zustand"),
        h("span", null, "بياناتك محفوظة محلياً على هذا المتصفح."),
        h("a", { href: "https://github.com/omarkarkotlykarkotly-lab/amr-javascript-tasks/tree/main/zustand-todo-app", target: "_blank", rel: "noreferrer" }, "عرض ملفات المشروع ↗")
      )
    )
  );
}

createRoot(document.getElementById("root")).render(h(React.StrictMode, null, h(App)));
