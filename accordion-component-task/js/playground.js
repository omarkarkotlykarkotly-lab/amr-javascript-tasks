import { Accordion, autoInitAccordions } from "./accordion.js";
import { questions } from "./data.js";
import { clampPercent, copyText, debounce, escapeHTML, highlightText, iconSVG, normalizeText } from "./utils.js";

const root = document.getElementById("app-window");
const list = document.getElementById("question-list");
const searchInput = document.getElementById("question-search");
const clearSearch = document.getElementById("clear-search");
const emptyState = document.getElementById("empty-state");
const searchResults = document.getElementById("search-results");
const questionCountBadge = document.querySelector("#questions-count span");
const openCount = document.getElementById("open-count");
const matchCount = document.getElementById("match-count");
const openRing = document.getElementById("open-ring");
const matchRing = document.getElementById("match-ring");
const generatedCode = document.getElementById("generated-code");
const codeBody = document.getElementById("code-body");
const copyButton = document.getElementById("copy-code");
const copyStatus = document.getElementById("copy-status");
const toggleCodeButton = document.getElementById("toggle-code");
const sidebar = document.getElementById("settings-sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const mobileSettings = document.getElementById("mobile-settings");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const themeToggle = document.getElementById("theme-toggle");

const controls = {
  questionCount: document.getElementById("question-count"),
  variant: document.getElementById("accordion-variant"),
  size: document.getElementById("accordion-size"),
  icon: document.getElementById("accordion-icon"),
  iconPosition: document.getElementById("icon-position"),
  headingLevel: document.getElementById("heading-level"),
  type: document.getElementById("accordion-type"),
  collapsible: document.getElementById("collapsible"),
  animated: document.getElementById("animated"),
  disabled: document.getElementById("disabled"),
  rtl: document.getElementById("rtl"),
};

function questionMarkup(question, index, query) {
  const open = index === 0;
  const triggerId = "faq-trigger-" + question.value;
  const panelId = "faq-panel-" + question.value;
  return '<article class="accordion__item" data-accordion-item data-value="' + escapeHTML(question.value) + '" data-disabled="false" data-state="' + (open ? "open" : "closed") + '" data-item-index="' + index + '">' +
    '<h3 class="accordion__heading"><button class="accordion__trigger" data-accordion-trigger type="button" id="' + triggerId + '" aria-expanded="' + String(open) + '" aria-controls="' + panelId + '">' +
    '<span class="accordion__number" aria-hidden="true">' + String(index + 1).padStart(2, "0") + '</span>' +
    '<span class="accordion__topic">' + escapeHTML(question.topic) + '</span>' +
    '<span class="accordion__label">' + highlightText(question.question, query) + '</span>' +
    '<span class="accordion__icon" data-shape="caret" data-position="end" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="currentColor" stroke="none"></path></svg></span>' +
    '</button></h3>' +
    '<div class="accordion__panel" data-accordion-panel id="' + panelId + '" role="region" aria-labelledby="' + triggerId + '" aria-hidden="' + String(!open) + '" data-state="' + (open ? "open" : "closed") + '"' + (open ? "" : " hidden inert") + '>' +
    '<div class="accordion__content"><p>' + highlightText(question.answer, query) + '</p>' +
    '<pre class="accordion__example"><code>' + highlightText(question.example, query) + '</code></pre></div></div></article>';
}

list.dataset.defaultOpen = "0";
list.innerHTML = questions.map((question, index) => questionMarkup(question, index, "")).join("");
const accordion = autoInitAccordions(document).find((instance) => instance.root === list);
const mediaDrawer = window.matchMedia("(max-width: 1190px)");
const mediaScheme = window.matchMedia("(prefers-color-scheme: light)");
let activeQuery = "";
let visibleQuestions = questions.slice();
let debounceSearch = null;
let copyTimer = 0;
let wasManuallyThemed = false;
let restoreFocusTarget = null;
let drawerIsOpen = false;
let codeIsCollapsed = false;

function readTheme() {
  try {
    const saved = localStorage.getItem("accordion-playground-theme");
    if (saved === "light" || saved === "dark") {
      wasManuallyThemed = true;
      return saved;
    }
  } catch (error) {
    wasManuallyThemed = false;
  }
  return mediaScheme.matches ? "light" : "dark";
}

function setTheme(theme, saveChoice = false) {
  document.documentElement.dataset.theme = theme;
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
  themeToggle.title = "Switch to " + (theme === "dark" ? "light" : "dark") + " theme";
  if (saveChoice) {
    wasManuallyThemed = true;
    try {
      localStorage.setItem("accordion-playground-theme", theme);
    } catch (error) {
      copyStatus.textContent = "";
    }
  }
}

function getSettings() {
  return {
    type: controls.type.value,
    collapsible: controls.collapsible.checked,
    variant: controls.variant.value,
    size: controls.size.value,
    icon: controls.icon.value,
    iconPosition: controls.iconPosition.value,
    headingLevel: controls.headingLevel.value,
    animated: controls.animated.checked,
    dir: controls.rtl.checked ? "rtl" : "ltr",
    disabled: controls.disabled.checked,
  };
}

function getDisplayedCount() {
  return Math.min(Number(controls.questionCount.value), questions.length);
}

function renderQuestionText(query) {
  accordion.items.forEach(({ element, index }) => {
    const question = questions[index];
    if (!question) return;
    const label = element.querySelector(".accordion__label");
    const paragraph = element.querySelector(".accordion__content p");
    const example = element.querySelector(".accordion__example code");
    label.innerHTML = highlightText(question.question, query);
    paragraph.innerHTML = highlightText(question.answer, query);
    if (example) example.innerHTML = highlightText(question.example, query);
  });
}

function updateSearchResults() {
  const limit = getDisplayedCount();
  const term = normalizeText(activeQuery);
  const matchesQuery = questions.filter((question) =>
    !term || normalizeText(question.topic + " " + question.question + " " + question.answer + " " + question.example).includes(term)
  );
  visibleQuestions = matchesQuery.slice(0, limit);
  const visibleValues = new Set(visibleQuestions.map((question) => question.value));

  accordion.items.forEach(({ element, index }) => {
    const question = questions[index];
    const matches = Boolean(question && visibleValues.has(question.value));
    element.hidden = !matches;
  });

  renderQuestionText(activeQuery);
  clearSearch.hidden = !activeQuery;
  emptyState.hidden = visibleQuestions.length !== 0;
  searchResults.innerHTML = "<strong>" + visibleQuestions.length + "</strong> " +
    (visibleQuestions.length === 1 ? "result" : "results") +
    (activeQuery ? ' <span class="result-query">for “' + escapeHTML(activeQuery) + "”</span>" : "");
  questionCountBadge.textContent = limit + " lessons";
  updateLiveStatus();
}

function setRing(ring, value, label) {
  const percentage = clampPercent(value);
  const circumference = 2 * Math.PI * 39;
  const circle = ring.querySelector(".progress-ring__value");
  const text = ring.querySelector(".progress-ring__label");
  circle.setAttribute("stroke-dashoffset", String(circumference * (1 - percentage / 100)));
  text.textContent = percentage + "%";
  ring.setAttribute("aria-label", label + ": " + percentage + "%");
}

function updateLiveStatus() {
  const visible = accordion.items.filter(({ element }) => !element.hidden);
  const expanded = visible.filter(({ trigger }) => trigger.getAttribute("aria-expanded") === "true");
  const openPercent = visible.length ? expanded.length / visible.length * 100 : 0;
  const matchPercent = getDisplayedCount() ? visible.length / getDisplayedCount() * 100 : 0;

  openCount.textContent = expanded.length + " of " + visible.length + " expanded";
  matchCount.textContent = visible.length + " of " + getDisplayedCount() + " shown";
  const openFootnote = document.querySelector(".stat-card:not(.stat-card--pink) .stat-card__copy > span");
  const matchFootnote = document.querySelector(".stat-card--pink .stat-card__copy > span");
  openFootnote.textContent = visible.length ? "Current results" : "No visible results";
  matchFootnote.textContent = activeQuery ? "Filtered by search" : "All questions visible";
  setRing(openRing, openPercent, "Open items");
  setRing(matchRing, matchPercent, "Search matches");
}

function buildUsageCode() {
  const settings = getSettings();
  const count = getDisplayedCount();
  return [
    'import { Accordion } from "./js/accordion.js";',
    "",
    "// " + count + " HTML, CSS, and JavaScript lessons",
    "const lessons = [...];",
    "",
    'const accordion = new Accordion(document.querySelector("[data-accordion]"), {',
    '  type: "' + settings.type + '",',
    '  variant: "' + settings.variant + '",',
    '  size: "' + settings.size + '",',
    '  icon: "' + settings.icon + '",',
    '  iconPosition: "' + settings.iconPosition + '",',
    '  headingLevel: "' + settings.headingLevel + '",',
    "  collapsible: " + String(settings.collapsible) + ",",
    "  animated: " + String(settings.animated) + ",",
    "  disabled: " + String(settings.disabled) + ",",
    "  defaultOpen: [0],",
    '  dir: "' + settings.dir + '"',
    "});",
  ].join("\n");
}

function codeTokenClass(token) {
  if (token.startsWith("//")) return "syntax-comment";
  if (token.startsWith('"') || token.startsWith("'")) return "syntax-string";
  if (/^(import|from|const|new|true|false|null|undefined)$/.test(token)) return "syntax-keyword";
  if (/^\d+$/.test(token)) return "syntax-number";
  if (/^[A-Za-z_$][\w$]*$/.test(token)) return "syntax-attribute";
  return "";
}

function appendHighlightedCode(parent, source) {
  const tokens = /(\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:import|from|const|new|true|false|null|undefined)\b|\b\d+\b|[A-Za-z_$][\w$]*(?=\s*:))/g;
  let cursor = 0;
  let match;
  while ((match = tokens.exec(source)) !== null) {
    if (match.index > cursor) parent.append(document.createTextNode(source.slice(cursor, match.index)));
    const token = match[0];
    const span = document.createElement("span");
    span.className = codeTokenClass(token);
    span.textContent = token;
    parent.append(span);
    cursor = match.index + token.length;
  }
  if (cursor < source.length) parent.append(document.createTextNode(source.slice(cursor)));
}

