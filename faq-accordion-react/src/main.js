import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

const h = React.createElement;
const SOURCE = "https://github.com/omarkarkotlykarkotly-lab/amr-javascript-tasks/tree/main/faq-accordion-react";
const ICONS = {
  chevron: '<path d="m7 10 5 5 5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  external: '<path d="M14 4h6v6M20 4 11 13"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
  moon: '<path d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14"/>',
  keyboard: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h.01M11 9h.01M15 9h.01M7 12h.01M11 12h.01M15 12h.01M8 15h8"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  sliders: '<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"/>',
  palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 22a10 10 0 1 1 10-10c0 2-1.5 3-3.5 3H16a2 2 0 0 0-2 2c0 1.5 1 2.5-2 5Z"/>',
  zap: '<path d="m13 2-3 8H4l7 12 3-8h6L13 2Z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  package: '<path d="m12 3 9 4.5v9L12 21l-9-4.5v-9L12 3Z"/><path d="m3 7.5 9 5 9-5M12 21v-8.5M7.5 5.3l9 5"/>',
  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  checkcircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>'
};
function Icon({ name, size = 18, className = "" }) {
  return h("svg", { className: "icon " + className, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: ICONS[name] || ICONS.code } });
}

const FAQ = [
  { id: "install", question: "How do I install the Accordion package?", answer: "Install the package with your preferred package manager, then import the compound parts and the stylesheet in your React application.", value: "install" },
  { id: "controlled", question: "Can I control the open item from my own state?", answer: "Yes. Pass value and onValueChange to Accordion.Root to control its state from a parent component. Use defaultValue for an uncontrolled accordion.", value: "controlled" },
  { id: "a11y", question: "Is keyboard navigation supported?", answer: "Yes. Triggers work with Enter and Space. Arrow keys move between enabled triggers, while Home and End jump to the first and last trigger.", value: "a11y" }
];

const SNIPPETS = {
  single: 'import { Accordion } from \"@amr/accordion\";\\n\\n<Accordion.Root type=\"single\" collapsible>\\n  <Accordion.Item value=\"account\">\\n    <Accordion.Trigger>Account settings</Accordion.Trigger>\\n    <Accordion.Content>Manage your account details.</Accordion.Content>\\n  </Accordion.Item>\\n</Accordion.Root>',
  multiple: 'import { Accordion } from \"@amr/accordion\";\\n\\n<Accordion.Root type=\"multiple\" defaultValue={[\"profile\"]}>\\n  <Accordion.Item value=\"profile\">\\n    <Accordion.Trigger>Profile</Accordion.Trigger>\\n    <Accordion.Content>Your profile settings.</Accordion.Content>\\n  </Accordion.Item>\\n</Accordion.Root>',
  controlled: 'const [value, setValue] = useState(\"overview\");\\n\\n<Accordion.Root type=\"single\" value={value}\\n  onValueChange={setValue} collapsible>\\n  {/* Accordion.Item children */}\\n</Accordion.Root>',
  custom: '<Accordion.Trigger icon={({ open }) => (\\n  <span>{open ? \"−\" : \"+\"}</span>\\n)}>\\n  Custom trigger\\n</Accordion.Trigger>',
  theme: '<Accordion.Root type=\"multiple\"\\n  variant=\"filled\" size=\"lg\" dir=\"ltr\">\\n  {/* Accessible accordion items */}\\n</Accordion.Root>'
};
const INSTALL = {
  npm: "npm install @amr/accordion",
  pnpm: "pnpm add @amr/accordion",
  yarn: "yarn add @amr/accordion"
};

