import { iconMarkup, parseBoolean, parseIndexList, prefersReducedMotion } from "./utils.js";

const instances = new WeakMap();
let sequence = 0;
const defaults = {
  type: "single",
  collapsible: false,
  variant: "filled",
  size: "md",
  icon: "caret",
  iconPosition: "end",
  headingLevel: "h3",
  animated: true,
  defaultOpen: undefined,
  dir: "ltr",
  disabled: false,
};
const valid = {
  type: ["single", "multiple"],
  variant: ["filled", "outlined", "ghost", "card"],
  size: ["sm", "md", "lg"],
  icon: ["caret", "chevron", "plus", "arrow"],
  iconPosition: ["start", "end"],
  headingLevel: ["h2", "h3", "h4", "h5", "h6"],
  dir: ["ltr", "rtl"],
};

function fromData(root) {
  const map = {
    type: "type", collapsible: "collapsible", variant: "variant", size: "size",
    icon: "icon", iconPosition: "iconPosition", headingLevel: "headingLevel",
    animated: "animated", defaultOpen: "defaultOpen", dir: "dir", disabled: "disabled",
  };
  const parsed = {};
  if (!root.dataset.type && root.dataset.multiple === "true") parsed.type = "multiple";
  Object.entries(map).forEach(([key, dataKey]) => {
    if (root.dataset[dataKey] === undefined) return;
    if (["collapsible", "animated", "disabled"].includes(key)) {
      parsed[key] = parseBoolean(root.dataset[dataKey]);
    } else if (key === "defaultOpen") {
      parsed[key] = parseIndexList(root.dataset[dataKey]);
    } else {
      parsed[key] = root.dataset[dataKey];
    }
  });
  return parsed;
}

function normalizeOptions(current) {
  const normalized = { ...current };
  Object.entries(valid).forEach(([key, choices]) => {
    if (!choices.includes(normalized[key])) normalized[key] = defaults[key];
  });
  ["collapsible", "animated", "disabled"].forEach((key) => {
    normalized[key] = Boolean(normalized[key]);
  });
  return normalized;
}

export class Accordion {
  constructor(root, options = {}) {
    if (!(root instanceof Element)) throw new TypeError("Accordion requires a valid root element.");
    this.root = root;
    this.destroyed = false;
    this.hideTimers = new Map();
    sequence += 1;
    this.id = root.id || "accordion-" + sequence;
    if (!root.id) root.id = this.id;
    this.options = normalizeOptions({ ...defaults, ...fromData(root), ...options });
    this.items = this.#findItems();
    this.#normalizeMarkup();

    const currentOpen = this.items
      .filter(({ trigger }) => trigger.getAttribute("aria-expanded") === "true")
      .map(({ index }) => index);
    const firstOpen = Object.prototype.hasOwnProperty.call(options, "defaultOpen")
      ? parseIndexList(options.defaultOpen)
      : this.options.defaultOpen !== undefined
        ? parseIndexList(this.options.defaultOpen)
        : currentOpen;
    this.openIndexes = new Set();
    firstOpen.forEach((index) => {
      if (this.#enabled(index) && (this.options.type === "multiple" || !this.openIndexes.size)) {
        this.openIndexes.add(index);
      }
    });

    this._click = (event) => this.#onClick(event);
    this._keydown = (event) => this.#onKeydown(event);
    this._transitionend = (event) => this.#onTransitionEnd(event);
    root.addEventListener("click", this._click);
    root.addEventListener("keydown", this._keydown);
    root.addEventListener("transitionend", this._transitionend);

    this.#applyOptions();
    this.items.forEach(({ index }) => this.#paint(index, this.openIndexes.has(index), false));
    instances.set(root, this);
  }

  #findItems() {
    return Array.from(this.root.querySelectorAll("[data-accordion-item], .accordion__item"))
      .map((element, index) => {
        const trigger = element.querySelector("[data-accordion-trigger], .accordion__trigger, button");
        const panel = element.querySelector("[data-accordion-panel], .accordion__panel, [role='region']");
        return trigger && panel ? { element, trigger, panel, index } : null;
      }).filter(Boolean);
  }

