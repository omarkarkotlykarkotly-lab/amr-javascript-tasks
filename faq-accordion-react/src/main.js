import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

const h = React.createElement;
const ICON_PATHS = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
  moon: '<path d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z"/>',
  display: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  icons: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
  sliders: '<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14"/>',
  caret: '<path d="m6 9 6 6 6-6" fill="currentColor" stroke="none"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  slidersHorizontal: '<path d="M4 7h10m4 0h2M4 17h2m4 0h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  external: '<path d="M14 4h6v6M20 4 11 13"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/><path d="M4 5.5V22M8 7h8M8 11h7"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>'
};

function Icon({ name, size = 18, className = "" }) {
  return h("svg", {
    className: "ui-icon " + className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    focusable: "false",
    "aria-hidden": "true",
    dangerouslySetInnerHTML: { __html: ICON_PATHS[name] || ICON_PATHS.sparkles }
  });
}

const FAQ_ITEMS = [
  {
    value: "virtual-dom",
    question: "What is the Virtual DOM in React?",
    answer: "The Virtual DOM is a lightweight, in-memory representation of the UI. When state or props change, React builds a new representation, compares it with the previous one, and commits the necessary updates to the real DOM. This reconciliation process helps React update interfaces predictably."
  },
  {
    value: "props-state",
    question: "What is the difference between props and state?",
    answer: "Props are inputs passed from a parent component and should be treated as read-only by the receiving component. State is data a component manages over time, usually with a Hook such as useState. Updating state asks React to render the component again with the new value."
  },
  {
    value: "hooks",
    question: "What are React Hooks?",
    answer: "Hooks are functions that let function components use React features such as state, context, refs, and effects. Common examples include useState, useEffect, useContext, useRef, and useMemo. Call Hooks at the top level of a function component or custom Hook, not inside loops or conditions."
  },
  {
    value: "keys",
    question: "Why are keys important when rendering lists?",
    answer: "Keys give sibling elements stable identities so React can match items between renders. Prefer a stable identifier from your data rather than an array index when items may be inserted, removed, or reordered. Good keys help React preserve the correct component state and avoid unnecessary DOM changes."
  },
  {
    value: "use-effect",
    question: "When should you use useEffect?",
    answer: "useEffect synchronizes a component with an external system, for example a subscription, browser API, timer, or network connection. Its dependency list describes the reactive values used by the effect, and the cleanup function releases resources before the effect runs again or the component unmounts."
  },
  {
    value: "controlled",
    question: "What is the difference between controlled and uncontrolled components?",
    answer: "A controlled component receives its current value from props and notifies its parent about changes through a callback. An uncontrolled component keeps its own internal state and may accept an initial defaultValue. Controlled state is useful when several parts of an interface must stay in sync."
  },
  {
    value: "context",
    question: "What problem does the Context API solve?",
    answer: "Context lets a parent provide a value to deeply nested descendants without passing it through every intermediate component as props. It is commonly used for themes, locale, or authenticated-user data. Keep context values focused, because consumers update when the provided value changes."
  },
  {
    value: "memoization",
    question: "When should you use React.memo, useMemo, or useCallback?",
    answer: "React.memo can skip rendering a component when its props have not changed, useMemo caches the result of a calculation, and useCallback caches a function reference. They are performance tools, not default requirements. Measure a real performance issue first, and keep dependencies correct to avoid stale values."
  }
];

const VALUE_OPTIONS = {
  questions: [["4", "4 questions"], ["6", "6 questions"], ["8", "8 questions"]],
  variant: [["filled", "Filled"], ["outlined", "Outlined"], ["ghost", "Ghost"], ["card", "Card"]],
  size: [["sm", "Small (sm)"], ["md", "Medium (md)"], ["lg", "Large (lg)"]],
  icon: [["caret", "Caret"], ["chevron", "Chevron"], ["plus", "Plus / minus"], ["arrow", "Arrow"]],
  position: [["start", "Start"], ["end", "End"]],
  heading: [["h2", "H2"], ["h3", "H3"], ["h4", "H4"], ["h5", "H5"], ["h6", "H6"]],
  type: [["single", "Single"], ["multiple", "Multiple"]]
};

