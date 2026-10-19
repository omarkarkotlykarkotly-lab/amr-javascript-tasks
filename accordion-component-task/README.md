# HTML, CSS & JavaScript — Interactive Learning Accordion

A beginner-friendly learning page for HTML, CSS, and JavaScript inspired by the topic-by-topic tutorial style of educational sites such as W3Schools. The lessons and examples here are original practice material. The project uses **vanilla HTML, CSS, and JavaScript ES modules only**: no React, no third-party JavaScript libraries, no package install, and no build step.

## Learning content

The accordion contains ten concise lessons, grouped by topic:

- **HTML:** page structure, tags and attributes, and semantic elements.
- **CSS:** selectors and rules, the box model, Flexbox vs. Grid, and responsive layouts.
- **JavaScript:** variables, functions and events, and DOM manipulation.

Each lesson includes a plain-language explanation and a small code example. Use the search field to find a concept in the lesson title, explanation, topic label, or example. The display selector lets you show 4, 6, 8, or 10 lessons.

## What changed

The starting version was a static Arabic FAQ with four entries. Its original Accordion class supported a basic multiple-open flag, synchronized aria-expanded and inert, and delegated clicks and keyboard navigation. The whole visual design and behavior were concentrated in one CSS file and one JavaScript file.

The upgrade changes the page into an interactive learning playground with a responsive control drawer, light/dark themes, searchable and highlighted lessons, category labels, code examples, live status rings, and a copyable JavaScript configuration snippet. The component logic remains independent from the playground so it can be reused with other markup.

## File structure

- index.html — semantic page shell, theme boot script, search area, controls, status rings, and generated code panel.
- css/tokens.css — design tokens and theme overrides.
- css/base.css — baseline typography, reset, focus indicators, and reduced-motion handling.
- css/layout.css — app window, three-column desktop layout, scroll areas, and responsive drawer.
- css/accordion.css — reusable Accordion item variants, icon states, sizes, panel transitions, and lesson examples.
- css/components.css — styled controls, hero, cards, progress rings, copy panel, and responsive refinements.
- js/accordion.js — reusable Accordion class, data-attribute initialization, keyboard behavior, state changes, and custom events.
- js/playground.js — lesson rendering, filtering, controls, theme persistence, live stats, and generated snippet.
- js/data.js — ten HTML, CSS, and JavaScript lessons.
- js/utils.js — safe highlighting, icon templates, boolean and index parsing, debounce, and clipboard fallback.

## Run locally

Open index.html in a modern browser, or run this one-line static server from the repository root:

    python -m http.server 8000

Then open:

    http://localhost:8000/accordion-component-task/

Use a local server because ES modules are loaded from separate files. No build or dependency installation is required. Google Fonts are optional; if they cannot load, system font fallbacks are used.

## Reusable component

### Markup

Add data-accordion to the root. Each item has a trigger button and a related panel. The class adds stable IDs, heading semantics, icons, ARIA relationships, inert behavior, and hidden state.

    <div id="learning-accordion" class="accordion" data-accordion data-type="single">
      <article class="accordion__item" data-accordion-item data-value="html">
        <h3 class="accordion__heading">
          <button class="accordion__trigger" data-accordion-trigger type="button">
            <span class="accordion__label">What is HTML?</span>
            <span class="accordion__icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="accordion__panel" data-accordion-panel>
          <div class="accordion__content">
            <p>HTML defines the structure and meaning of a web page.</p>
          </div>
        </div>
      </article>
    </div>

### Initialize and configure

    import { Accordion, autoInitAccordions } from "./js/accordion.js";

    const root = document.querySelector("#learning-accordion");
    const accordion = new Accordion(root, {
      type: "single",
      collapsible: true,
      variant: "filled",
      size: "md",
      icon: "caret",
      iconPosition: "end",
      headingLevel: "h3",
      animated: true,
      defaultOpen: [0],
      dir: "ltr",
      disabled: false,
    });

    // Or initialize all elements marked with data-accordion.
    autoInitAccordions();

### Options

