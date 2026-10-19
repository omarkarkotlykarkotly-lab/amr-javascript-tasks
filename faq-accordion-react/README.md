# FAQ Accordion — React

An independent, English-language FAQ accordion project built with React. The app is designed for GitHub Pages and loads React through an import map, so it does not require a build step.

## Features
- Responsive layout for desktop, tablet, and mobile.
- Accessible accordion triggers with `aria-expanded`, `aria-controls`, and labelled answer regions.
- Multiple questions can be open at the same time.
- Search through question titles, answers, and categories.
- Filter questions by topic.
- Expand all or collapse all visible questions.
- Keyboard-friendly native buttons and visible focus states.
- Respects the reduced-motion preference.

## Run locally
From the repository root:

    python -m http.server 8000

Then open:

    http://localhost:8000/faq-accordion-react/

Internet access is needed to load React from esm.sh and the optional Google font.

## Files
- `index.html` — page shell and import map.
- `styles.css` — responsive theme and accordion animation.
- `src/main.js` — React UI, sample FAQ data, filters, and accordion state.

This is an original implementation for learning React state, component composition, and accessible interactive UI patterns.
