import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

const h = React.createElement;
const SOURCE_URL = "https://github.com/omarkarkotlykarkotly-lab/amr-javascript-tasks/tree/main/faq-accordion-react";
const ICONS = {
  sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  arrow: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/><path d="M4 5.5V22M8 7h8M8 11h7"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  keyboard: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h.01M11 9h.01M15 9h.01M7 12h.01M11 12h.01M15 12h.01M8 15h8"/>',
  message: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.8-4.8A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 11h8M8 14h5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1.5A5.5 5.5 0 0 1 9.5 14h5a5.5 5.5 0 0 1 5.5 5.5V21"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  rocket: '<path d="M5 15c-2 1-2.5 4-2.5 4S5.5 18.5 7 16"/><path d="M9 14.5 6 11.5c2-5 6-8 13-8 0 7-3 11-8 13l-2-2Z"/><path d="M13 8a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/><path d="m9 15-1 4 4-1"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  external: '<path d="M14 4h6v6M20 4 11 13"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-1.1 1-1.7 1.3-1.7 2.7M12 17h.01"/>'
};

function Icon({ name, size = 20, className = "" }) {
  return h("svg", {
    className: "icon " + className, width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round",
    strokeLinejoin: "round", "aria-hidden": "true", focusable: "false",
    dangerouslySetInnerHTML: { __html: ICONS[name] || ICONS.help }
  });
}

const ALL_TOPICS = "All topics";
const TOPICS = [
  { name: "Getting Started", icon: "rocket" },
  { name: "Account & Settings", icon: "user" },
  { name: "Billing & Plans", icon: "card" },
  { name: "Privacy & Security", icon: "shield" },
  { name: "Features", icon: "layers" },
  { name: "Support", icon: "message" },
  { name: "Accessibility", icon: "keyboard" }
];

const FAQ_ITEMS = [
  { id: "start", category: "Getting Started", question: "Where should I start if I’m new here?", answer: "Start with the topic tabs to browse the help center by subject, or type a keyword into search. Open any question to read its answer. You can keep several answers open while comparing information, and use Expand all or Collapse all to manage the current list." },
  { id: "find-topic", category: "Getting Started", question: "How do I find the answer I need faster?", answer: "Search checks the question text, answer text, and category names as you type. You can combine search with a topic tab to narrow the list further. Try a short keyword first, then refine it if you see too many results." },
  { id: "profile", category: "Account & Settings", question: "Can I update my account details later?", answer: "On most services, profile details and preferences can be changed from an Account or Settings area. Review your changes before saving, and make sure your email address stays current so important messages can reach you." },
  { id: "billing", category: "Billing & Plans", question: "Can I change or cancel a subscription?", answer: "Subscription options depend on the service provider. In a typical account dashboard, plan changes and cancellations are handled in the Billing or Subscription section. Check the renewal date and any terms shown before confirming a change." },
  { id: "privacy", category: "Privacy & Security", question: "What can I do to keep my account secure?", answer: "Use a long, unique password and enable two-factor authentication when it is available. Avoid sharing sign-in codes, review active sessions periodically, and contact the service through its official support channel if anything looks unfamiliar." },
  { id: "data", category: "Privacy & Security", question: "How should a service explain its privacy practices?", answer: "A trustworthy service should make its privacy policy easy to find and explain what information it collects, why it needs it, how long it keeps it, and what choices are available to you. Review those details before sharing sensitive information." },
  { id: "mobile", category: "Features", question: "Does the help center work on phones and tablets?", answer: "Yes. The layout adapts to narrow and wide screens, the topic tabs can be scrolled horizontally on smaller phones, and the question controls are sized for touch. Text and answer panels reflow so content remains readable without horizontal page scrolling." },
  { id: "multi-open", category: "Features", question: "Can I open more than one answer at a time?", answer: "Yes. Each question keeps its own open or closed state, so you can expand several answers and compare them. The controls above the list let you expand or collapse all questions currently visible under your search and topic filters." },
  { id: "search", category: "Features", question: "What happens when I search and filter together?", answer: "The active topic and search term work together. Search narrows the questions first, and the selected topic narrows those results further. Choose All topics and clear the search to return to the complete list." },
  { id: "contact", category: "Support", question: "What should I include when contacting support?", answer: "Describe what you were trying to do, what happened instead, and the steps that led to the issue. Include any relevant error message, the device or browser you use, and a screenshot when appropriate. Never include passwords or one-time security codes." },
  { id: "no-answer", category: "Support", question: "What if my question is not listed here?", answer: "Try searching for a related phrase or selecting a nearby topic. If the information still is not covered, use the service’s official contact or support channel. This is a sample help-center project, so these answers demonstrate common FAQ patterns rather than account-specific support." },
  { id: "keyboard", category: "Accessibility", question: "Can I use the accordion without a mouse?", answer: "Yes. Use Tab or Shift+Tab to move between controls, then press Enter or Space to open or close a question. The buttons expose their expanded state to assistive technology, and visible focus styles help show which control is selected." },
  { id: "motion", category: "Accessibility", question: "Can I reduce the interface animations?", answer: "The interface respects your device’s reduced-motion preference. When that setting is enabled, the floating illustration and most transitions are shortened or disabled to make the page more comfortable to use." }
];