function renderUsageCode() {
  const source = buildUsageCode();
  generatedCode.replaceChildren();
  source.split("\n").forEach((line, index) => {
    const lineElement = document.createElement("div");
    lineElement.className = "code-line";
    const lineNumber = document.createElement("span");
    lineNumber.className = "code-line__number";
    lineNumber.setAttribute("aria-hidden", "true");
    lineNumber.textContent = String(index + 1).padStart(2, "0");
    const code = document.createElement("code");
    code.className = "code-line__source";
    appendHighlightedCode(code, line);
    if (!line) code.append(document.createTextNode(" "));
    lineElement.append(lineNumber, code);
    generatedCode.append(lineElement);
  });
}

function refreshSettings() {
  const settings = getSettings();
  accordion.update(settings);
  renderUsageCode();
  updateSearchResults();
}

function openDrawer(focusControl = true) {
  if (!mediaDrawer.matches) return;
  drawerIsOpen = true;
  restoreFocusTarget = document.activeElement;
  root.classList.add("is-drawer-open");
  sidebarToggle.setAttribute("aria-expanded", "true");
  mobileSettings.setAttribute("aria-expanded", "true");
  sidebar.setAttribute("aria-hidden", "false");
  sidebar.inert = false;
  if (focusControl) controls.questionCount.focus();
}

