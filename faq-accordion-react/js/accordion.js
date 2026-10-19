const PRESETS = new Set(["caret", "chevron", "plus", "arrow"]);
const VARIANTS = new Set(["filled", "outlined", "ghost", "card"]);
const SIZES = new Set(["sm", "md", "lg"]);
const HEADING_LEVELS = new Set(["h2", "h3", "h4", "h5", "h6"]);
const ICON_PATHS = {
  caret: "M6 9l6 6 6-6Z",
  chevron: "M7 10l5 5 5-5",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  arrow: "M5 12h14m-7-7 7 7-7 7"
};

const instances = new WeakMap();
let generatedId = 0;

function normalizeIndices(value) {
  if (Array.isArray(value)) return value.map(Number).filter(Number.isInteger);
  if (typeof value === "number") return [value];
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((part) => Number(part.trim())).filter(Number.isInteger);
  }
  return [];
}

function booleanOption(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  return value === true || value === "true" || value === "1";
}

function readDataOptions(element) {
  const data = element.dataset;
  return {
    type: data.type,
    collapsible: data.collapsible,
    variant: data.variant,
    size: data.size,
    icon: data.icon,
    iconPosition: data.iconPosition,
    headingLevel: data.headingLevel,
    animated: data.animated,
    defaultOpen: data.defaultOpen,
    dir: data.dir
  };
}

function createIcon(name, open) {
  const actualName = name === "plus" && open ? "minus" : name;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("accordion__icon-svg");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", ICON_PATHS[actualName] || ICON_PATHS.caret);
  if (actualName === "caret") path.setAttribute("fill", "currentColor");
  else {
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.8");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
  }
  svg.append(path);
  return svg;
}

