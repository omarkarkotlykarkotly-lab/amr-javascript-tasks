# Web Basics — HTML, CSS & JavaScript Accordion

A responsive, tutorial-style playground for learning HTML, CSS, and JavaScript with short explanations and practical code examples. The reusable Accordion class is built with semantic HTML, modular CSS, and native JavaScript ES modules. There is no framework, external JavaScript dependency, or build step.

## Live demo

https://omarkarkotlykarkotly-lab.github.io/amr-javascript-tasks/faq-accordion-react/

## Project structure

- index.html — semantic page shell, accessible controls, metadata, theme pre-paint script, and module entry point.
- css/tokens.css — dark and light design tokens, radii, shadows, and motion timings.
- css/base.css — reset, global type, focus styles, hidden-state utilities, and reduced motion.
- css/layout.css — rounded app window, three-column grid, sidebar drawer, and responsive breakpoints.
- css/accordion.css — reusable Accordion variants, sizes, states, and open/close animation.
- css/components.css — sidebar controls, hero, search, live status rings, code panel, and utility components.
- js/accordion.js — framework-free Accordion class, data-attribute auto-init, keyboard support, public methods, and CustomEvents.
- js/data.js — ten beginner lessons across HTML, CSS, and JavaScript.
- js/utils.js — filtering, debouncing, safe text highlighting, clipboard fallback, and numeric clamping.
- js/playground.js — page controls, dynamic questions, live metrics, theme toggle, and generated code.

## Run locally

Open index.html directly in a modern browser. For the most reliable ES module behavior, run a one-line static server from this folder:

~~~sh
python -m http.server 8000
~~~

Then open http://localhost:8000/faq-accordion-react/ if you started the server from the repository root, or http://localhost:8000/ if you started it from this folder.

Google Fonts are used for typography. If fonts cannot be reached, the page falls back to system sans-serif and monospace fonts. No JavaScript library, package install, compilation, or bundler is required.

## Lesson content

The playground begins with ten short, beginner-level topics: HTML document structure, semantic elements, links and images, CSS selectors, the box model, responsive layouts, JavaScript variables, functions, DOM events, and arrays. Each lesson includes an explanation and a code example. The topic chips filter the lessons by language, and search checks the title, explanation, category, and code sample.

## Lesson content

The playground includes ten short beginner topics: HTML document structure, semantic elements, links and images, CSS selectors, the box model, responsive layouts, JavaScript variables, functions, DOM events, and arrays. Every lesson includes an explanation and a code sample. Category chips filter the active language, and search includes titles, explanations, categories, and snippets.

## Reusable Accordion class

Import the class into any page:

~~~js
import { Accordion } from "./js/accordion.js";

const accordion = new Accordion(document.querySelector("#faq"), {
  type: "single",
  collapsible: true,
  variant: "filled",
  size: "md",
  icon: "caret",
  iconPosition: "end",
  headingLevel: "h3",
  animated: true,
  defaultOpen: [0],
  dir: "ltr"
});

accordion.open(1);
accordion.close(1);
accordion.toggle(2);
accordion.openAll();
accordion.closeAll();
accordion.update({ variant: "card", size: "lg" });
~~~

The target element contains one child with data-accordion-item per question. Each item can have a button marked data-accordion-trigger and a panel marked data-accordion-panel. The class adds missing ARIA relationships and heading wrappers when needed.

~~~html
<div id="faq" data-accordion data-type="single" data-collapsible="true"
     data-variant="filled" data-size="md" data-default-open="0">
  <div data-accordion-item data-value="profile">
    <h3><button type="button" data-accordion-trigger>Profile settings</button></h3>
    <div data-accordion-panel>
      <div class="accordion__panel-inner">
        <p>Update your profile preferences here.</p>
      </div>
    </div>
  </div>
</div>
~~~

Supported options:

| Option | Values | Default |
| --- | --- | --- |
| type | single, multiple | single |
| collapsible | boolean | false |
| variant | filled, outlined, ghost, card | filled |
| size | sm, md, lg | md |
| icon | caret, chevron, plus, arrow | caret |
| iconPosition | start, end | end |
| headingLevel | h2, h3, h4, h5, h6 | h3 |
| animated | boolean | true |
| defaultOpen | array of zero-based item indexes, or a comma-separated data attribute | empty |
| dir | ltr, rtl | inherited or ltr |
| disabled | boolean root option; item-level data-disabled or disabled attribute | false |

The class exposes open(index), close(index), toggle(index), openAll(), closeAll(), update(options), and destroy(). Indexes are zero-based. In single mode, openAll opens the first enabled item; toggle will not close the last open item unless collapsible is true. Explicit close(index) and closeAll() always close the requested items.

### Events

The Accordion root emits bubbling CustomEvents:

- accordion:open — an item has opened.
- accordion:close — an item has closed.
- accordion:change — open state changed.

Each event detail includes the changed reason, item index when applicable, openIndices, corresponding values, and selection type.

~~~js
const faq = document.querySelector("#faq");

faq.addEventListener("accordion:change", (event) => {
  console.log(event.detail.openIndices);
});
~~~

Any markup marked with data-accordion is initialized automatically. Add data-type, data-variant, data-size, data-icon, data-icon-position, data-heading-level, data-collapsible, data-animated, data-default-open, and dir to configure it. Use data-accordion-manual on a root when creating it manually.

## Accessibility

- Triggers are native buttons inside a configurable heading element.
- Triggers expose aria-expanded and aria-controls; panels use role=region and aria-labelledby.
- Closed panels are hidden and inert. Closing panels are hidden after their transition completes.
- Enter and Space use native button activation. Arrow Up/Down, Home, and End move focus between enabled triggers.
- Disabled items are skipped by keyboard navigation.
- Search uses a polite live result count and highlights matching text through text nodes and mark elements.
- Visible focus rings, touch-sized controls, light and dark themes, and reduced-motion support are included.

## Manual verification checklist

- [ ] Use Tab, Shift+Tab, Enter, and Space to move through and activate question triggers.
- [ ] Use Arrow Up/Down, Home, and End; confirm disabled items are skipped.
- [ ] Check each panel’s accessible name and expanded state in a screen reader.
- [ ] Search a word in a lesson title, explanation, and code sample; confirm highlighted matches and live counts.
- [ ] Switch between single and multiple selection, and test collapsible on and off.
- [ ] Change style, size, icon shape, icon position, and heading level.
- [ ] Enable RTL and confirm alignment, icon placement, and keyboard flow remain usable.
- [ ] Turn on the operating system’s reduced-motion setting and confirm transitions are suppressed.
- [ ] Switch light/dark themes, refresh, and confirm the chosen theme persists without a flash.
- [ ] At mobile width, open the drawer, tab through its controls, close it with Escape, and check for horizontal page scrolling.
- [ ] Copy the generated code and verify the status changes to Copied.

## Design tokens

The initial palette uses a deep navy outer canvas (#0A1330), navy window/sidebar surfaces (#0E1A3C and #0F1C3F), raised blue item surfaces (#1B3366), a lavender-blue accent (#A9BEFF), and pink open-state border (#C77DBA). The open item surface is #2B2755. Light mode switches to cool white and gray surfaces with deeper, readable text tones. Spacing uses a 4/8px rhythm, with 14px controls, 16px accordion rows, and 28px app-window corners.

## Browser support

Use a current browser with ES modules, native inert support, CSS Grid, and CustomEvent. No transpilation is needed. The project uses progressive native HTML controls and SVG icons rather than external icon or UI packages.