function SelectControl({ label, value, options, onChange, id }) {
  return h("label", { className: "select-control", htmlFor: id },
    h("span", { className: "control-label" }, label),
    h("span", { className: "select-wrap" },
      h("select", { id, value, onChange: (event) => onChange(event.target.value) },
        options.map((option) => h("option", { key: option[0], value: option[0] }, option[1]))
      ),
      h("span", { className: "select-chevron", "aria-hidden": "true" }, h(Icon, { name: "caret", size: 15 }))
    )
  );
}

function SwitchControl({ label, detail, checked, onChange }) {
  return h("div", { className: "switch-control" },
    h("span", { className: "switch-copy" },
      h("span", { className: "control-label" }, label),
      detail ? h("span", { className: "switch-detail" }, detail) : null
    ),
    h("button", {
      type: "button",
      className: "switch",
      role: "switch",
      "aria-checked": checked,
      "aria-label": label,
      onClick: () => onChange(!checked)
    }, h("span", { className: "switch-thumb" }))
  );
}

function SectionTitle({ icon, children }) {
  return h("h3", { className: "sidebar-section-title" },
    h(Icon, { name: icon, size: 15 }),
    h("span", null, children)
  );
}

function normalize(value) {
  return String(value || "").toLowerCase().trim().replace(/\s+/g, " ");
}

function highlightText(text, query) {
  if (!query || !normalize(query)) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = normalize(query);
  const parts = [];
  let cursor = 0;
  let found = lowerText.indexOf(lowerQuery, cursor);
  while (found !== -1) {
    if (found > cursor) parts.push(text.slice(cursor, found));
    parts.push(h("mark", { key: "match-" + found }, text.slice(found, found + lowerQuery.length)));
    cursor = found + lowerQuery.length;
    found = lowerText.indexOf(lowerQuery, cursor);
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts.length ? parts : text;
}

function renderIconName(shape, isOpen) {
  if (shape === "plus") return isOpen ? "minus" : "plus";
  return shape;
}

function QuestionItem({ item, index, isOpen, query, settings, onToggle }) {
  const Heading = settings.headingLevel;
  const iconName = renderIconName(settings.iconShape, isOpen);
  const icon = h(Icon, { name: iconName, size: settings.size === "sm" ? 16 : settings.size === "lg" ? 22 : 18 });
  const iconStart = settings.iconPosition === "start";
  const onKeyDown = (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const container = event.currentTarget.closest(".question-list");
    const triggers = Array.from(container?.querySelectorAll(".question-trigger:not(:disabled)") || []);
    const current = triggers.indexOf(event.currentTarget);
    if (current < 0 || !triggers.length) return;
    let next = current;
    if (event.key === "ArrowDown") next = (current + 1) % triggers.length;
    if (event.key === "ArrowUp") next = (current - 1 + triggers.length) % triggers.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = triggers.length - 1;
    if (next !== current) {
      event.preventDefault();
      triggers[next]?.focus();
    }
  };
  return h("article", {
    className: "question-item" + (isOpen ? " is-open" : ""),
    "data-state": isOpen ? "open" : "closed",
    "data-disabled": settings.disabled ? "true" : undefined,
    style: { "--item-order": index }
  },
    h(Heading, { className: "question-heading" },
      h("button", {
        type: "button",
        className: "question-trigger",
        disabled: settings.disabled,
        "aria-expanded": isOpen,
        "aria-controls": "answer-" + item.value,
        id: "question-" + item.value,
        "data-accordion-trigger": "true",
        onClick: () => onToggle(item.value),
        onKeyDown
      },
        iconStart ? h("span", { className: "question-leading-icon", "aria-hidden": "true" }, icon) : null,
        h("span", { className: "question-number", "aria-hidden": "true" }, String(index + 1).padStart(2, "0")),
        h("span", { className: "question-label" }, highlightText(item.question, query)),
        !iconStart ? h("span", { className: "question-trailing-icon", "aria-hidden": "true" }, icon) : null
      )
    ),
    h("div", {
      className: "question-panel",
      id: "answer-" + item.value,
      role: "region",
      "aria-labelledby": "question-" + item.value,
      "aria-hidden": !isOpen,
      "data-state": isOpen ? "open" : "closed",
      inert: !isOpen
    },
      h("div", { className: "question-panel-inner" },
        h("p", null, highlightText(item.answer, query))
      )
    )
  );
}

function ProgressRing({ percent, tone, label }) {
  const radius = 37;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, percent)) / 100);
  return h("svg", {
    className: "progress-ring " + (tone === "pink" ? "tone-pink" : "tone-blue"),
    viewBox: "0 0 100 100",
    role: "img",
    "aria-label": label + ": " + Math.round(percent) + "%"
  },
    h("circle", { className: "ring-track", cx: 50, cy: 50, r: radius, fill: "none", strokeWidth: 7 }),
    h("circle", {
      className: "ring-value",
      cx: 50, cy: 50, r: radius, fill: "none", strokeWidth: 7,
      strokeDasharray: circumference,
      strokeDashoffset: offset,
      transform: "rotate(-90 50 50)",
      strokeLinecap: "round"
    }),
    h("text", { x: 50, y: 54, textAnchor: "middle", className: "ring-label" }, Math.round(percent) + "%")
  );
}

