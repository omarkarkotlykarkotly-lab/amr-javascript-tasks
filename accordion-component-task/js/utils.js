const ICON_PATHS = {
  caret: '<path d="m6 9 6 6 6-6" fill="currentColor" stroke="none"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
};

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export function iconMarkup(name, open = false) {
  const resolved = name === "plus" && open ? "minus" : name;
  const path = ICON_PATHS[resolved] || ICON_PATHS.caret;
  const filled = resolved === "caret";
  const pathData = path.match(/<path d="([^"]*)"/)?.[1] || "";
  return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' +
    pathData +
    '" fill="' + (filled ? "currentColor" : "none") + '" stroke="' + (filled ? "none" : "currentColor") +
    '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

export function iconSVG(name, className = "") {
  const path = ICON_PATHS[name] || ICON_PATHS.caret;
  return '<svg class="icon ' + escapeHTML(className) + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + path + "</svg>";
}

export function normalizeText(value) {
  return String(value ?? "").toLocaleLowerCase().trim().replace(/\s+/g, " ");
}

export function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return value === "true" || value === "1" || value === "";
}

export function parseIndexList(value) {
  if (Array.isArray(value)) {
    return value.map(Number).filter((index) => Number.isInteger(index) && index >= 0);
  }
  if (typeof value === "number") return Number.isInteger(value) && value >= 0 ? [value] : [];
  if (typeof value !== "string" || !value.trim()) return [];
  const text = value.trim();
  if (text.startsWith("[")) {
    try {
      return parseIndexList(JSON.parse(text));
    } catch {
      return [];
    }
  }
  return text.split(/[\s,]+/).map(Number).filter((index) => Number.isInteger(index) && index >= 0);
}

export function debounce(callback, delay = 150) {
  let timerId;
  const debounced = (...args) => {
    globalThis.clearTimeout(timerId);
    timerId = globalThis.setTimeout(() => callback(...args), delay);
  };
  debounced.cancel = () => globalThis.clearTimeout(timerId);
  return debounced;
}

export function highlightText(text, query) {
  const source = String(text ?? "");
  const term = String(query ?? "").trim();
  if (!term) return escapeHTML(source);

  const lowerSource = source.toLocaleLowerCase();
  const lowerTerm = term.toLocaleLowerCase();
  const parts = [];
  let cursor = 0;
  let matchAt = lowerSource.indexOf(lowerTerm, cursor);

  while (matchAt !== -1) {
    if (matchAt > cursor) parts.push(escapeHTML(source.slice(cursor, matchAt)));
    parts.push("<mark>" + escapeHTML(source.slice(matchAt, matchAt + term.length)) + "</mark>");
    cursor = matchAt + term.length;
    matchAt = lowerSource.indexOf(lowerTerm, cursor);
  }

  if (cursor < source.length) parts.push(escapeHTML(source.slice(cursor)));
  return parts.join("");
}

export function copyText(text) {
  if (globalThis.navigator?.clipboard?.writeText) {
    return globalThis.navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text) {
  const field = document.createElement("textarea");
  field.className = "clipboard-fallback";
  field.value = text;
  field.setAttribute("readonly", "");
  document.body.append(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  field.remove();
  return copied;
}

export function prefersReducedMotion() {
  return typeof globalThis.matchMedia === "function" &&
    globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