function closeDrawer(restoreFocus = true) {
  drawerIsOpen = false;
  root.classList.remove("is-drawer-open");
  sidebarToggle.setAttribute("aria-expanded", "false");
  mobileSettings.setAttribute("aria-expanded", "false");
  sidebar.setAttribute("aria-hidden", String(mediaDrawer.matches));
  sidebar.inert = mediaDrawer.matches;
  if (restoreFocus && restoreFocusTarget instanceof HTMLElement) restoreFocusTarget.focus();
}

function syncDrawerForViewport() {
  if (!mediaDrawer.matches) {
    root.classList.remove("is-drawer-open");
    sidebar.removeAttribute("aria-hidden");
    sidebar.inert = false;
    drawerIsOpen = false;
    sidebarToggle.setAttribute("aria-expanded", "false");
    mobileSettings.setAttribute("aria-expanded", "false");
  } else if (!drawerIsOpen) {
    sidebar.setAttribute("aria-hidden", "true");
    sidebar.inert = true;
  }
}

function bindControls() {
  Object.values(controls).forEach((control) => {
    control.addEventListener("change", refreshSettings);
  });

  const updateSearch = debounce(() => {
    activeQuery = searchInput.value.trim();
    updateSearchResults();
  }, 150);
  debounceSearch = updateSearch;
  searchInput.addEventListener("input", updateSearch);
  searchInput.addEventListener("search", () => {
    updateSearch.cancel();
    activeQuery = searchInput.value.trim();
    updateSearchResults();
  });

  clearSearch.addEventListener("click", clearSearchText);
  document.getElementById("empty-reset").addEventListener("click", clearSearchText);
  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next, true);
  });
  sidebarToggle.addEventListener("click", () => {
    if (mediaDrawer.matches) drawerIsOpen ? closeDrawer() : openDrawer();
  });
  mobileSettings.addEventListener("click", () => openDrawer());
  drawerBackdrop.addEventListener("click", () => closeDrawer());
  mediaDrawer.addEventListener?.("change", syncDrawerForViewport);
  mediaScheme.addEventListener?.("change", (event) => {
    if (!wasManuallyThemed) setTheme(event.matches ? "light" : "dark");
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target instanceof HTMLElement &&
      (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
    if (event.key === "/" && !typing) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === "Escape") {
      if (searchInput.value || activeQuery) clearSearchText();
      if (drawerIsOpen) closeDrawer();
    }
  });

  toggleCodeButton.addEventListener("click", () => {
    codeIsCollapsed = !codeIsCollapsed;
    codeBody.hidden = codeIsCollapsed;
    toggleCodeButton.setAttribute("aria-expanded", String(!codeIsCollapsed));
    toggleCodeButton.setAttribute("aria-label", codeIsCollapsed ? "Expand code panel" : "Collapse code panel");
  });

  copyButton.addEventListener("click", async () => {
    const copied = await copyText(buildUsageCode());
    copyStatus.textContent = copied ? "Copied!" : "Copy failed";
    copyButton.querySelector("span").textContent = copied ? "Copied!" : "Retry";
    copyButton.querySelector(".icon").outerHTML = iconSVG(copied ? "check" : "copy");
    globalThis.clearTimeout(copyTimer);
    copyTimer = globalThis.setTimeout(() => {
      copyStatus.textContent = "";
      copyButton.querySelector("span").textContent = "Copy";
      copyButton.querySelector(".icon").outerHTML = iconSVG("copy");
    }, 1800);
  });

  list.addEventListener("accordion:change", updateLiveStatus);
}

function clearSearchText() {
  if (debounceSearch) debounceSearch.cancel();
  searchInput.value = "";
  activeQuery = "";
  updateSearchResults();
  searchInput.focus();
}

function start() {
  setTheme(readTheme());
  bindControls();
  refreshSettings();
  syncDrawerForViewport();
  updateLiveStatus();
}

start();