function syntaxTokens(line) {
  return line.split(/(\/\/.*|<\/?[A-Za-z.]+|\/?>|[A-Za-z-]+(?==)|"[^"]*"|'[^']*'|=|\{[^}]*\})/g).filter((part) => part !== "");
}

function syntaxClass(token) {
  if (token.startsWith("//")) return "syntax-comment";
  if (token.startsWith("</") || token.startsWith("<")) return "syntax-tag";
  if (token.startsWith('"') || token.startsWith("'")) return "syntax-string";
  if (/^[A-Za-z-]+$/.test(token)) return "syntax-attribute";
  if (token === "=") return "syntax-punctuation";
  if (token.startsWith("{")) return "syntax-expression";
  return "";
}

function CodePanel({ code, collapsed, onToggleCollapse }) {
  const [copied, setCopied] = useState(false);
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  }
  const lines = code.split("\n");
  return h("section", { className: "usage-card", "aria-labelledby": "usage-heading" },
    h("div", { className: "usage-heading-row" },
      h("h2", { id: "usage-heading" }, "Usage"),
      h("span", { className: "usage-caption" }, "Generated from your settings")
    ),
    h("div", { className: "code-card" },
      h("div", { className: "code-toolbar" },
        h("div", { className: "code-file" },
          h("span", { className: "code-file-icon" }, h(Icon, { name: "code", size: 16 })),
          h("span", null, "Accordion.jsx"),
          h("span", { className: "code-language" }, "JSX")
        ),
        h("div", { className: "code-actions" },
          h("button", { type: "button", className: "copy-button", onClick: copyCode, "aria-label": "Copy Accordion usage code" },
            h(Icon, { name: copied ? "check" : "copy", size: 14 }),
            copied ? "Copied" : "Copy"
          ),
          h("button", { type: "button", className: "code-collapse-button", onClick: onToggleCollapse, "aria-expanded": !collapsed, "aria-label": collapsed ? "Expand code panel" : "Collapse code panel" },
            h(Icon, { name: "caret", size: 15 })
          )
        )
      ),
      collapsed ? null : h("div", { className: "code-body" },
        h("pre", { className: "code-lines", "aria-label": "Generated Accordion JSX", tabIndex: 0 },
          lines.map((line, i) => h("div", { className: "code-line", key: i },
            h("span", { className: "line-number", "aria-hidden": "true" }, String(i + 1).padStart(2, "0")),
            h("code", null,
              syntaxTokens(line).map((token, j) => h("span", { key: j, className: syntaxClass(token) }, token)),
              line.length === 0 ? "\u00a0" : null
            )
          ))
        )
      ),
      h("div", { className: "code-footer" },
        h("span", null, h(Icon, { name: "checkCircle", size: 14 }), "Live config"),
        h("span", { "aria-live": "polite", className: "copy-status" }, copied ? "Code copied to clipboard" : " "
        )
      )
    )
  );
}

