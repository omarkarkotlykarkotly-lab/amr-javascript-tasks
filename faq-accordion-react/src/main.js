import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const h = React.createElement;

const FAQ_ITEMS = [
  {
    id: "getting-started",
    category: "Getting Started",
    question: "How do I get started?",
    answer: "Start by adding your first task or exploring the examples on this page. Each section is designed to be easy to understand, and you can change your selections at any time."
  },
  {
    id: "account",
    category: "Account & Settings",
    question: "Can I update my account details later?",
    answer: "Yes. You can update your profile details and preferences whenever you need to. Save your changes before leaving the settings page so your latest information is kept."
  },
  {
    id: "plans",
    category: "Billing",
    question: "Can I change or cancel a plan later?",
    answer: "Plan changes depend on the service you use. In a typical subscription dashboard, you can review available plans and manage cancellation from the billing or account settings page."
  },
  {
    id: "security",
    category: "Privacy & Security",
    question: "How is my information protected?",
    answer: "Use a strong, unique password and enable two-factor authentication whenever it is available. A real service should clearly explain its privacy practices, data retention, and security controls."
  },
  {
    id: "mobile",
    category: "Features",
    question: "Does the page work on mobile devices?",
    answer: "Yes. This FAQ layout adapts to phones, tablets, and desktop screens. Buttons have touch-friendly sizes, and the content reflows so questions remain readable on smaller displays."
  },
  {
    id: "support",
    category: "Support",
    question: "How can I contact support?",
    answer: "Use the contact method provided by the service, such as its help center or support email. When you reach out, include a brief description of the issue and any relevant steps to reproduce it."
  },
  {
    id: "multiple",
    category: "Features",
    question: "Can I open more than one answer at a time?",
    answer: "Yes. This accordion supports multiple open items. You can expand several answers while comparing information, or use the controls above the list to open or close all currently visible questions."
  },
  {
    id: "search",
    category: "Features",
    question: "How does the FAQ search work?",
    answer: "Type a keyword into the search field. The list filters as you type and checks both question titles and answer text. You can combine search with a topic filter, and clear the search to see the full list again."
  },
  {
    id: "accessibility",
    category: "Accessibility",
    question: "Can I use the accordion with a keyboard?",
    answer: "Yes. Each question is a real button, so it can be reached with Tab and toggled with Enter or Space. The expanded state is exposed with aria-expanded, and each answer panel is connected to its question using ARIA attributes."
  }
];

const ALL_TOPICS = "All topics";

function normalize(text) {
  return String(text || "").toLowerCase().trim().replace(/\s+/g, " ");
}

