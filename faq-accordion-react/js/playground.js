import { Accordion } from "./accordion.js";
import { PLAYGROUND_DEFAULTS, REACT_QUESTIONS } from "./data.js";
import { clampNumber, copyText, debounce, filterQuestions, highlightText } from "./utils.js";

const root = document.documentElement;
const appWindow = document.getElementById("app-window");
const sidebar = document.getElementById("settings-sidebar");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const sidebarToggle = document.getElementById("sidebar-toggle");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const themeToggle = document.getElementById("theme-toggle");
const questionList = document.getElementById("question-list");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("react-question-search");
const clearSearchButton = document.getElementById("clear-search");
const emptyResetButton = document.getElementById("empty-reset");
const searchResultCount = document.getElementById("search-result-count");
const countBadge = document.getElementById("question-count-badge");
const openRing = document.getElementById("open-ring");
const matchRing = document.getElementById("match-ring");
const openRingLabel = document.getElementById("open-ring-label");
const matchRingLabel = document.getElementById("match-ring-label");
const openItemSummary = document.getElementById("open-item-summary");
const matchItemSummary = document.getElementById("match-item-summary");
const matchFootnote = document.getElementById("match-footnote");
const codeLines = document.getElementById("code-lines");
const codeBody = document.getElementById("code-body");
const copyCodeButton = document.getElementById("copy-code");
const copyLabel = document.getElementById("copy-label");
const copyStatus = document.getElementById("copy-status");
const collapseCodeButton = document.getElementById("collapse-code");
const settings = { ...PLAYGROUND_DEFAULTS, disabled: false };
const openValues = new Set(["virtual-dom"]);
let accordion = null;
let visibleItems = [];
let searchQuery = "";
let drawerOpen = false;
let sidebarCollapsed = false;
let codeCollapsed = false;
let copyResetTimeout = 0;

const controls = {
  count: document.getElementById("questions-count"),
  variant: document.getElementById("accordion-variant"),
  size: document.getElementById("accordion-size"),
  icon: document.getElementById("icon-shape"),
  iconPosition: document.getElementById("icon-position"),
  headingLevel: document.getElementById("heading-level"),
  type: document.getElementById("accordion-type"),
  collapsible: document.getElementById("collapsible-toggle"),
  animated: document.getElementById("animated-toggle"),
  disabled: document.getElementById("disabled-toggle"),
  rtl: document.getElementById("rtl-toggle")
};

function isCompactLayout() {
  return window.matchMedia("(max-width: 1024px)").matches;
}

function setDrawerOpen(open) {
  drawerOpen = Boolean(open);
  appWindow.classList.toggle("drawer-open", drawerOpen);
  drawerBackdrop.hidden = !drawerOpen;
  sidebar.setAttribute("aria-hidden", String(isCompactLayout() && !drawerOpen));
  sidebar.inert = isCompactLayout() && !drawerOpen;
  [sidebarToggle, mobileMenuToggle].forEach((button) => {
    button.setAttribute("aria-expanded", String(drawerOpen));
    button.setAttribute("aria-label", drawerOpen ? "Close settings" : "Open settings");
  });

  if (drawerOpen && isCompactLayout()) {
    window.requestAnimationFrame(() => controls.count.focus());
  } else if (!drawerOpen && isCompactLayout()) {
    mobileMenuToggle.focus();
  }
}

function setSidebarCollapsed(collapsed) {
  sidebarCollapsed = Boolean(collapsed);
  appWindow.classList.toggle("sidebar-collapsed", sidebarCollapsed);
  sidebarToggle.setAttribute("aria-expanded", String(!sidebarCollapsed));
  sidebarToggle.setAttribute("aria-label", sidebarCollapsed ? "Expand controls" : "Collapse controls");
}

function selectedQuestions() {
  const count = clampNumber(settings.count, 1, REACT_QUESTIONS.length, PLAYGROUND_DEFAULTS.count);
  return REACT_QUESTIONS.slice(0, count);
}

function createQuestionElement(item, index) {
  const article = document.createElement("article");
  article.className = "accordion__item";
  article.dataset.accordionItem = "";
  article.dataset.value = item.value;

  const heading = document.createElement(settings.headingLevel);
  heading.className = "accordion__heading";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "accordion__trigger";
  trigger.dataset.accordionTrigger = "";
  trigger.setAttribute("aria-expanded", "false");

  const number = document.createElement("span");
  number.className = "accordion__number";
  number.setAttribute("aria-hidden", "true");
  number.textContent = String(index + 1).padStart(2, "0");

  const label = document.createElement("span");
  label.className = "accordion__label";
  highlightText(label, item.question, searchQuery);
  trigger.append(number, label);
  heading.append(trigger);

  const panel = document.createElement("div");
  panel.className = "accordion__panel";
  panel.dataset.accordionPanel = "";
  panel.hidden = true;

  const inner = document.createElement("div");
  inner.className = "accordion__panel-inner";
  const answer = document.createElement("p");
  highlightText(answer, item.answer, searchQuery);
  inner.append(answer);
  panel.append(inner);
  article.append(heading, panel);

  return article;
}