function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === "light" ? "light" : "dark");
  const [questionCount, setQuestionCount] = useState("8");
  const [variant, setVariant] = useState("filled");
  const [size, setSize] = useState("md");
  const [iconShape, setIconShape] = useState("caret");
  const [iconPosition, setIconPosition] = useState("end");
  const [headingLevel, setHeadingLevel] = useState("h3");
  const [type, setType] = useState("single");
  const [collapsible, setCollapsible] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [query, setQuery] = useState("");
  const [openItems, setOpenItems] = useState(() => new Set(["virtual-dom"]));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [codeCollapsed, setCodeCollapsed] = useState(false);
  const effectiveCount = Math.min(Number(questionCount), FAQ_ITEMS.length);
  const baseItems = useMemo(() => FAQ_ITEMS.slice(0, effectiveCount), [effectiveCount]);
  const filteredItems = useMemo(() => {
    const term = normalize(query);
    if (!term) return baseItems;
    return baseItems.filter((item) => normalize(item.question + " " + item.answer).includes(term));
  }, [baseItems, query]);
  const visibleOpenCount = filteredItems.filter((item) => openItems.has(item.value)).length;
  const openPercent = filteredItems.length ? visibleOpenCount / filteredItems.length * 100 : 0;
  const searchPercent = baseItems.length ? filteredItems.length / baseItems.length * 100 : 0;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("accordion-demo-theme", theme); } catch (error) {}
  }, [theme]);

  useEffect(() => {
    function handleKeyboard(event) {
      const target = event.target;
      const isTyping = target instanceof HTMLElement && (
        target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      );
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        document.getElementById("react-question-search")?.focus();
      }
      if (event.key === "Escape") {
        if (query) setQuery("");
        setDrawerOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [query]);

  function toggleQuestion(value) {
    setOpenItems((previous) => {
      const next = new Set(previous);
      if (type === "single") {
        if (next.has(value)) {
          if (collapsible) next.delete(value);
        } else {
          next.clear();
          next.add(value);
        }
      } else if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }

  const settings = { variant, size, iconShape, iconPosition, headingLevel, type, collapsible, animated, disabled, rtl };
  const usageCode = [
    "const questions = [",
    "  // " + effectiveCount + " React interview questions",
    '  { value: "virtual-dom", title: "What is the Virtual DOM?", content: "..." },',
    '  { value: "props-state", title: "Props vs. state", content: "..." },',
    "  // Add the remaining question objects",
    "];",
    "",
    " <Accordion",
    "   items={questions.slice(0, " + effectiveCount + ")}",
    '   type="' + type + '"',
    '   variant="' + variant + '"',
    '   size="' + size + '"',
    '   icon="' + iconShape + '"',
    '   iconPosition="' + iconPosition + '"',
    '   headingLevel="' + headingLevel + '"',
    "   collapsible={" + String(collapsible) + "}",
    "   animated={" + String(animated) + "}",
    "   disabled={" + String(disabled) + "}",
    '   dir="' + (rtl ? "rtl" : "ltr") + '"',
    " />"
  ].join("\n");

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 1060px)").matches) {
      setDrawerOpen((current) => !current);
    } else {
      setSidebarCollapsed((current) => !current);
    }
  }

  return h("div", { className: "page-shell" },
    h("div", { className: "app-window" + (sidebarCollapsed ? " sidebar-collapsed" : "") + (drawerOpen ? " drawer-open" : ""), "data-theme": theme },
      h("div", { className: "window-chrome", "aria-hidden": "true" },
        h("div", { className: "window-dots" }, h("span"), h("span"), h("span")),
        h("span", { className: "window-chrome-label" }, "ACCORD UI  /  INTERACTIVE PLAYGROUND"),
        h("span", { className: "window-chrome-version" }, "PREVIEW")
      ),
      h("button", { type: "button", className: "drawer-backdrop", onClick: () => setDrawerOpen(false), tabIndex: -1, "aria-label": "Close settings panel" }),
      h("aside", { className: "sidebar", "aria-label": "Accordion configuration" },
        h("div", { className: "sidebar-header" },
          h("button", { type: "button", className: "icon-button menu-button", onClick: toggleSidebar, "aria-label": sidebarCollapsed ? "Expand controls" : "Collapse controls", "aria-expanded": !sidebarCollapsed }, h(Icon, { name: "menu", size: 18 })),
          h("span", { className: "sidebar-brand" }, "Accordion"),
          h("button", { type: "button", className: "icon-button theme-button", onClick: () => setTheme(theme === "dark" ? "light" : "dark"), "aria-label": "Switch to " + (theme === "dark" ? "light" : "dark") + " theme", title: "Toggle theme" }, h(Icon, { name: theme === "dark" ? "sun" : "moon", size: 17 }))
        ),
        h("div", { className: "sidebar-scroll" },
          h("section", { className: "sidebar-section" },
            h(SectionTitle, { icon: "display" }, "Display"),
            h(SelectControl, { id: "control-questions", label: "Questions shown", value: questionCount, options: VALUE_OPTIONS.questions, onChange: setQuestionCount }),
            h(SelectControl, { id: "control-variant", label: "Style", value: variant, options: VALUE_OPTIONS.variant, onChange: setVariant }),
            h(SelectControl, { id: "control-size", label: "Size", value: size, options: VALUE_OPTIONS.size, onChange: setSize })
          ),
          h("section", { className: "sidebar-section" },
            h(SectionTitle, { icon: "icons" }, "Icons"),
            h(SelectControl, { id: "control-icon", label: "Icon shape", value: iconShape, options: VALUE_OPTIONS.icon, onChange: setIconShape }),
            h(SelectControl, { id: "control-position", label: "Icon position", value: iconPosition, options: VALUE_OPTIONS.position, onChange: setIconPosition }),
            h(SelectControl, { id: "control-heading", label: "Heading level", value: headingLevel, options: VALUE_OPTIONS.heading, onChange: setHeadingLevel })
          ),
          h("section", { className: "sidebar-section behaviour-section" },
            h(SectionTitle, { icon: "sliders" }, "Behaviour"),
            h(SelectControl, { id: "control-type", label: "Interaction type", value: type, options: VALUE_OPTIONS.type, onChange: (nextType) => {
              setType(nextType);
              if (nextType === "single") setOpenItems((previous) => previous.size ? new Set([previous.values().next().value]) : previous);
            } }),
            h(SwitchControl, { label: "Collapsible", detail: "Close the active question", checked: collapsible, onChange: setCollapsible }),
            h(SwitchControl, { label: "Animated", detail: "Smooth open and close motion", checked: animated, onChange: setAnimated }),
            h(SwitchControl, { label: "Disabled", detail: "Disable all questions", checked: disabled, onChange: setDisabled }),
            h(SwitchControl, { label: "RTL direction", detail: "Right-to-left layout", checked: rtl, onChange: setRtl })
          ),
          h("div", { className: "sidebar-note" }, h(Icon, { name: "sparkles", size: 15 }), h("span", null, "Tune a setting to update the live preview and generated JSX."))
        )
      ),
      h("main", { className: "main-column" },
        h("div", { className: "mobile-mainbar" },
          h("button", { type: "button", className: "icon-button", onClick: () => setDrawerOpen(true), "aria-label": "Open settings" }, h(Icon, { name: "menu", size: 18 })),
          h("span", null, "Accordion Playground")
        ),
        h("div", { className: "page-title-row" },
          h("div", null, h("p", { className: "page-eyebrow" }, "REACT UI TOOLKIT"), h("h1", null, "Component Library")),
          h("span", { className: "build-pill" }, h("span"), "Live preview")
        ),
        h("section", { className: "hero-card" },
          h("div", { className: "hero-sparkle" }, h(Icon, { name: "sparkles", size: 27 })),
          h("p", { className: "hero-kicker" }, "INTERACTIVE PLAYGROUND"),
          h("h2", null, "Explore the Accordion"),
          h("p", { className: "hero-description" }, "Search the React questions below, tune the props from the sidebar, and copy the code."),
          h("label", { className: "hero-search-label", htmlFor: "react-question-search" }, "Search React questions"),
          h("div", { className: "hero-search" },
            h("span", { className: "hero-search-icon" }, h(Icon, { name: "search", size: 19 })),
            h("input", { id: "react-question-search", type: "search", value: query, placeholder: "Search React concepts", onChange: (event) => setQuery(event.target.value), autoComplete: "off" }),
            query ? h("button", { type: "button", className: "clear-search", onClick: () => setQuery(""), "aria-label": "Clear search" }, h(Icon, { name: "close", size: 15 })) : h("kbd", { className: "search-shortcut" }, "/")
          ),
          h("p", { className: "hero-result-count", "aria-live": "polite" }, h("strong", null, filteredItems.length), " ", filteredItems.length === 1 ? "result" : "results", query ? " for “" + query + "”" : "")
        ),
        h("section", { className: "questions-card", "aria-labelledby": "questions-title", dir: rtl ? "rtl" : "ltr" },
          h("div", { className: "questions-card-header" },
            h("div", null, h("p", { className: "section-kicker" }, "LEARN BY EXAMPLE"), h("h2", { id: "questions-title" }, "React interview questions")),
            h("span", { className: "questions-pill" }, h(Icon, { name: "book", size: 14 }), effectiveCount, " questions")
          ),
          h("div", {
            className: "question-list",
            "data-variant": variant,
            "data-size": size,
            "data-animated": animated ? "true" : "false",
            "data-disabled": disabled ? "true" : "false",
            "data-icon-position": iconPosition,
            "data-heading-level": headingLevel
          },
            filteredItems.length
              ? filteredItems.map((item, index) => h(QuestionItem, {
                  key: item.value, item, index, query, settings,
                  isOpen: openItems.has(item.value),
                  onToggle: toggleQuestion
                }))
              : h("div", { className: "empty-state" },
                  h("span", { className: "empty-state-icon" }, h(Icon, { name: "search", size: 23 })),
                  h("h3", null, "No matching questions"),
                  h("p", null, "Try another keyword or clear your search to see all React questions."),
                  h("button", { type: "button", className: "empty-reset", onClick: () => setQuery("") }, "Clear search")
                )
          )
        )
      ),
      h("aside", { className: "right-column", "aria-label": "Live status and code usage" },
        h("section", { className: "status-section", "aria-labelledby": "status-title" },
          h("div", { className: "right-section-header" }, h("h2", { id: "status-title" }, "Live status"), h("span", { className: "live-indicator" }, h("span"), "Updating")),
          h("article", { className: "stat-card stat-card-blue" },
            h(ProgressRing, { percent: openPercent, tone: "blue", label: "Open items" }),
            h("div", { className: "stat-copy" }, h("h3", null, "Open items"), h("p", null, visibleOpenCount, " of ", filteredItems.length, " expanded"), h("span", { className: "stat-footnote" }, "Current results"))
          ),
          h("article", { className: "stat-card stat-card-pink" },
            h(ProgressRing, { percent: searchPercent, tone: "pink", label: "Search matches" }),
            h("div", { className: "stat-copy" }, h("h3", null, "Search matches"), h("p", null, filteredItems.length, " of ", baseItems.length, " shown"), h("span", { className: "stat-footnote" }, query ? "Filtered by search" : "All questions visible"))
          )
        ),
        h(CodePanel, { code: usageCode, collapsed: codeCollapsed, onToggleCollapse: () => setCodeCollapsed((current) => !current) }),
        h("div", { className: "right-note" }, h("span", { className: "right-note-icon" }, h(Icon, { name: "sparkles", size: 15 })), h("p", null, "Every control is connected. Adjust a prop and watch the preview and usage code update instantly."))
      )
    ),
    h("div", { className: "page-footnote" }, h("span", null, "ACCORD UI"), h("span", null, "Accessible by design · Powered by React"), h("a", { href: "https://github.com/omarkarkotlykarkotly-lab/amr-javascript-tasks/tree/main/faq-accordion-react", target: "_blank", rel: "noreferrer" }, "Source code", h(Icon, { name: "external", size: 12 })))
  );
}

createRoot(document.getElementById("root")).render(h(React.StrictMode, null, h(App)));