  #normalizeMarkup() {
    this.items.forEach((entry, index) => {
      let { element, trigger, panel } = entry;
      if (trigger.tagName !== "BUTTON") {
        const button = this.root.ownerDocument.createElement("button");
        Array.from(trigger.attributes).forEach((attribute) => button.setAttribute(attribute.name, attribute.value));
        button.className = trigger.className;
        button.innerHTML = trigger.innerHTML;
        trigger.replaceWith(button);
        trigger = button;
      }
      trigger.type = "button";
      trigger.classList.add("accordion__trigger");
      trigger.dataset.accordionTrigger = "true";
      element.classList.add("accordion__item");

      let heading = trigger.closest("h1, h2, h3, h4, h5, h6");
      if (!heading || heading.parentElement !== element) {
        heading = this.root.ownerDocument.createElement(this.options.headingLevel);
        heading.className = "accordion__heading";
        trigger.parentNode.insertBefore(heading, trigger);
        heading.append(trigger);
      } else {
        heading = this.#headingAtLevel(heading, this.options.headingLevel);
      }
      heading.classList.add("accordion__heading");

      const itemKey = element.dataset.value || String(index + 1);
      if (!trigger.id) trigger.id = this.id + "-trigger-" + itemKey;
      if (!panel.id) panel.id = this.id + "-panel-" + itemKey;
      trigger.setAttribute("aria-controls", panel.id);
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", trigger.id);
      panel.classList.add("accordion__panel");

      let label = trigger.querySelector(".accordion__label");
      let icon = trigger.querySelector(".accordion__icon");
      if (!label) {
        label = this.root.ownerDocument.createElement("span");
        label.className = "accordion__label";
        Array.from(trigger.childNodes).forEach((node) => {
          if (node !== icon) label.append(node);
        });
        trigger.insertBefore(label, icon || null);
      }
      if (!icon) {
        icon = this.root.ownerDocument.createElement("span");
        icon.className = "accordion__icon";
        trigger.append(icon);
      }
      icon.setAttribute("aria-hidden", "true");
      const isDisabled = element.dataset.disabled === "true" || trigger.disabled;
      element.dataset.disabled = String(isDisabled);
      trigger.disabled = isDisabled;
      this.items[index] = { element, trigger, panel, index };
    });
  }

  #headingAtLevel(heading, level) {
    if (heading.tagName.toLowerCase() === level) return heading;
    const replacement = this.root.ownerDocument.createElement(level);
    Array.from(heading.attributes).forEach((attribute) => replacement.setAttribute(attribute.name, attribute.value));
    while (heading.firstChild) replacement.append(heading.firstChild);
    heading.replaceWith(replacement);
    return replacement;
  }

  #applyOptions() {
    const { type, variant, size, iconPosition, headingLevel, animated, dir, disabled, icon } = this.options;
    Object.assign(this.root.dataset, {
      type, variant, size, icon, iconPosition, headingLevel, animated: String(animated), disabled: String(disabled),
    });
    this.root.setAttribute("dir", dir);
    this.root.classList.add("accordion", "accordion--initialized");

    this.items.forEach(({ element, trigger, panel }) => {
      const heading = trigger.closest("h1, h2, h3, h4, h5, h6");
      if (heading) this.#headingAtLevel(heading, headingLevel).classList.add("accordion__heading");
      trigger.disabled = disabled || element.dataset.disabled === "true";
      const iconElement = trigger.querySelector(".accordion__icon");
      iconElement.dataset.position = iconPosition;
      iconElement.dataset.shape = icon;
      iconElement.innerHTML = iconMarkup(icon, trigger.getAttribute("aria-expanded") === "true");
      panel.dataset.animated = String(animated);
    });
  }

  #enabled(index) {
    const item = this.items[index];
    return Boolean(item && !this.options.disabled && !item.trigger.disabled && item.element.dataset.disabled !== "true");
  }

  #resolve(value) {
    if (Number.isInteger(value)) return value >= 0 && value < this.items.length ? value : -1;
    if (typeof value === "string") {
      return this.items.find(({ element, trigger, index }) =>
        element.dataset.value === value || trigger.id === value || String(index) === value
      )?.index ?? -1;
    }
    if (value instanceof Element) {
      return this.items.find(({ element, trigger }) => element === value || trigger === value || element.contains(value))?.index ?? -1;
    }
    return -1;
  }

  #emit(name, item, action) {
    const Constructor = this.root.ownerDocument.defaultView?.CustomEvent || CustomEvent;
    this.root.dispatchEvent(new Constructor(name, {
      bubbles: true,
      detail: {
        index: item.index,
        value: item.element.dataset.value || item.index,
        trigger: item.trigger,
        panel: item.panel,
        open: this.openIndexes.has(item.index),
        openIndexes: Array.from(this.openIndexes),
        action,
      },
    }));
  }

  #paint(index, open, animate = this.options.animated) {
    const item = this.items[index];
    if (!item) return;
    const { element, trigger, panel } = item;
    const wasOpen = trigger.getAttribute("aria-expanded") === "true";
    const pendingTimer = this.hideTimers.get(index);
    if (pendingTimer) globalThis.clearTimeout(pendingTimer);
    this.hideTimers.delete(index);

    trigger.setAttribute("aria-expanded", String(open));
    trigger.dataset.state = open ? "open" : "closed";
    element.dataset.state = open ? "open" : "closed";
    panel.setAttribute("aria-hidden", String(!open));
    panel.inert = !open;
    panel.dataset.state = open ? "open" : "closed";
    const iconElement = trigger.querySelector(".accordion__icon");
    if (iconElement) iconElement.innerHTML = iconMarkup(this.options.icon, open);

    if (open) {
      panel.hidden = false;
      this.openIndexes.add(index);
      if (animate && !prefersReducedMotion()) {
        panel.dataset.state = "closed";
        globalThis.requestAnimationFrame(() => {
          if (!this.destroyed && this.openIndexes.has(index)) panel.dataset.state = "open";
        });
      } else {
        panel.dataset.state = "open";
      }
    } else {
      this.openIndexes.delete(index);
      if (!animate || prefersReducedMotion() || !wasOpen) {
        panel.hidden = true;
      } else {
        panel.hidden = false;
        this.hideTimers.set(index, globalThis.setTimeout(() => {
          if (!this.openIndexes.has(index)) panel.hidden = true;
          this.hideTimers.delete(index);
        }, 320));
      }
    }

    if (wasOpen !== open) {
      this.#emit(open ? "accordion:open" : "accordion:close", item, open ? "open" : "close");
      this.#emit("accordion:change", item, open ? "open" : "close");
    }
  }

  #onClick(event) {
    const trigger = event.target.closest?.("[data-accordion-trigger]");
    if (!trigger || !this.root.contains(trigger)) return;
    const item = this.items.find((entry) => entry.trigger === trigger);
    if (item && this.#enabled(item.index)) this.toggle(item.index);
  }

  #onKeydown(event) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const current = this.items.find(({ trigger }) => trigger === event.target);
    if (!current) return;
    const available = this.items.filter(({ index, element }) => this.#enabled(index) && !element.hidden);
    const currentPosition = available.findIndex(({ index }) => index === current.index);
    if (currentPosition < 0 || !available.length) return;

    let target = currentPosition;
    if (event.key === "ArrowDown") target = (currentPosition + 1) % available.length;
    if (event.key === "ArrowUp") target = (currentPosition - 1 + available.length) % available.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = available.length - 1;
    if (target !== currentPosition) {
      event.preventDefault();
      available[target].trigger.focus();
    }
  }

  #onTransitionEnd(event) {
    if (!event.target.matches?.(".accordion__panel") || event.propertyName !== "grid-template-rows") return;
    const item = this.items.find((entry) => entry.panel === event.target);
    if (item && !this.openIndexes.has(item.index)) item.panel.hidden = true;
  }

  open(value) {
    const index = this.#resolve(value);
    if (!this.#enabled(index) || this.openIndexes.has(index)) return this;
    if (this.options.type === "single") Array.from(this.openIndexes).forEach((opened) => this.#paint(opened, false));
    this.#paint(index, true);
    return this;
  }

  close(value) {
    const index = this.#resolve(value);
    if (index >= 0 && this.openIndexes.has(index)) this.#paint(index, false);
    return this;
  }

  toggle(value) {
    const index = this.#resolve(value);
    if (!this.#enabled(index)) return this;
    if (this.openIndexes.has(index)) {
      if (this.options.type === "multiple" || this.options.collapsible) this.close(index);
    } else {
      this.open(index);
    }
    return this;
  }

  openAll() {
    if (this.options.type === "single") {
      const first = this.items.find(({ index }) => this.#enabled(index));
      if (first) this.open(first.index);
      return this;
    }
    this.items.forEach(({ index }) => { if (this.#enabled(index)) this.open(index); });
    return this;
  }

  closeAll() {
    Array.from(this.openIndexes).forEach((index) => this.close(index));
    return this;
  }

  update(options = {}) {
    const previousType = this.options.type;
    this.options = normalizeOptions({ ...this.options, ...options });
    this.#applyOptions();
    if (previousType !== this.options.type && this.options.type === "single" && this.openIndexes.size > 1) {
      const [first, ...rest] = Array.from(this.openIndexes);
      rest.forEach((index) => this.#paint(index, false));
      if (first !== undefined) this.openIndexes.add(first);
    }
    if (Object.prototype.hasOwnProperty.call(options, "defaultOpen")) {
      this.closeAll();
      parseIndexList(options.defaultOpen).forEach((index) => this.open(index));
    } else {
      this.items.forEach(({ index }) => this.#paint(index, this.openIndexes.has(index), false));
    }
    return this;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.root.removeEventListener("click", this._click);
    this.root.removeEventListener("keydown", this._keydown);
    this.root.removeEventListener("transitionend", this._transitionend);
    this.hideTimers.forEach((timer) => globalThis.clearTimeout(timer));
    this.hideTimers.clear();
    this.root.classList.remove("accordion--initialized");
    instances.delete(this.root);
  }

  static autoInit(scope = document) {
    return autoInitAccordions(scope);
  }
}

export function autoInitAccordions(scope = document) {
  const elements = [];
  if (scope instanceof Element && scope.matches("[data-accordion]")) elements.push(scope);
  elements.push(...scope.querySelectorAll("[data-accordion]"));
  return elements.map((element) => instances.get(element) || new Accordion(element));
}