function captureOpenValues() {
  if (!accordion) return;
  const indices = accordion.getOpenIndices();
  const activeIndices = settings.type === "single" ? indices.slice(0, 1) : indices;
  activeIndices.forEach((index) => {
    const value = visibleItems[index]?.value;
    if (value) openValues.add(value);
  });
}

function renderQuestionList() {
  captureOpenValues();
  if (accordion) {
    accordion.destroy();
    accordion = null;
  }

  const baseItems = selectedQuestions();
  visibleItems = filterQuestions(baseItems, searchQuery);
  const normalizedOpenValues = new Set(
    visibleItems.map((item) => item.value).filter((value) => openValues.has(value))
  );

  questionList.replaceChildren();
  const fragment = document.createDocumentFragment();
  visibleItems.forEach((item, index) => fragment.append(createQuestionElement(item, index)));
  questionList.append(fragment);

  const shouldShowEmpty = visibleItems.length === 0;
  questionList.hidden = shouldShowEmpty;
  emptyState.hidden = !shouldShowEmpty;

  const defaultOpen = visibleItems
    .map((item, index) => normalizedOpenValues.has(item.value) ? index : -1)
    .filter((index) => index >= 0);

  accordion = new Accordion(questionList, {
    type: settings.type,
    collapsible: settings.collapsible,
    variant: settings.variant,
    size: settings.size,
    icon: settings.icon,
    iconPosition: settings.iconPosition,
    headingLevel: settings.headingLevel,
    animated: settings.animated,
    disabled: settings.disabled,
    dir: settings.dir,
    defaultOpen: settings.type === "single" ? defaultOpen.slice(0, 1) : defaultOpen
  });

  questionList.setAttribute("aria-label", "React interview questions");
  accordion.update({
    type: settings.type,
    collapsible: settings.collapsible,
    variant: settings.variant,
    size: settings.size,
    icon: settings.icon,
    iconPosition: settings.iconPosition,
    headingLevel: settings.headingLevel,
    animated: settings.animated,
    disabled: settings.disabled,
    dir: settings.dir
  });
  updateStatus();
  updateUsageCode();
}

function onAccordionChange(event) {
  const indices = event.detail?.openIndices || [];
  openValues.clear();
  indices.forEach((index) => {
    const value = visibleItems[index]?.value;
    if (value) openValues.add(value);
  });
  updateStatus();
}

function updateRing(svg, labelNode, percent, accessibleName) {
  const normalizedPercent = Math.min(100, Math.max(0, percent));
  const ring = svg.querySelector(".ring-value");
  const circumference = Number(ring.getAttribute("stroke-dasharray")) || 2 * Math.PI * 37;
  ring.setAttribute("stroke-dashoffset", String(circumference * (1 - normalizedPercent / 100)));
  labelNode.textContent = Math.round(normalizedPercent) + "%";
  svg.setAttribute("aria-label", accessibleName + ": " + Math.round(normalizedPercent) + "%");
}

function updateStatus() {
  const baseCount = selectedQuestions().length;
  const resultCount = visibleItems.length;
  const openedCount = visibleItems.filter((item) => openValues.has(item.value)).length;
  const openPercent = resultCount ? openedCount / resultCount * 100 : 0;
  const matchPercent = baseCount ? resultCount / baseCount * 100 : 0;

  searchResultCount.replaceChildren();
  const strong = document.createElement("strong");
  strong.textContent = String(resultCount);
  searchResultCount.append(strong, document.createTextNode(" " + (resultCount === 1 ? "result" : "results")));
  if (searchQuery) searchResultCount.append(document.createTextNode(" for “" + searchQuery + "”"));

  countBadge.textContent = baseCount + (baseCount === 1 ? " question" : " questions");
  openItemSummary.textContent = openedCount + " of " + resultCount + " expanded";
  matchItemSummary.textContent = resultCount + " of " + baseCount + " shown";
  matchFootnote.textContent = searchQuery ? "Filtered by search" : "All questions visible";

  updateRing(openRing, openRingLabel, openPercent, "Open items");
  updateRing(matchRing, matchRingLabel, matchPercent, "Search matches");
  clearSearchButton.hidden = searchQuery.length === 0;
}

