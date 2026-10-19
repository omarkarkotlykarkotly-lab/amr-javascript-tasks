"use strict";

/**
 * Accordion: مكوّن قابل لإعادة الاستخدام ومتاح للجميع (WAI-ARIA).
 *
 * الاستخدام: أضف data-accordion للحاوية.
 *   data-multiple="true"  → يسمح بفتح أكثر من عنصر معًا (الافتراضي: عنصر واحد)
 *
 * لوحة المفاتيح: Enter / Space للفتح والإغلاق (يوفرها <button> تلقائيًا)،
 * ↑ ↓ للتنقل بين العناوين، Home / End للقفز إلى الأول والأخير.
 */
class Accordion {
  constructor(root) {
    this.root = root;
    this.multiple = root.dataset.multiple === "true";
    this.triggers = [...root.querySelectorAll(".accordion__trigger")];

    // مزامنة الحالة الأولية (aria-expanded هو مصدر الحقيقة الوحيد)
    this.triggers.forEach((trigger) => {
      this.#setPanelState(trigger, trigger.getAttribute("aria-expanded") === "true");
    });

    // مستمع واحد للحاوية كلها (event delegation) بدل مستمع لكل زر
    root.addEventListener("click", (event) => {
      const trigger = event.target.closest(".accordion__trigger");
      if (trigger && this.triggers.includes(trigger)) this.toggle(trigger);
    });
    root.addEventListener("keydown", (event) => this.#onKeydown(event));
  }

  toggle(trigger) {
    const willOpen = trigger.getAttribute("aria-expanded") !== "true";

    if (willOpen && !this.multiple) {
      this.triggers.forEach((other) => {
        if (other !== trigger) this.#setPanelState(other, false);
      });
    }
    this.#setPanelState(trigger, willOpen);
  }

  #setPanelState(trigger, open) {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    trigger.setAttribute("aria-expanded", String(open));
    // inert: المحتوى المغلق لا يستقبل تركيزًا ولا يقرؤه قارئ الشاشة
    if (panel) panel.inert = !open;
  }

  #onKeydown(event) {
    const current = this.triggers.indexOf(document.activeElement);
    if (current === -1) return;

    const last = this.triggers.length - 1;
    const target = {
      ArrowDown: current === last ? 0 : current + 1,
      ArrowUp: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key];

    if (target !== undefined) {
      event.preventDefault();
      this.triggers[target].focus();
    }
  }
}

document.querySelectorAll("[data-accordion]").forEach((el) => new Accordion(el));