function App() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_TOPICS);
  const [openIds, setOpenIds] = useState(() => new Set(["getting-started"]));

  const categories = useMemo(
    () => [ALL_TOPICS, ...new Set(FAQ_ITEMS.map((item) => item.category))],
    []
  );

  const searchedItems = useMemo(() => {
    const searchTerm = normalize(query);
    if (!searchTerm) return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) =>
      normalize(item.question + " " + item.answer + " " + item.category).includes(searchTerm)
    );
  }, [query]);

  const visibleItems = useMemo(
    () => activeCategory === ALL_TOPICS
      ? searchedItems
      : searchedItems.filter((item) => item.category === activeCategory),
    [searchedItems, activeCategory]
  );

  const openedVisibleCount = visibleItems.filter((item) => openIds.has(item.id)).length;

  function toggleItem(id) {
    setOpenIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandVisible() {
    setOpenIds((previous) => new Set([...previous, ...visibleItems.map((item) => item.id)]));
  }

  function collapseVisible() {
    setOpenIds((previous) => {
      const next = new Set(previous);
      visibleItems.forEach((item) => next.delete(item.id));
      return next;
    });
  }

  function resetFilters() {
    setQuery("");
    setActiveCategory(ALL_TOPICS);
  }

  return h("div", { className: "page-shell", id: "top" },
    h("div", { className: "background-orb orb-one", "aria-hidden": "true" }),
    h("div", { className: "background-orb orb-two", "aria-hidden": "true" }),
    h("header", { className: "topbar" },
      h("a", { className: "brand", href: "#top", "aria-label": "AMR FAQ home" },
        h("span", { className: "brand-symbol", "aria-hidden": "true" }, "?"),
        h("span", { className: "brand-copy" },
          h("strong", null, "AMR / HELP CENTER"),
          h("small", null, "React accordion project")
        )
      ),
      h("a", {
        className: "top-link",
        href: "https://github.com/omarkarkotlykarkotly-lab/amr-javascript-tasks/tree/main/faq-accordion-react",
        target: "_blank",
        rel: "noreferrer"
      }, "View source code ", h("span", { className: "arrow", "aria-hidden": "true" }, "↗"))
    ),
    h("main", { className: "layout" },
      h("section", { className: "intro", "aria-labelledby": "page-title" },
        h("span", { className: "kicker" },
          h("span", { className: "kicker-dot", "aria-hidden": "true" }),
          "QUICK ANSWERS, CLEARER DAYS"
        ),
        h("h1", { id: "page-title" }, "Questions? ", h("span", null, "Answered.")),
        h("p", { className: "intro-copy" },
          "Browse our frequently asked questions to find helpful information about the features, settings, and support. Search for a topic or explore a category to get the answer you need."
        ),
        h("div", { className: "intro-rule", "aria-hidden": "true" }),
        h("aside", { className: "help-card" },
          h("span", { className: "help-card-icon", "aria-hidden": "true" }, "↗"),
          h("strong", null, "Still need a hand?"),
          h("p", null, "If you cannot find what you are looking for, check the source code or send the team a question."),
          h("a", {
            href: "https://github.com/omarkarkotlykarkotly-lab/amr-javascript-tasks",
            target: "_blank",
            rel: "noreferrer"
          }, "Visit the GitHub repository ", h("span", { "aria-hidden": "true" }, "→"))
        )
      ),
      h("section", { className: "faq-column", "aria-labelledby": "faq-heading" },
        h("header", { className: "faq-heading" },
          h("div", null,
            h("h2", { id: "faq-heading" }, "Frequently asked questions"),
            h("p", null, "Find answers in a few clicks.")
          ),
          h("span", { className: "faq-counter" }, String(visibleItems.length).padStart(2, "0") + " / " + FAQ_ITEMS.length)
        ),
        h("div", { className: "search-wrap" },
          h("label", { className: "visually-hidden", htmlFor: "faq-search" }, "Search questions and answers"),
          h("span", { className: "search-icon", "aria-hidden": "true" }, "⌕"),
          h("input", {
            id: "faq-search",
            className: "search-input",
            type: "search",
            placeholder: "Search questions or keywords...",
            value: query,
            onChange: (event) => setQuery(event.target.value),
            autoComplete: "off"
          }),
          h("button", {
            type: "button",
            className: "clear-search",
            onClick: () => setQuery(""),
            "aria-label": "Clear search",
            hidden: !query
          }, "×")
        ),
        h("div", { className: "category-tabs", role: "group", "aria-label": "Filter by topic" },
          categories.map((category) => {
            const count = category === ALL_TOPICS
              ? searchedItems.length
              : searchedItems.filter((item) => item.category === category).length;
            return h("button", {
              key: category,
              type: "button",
              className: "category-tab" + (activeCategory === category ? " is-active" : ""),
              onClick: () => setActiveCategory(category),
              "aria-pressed": String(activeCategory === category)
            },
              category,
              h("span", { className: "tab-count" }, count)
            );
          })
        ),
        h("div", { className: "list-toolbar" },
          h("p", { className: "results-text", "aria-live": "polite" },
            "Showing ",
            h("strong", null, visibleItems.length),
            " of ",
            h("strong", null, FAQ_ITEMS.length),
            " questions · ",
            h("strong", null, openedVisibleCount),
            " open"
          ),
          h("div", { className: "toolbar-actions" },
            h("button", {
              type: "button",
              className: "toolbar-button",
              onClick: expandVisible,
              disabled: visibleItems.length === 0 || openedVisibleCount === visibleItems.length
            }, "Expand all"),
            h("button", {
              type: "button",
              className: "toolbar-button",
              onClick: collapseVisible,
              disabled: openedVisibleCount === 0
            }, "Collapse all")
          )
        ),
        visibleItems.length
          ? h("div", { className: "accordion-list" },
              visibleItems.map((item, index) => h(AccordionItem, {
                key: item.id,
                item,
                index: index + 1,
                isOpen: openIds.has(item.id),
                onToggle: () => toggleItem(item.id)
              }))
            )
          : h("div", { className: "empty-state" },
              h("span", { className: "empty-icon", "aria-hidden": "true" }, "⌕"),
              h("strong", null, "No matching questions"),
              h("p", null, "Try another keyword or select a different topic."),
              h("button", { className: "reset-button", type: "button", onClick: resetFilters }, "Reset filters")
            )
      )
    ),
    h("footer", { className: "page-footer" },
      h("span", null, "AMR · FAQ ACCORDION · BUILT WITH REACT"),
      h("span", null, "Responsive · Keyboard friendly · ",
        h("a", { href: "https://github.com/omarkarkotlykarkotly-lab/amr-javascript-tasks", target: "_blank", rel: "noreferrer" }, "Open source code")
      )
    )
  );
}

function AccordionItem({ item, index, isOpen, onToggle }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.style.maxHeight = isOpen ? panel.scrollHeight + "px" : "0px";
  }, [isOpen, item.answer]);

  const questionId = "question-" + item.id;
  const answerId = "answer-" + item.id;

  return h("article", { className: "faq-item" + (isOpen ? " is-open" : "") },
    h("button", {
      type: "button",
      id: questionId,
      className: "question-button",
      onClick: onToggle,
      "aria-expanded": String(isOpen),
      "aria-controls": answerId
    },
      h("span", { className: "question-number", "aria-hidden": "true" }, String(index).padStart(2, "0")),
      h("span", { className: "question-copy" },
        h("span", { className: "question-category" }, item.category),
        h("span", { className: "question-title" }, item.question)
      ),
      h("span", { className: "toggle-icon", "aria-hidden": "true" })
    ),
    h("div", {
      id: answerId,
      ref: panelRef,
      className: "answer-panel",
      role: "region",
      "aria-labelledby": questionId,
      "aria-hidden": String(!isOpen)
    },
      h("div", { className: "answer-inner" },
        h("div", { className: "answer-divider", "aria-hidden": "true" }),
        h("p", { className: "answer-copy" }, item.answer)
      )
    )
  );
}

createRoot(document.getElementById("root")).render(h(React.StrictMode, null, h(App)));