function buildUsageCode() {
  const baseCount = selectedQuestions().length;
  return [
    'import { Accordion } from "./js/accordion.js";',
    "",
    "// Reuse your existing question markup.",
    "const accordion = new Accordion(",
    '  document.querySelector("#question-list"),',
    "  {",
    '    type: "' + settings.type + '",',
    '    variant: "' + settings.variant + '",',
    '    size: "' + settings.size + '",',
    '    icon: "' + settings.icon + '",',
    '    iconPosition: "' + settings.iconPosition + '",',
    '    headingLevel: "' + settings.headingLevel + '",',
    '    dir: "' + settings.dir + '",',
    "    collapsible: " + String(settings.collapsible) + ",",
    "    animated: " + String(settings.animated) + ",",
    "    disabled: " + String(settings.disabled) + ",",
    "    defaultOpen: [0]",
    "  }",
    ");",
    "",
    "// " + baseCount + " React interview questions are shown.",
    'accordion.open(0); // Open the first item',
    'accordion.toggle(1); // Toggle another item'
  ].join("\n");
}

const TOKEN_PATTERN = /(\/\/.*|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b(?:import|from|const|new|true|false|return|class|export|default|if|else)\b|#[\w-]+|[A-Za-z_$][\w$]*(?=\s*:)|=>|[{}\[\](),.;=])/g;

function tokenClass(token) {
  if (token.startsWith("//")) return "syntax-comment";
  if (token.startsWith('"') || token.startsWith("'")) return "syntax-string";
  if (/^(import|from|const|new|true|false|return|class|export|default|if|else)$/.test(token)) return "syntax-keyword";
  if (token.startsWith("#")) return "syntax-attribute";
  if (/^[A-Za-z_$][\w$]*$/.test(token) && !["Accordion"].includes(token)) return "syntax-attribute";
  if (["=", "=>", "{", "}", "[", "]", "(", ")", ",", ";", "."].includes(token)) return "syntax-punctuation";
  return "";
}

function tokenizeLine(line) {
  const tokens = [];
  let cursor = 0;
  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? cursor;
    if (index > cursor) tokens.push({ text: line.slice(cursor, index), className: "" });
    tokens.push({ text: match[0], className: tokenClass(match[0]) });
    cursor = index + match[0].length;
  }
  if (cursor < line.length) tokens.push({ text: line.slice(cursor), className: "" });
  if (tokens.length === 0) tokens.push({ text: " ", className: "" });
  return tokens;
}

function renderCode() {
  const code = buildUsageCode();
  codeLines.replaceChildren();

  code.split("\n").forEach((line, index) => {
    const row = document.createElement("div");
    row.className = "code-line";

    const number = document.createElement("span");
    number.className = "line-number";
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(index + 1).padStart(2, "0");

    const code = document.createElement("code");
    tokenizeLine(line).forEach((token) => {
      if (!token.className) {
        code.append(document.createTextNode(token.text));
      } else {
        const span = document.createElement("span");
        span.className = token.className;
        span.textContent = token.text;
        code.append(span);
      }
    });

    row.append(number, code);
    codeLines.append(row);
  });
  return code;
}

function updateUsageCode() {
  renderCode();
}

function readControls() {
  const previousType = settings.type;
  const nextType = controls.type.value;
  if (nextType === "single" && previousType !== "single") {
    const currentIndex = accordion?.getOpenIndices()[0];
    const currentValue = currentIndex === undefined ? null : visibleItems[currentIndex]?.value;
    openValues.clear();
    if (currentValue) openValues.add(currentValue);
  }
  settings.count = clampNumber(controls.count.value, 4, REACT_QUESTIONS.length, PLAYGROUND_DEFAULTS.count);
  settings.variant = controls.variant.value;
  settings.size = controls.size.value;
  settings.icon = controls.icon.value;
  settings.iconPosition = controls.iconPosition.value;
  settings.headingLevel = controls.headingLevel.value;
  settings.type = nextType;
  settings.collapsible = controls.collapsible.checked;
  settings.animated = controls.animated.checked;
  settings.disabled = controls.disabled.checked;
  settings.dir = controls.rtl.checked ? "rtl" : "ltr";

  if (settings.type === "single" && openValues.size > 1) {
    const firstOpen = openValues.values().next().value;
    openValues.clear();
    if (firstOpen) openValues.add(firstOpen);
  }
}

function applySettings() {
  readControls();
  renderQuestionList();
}

function applyTheme(theme, persist = true) {
  root.dataset.theme = theme;
  const isDark = theme === "dark";
  const sun = themeToggle.querySelector(".theme-icon-sun");
  const moon = themeToggle.querySelector(".theme-icon-moon");
  sun.hidden = !isDark;
  moon.hidden = isDark;
  themeToggle.setAttribute("aria-label", "Switch to " + (isDark ? "light" : "dark") + " theme");
  themeToggle.title = "Switch to " + (isDark ? "light" : "dark") + " theme";

  if (persist) {
    try {
      localStorage.setItem("accordion-demo-theme", theme);
    } catch {
      // Storage may be unavailable in private browsing contexts.
    }
  }
}

