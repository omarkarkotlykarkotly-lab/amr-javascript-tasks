# Accord UI — React Accordion Playground

Accord UI is an accessible, customizable React Accordion component library with a live configuration playground. The repository includes a no-build browser demo for GitHub Pages and a strict TypeScript implementation for app integration.

## Explore the playground

Open the live playground at:

https://omarkarkotlykarkotly-lab.github.io/amr-javascript-tasks/faq-accordion-react/

Change the style, size, icon, heading level, interaction type, animation, disabled state, and text direction. The React interview question list, live status rings, and generated JSX update as you change controls.

## Project structure

- index.html, styles.css, and src/main.js — interactive three-column playground for GitHub Pages.
- src/playground-utils.js and src/playground-utils.test.js — tested filtering, generated JSX, and clipboard helpers.
- src/accordion/Accordion.tsx — compound component implementation and data-driven convenience component.
- src/accordion/accordion.css — responsive styles, variants, icon states, RTL support, and reduced-motion behavior.
- src/accordion/types.ts and src/accordion/index.ts — exported props, values, and public types.
- src/accordion/Accordion.test.tsx — React Testing Library and jest-axe coverage.
- src/accordion/Accordion.stories.tsx and .storybook/ — Storybook examples.
- package.json, vite.config.ts, tsconfig files, and eslint.config.js — local development, builds, linting, and type checking.

## Install and run locally

Use Node.js 20 or later:

~~~sh
cd faq-accordion-react
npm install
npm run dev
~~~

Vite prints a local development URL. The static GitHub Pages playground itself remains browser-native and loads React through an import map.

## Quality commands

~~~sh
npm run typecheck
npm test
npm run lint
npm run build
npm run storybook
~~~

Build the Storybook site with npm run build-storybook.

## Data-driven convenience API

~~~tsx
import { Accordion } from "./src/accordion";
import "./src/accordion/accordion.css";

const questions = [
  {
    value: "virtual-dom",
    title: "What is the Virtual DOM?",
    content: "The Virtual DOM is an in-memory representation of the UI.",
  },
  {
    value: "props-state",
    title: "How do props differ from state?",
    content: "Props are inputs; state is data managed by a component.",
  },
];

export function Questions() {
  return (
    <Accordion
      items={questions}
      type="single"
      variant="filled"
      size="md"
      icon="caret"
      iconPosition="end"
      headingLevel="h3"
      collapsible
      animated
      defaultOpenFirst
    />
  );
}
~~~

The convenience API accepts an array of objects containing value, title, content, and optional disabled fields, then renders the compound parts internally.

## Compound API

~~~tsx
<Accordion.Root type="multiple" defaultValue={["profile", "privacy"]} variant="card">
  <Accordion.Item value="profile">
    <Accordion.Header level="h3">
      <Accordion.Trigger>Profile settings</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Update profile preferences here.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="privacy" disabled>
    <Accordion.Header>
      <Accordion.Trigger>Privacy settings</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Review your privacy settings.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
~~~

### Root props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| type | single or multiple | required | Choose one active item or allow multiple open items. |
| value | string or string array | — | Controlled open value(s). |
| defaultValue | string or string array | — | Initial value for uncontrolled state. |
| onValueChange | callback | — | Receives the changed single value or multiple value array. A collapsed single item reports undefined. |
| collapsible | boolean | false | Allows the active item to close in single mode. |
| disabled | boolean | false | Disables all triggers. |
| variant | filled, outlined, ghost, or card | filled | Selects the surface treatment. |
| size | sm, md, or lg | md | Controls spacing and type size. |
| icon | preset, ReactNode, or render function | caret | Sets the trigger icon. Presets: caret, chevron, plus, arrow. |
| iconPosition | start or end | end | Positions the icon in the text direction. |
| headingLevel | h2 through h6 | h3 | Sets the semantic heading element. |
| dir | ltr or rtl | ltr | Sets text direction and horizontal arrow-key direction. |
| orientation | vertical or horizontal | vertical | Selects keyboard navigation orientation. |
| animated | boolean | true | Enables open/close transitions; reduced-motion settings take precedence. |
| defaultOpenFirst | boolean | false | Opens the first item by default when no default value is set. |
| bordered | boolean | false | Legacy alias for the outlined variant. |

The previous variant values default and bordered remain supported as deprecated aliases for the filled and outlined variants.

### Item, Header, Trigger, and Content props

- Accordion.Item: required value, optional disabled, native div attributes and forwarded ref.
- Accordion.Header: optional level override (h2 through h6), native heading attributes and forwarded ref.
- Accordion.Trigger: accepts icon, iconPosition, asChild, native button attributes and forwarded ref. A custom icon render function receives open, disabled, and direction.
- Accordion.Content: native div attributes and forwarded ref. The panel is connected to its trigger with role=region and aria-labelledby.

## Accessibility

- Trigger buttons are contained in the chosen heading element and expose aria-expanded and aria-controls.
- Answer panels use role=region and aria-labelledby, and closed content is inert and hidden from assistive technology.
- Native buttons provide Enter/Space activation. Arrow Up/Down (vertical), RTL-aware Arrow Left/Right (horizontal), Home, and End move focus between enabled triggers.
- Visible focus styling, disabled states, and prefers-reduced-motion support are included.
- The library uses useId for stable trigger/content relationships and forwards refs and native element props.

## Compatibility

The previous compound API remains available. Existing Accordion.Item / Accordion.Trigger / Accordion.Content usage still works: Trigger creates the default heading wrapper if it is not already inside Accordion.Header.
