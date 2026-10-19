export function normalizeSearchValue(value) {
  return String(value || "").toLowerCase().trim().replace(/\s+/g, " ");
}

export function filterQuestions(items, query) {
  const term = normalizeSearchValue(query);
  if (!term) return items;
  return items.filter((item) =>
    normalizeSearchValue(String(item.question || "") + " " + String(item.answer || "")).includes(term)
  );
}

export function buildUsageCode(settings, itemCount) {
  return [
    "const questions = [",
    "  // " + itemCount + " React interview questions",
    '  { value: "virtual-dom", title: "What is the Virtual DOM?", content: "..." },',
    '  { value: "props-state", title: "Props vs. state", content: "..." },',
    "  // Add the remaining question objects",
    "];",
    "",
    "<Accordion",
    "  items={questions.slice(0, " + itemCount + ")}",
    '  type="' + settings.type + '"',
    '  variant="' + settings.variant + '"',
    '  size="' + settings.size + '"',
    '  icon="' + settings.iconShape + '"',
    '  iconPosition="' + settings.iconPosition + '"',
    '  headingLevel="' + settings.headingLevel + '"',
    "  collapsible={" + String(settings.collapsible) + "}",
    "  animated={" + String(settings.animated) + "}",
    "  disabled={" + String(settings.disabled) + "}",
    '  dir="' + (settings.rtl ? "rtl" : "ltr") + '"',
    "/>"
  ].join("\n");
}

export async function copyToClipboard(text, clipboard = typeof navigator !== "undefined" ? navigator.clipboard : undefined) {
  if (!clipboard || typeof clipboard.writeText !== "function") return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