function closeCodePanel() {
  codeCollapsed = !codeCollapsed;
  codeBody.hidden = codeCollapsed;
  collapseCodeButton.setAttribute("aria-expanded", String(!codeCollapsed));
  collapseCodeButton.setAttribute("aria-label", codeCollapsed ? "Expand code panel" : "Collapse code panel");
}

const onSearch = debounce((value) => {
  searchQuery = value;
  renderQuestionList();
}, 150);

controls.count.addEventListener("change", applySettings);
controls.variant.addEventListener("change", applySettings);
controls.size.addEventListener("change", applySettings);
controls.icon.addEventListener("change", applySettings);
controls.iconPosition.addEventListener("change", applySettings);
controls.headingLevel.addEventListener("change", applySettings);
controls.type.addEventListener("change", applySettings);
controls.collapsible.addEventListener("change", applySettings);
controls.animated.addEventListener("change", applySettings);
controls.disabled.addEventListener("change", applySettings);
controls.rtl.addEventListener("change", applySettings);

searchInput.addEventListener("input", () => {
  onSearch(searchInput.value);
  clearSearchButton.hidden = searchInput.value.length === 0;
});
searchInput.addEventListener("search", () => {
  onSearch.cancel();
  searchQuery = searchInput.value;
  renderQuestionList();
});
clearSearchButton.addEventListener("click", () => {
  onSearch.cancel();
  searchInput.value = "";
  searchQuery = "";
  renderQuestionList();
  searchInput.focus();
});
emptyResetButton.addEventListener("click", () => {
  onSearch.cancel();
  searchInput.value = "";
  searchQuery = "";
  renderQuestionList();
  searchInput.focus();
});

questionList.addEventListener("accordion:change", onAccordionChange);

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

sidebarToggle.addEventListener("click", () => {
  if (isCompactLayout()) setDrawerOpen(!drawerOpen);
  else setSidebarCollapsed(!sidebarCollapsed);
});
mobileMenuToggle.addEventListener("click", () => setDrawerOpen(true));
drawerBackdrop.addEventListener("click", () => setDrawerOpen(false));

copyCodeButton.addEventListener("click", async () => {
  const copied = await copyText(buildUsageCode());
  copyLabel.textContent = copied ? "Copied!" : "Copy failed";
  copyStatus.textContent = copied ? "Code copied to clipboard" : "Clipboard access was blocked";
  copyCodeButton.setAttribute("aria-label", copied ? "Code copied to clipboard" : "Could not copy code");
  window.clearTimeout(copyResetTimeout);
  copyResetTimeout = window.setTimeout(() => {
    copyLabel.textContent = "Copy";
    copyStatus.textContent = "";
    copyCodeButton.setAttribute("aria-label", "Copy generated JavaScript");
  }, 2200);
});
collapseCodeButton.addEventListener("click", closeCodePanel);

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLElement && (
    target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    searchInput.focus();
  }

  if (event.key === "Escape") {
    if (searchInput.value || searchQuery) {
      onSearch.cancel();
      searchInput.value = "";
      searchQuery = "";
      renderQuestionList();
    }
    if (drawerOpen) setDrawerOpen(false);
  }
});

const colorScheme = window.matchMedia("(prefers-color-scheme: light)");
colorScheme.addEventListener?.("change", (event) => {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("accordion-demo-theme");
  } catch {
    savedTheme = "dark";
  }
  if (savedTheme !== "light" && savedTheme !== "dark") applyTheme(event.matches ? "light" : "dark", false);
});

window.addEventListener("resize", () => {
  if (isCompactLayout()) {
    sidebar.inert = !drawerOpen;
    sidebar.setAttribute("aria-hidden", String(!drawerOpen));
    appWindow.classList.remove("sidebar-collapsed");
    sidebarCollapsed = false;
    if (!drawerOpen) setDrawerOpen(false);
  } else {
    if (drawerOpen) setDrawerOpen(false);
    sidebar.inert = false;
    sidebar.removeAttribute("aria-hidden");
    sidebarToggle.setAttribute("aria-expanded", String(!sidebarCollapsed));
    sidebarToggle.setAttribute("aria-label", sidebarCollapsed ? "Expand controls" : "Collapse controls");
    drawerBackdrop.hidden = true;
  }
});

function init() {
  settings.count = Number(controls.count.value);
  applyTheme(root.dataset.theme === "light" ? "light" : "dark", false);
  setDrawerOpen(false);
  setSidebarCollapsed(false);
  renderQuestionList();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}