function DemoAccordion({ mode = "single", collapsible = true, disabled = false, variant = "default", size = "md", customIcon = false, rtl = false, initialOpen = [], compact = false }) {
  const [open, setOpen] = useState(() => new Set(initialOpen));
  const items = [
    { value: "overview", title: "What is the Accordion component?", answer: "A flexible, accessible disclosure pattern for revealing related content without leaving the current page." },
    { value: "keyboard", title: "How does keyboard navigation work?", answer: "Use Enter or Space to toggle an item, Arrow keys to move between triggers, and Home or End to jump to the first or last enabled trigger." },
    { value: "custom", title: "Can I customize the appearance?", answer: "Choose a visual variant and size, provide your own trigger icon, or use CSS variables to match the component to your design system." }
  ];
  function toggle(value) {
    setOpen((previous) => {
      const next = new Set(previous);
      if (mode === "single") {
        if (next.has(value)) { if (collapsible) next.clear(); }
        else { next.clear(); next.add(value); }
      } else if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }
  return h("div", { className: "demo-accordion " + (compact ? "is-compact" : ""), dir: rtl ? "rtl" : "ltr", "data-variant": variant, "data-size": size, "data-disabled": disabled ? "true" : undefined },
    items.map((item, index) => {
      const isOpen = open.has(item.value);
      const itemDisabled = disabled || (mode === "multiple" && item.value === "custom" && !compact);
      return h("article", { key: item.value, className: "demo-item " + (isOpen ? "is-open" : ""), "data-state": isOpen ? "open" : "closed" },
        h("h4", { className: "demo-heading" },
          h("button", { type: "button", className: "demo-trigger", disabled: itemDisabled, "aria-expanded": isOpen, onClick: () => toggle(item.value) },
            h("span", { className: "demo-num", "aria-hidden": "true" }, String(index + 1).padStart(2, "0")),
            h("span", { className: "demo-label" }, item.title),
            h("span", { className: "demo-icon", "aria-hidden": "true" },
              customIcon ? (isOpen ? h(Icon, { name: "minus", size: 16 }) : h(Icon, { name: "plus", size: 16 })) : h(Icon, { name: "chevron", size: 16 })
            )
          )
        ),
        h("div", { className: "demo-panel", "aria-hidden": !isOpen, inert: !isOpen },
          h("div", { className: "demo-panel-inner" }, h("p", null, item.answer))
        )
      );
    })
  );
}

function CodePanel({ code, label = "Example" }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }
  return h("div", { className: "code-panel" },
    h("div", { className: "code-toolbar" },
      h("div", { className: "code-file" }, h("span", { className: "code-dot" }), label),
      h("button", { type: "button", className: "copy-button", onClick: copy, "aria-label": "Copy " + label + " code" },
        h(Icon, { name: copied ? "check" : "copy", size: 14 }), copied ? "Copied" : "Copy code")
    ),
    h("pre", null, h("code", null, code))
  );
}

function PropTable({ rows }) {
  return h("div", { className: "table-wrap" },
    h("table", { className: "api-table" },
      h("thead", null, h("tr", null, h("th", null, "Prop"), h("th", null, "Type"), h("th", null, "Default"), h("th", null, "Description"))),
      h("tbody", null, rows.map((row) => h("tr", { key: row[0] },
        h("td", null, h("code", { className: "prop-name" }, row[0])),
        h("td", null, h("code", { className: "type-code" }, row[1])),
        h("td", null, h("code", { className: "type-code" }, row[2])),
        h("td", null, row[3])
      )))
    )
  );
}

function App() {
  const [theme, setTheme] = useState("system");
  const [systemDark, setSystemDark] = useState(false);
  const [accent, setAccent] = useState("indigo");
  const [playVariant, setPlayVariant] = useState("bordered");
  const [playSize, setPlaySize] = useState("md");
  const [installTab, setInstallTab] = useState("npm");
  const [mobileNav, setMobileNav] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemDark(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;
  const rootStyle = { "--accent": accent === "violet" ? "#8b5cf6" : accent === "cyan" ? "#0891b2" : accent === "emerald" ? "#059669" : accent === "rose" ? "#e11d48" : "#6366f1" };
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedInstall(true);
      window.setTimeout(() => setCopiedInstall(false), 1600);
    } catch {
      setCopiedInstall(false);
    }
  }

  const features = [
    ["shield", "Accessibility first", "WAI-ARIA relationships, labelled regions, visible focus rings, and sensible defaults."],
    ["keyboard", "Keyboard navigation", "Arrow keys move between triggers. Home and End jump to the first and last item."],
    ["zap", "Smooth motion", "Height transitions and animated indicators respect reduced-motion preferences."],
    ["layers", "Flexible state", "Single or multiple values, controlled or uncontrolled, with explicit collapsibility."],
    ["palette", "Design variants", "Default, bordered, filled, and ghost surfaces plus three component sizes."],
    ["code", "TypeScript ready", "Exported prop types, compound components, forwarded refs, and native element props."]
  ];

  return h("div", { className: "site", "data-theme": resolvedTheme, "data-accent": accent, style: rootStyle },
    h("header", { className: "navbar" },
      h("div", { className: "nav-inner" },
        h("a", { href: "#top", className: "brand", "aria-label": "Accord UI home" },
          h("span", { className: "brand-mark" }, h(Icon, { name: "chevron", size: 20 })),
          h("span", { className: "brand-word" }, "accord", h("span", null, ".ui")),
          h("span", { className: "version-pill" }, "v1.0")
        ),
        h("nav", { className: "main-nav " + (mobileNav ? "is-open" : ""), "aria-label": "Main navigation" },
          [["Features", "#features"], ["Examples", "#examples"], ["Playground", "#playground"], ["API", "#api"], ["Install", "#install"]].map((item) => h("a", { key: item[0], href: item[1], onClick: () => setMobileNav(false) }, item[0]))
        ),
        h("div", { className: "nav-actions" },
          h("button", { type: "button", className: "icon-button theme-button", onClick: () => setTheme(theme === "dark" ? "light" : theme === "light" ? "dark" : resolvedTheme === "dark" ? "light" : "dark"), "aria-label": "Toggle color theme", title: "Toggle theme" }, h(Icon, { name: resolvedTheme === "dark" ? "sun" : "moon", size: 17 })),
          h("a", { className: "nav-github", href: SOURCE, target: "_blank", rel: "noreferrer" }, h(Icon, { name: "external", size: 15 }), "GitHub"),
          h("button", { type: "button", className: "mobile-menu icon-button", onClick: () => setMobileNav(!mobileNav), "aria-label": "Toggle navigation" }, h(Icon, { name: "menu", size: 18 }))
        )
      )
    ),

    h("main", { id: "top" },
      h("section", { className: "hero section-wrap" },
        h("div", { className: "hero-copy" },
          h("div", { className: "announcement" }, h("span", { className: "announcement-dot" }), "OPEN SOURCE COMPONENT", h("span", { className: "announcement-arrow" }, h(Icon, { name: "arrow", size: 13 }))),
          h("h1", null, "A better way to ", h("span", null, "expand"), " the details."),
          h("p", { className: "hero-description" }, "A thoughtfully built, accessible React accordion. Flexible state, polished motion, and a design system that fits your product."),
          h("div", { className: "hero-ctas" },
            h("a", { className: "button-primary", href: "#install" }, "Get started", h(Icon, { name: "arrow", size: 16 })),
            h("a", { className: "button-secondary", href: SOURCE, target: "_blank", rel: "noreferrer" }, h(Icon, { name: "code", size: 16 }), "View on GitHub")
          ),
          h("div", { className: "hero-meta" }, h("span", null, h(Icon, { name: "checkcircle", size: 15 }), "Accessible by default"), h("span", null, h(Icon, { name: "package", size: 15 }), "TypeScript"), h("span", null, h(Icon, { name: "zap", size: 15 }), "Tiny API"))
        ),
        h("div", { className: "hero-demo-wrap" },
          h("div", { className: "hero-glow" }),
          h("div", { className: "hero-demo-card" },
            h("div", { className: "demo-card-top" }, h("span", { className: "window-dots" }, h("i"), h("i"), h("i")), h("span", { className: "demo-card-label" }, "LIVE PREVIEW"), h("span", { className: "status-live" }, "● Live")),
            h("div", { className: "hero-demo-title" }, h("span", { className: "mini-icon" }, h(Icon, { name: "layers", size: 15 })), "Product overview"),
            h(DemoAccordion, { compact: true, mode: "single", collapsible: true, initialOpen: ["overview"] }),
            h("div", { className: "hero-demo-footer" }, h("span", null, h(Icon, { name: "check", size: 14 }), "Try clicking a question"), h("span", null, "Interactive preview"))
          )
        )
      ),

      h("section", { id: "features", className: "section-wrap features-section" },
        h("div", { className: "section-heading" }, h("div", { className: "eyebrow" }, "MADE FOR REAL PRODUCTS"), h("h2", null, "The details are the difference."), h("p", null, "A small, predictable API backed by the accessibility and customization features your team expects.")),
        h("div", { className: "feature-grid" }, features.map((feature, i) => h("article", { key: feature[1], className: "feature-card", style: { "--stagger": i } },
          h("span", { className: "feature-icon" }, h(Icon, { name: feature[0], size: 19 })),
          h("h3", null, feature[1]), h("p", null, feature[2]), h("span", { className: "feature-card-arrow" }, h(Icon, { name: "arrow", size: 15 }))
        )))
      ),

      h("section", { id: "examples", className: "section-wrap examples-section" },
        h("div", { className: "section-heading split-heading" }, h("div", null, h("div", { className: "eyebrow" }, "COMPOSABLE BY DESIGN"), h("h2", null, "See it in action."), h("p", null, "Six common patterns, one consistent component API.")), h("span", { className: "section-index" }, "01 — 06")),
        h("div", { className: "examples-grid" },
          h("article", { className: "example-card" }, h("div", { className: "example-head" }, h("span", { className: "example-number" }, "01"), h("div", null, h("h3", null, "Single"), h("p", null, "Only one item opens at once.")), h("span", { className: "type-badge" }, "type=single")), h(DemoAccordion, { mode: "single", collapsible: false, initialOpen: ["overview"], compact: true }), h(CodePanel, { label: "single.tsx", code: SNIPPETS.single })),
          h("article", { className: "example-card" }, h("div", { className: "example-head" }, h("span", { className: "example-number" }, "02"), h("div", null, h("h3", null, "Multiple"), h("p", null, "Keep several answers expanded.")), h("span", { className: "type-badge" }, "type=multiple")), h(DemoAccordion, { mode: "multiple", initialOpen: ["overview", "keyboard"], compact: true }), h(CodePanel, { label: "multiple.tsx", code: SNIPPETS.multiple })),
          h("article", { className: "example-card" }, h("div", { className: "example-head" }, h("span", { className: "example-number" }, "03"), h("div", null, h("h3", null, "Collapsible"), h("p", null, "Close the last open item.")), h("span", { className: "type-badge" }, "collapsible")), h(DemoAccordion, { mode: "single", collapsible: true, initialOpen: ["overview"], compact: true }), h(CodePanel, { label: "collapsible.tsx", code: SNIPPETS.single })),
          h("article", { className: "example-card" }, h("div", { className: "example-head" }, h("span", { className: "example-number" }, "04"), h("div", null, h("h3", null, "Disabled"), h("p", null, "Disable a root or one item.")), h("span", { className: "type-badge" }, "disabled")), h(DemoAccordion, { mode: "multiple", disabled: false, initialOpen: ["overview"], compact: true }), h("p", { className: "example-note" }, h(Icon, { name: "check", size: 14 }), "The third item is disabled in this example.")),
          h("article", { className: "example-card" }, h("div", { className: "example-head" }, h("span", { className: "example-number" }, "05"), h("div", null, h("h3", null, "Variants & sizes"), h("p", null, "Tune surfaces and density.")), h("span", { className: "type-badge" }, "themeable")), h(DemoAccordion, { mode: "single", variant: "filled", size: "sm", initialOpen: ["overview"], compact: true }), h("p", { className: "example-note" }, h(Icon, { name: "palette", size: 14 }), "Try the theming playground below.")),
          h("article", { className: "example-card" }, h("div", { className: "example-head" }, h("span", { className: "example-number" }, "06"), h("div", null, h("h3", null, "Custom icons"), h("p", null, "Bring your own icon slot.")), h("span", { className: "type-badge" }, "icon")), h(DemoAccordion, { mode: "single", customIcon: true, initialOpen: ["overview"], compact: true }), h(CodePanel, { label: "custom-icon.tsx", code: SNIPPETS.custom }))
        )
      ),

      h("section", { id: "playground", className: "playground-section" },
        h("div", { className: "section-wrap playground-inner" },
          h("div", { className: "section-heading" }, h("div", { className: "eyebrow" }, "MAKE IT YOURS"), h("h2", null, "Theming playground."), h("p", null, "Change the theme, accent, variant, and size to see the component respond in real time.")),
          h("div", { className: "playground-layout" },
            h("aside", { className: "playground-controls" },
              h("div", { className: "control-group" }, h("label", null, "Color theme"), h("div", { className: "segmented" }, ["system", "light", "dark"].map((x) => h("button", { key: x, type: "button", className: theme === x ? "active" : "", onClick: () => setTheme(x) }, x[0].toUpperCase() + x.slice(1)))),
              h("p", { className: "control-hint" }, "System follows your OS preference.")),
              h("div", { className: "control-group" }, h("label", null, "Accent color"), h("div", { className: "swatch-row" }, ["indigo", "violet", "cyan", "emerald", "rose"].map((x) => h("button", { key: x, type: "button", className: "color-swatch swatch-" + x + (accent === x ? " active" : ""), onClick: () => setAccent(x), "aria-label": x + " accent", "aria-pressed": accent === x })), h("span", { className: "swatch-label" }, accent))),
              h("div", { className: "control-group" }, h("label", null, "Variant"), h("div", { className: "select-wrap" }, h("select", { value: playVariant, onChange: (e) => setPlayVariant(e.target.value) }, ["default", "bordered", "filled", "ghost"].map((x) => h("option", { value: x, key: x }, x[0].toUpperCase() + x.slice(1)))))),
              h("div", { className: "control-group" }, h("label", null, "Size"), h("div", { className: "segmented" }, ["sm", "md", "lg"].map((x) => h("button", { key: x, type: "button", className: playSize === x ? "active" : "", onClick: () => setPlaySize(x) }, x.toUpperCase()))),
              h("div", { className: "playground-code-label" }, h(Icon, { name: "code", size: 15 }), "Current configuration"),
              h("code", { className: "config-code" }, '<Accordion.Root type=\"multiple\" variant=\"' + playVariant + '\" size=\"' + playSize + '\" />')
            ),
            h("div", { className: "playground-preview" },
              h("div", { className: "preview-bar" }, h("span", null, "LIVE COMPONENT"), h("span", { className: "preview-bar-right" }, h("span", { className: "preview-dot" }), "Updates instantly")),
              h("div", { className: "preview-content" }, h(DemoAccordion, { mode: "multiple", variant: playVariant, size: playSize, initialOpen: ["overview"] })),
              h("div", { className: "preview-bottom" }, h(Icon, { name: "checkcircle", size: 15 }), "All controls are interactive")
            )
          )
        )
      ),

      h("section", { id: "api", className: "section-wrap api-section" },
        h("div", { className: "section-heading split-heading" }, h("div", null, h("div", { className: "eyebrow" }, "CLEAR API, FEWER SURPRISES"), h("h2", null, "API reference."), h("p", null, "Four compound parts. Every prop is typed and documented.")), h("span", { className: "api-stamp" }, h(Icon, { name: "code", size: 15 }), "TypeScript")),
        h("div", { className: "api-block" }, h("div", { className: "api-block-title" }, h("code", null, "Accordion.Root"), h("span", null, "Controls state, direction, and visual defaults")), h(PropTable, { rows: [
          ["type", "'single' | 'multiple'", "required", "Choose one open item or allow many."],
          ["value", "string | string[]", "undefined", "Controlled open value(s)."],
          ["defaultValue", "string | string[]", "undefined", "Initial value for uncontrolled state."],
          ["onValueChange", "(value) => void", "—", "Called when the open value changes."],
          ["collapsible", "boolean", "false", "Allow the active single item to close."],
          ["disabled", "boolean", "false", "Disable all triggers within the root."],
          ["dir", "'ltr' | 'rtl'", "'ltr'", "Set text direction and horizontal navigation."],
          ["variant / size", "AccordionVariant / AccordionSize", "'default' / 'md'", "Set appearance and density."]
        ] })),
        h("div", { className: "api-block" }, h("div", { className: "api-block-title" }, h("code", null, "Accordion.Item"), h("span", null, "Defines an addressable section")), h(PropTable, { rows: [
          ["value", "string", "required", "Unique identifier for this item."],
          ["disabled", "boolean", "false", "Disable this item without disabling siblings."],
          ["...div props", "HTMLAttributes<HTMLDivElement>", "—", "Native attributes and forwarded ref."]
        ] })),
        h("div", { className: "api-block" }, h("div", { className: "api-block-title" }, h("code", null, "Accordion.Trigger"), h("span", null, "Accessible button inside a heading")), h(PropTable, { rows: [
          ["icon", "ReactNode | render function", "chevron", "Custom icon slot; render functions receive open, disabled, and direction."],
          ["disabled", "boolean", "false", "Disable this trigger."],
          ["...button props", "ButtonHTMLAttributes", "—", "Native button attributes, events, and forwarded ref."]
        ] })),
        h("div", { className: "api-block" }, h("div", { className: "api-block-title" }, h("code", null, "Accordion.Content"), h("span", null, "Animated, labelled answer region")), h(PropTable, { rows: [
          ["forceMount", "boolean", "false", "Keep content mounted while closed."],
          ["...div props", "HTMLAttributes<HTMLDivElement>", "—", "Native region attributes and forwarded ref."]
        ] }))
      ),

      h("section", { id: "install", className: "install-section" },
        h("div", { className: "section-wrap install-layout" },
          h("div", { className: "install-copy" }, h("div", { className: "eyebrow" }, "UP AND RUNNING"), h("h2", null, "A few lines. A better UX."), h("p", null, "Use your favourite package manager, import the styles, and compose the parts to suit your interface."), h("div", { className: "install-checks" }, h("span", null, h(Icon, { name: "check", size: 15 }), "React 18+"), h("span", null, h(Icon, { name: "check", size: 15 }), "TypeScript exports"), h("span", null, h(Icon, { name: "check", size: 15 }), "No runtime dependencies beyond React"))),
          h("div", { className: "install-card" },
            h("div", { className: "install-tabs", role: "tablist", "aria-label": "Package manager" }, ["npm", "pnpm", "yarn"].map((x) => h("button", { key: x, type: "button", role: "tab", className: installTab === x ? "active" : "", "aria-selected": installTab === x, onClick: () => setInstallTab(x) }, x))),
            h("div", { className: "install-command" }, h("span", { className: "terminal-prompt" }, "$"), h("code", null, INSTALL[installTab]), h("button", { type: "button", className: "icon-button copy-install", onClick: () => copyText(INSTALL[installTab]), "aria-label": "Copy install command" }, h(Icon, { name: copiedInstall ? "check" : "copy", size: 16 }))),
            h("div", { className: "install-divider" }),
            h("div", { className: "quickstart-title" }, h("span", null, "01"), h("strong", null, "Import the component")),
            h("pre", { className: "quickstart-code" }, h("code", null, 'import { Accordion } from \"@amr/accordion\";\\nimport \"@amr/accordion/styles.css\";')),
            h("div", { className: "quickstart-title" }, h("span", null, "02"), h("strong", null, "Compose your sections")),
            h("pre", { className: "quickstart-code" }, h("code", null, ' <Accordion.Root type=\"single\" collapsible>\\n  <Accordion.Item value=\"details\">\\n    <Accordion.Trigger>Details</Accordion.Trigger>\\n    <Accordion.Content>More information.</Accordion.Content>\\n  </Accordion.Item>\\n</Accordion.Root>')),
            h("p", { className: "install-disclaimer" }, "Package name and install command are illustrative until this project is published to a package registry.")
          )
        )
      )
    ),

    h("footer", { className: "footer" },
      h("div", { className: "footer-inner" },
        h("a", { href: "#top", className: "brand footer-brand" }, h("span", { className: "brand-mark" }, h(Icon, { name: "chevron", size: 17 })), h("span", { className: "brand-word" }, "accord", h("span", null, ".ui"))),
        h("p", null, "Built with care. Designed for every detail."),
        h("div", { className: "footer-links" }, h("a", { href: "#api" }, "API"), h("a", { href: "#examples" }, "Examples"), h("a", { href: SOURCE, target: "_blank", rel: "noreferrer" }, "GitHub", h(Icon, { name: "external", size: 13 })))
      )
    )
  );
}

createRoot(document.getElementById("root")).render(h(React.StrictMode, null, h(App)));
