# Accordion Component — Interactive Playground

A modern, accessible Accordion component written with **vanilla HTML, CSS, and JavaScript ES modules**. The demo has no runtime framework, package install, or build step.

## What changed

The original task was a static Arabic FAQ page with four entries. Its Accordion class read a single data-multiple flag, synchronized aria-expanded and inert, and delegated clicks and basic keyboard navigation. The visual design and JavaScript were each concentrated in one file, with no theme switch, search, live settings, usage panel, progress indicators, or reusable public methods.

The upgraded task splits layout, tokens, component styles, question data, utility functions, the reusable class, and the playground into dedicated files. The live playground includes eight React interview questions, debounced search and highlighted matches, a light/dark theme toggle, responsive settings drawer, live status rings, and generated copyable JavaScript.

## File structure

- index.html — accessible page shell, theme boot script, metadata, and module entry point.
- css/tokens.css — design tokens and light-theme overrides.
- css/base.css — reset, typography baseline, focus indicators, and motion preferences.
- css/layout.css — app window, three-column layout, scrolling regions, and responsive drawer behavior.
- css/accordion.css — reusable Accordion variants, sizes, state styling, and animated panels.
- css/components.css — sidebar controls, hero, status rings, code panel, responsive refinements, and small UI components.
- js/accordion.js — framework-free Accordion class and autoInitAccordions() helper.
- js/playground.js — interactive page logic, search, settings, status rings, code preview, and theme persistence.
- js/data.js — the eight React interview questions.
- js/utils.js — safe HTML escaping, search highlighting, icon markup, debounce, clipboard handling, and preference helpers.

## Run locally

Open index.html in a browser, or serve the repository root with Python:

    python -m http.server 8000

Then visit:

    http://localhost:8000/accordion-component-task/

A local server is recommended because the page uses JavaScript ES modules. Google Fonts are an optional network resource; the page falls back to system fonts if they are unavailable.

## Reusable component

### Markup

The root uses data-accordion. Each item contains a trigger button and a panel. The class normalizes IDs, heading semantics, icon markup, aria-expanded, aria-controls, role=region, aria-labelledby, inert, and closed-panel hidden state.

    <div id="settings-accordion" class="accordion" data-accordion>
      <article class="accordion__item" data-accordion-item data-value="profile">
        <h3 class="accordion__heading">
          <button class="accordion__trigger" data-accordion-trigger type="button">
            <span class="accordion__label">Profile settings</span>
            <span class="accordion__icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="accordion__panel" data-accordion-panel>
          <div class="accordion__content">
            <p>Update your profile preferences here.</p>
          </div>
        </div>
      </article>
    </div>

### Initialize

    import { Accordion, autoInitAccordions } from "./js/accordion.js";

    const root = document.querySelector("#settings-accordion");

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

    // Or initialize every element marked with data-accordion.
    autoInitAccordions();

Data attributes are also supported: data-type, data-collapsible, data-variant, data-size, data-icon, data-icon-position, data-heading-level, data-animated, data-default-open, data-dir, and data-disabled. Boolean values can use true or false; data-default-open accepts a comma-separated index list such as 0,2. The previous data-multiple="true" attribute remains supported as a compatibility alias for data-type="multiple".

### Options

| Option | Values | Default | Description |
| --- | --- | --- | --- |
| type | single, multiple | single | Allow one expanded item or several. |
| collapsible | Boolean | false | In single mode, allow the open item to close when activated again. |
| variant | filled, outlined, ghost, card | filled | Controls the item surface style. |
| size | sm, md, lg | md | Controls trigger spacing and typography. |
| icon | caret, chevron, plus, arrow | caret | Selects the trigger indicator. |
| iconPosition | start, end | end | Places the icon at the start or end of the trigger. |
| headingLevel | h2–h6 | h3 | Sets the semantic heading element containing each trigger. |
| animated | Boolean | true | Enables grid-row open/close animation unless reduced motion is requested. |
| defaultOpen | Array of zero-based indexes | Existing aria-expanded state | Sets the initial expanded items. |
| dir | ltr, rtl | ltr | Sets text direction and aligns the component layout. |
| disabled | Boolean | false | Disables every item at the root level. |

Individual items can be disabled with data-disabled="true" or a disabled trigger button. Root-level disabled state is applied without losing each item's disabled state.

### Public API

    accordion.open(0);
    accordion.close(0);
    accordion.toggle(1);
    accordion.openAll();
    accordion.closeAll();
    accordion.update({ variant: "card", size: "lg" });
    accordion.destroy();

Indexes are zero-based. openAll() opens all enabled entries in multiple mode; in single mode it opens the first enabled entry. The class also accepts an item's data-value, trigger ID, or element in its open/close/toggle methods.

### Custom events

The root dispatches bubbling CustomEvent events whenever an item changes state:

- accordion:open — an item has opened.
- accordion:close — an item has closed.
- accordion:change — an item's open state has changed.

Each event's detail includes the item index, value, trigger, panel, current open state, openIndexes, and the action.

    root.addEventListener("accordion:change", (event) => {
      console.log(event.detail.index, event.detail.open);
    });

## Accessibility and interaction

- Triggers are real buttons inside headings and expose aria-expanded and aria-controls.
- Panels use role=region and aria-labelledby; closed panels are inert, hidden from assistive technology, and removed from keyboard focus.
- Enter and Space use native button activation. Arrow Up/Down move between enabled triggers; Home/End jump to the first/last enabled trigger.
- Keyboard navigation skips disabled and currently filtered-out entries.
- Focus-visible rings, readable light/dark color tokens, and prefers-reduced-motion handling are included.
- Search matches question and answer text, escapes content before highlighting, and is debounced to reduce repeated filtering work.
- Theme selection follows the system preference until the user manually switches theme. Manual selection is stored in localStorage when available.

## Manual verification checklist

- [ ] Use Tab and Shift+Tab to reach each control and question trigger.
- [ ] Use Enter and Space to open and close questions.
- [ ] Use Arrow Up/Down and Home/End to navigate enabled question triggers.
- [ ] Switch between single and multiple modes; try closing the last open item.
- [ ] Test root disabled mode and verify that disabled triggers cannot be activated.
- [ ] Search by a word in a question and by a word in an answer; verify highlights and the empty state.
- [ ] Change the icon shape and position, heading level, variant, and size.
- [ ] Enable RTL and inspect the question list, icon position, and focus navigation.
- [ ] Toggle dark/light theme, refresh the page, and verify the selection persists.
- [ ] Enable the operating system's reduced-motion setting and verify that transitions are minimized.
- [ ] Open the settings drawer at a narrow viewport, then close it with Escape, the backdrop, and the menu control.
- [ ] Use a screen reader to verify trigger labels, expanded states, and labelled answer regions.
- [ ] Copy the generated JavaScript and paste it into a text editor to review the current options.

## Notes

This project deliberately has no runtime JavaScript dependencies or build step. The CSS is split by responsibility to keep tokens, layout, component states, and UI components easy to maintain. The demo is a learning and portfolio project; actual Lighthouse scores should be measured in a browser on the deployed page rather than assumed.