function normalize(value) {
  return String(value || "").toLowerCase().trim().replace(/\s+/g, " ");
}

function App() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_TOPICS);
  const [openIds, setOpenIds] = useState(() => new Set(["start"]));

  const searchedItems = useMemo(() => {
    const term = normalize(query);
    if (!term) return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => normalize(item.question + " " + item.answer + " " + item.category).includes(term));
  }, [query]);

  const visibleItems = useMemo(() => activeCategory === ALL_TOPICS
    ? searchedItems
    : searchedItems.filter((item) => item.category === activeCategory), [searchedItems, activeCategory]);

  const openedVisibleCount = visibleItems.filter((item) => openIds.has(item.id)).length;

  function toggleItem(id) {
    setOpenIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
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

  function selectPopular(term) {
    setQuery(term);
    setActiveCategory(ALL_TOPICS);
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return h("div", { className: "page-shell", id: "top" },
    h("header", { className: "topbar" },
      h("a", { className: "brand", href: "#top", "aria-label": "AMR Help Center home" },
        h("span", { className: "brand-symbol" }, h(Icon, { name: "sparkles", size: 23 })),
        h("span", { className: "brand-copy" }, h("strong", null, "AMR / HELP CENTER"), h("small", null, "Answers made simple"))
      ),
      h("div", { className: "nav-right" },
        h("span", { className: "nav-note" }, h("span", { className: "status-dot" }), "Help is always one click away"),
        h("a", { className: "source-button", href: SOURCE_URL, target: "_blank", rel: "noreferrer" },
          h(Icon, { name: "external", size: 15 }), "View source")
      )
    ),
    h("main", null,
      h("section", { className: "hero shell-width", "aria-labelledby": "hero-title" },
        h("div", { className: "hero-copy" },
          h("p", { className: "eyebrow" }, h("span", { className: "eyebrow-mark" }, h(Icon, { name: "sparkles", size: 15 })), "A BETTER WAY TO GET HELP"),
          h("h1", { id: "hero-title" }, "Questions? ", h("span", null, "You’re in the right place.")),
          h("p", { className: "hero-description" }, "Clear answers, useful guidance, and less time searching. Find what you need from one friendly, easy-to-use help center."),
          h("div", { className: "hero-search" },
            h("label", { className: "visually-hidden", htmlFor: "faq-search" }, "Search all questions"),
            h("div", { className: "search-field" },
              h(Icon, { name: "search", size: 21 }),
              h("input", {
                id: "faq-search", className: "search-input", type: "search",
                placeholder: "Search a question, topic, or keyword…", value: query,
                onChange: (event) => setQuery(event.target.value), autoComplete: "off"
              }),
              h("button", { type: "button", className: "clear-search", onClick: () => setQuery(""), "aria-label": "Clear search", hidden: !query },
                h(Icon, { name: "close", size: 15 }))
            ),
            h("p", { className: "search-hint" }, h("span", null, "Popular:"),
              ["account", "security", "mobile"].map((term) => h("button", {
                key: term, className: "keycap", type: "button", onClick: () => selectPopular(term)
              }, term))
            )
          )
        ),
        h("div", { className: "hero-art", "aria-hidden": "true" },
          h("div", { className: "art-halo" }),
          h("div", { className: "art-spark art-spark-one" }, h(Icon, { name: "sparkles", size: 23 })),
          h("div", { className: "art-spark art-spark-two" }, h(Icon, { name: "check", size: 22 })),
          h("div", { className: "answer-preview" },
            h("div", { className: "preview-top" },
              h("div", { className: "preview-brand" }, h("span", { className: "preview-brand-mark" }, h(Icon, { name: "help", size: 18 })), "Quick answer"),
              h("span", { className: "preview-badge" }, "Solved")
            ),
            h("p", { className: "preview-question" }, "Everything in one place."),
            h("p", { className: "preview-answer" }, "Browse topics, find the right answer, and get back to what matters."),
            h("div", { className: "preview-lines" }, h("span", { className: "preview-line" }), h("span", { className: "preview-line" }), h("span", { className: "preview-line" }))
          ),
          h("div", { className: "preview-floating" },
            h("span", { className: "preview-floating-icon" }, h(Icon, { name: "clock", size: 17 })),
            h("span", null, h("strong", null, "Less searching"), h("small", null, "More doing"))
          )
        )
      ),
      h("section", { className: "benefit-strip shell-width", "aria-label": "Help center features" },
        h("article", { className: "benefit-card" }, h("span", { className: "benefit-icon" }, h(Icon, { name: "search", size: 21 })), h("div", null, h("strong", null, "Find it faster"), h("p", null, "Instant search across every answer"))),
        h("article", { className: "benefit-card" }, h("span", { className: "benefit-icon" }, h(Icon, { name: "layers", size: 21 })), h("div", null, h("strong", null, "Browse by topic"), h("p", null, "Focused categories, less clutter"))),
        h("article", { className: "benefit-card" }, h("span", { className: "benefit-icon" }, h(Icon, { name: "keyboard", size: 21 })), h("div", null, h("strong", null, "Built for everyone"), h("p", null, "Keyboard friendly and responsive")))
      ),
      h("section", { id: "faq", className: "faq-section", "aria-labelledby": "faq-heading" },
        h("div", { className: "section-heading" },
          h("div", null, h("p", { className: "section-eyebrow" }, "THE HELP LIBRARY"), h("h2", { id: "faq-heading" }, "Find your answer"),
            h("p", null, "Explore a topic or open a question for a clear, step-by-step answer.")),
          h("div", { className: "counter-pill" }, h(Icon, { name: "book", size: 17 }), h("strong", null, String(visibleItems.length).padStart(2, "0")), " answers")
        ),
        h("div", { className: "category-tabs", role: "group", "aria-label": "Filter questions by topic" },
          h("button", { type: "button", className: "category-tab" + (activeCategory === ALL_TOPICS ? " is-active" : ""), onClick: () => setActiveCategory(ALL_TOPICS), "aria-pressed": activeCategory === ALL_TOPICS },
            h("span", { className: "tab-icon" }, h(Icon, { name: "layers", size: 15 })), ALL_TOPICS, h("span", { className: "tab-count" }, FAQ_ITEMS.length)),
          TOPICS.map((topic) => {
            const count = FAQ_ITEMS.filter((item) => item.category === topic.name).length;
            return h("button", { key: topic.name, type: "button", className: "category-tab" + (activeCategory === topic.name ? " is-active" : ""),
              onClick: () => setActiveCategory(topic.name), "aria-pressed": activeCategory === topic.name },
              h("span", { className: "tab-icon" }, h(Icon, { name: topic.icon, size: 15 })), topic.name, h("span", { className: "tab-count" }, count));
          })
        ),
        h("div", { className: "list-toolbar" },
          h("p", { className: "results-text", "aria-live": "polite" }, "Showing ", h("strong", null, visibleItems.length), " of ", h("strong", null, FAQ_ITEMS.length), " questions · ", h("strong", null, openedVisibleCount), " open"),
          h("div", { className: "toolbar-actions" },
            h("button", { type: "button", className: "toolbar-button", onClick: expandVisible, disabled: visibleItems.length === 0 || openedVisibleCount === visibleItems.length }, h(Icon, { name: "layers", size: 14 }), "Expand all"),
            h("button", { type: "button", className: "toolbar-button", onClick: collapseVisible, disabled: openedVisibleCount === 0 }, h(Icon, { name: "chevron", size: 14 }), "Collapse all")
          )
        ),
        visibleItems.length
          ? h("div", { className: "accordion-list" }, visibleItems.map((item, index) => h(AccordionItem, {
              key: item.id, item, index: index + 1, isOpen: openIds.has(item.id), onToggle: () => toggleItem(item.id)
            })))
          : h("div", { className: "empty-state" },
              h("span", { className: "empty-icon" }, h(Icon, { name: "search", size: 23 })),
              h("strong", null, "No answers found"),
              h("p", null, "Try a different keyword or choose another topic."),
              h("button", { className: "reset-button", type: "button", onClick: resetFilters }, "Clear search and filters")
            )
      ),
      h("section", { className: "contact-banner shell-width", "aria-label": "Need more help" },
        h("div", { className: "contact-copy" }, h("span", { className: "contact-icon" }, h(Icon, { name: "message", size: 22 })),
          h("div", null, h("strong", null, "Still have a question?"), h("p", null, "Browse the source and explore how this React FAQ project works."))),
        h("a", { className: "contact-button", href: SOURCE_URL, target: "_blank", rel: "noreferrer" }, "Explore the project", h(Icon, { name: "arrow", size: 17 }))
      )
    ),
    h("footer", { className: "page-footer" },
      h("span", { className: "footer-brand" }, h("span", { className: "footer-mark" }, h(Icon, { name: "sparkles", size: 14 })), "AMR · FAQ ACCORDION"),
      h("span", null, "Designed with care · Built with React"),
      h("a", { href: SOURCE_URL, target: "_blank", rel: "noreferrer" }, "View on GitHub", h(Icon, { name: "external", size: 13 }))
    )
  );
}

function AccordionItem({ item, index, isOpen, onToggle }) {
  const questionId = "question-" + item.id;
  const answerId = "answer-" + item.id;
  const topic = TOPICS.find((entry) => entry.name === item.category);

  return h("article", { className: "faq-item" + (isOpen ? " is-open" : "") },
    h("button", { type: "button", id: questionId, className: "question-button", onClick: onToggle,
      "aria-expanded": isOpen, "aria-controls": answerId },
      h("span", { className: "question-icon" }, h(Icon, { name: topic ? topic.icon : "help", size: 20 })),
      h("span", { className: "question-copy" },
        h("span", { className: "question-category" }, item.category + "  ·  " + String(index).padStart(2, "0")),
        h("span", { className: "question-title" }, item.question)),
      h("span", { className: "toggle-icon" }, h(Icon, { name: "close", size: 16 }))
    ),
    h("div", { id: answerId, className: "answer-panel", role: "region", "aria-labelledby": questionId, "aria-hidden": !isOpen },
      h("div", { className: "answer-inner" },
        h("div", { className: "answer-divider" }),
        h("p", { className: "answer-copy" }, item.answer),
        h("div", { className: "answer-footer" }, h(Icon, { name: "check", size: 14 }), "Hope this helped")
      )
    )
  );
}

createRoot(document.getElementById("root")).render(h(React.StrictMode, null, h(App)));