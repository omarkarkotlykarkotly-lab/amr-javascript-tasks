export function normalizeText(value) {
  return String(value ?? "").toLocaleLowerCase().trim().replace(/\s+/g, " ");
}

export function filterQuestions(items, query) {
  const term = normalizeText(query);
  if (!term) return [...items];

  return items.filter((item) =>
    normalizeText(item.question + " " + item.answer).includes(term)
  );
}

export function debounce(callback, delay = 150) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}

export function highlightText(element, text, query) {
  const term = String(query ?? "").trim();
  element.replaceChildren();

  if (!term) {
    element.textContent = text;
    return;
  }

  const lowerText = text.toLocaleLowerCase();
  const lowerTerm = term.toLocaleLowerCase();
  let cursor = 0;
  let matchIndex = lowerText.indexOf(lowerTerm);

  while (matchIndex !== -1) {
    if (matchIndex > cursor) {
      element.append(document.createTextNode(text.slice(cursor, matchIndex)));
    }

    const mark = document.createElement("mark");
    mark.textContent = text.slice(matchIndex, matchIndex + term.length);
    element.append(mark);

    cursor = matchIndex + term.length;
    matchIndex = lowerText.indexOf(lowerTerm, cursor);
  }

  if (cursor < text.length) {
    element.append(document.createTextNode(text.slice(cursor)));
  }

  if (!element.childNodes.length) element.textContent = text;
}

export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.className = "clipboard-fallback";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  } catch {
    return false;
  }
}

export function clampNumber(value, min, max, fallback = min) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}