| Option | Values | Default | Description |
| --- | --- | --- | --- |
| type | single, multiple | single | Allow one expanded item or several. |
| collapsible | Boolean | false | Let the active item close in single mode. |
| variant | filled, outlined, ghost, card | filled | Choose the surface style. |
| size | sm, md, lg | md | Change spacing and font size. |
| icon | caret, chevron, plus, arrow | caret | Select a trigger icon. |
| iconPosition | start, end | end | Place the icon at the start or end. |
| headingLevel | h2–h6 | h3 | Choose the heading element around each trigger. |
| animated | Boolean | true | Enable the panel transition unless reduced motion is requested. |
| defaultOpen | Array of zero-based indexes | Existing aria-expanded state | Select initial open items. |
| dir | ltr, rtl | ltr | Set the reading direction. |
| disabled | Boolean | false | Disable all Accordion items. |

Per-item disabling is supported using data-disabled="true" or a disabled trigger. Root-level disabling does not erase the individual item's disabled attribute.

Data attributes also support type, collapsible, variant, size, icon, iconPosition, headingLevel, animated, defaultOpen, dir, and disabled. For example, data-default-open="0,2" opens the first and third items. The previous data-multiple="true" format is kept as a compatibility alias for data-type="multiple".

### Public API

    accordion.open(0);
    accordion.close(0);
    accordion.toggle(1);
    accordion.openAll();
    accordion.closeAll();
    accordion.update({ variant: "card", size: "lg" });
    accordion.destroy();

Item indexes are zero-based. openAll() opens each enabled item in multiple mode, or the first enabled item in single mode. Methods also accept a value from data-value, a trigger ID, or an item/trigger element.

### Events

The root dispatches bubbling CustomEvents after an item's state changes:

- accordion:open — an item opens.
- accordion:close — an item closes.
- accordion:change — the open state changes.

The event detail includes index, value, trigger, panel, open state, openIndexes, and action.

    root.addEventListener("accordion:change", (event) => {
      console.log(event.detail.index, event.detail.open);
    });

## Accessibility

- Triggers are real buttons inside headings with aria-expanded and aria-controls.
- Panels use role="region" and aria-labelledby.
- Closed panels become inert and hidden so their links or controls cannot receive focus.
- Enter and Space use native button activation.
- Arrow Up/Down move between enabled triggers, while Home/End move to the first/last enabled trigger.
- Search results that are filtered out are skipped by keyboard navigation.
- Focus-visible rings and reduced-motion support are included.
- Search highlighting escapes lesson text before adding mark elements.

## Manual test checklist

- [ ] Navigate controls and triggers using Tab and Shift+Tab.
- [ ] Open and close an item with Enter and Space.
- [ ] Verify Arrow Up/Down, Home, and End navigation.
- [ ] Switch between single and multiple modes and test collapsible behavior.
- [ ] Enable the Disabled switch and verify questions cannot be activated.
- [ ] Search for HTML, Flexbox, a JavaScript method, and a word found only in an answer or example.
- [ ] Search for a nonexistent topic and test the empty state and clear buttons.
- [ ] Change variant, size, icon, icon position, and heading level.
- [ ] Enable RTL and inspect layout and control placement.
- [ ] Switch theme, reload, and verify the chosen theme is remembered.
- [ ] Enable operating-system reduced-motion preferences and verify transitions are minimized.
- [ ] Open the settings drawer on a narrow viewport and close it with Escape and the backdrop.
- [ ] Check trigger labels, expanded states, and answer-region names with a screen reader.
- [ ] Copy the generated snippet and review that its options match the current controls.

## Design tokens

The default theme uses deep navy surfaces, powder-blue accents, and a mauve open state:

- Page background: #0A1330
- App window: #0E1A3C
- Sidebar: #0F1C3F
- Surface / raised surface: #14254F / #1B3366
- Border: rgba(140, 170, 255, .18)
- Main text / muted text: #F4F6FF / #9FB0DC
- Blue / pink accent: #A9BEFF / #E08BC0
- Expanded background / border: #2B2755 / #C77DBA

The light theme uses cool white surfaces and dark text. Typography uses Lexend, Inter, and JetBrains Mono where available, with system fallbacks.

## Notes

The page uses only native browser APIs and plain ES modules. Lighthouse scores should be measured against the deployed build in a real browser; they are not assumed in advance.