function dispatch(root, name, detail) {
  root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

export class Accordion {
  constructor(element, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError("Accordion requires a root HTMLElement.");
    }

    const existing = instances.get(element);
    if (existing) existing.destroy();

    this.element = element;
    this.options = {
      type: "single",
      collapsible: false,
      variant: "filled",
      size: "md",
      icon: "caret",
      iconPosition: "end",
      headingLevel: "h3",
      animated: true,
      defaultOpen: [],
      dir: element.getAttribute("dir") || "ltr",
      ...readDataOptions(element),
      ...options
    };
    this.options.collapsible = booleanOption(this.options.collapsible, false);
    this.options.animated = booleanOption(this.options.animated, true);
    this.openIndices = new Set();
    this.items = [];
    this.onClick = this.handleClick.bind(this);
    this.onKeydown = this.handleKeydown.bind(this);

    this.element.classList.add("accordion");
    this.element.addEventListener("click", this.onClick);
    this.element.addEventListener("keydown", this.onKeydown);
    instances.set(this.element, this);
    this.update(this.options, { resetOpen: true });
  }

  get count() {
    return this.items.length;
  }

  getOpenIndices() {
    return [...this.openIndices].sort((a, b) => a - b);
  }

  getItems() {
    return Array.from(this.element.querySelectorAll("[data-accordion-item]"));
  }

  isItemDisabled(item) {
    return this.element.hasAttribute("data-disabled") ||
      item.dataset.disabled === "true" ||
      item.hasAttribute("disabled") ||
      Boolean(item.querySelector("[data-accordion-trigger]")?.disabled);
  }

  getItem(index) {
    return this.items[Number(index)] || null;
  }

  ensureItemStructure(item, index) {
    item.classList.add("accordion__item");

    let trigger = item.querySelector("[data-accordion-trigger], .accordion__trigger, button");
    let panel = item.querySelector("[data-accordion-panel], .accordion__panel");

    if (!trigger) {
      trigger = document.createElement("button");
      trigger.type = "button";
      trigger.dataset.accordionTrigger = "";
      trigger.textContent = item.dataset.title || "Question " + (index + 1);
      item.prepend(trigger);
    }

    if (!(trigger instanceof HTMLButtonElement)) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.accordionTrigger = "";
      button.className = trigger.className;
      button.append(...Array.from(trigger.childNodes));
      trigger.replaceWith(button);
      trigger = button;
    }

    trigger.dataset.accordionTrigger = "";
    trigger.classList.add("accordion__trigger");
    if (!trigger.id) trigger.id = (this.element.id || "accordion") + "-trigger-" + index + "-" + (++generatedId);

    let heading = trigger.parentElement?.matches(this.options.headingLevel)
      ? trigger.parentElement
      : null;

    if (!heading) {
      const wrapper = document.createElement(this.options.headingLevel);
      wrapper.className = "accordion__heading";
      trigger.before(wrapper);
      wrapper.append(trigger);
      heading = wrapper;
    } else if (heading.tagName.toLowerCase() !== this.options.headingLevel) {
      const wrapper = document.createElement(this.options.headingLevel);
      wrapper.className = heading.className || "accordion__heading";
      heading.replaceWith(wrapper);
      wrapper.append(trigger);
      heading = wrapper;
    }
    heading.classList.add("accordion__heading");

    let label = trigger.querySelector(":scope > .accordion__label");
    if (!label) {
      label = document.createElement("span");
      label.className = "accordion__label";
      const oldIcon = trigger.querySelector(":scope > .accordion__icon");
      Array.from(trigger.childNodes).filter((node) => node !== oldIcon).forEach((node) => label.append(node));
      trigger.append(label);
    }

    let iconSlot = trigger.querySelector(":scope > .accordion__icon");
    if (!iconSlot) {
      iconSlot = document.createElement("span");
      iconSlot.className = "accordion__icon";
      iconSlot.setAttribute("aria-hidden", "true");
      trigger.append(iconSlot);
    }

    if (!panel) {
      panel = document.createElement("div");
      panel.dataset.accordionPanel = "";
      panel.className = "accordion__panel";
      const answer = item.dataset.answer;
      if (answer) {
        const paragraph = document.createElement("p");
        paragraph.textContent = answer;
        panel.append(paragraph);
      }
      heading.after(panel);
    }
    panel.classList.add("accordion__panel");
    if (!panel.id) panel.id = (this.element.id || "accordion") + "-panel-" + index + "-" + (++generatedId);

    trigger.setAttribute("aria-controls", panel.id);
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", trigger.id);
    item.dataset.accordionIndex = String(index);
    item.dataset.accordionValue = item.dataset.value || String(index);

    return { item, trigger, panel, iconSlot, heading };
  }

  update(options = {}, internal = {}) {
    const previousOpen = this.getOpenIndices();
    this.options = { ...this.options, ...options };

    if (!["single", "multiple"].includes(this.options.type)) this.options.type = "single";
    if (!VARIANTS.has(this.options.variant)) this.options.variant = "filled";
    if (!SIZES.has(this.options.size)) this.options.size = "md";
    if (!PRESETS.has(this.options.icon)) this.options.icon = "caret";
    if (!["start", "end"].includes(this.options.iconPosition)) this.options.iconPosition = "end";
    if (!HEADING_LEVELS.has(this.options.headingLevel)) this.options.headingLevel = "h3";
    if (!["ltr", "rtl"].includes(this.options.dir)) this.options.dir = "ltr";
    this.options.collapsible = booleanOption(this.options.collapsible, false);
    this.options.animated = booleanOption(this.options.animated, true);

    this.element.dataset.type = this.options.type;
    this.element.dataset.variant = this.options.variant;
    this.element.dataset.size = this.options.size;
    this.element.dataset.iconPosition = this.options.iconPosition;
    this.element.dataset.animated = String(this.options.animated);
    this.element.dir = this.options.dir;

    this.items = this.getItems().map((item, index) => this.ensureItemStructure(item, index));

    if (internal.resetOpen || Object.hasOwn(options, "defaultOpen")) {
      this.openIndices = new Set(normalizeIndices(this.options.defaultOpen)
        .filter((index) => index >= 0 && index < this.items.length && !this.isItemDisabled(this.items[index].item)));
      if (this.options.type === "single" && this.openIndices.size > 1) {
        this.openIndices = new Set([Math.min(...this.openIndices)]);
      }
    } else {
      this.openIndices = new Set(previousOpen.filter((index) => index < this.items.length));
      if (this.options.type === "single" && this.openIndices.size > 1) {
        this.openIndices = new Set([Math.min(...this.openIndices)]);
      }
    }

    this.items.forEach((entry, index) => {
      entry.trigger.disabled = this.isItemDisabled(entry.item);
      entry.panel.dataset.animated = String(this.options.animated);
      entry.item.dataset.disabled = String(this.isItemDisabled(entry.item));
      entry.item.dataset.state = this.openIndices.has(index) ? "open" : "closed";
      this.syncItem(entry, index, true);
    });
    return this;
  }

  renderIcon(entry, index) {
    entry.iconSlot.replaceChildren(createIcon(this.options.icon, this.openIndices.has(index)));
    entry.trigger.dataset.iconPosition = this.options.iconPosition;
    entry.trigger.dataset.iconShape = this.options.icon;
    entry.trigger.dataset.state = this.openIndices.has(index) ? "open" : "closed";
    if (this.options.iconPosition === "start") entry.trigger.insertBefore(entry.iconSlot, entry.trigger.firstChild);
    else entry.trigger.append(entry.iconSlot);
  }

  syncItem(entry, index, immediate = false) {
    const isOpen = this.openIndices.has(index);
    const { item, trigger, panel } = entry;
    item.dataset.state = isOpen ? "open" : "closed";
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("aria-controls", panel.id);
    panel.setAttribute("aria-hidden", String(!isOpen));
    panel.toggleAttribute("inert", !isOpen);

    if (isOpen) {
      panel.hidden = false;
      requestAnimationFrame(() => {
        if (this.openIndices.has(index)) panel.dataset.state = "open";
      });
    } else {
      panel.dataset.state = "closed";
      const hidePanel = () => {
        if (!this.openIndices.has(index)) panel.hidden = true;
      };
      if (immediate || !this.options.animated || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        hidePanel();
      } else {
        panel.addEventListener("transitionend", (event) => {
          if (event.target === panel && event.propertyName === "grid-template-rows") hidePanel();
        }, { once: true });
        window.setTimeout(hidePanel, 360);
      }
    }

    this.renderIcon(entry, index);
  }

  emitChange(reason, index = null) {
    const detail = {
      reason,
      index,
      openIndices: this.getOpenIndices(),
      values: this.getOpenIndices().map((i) => this.items[i]?.item.dataset.accordionValue),
      type: this.options.type
    };
    dispatch(this.element, "accordion:change", detail);
    return detail;
  }

  open(index) {
    const itemIndex = Number(index);
    const entry = this.getItem(itemIndex);
    if (!entry || this.isItemDisabled(entry.item)) return this;
    if (this.openIndices.has(itemIndex)) return this;

    if (this.options.type === "single") {
      this.getOpenIndices().forEach((openIndex) => {
        this.openIndices.delete(openIndex);
        this.syncItem(this.items[openIndex], openIndex);
        dispatch(this.element, "accordion:close", this.emitChange("close", openIndex));
      });
    }

    this.openIndices.add(itemIndex);
    this.syncItem(entry, itemIndex);
    dispatch(this.element, "accordion:open", this.emitChange("open", itemIndex));
    return this;
  }

  close(index) {
    const itemIndex = Number(index);
    const entry = this.getItem(itemIndex);
    if (!entry || !this.openIndices.has(itemIndex)) return this;

    this.openIndices.delete(itemIndex);
    this.syncItem(entry, itemIndex);
    dispatch(this.element, "accordion:close", this.emitChange("close", itemIndex));
    return this;
  }

  toggle(index) {
    const itemIndex = Number(index);
    if (this.openIndices.has(itemIndex)) {
      if (this.options.type === "multiple" || this.options.collapsible) this.close(itemIndex);
      return this;
    }
    return this.open(itemIndex);
  }

  openAll() {
    if (this.options.type === "single") {
      const nextIndex = this.items.findIndex((entry) => !this.isItemDisabled(entry.item));
      if (nextIndex >= 0) this.open(nextIndex);
      return this;
    }
    this.items.forEach((entry, index) => {
      if (!this.isItemDisabled(entry.item)) this.open(index);
    });
    return this;
  }

  closeAll() {
    this.getOpenIndices().forEach((index) => this.close(index));
    return this;
  }

  handleClick(event) {
    const trigger = event.target.closest("[data-accordion-trigger]");
    if (!trigger || !this.element.contains(trigger)) return;
    const entry = this.items.find((item) => item.trigger === trigger);
    if (!entry || trigger.disabled || this.isItemDisabled(entry.item)) return;
    const index = this.items.indexOf(entry);
    const wasOpen = this.openIndices.has(index);
    if (!wasOpen || this.options.type === "multiple" || this.options.collapsible) this.toggle(index);
  }

  handleKeydown(event) {
    const trigger = event.target.closest("[data-accordion-trigger]");
    if (!trigger || !this.element.contains(trigger)) return;

    const enabled = this.items.filter((entry) => !this.isItemDisabled(entry.item)).map((entry) => entry.trigger);
    const current = enabled.indexOf(trigger);
    if (current < 0 || !enabled.length) return;

    let next = current;
    if (event.key === "ArrowDown") next = (current + 1) % enabled.length;
    else if (event.key === "ArrowUp") next = (current - 1 + enabled.length) % enabled.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = enabled.length - 1;
    else return;

    event.preventDefault();
    enabled[next]?.focus();
  }

  destroy() {
    this.element.removeEventListener("click", this.onClick);
    this.element.removeEventListener("keydown", this.onKeydown);
    this.items.forEach(({ trigger, panel }) => {
      trigger.removeAttribute("aria-expanded");
      trigger.removeAttribute("aria-controls");
      panel.removeAttribute("role");
      panel.removeAttribute("aria-labelledby");
      panel.removeAttribute("aria-hidden");
      panel.removeAttribute("inert");
      panel.hidden = false;
    });
    this.element.classList.remove("accordion");
    instances.delete(this.element);
  }
}

export function getAccordionInstance(element) {
  return instances.get(element);
}

export function autoInitAccordions(scope = document) {
  scope.querySelectorAll("[data-accordion]:not([data-accordion-manual])").forEach((element) => {
    if (!instances.has(element)) new Accordion(element, readDataOptions(element));
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => autoInitAccordions(), { once: true });
  } else {
    autoInitAccordions();
  }
}