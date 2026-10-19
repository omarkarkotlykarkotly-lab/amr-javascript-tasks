# Accord UI — React Accordion

Accord UI is an accessible compound Accordion API with a modern interactive documentation page. The repository keeps a no-build browser demo for GitHub Pages and strict TypeScript source for local development.

## Project structure

- index.html, styles.css, and src/main.js — live documentation website and interactive examples.
- src/accordion/Accordion.tsx — compound component implementation.
- src/accordion/accordion.css — variants, responsive styles, and reduced-motion behavior.
- src/accordion/types.ts and src/accordion/index.ts — public types and exports.
- src/accordion/Accordion.test.tsx — interaction, state, keyboard, disabled, custom icon, and axe tests.
- vite.config.ts, tsconfig files, and package.json — local development, type checking, and build configuration.

## Component API

The library uses the compound component pattern: Accordion.Root, Accordion.Item, Accordion.Trigger, and Accordion.Content. Each public component forwards its ref and native element props.

### Single accordion

~~~tsx
import { Accordion } from "./src/accordion";
import "./src/accordion/accordion.css";

export function Details() {
  return (
    <Accordion.Root type="single" collapsible defaultValue="account">
      <Accordion.Item value="account">
        <Accordion.Trigger>Account settings</Accordion.Trigger>
        <Accordion.Content>
          Update your account preferences here.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
~~~

### Multiple items

~~~tsx
<Accordion.Root type="multiple" defaultValue={["profile", "privacy"]}>
  <Accordion.Item value="profile">
    <Accordion.Trigger>Profile</Accordion.Trigger>
    <Accordion.Content>Manage your profile.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="privacy">
    <Accordion.Trigger>Privacy</Accordion.Trigger>
    <Accordion.Content>Review privacy settings.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
~~~

### Controlled state

~~~tsx
const [value, setValue] = useState<string | undefined>("overview");

<Accordion.Root
  type="single"
  value={value}
  onValueChange={(next) => setValue(next || undefined)}
  collapsible
>
  {/* Compose Accordion.Item parts here. */}
</Accordion.Root>
~~~

### Variants, sizes, RTL, and disabled items

~~~tsx
<Accordion.Root type="multiple" variant="filled" size="lg" dir="rtl">
  <Accordion.Item value="advanced" disabled>
    <Accordion.Trigger>Advanced options</Accordion.Trigger>
    <Accordion.Content>This item is disabled.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
~~~

Supported variants are default, bordered, filled, and ghost. Supported sizes are sm, md, and lg. The Trigger icon prop accepts a ReactNode or a render function receiving open, disabled, and direction.

## Accessibility

- Buttons live inside heading elements and expose aria-expanded and aria-controls.
- Content panels use role="region" and aria-labelledby.
- Enter and Space activate triggers through native button behavior.
- Arrow Up/Down work in vertical orientation. Horizontal Arrow Left/Right navigation flips in RTL. Home and End focus the first or last enabled trigger.
- Open and close transitions honor prefers-reduced-motion.
- Root-level and item-level disabled states are supported.

## Run locally

Use Node.js 20 or later, then run:

~~~sh
cd faq-accordion-react
npm install
npm run dev
~~~

Vite prints a local URL for the documentation site. The live GitHub Pages version remains no-build and loads React from an import map.

## Quality commands

~~~sh
npm run typecheck
npm test
npm run build
~~~

The tests use React Testing Library, Vitest, and jest-axe. The package name shown in the installation panel is illustrative and has not been published to npm.
