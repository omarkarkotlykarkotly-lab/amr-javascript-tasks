# JavaScript from Zero — AMR Practice Repository

A beginner-friendly JavaScript workbook with 13 exercises across five levels. It includes standalone solution files, interactive browser demos, and a dependency-free Node.js test suite.

## Curriculum
- Level 1 — Basics: console output, variables, operators, and data types.
- Level 2 — Logic: functions, conditions, loops, and FizzBuzz.
- Level 3 — Data: arrays, objects, and map/filter/find/reduce.
- Level 4 — DOM: selectors, events, a click counter, and a tip calculator.
- Level 5 — Mini project: a Todo app using task objects and events.

## Extra project: ToDo App with Zustand
A separate React app is available in [zustand-todo-app](./zustand-todo-app/), using Zustand state management and localStorage persistence. Live app: [FocusFlow ToDo](https://omarkarkotlykarkotly-lab.github.io/amr-javascript-tasks/zustand-todo-app/).

## Run the JavaScript workbook locally
Open this repository in VS Code. Run a local server from the project directory:

    python -m http.server 8000

Open http://localhost:8000 in a browser.

## Run the workbook tests
Install Node.js, then run:

    node tests/run-tests.js

No third-party packages are required for the workbook tests.

## Publish with GitHub Pages
The repository can be published from Settings → Pages → Deploy from a branch → main → /(root).

## About
This is an independent learning implementation of common JavaScript practice topics. It does not modify or copy anyone else's repository.
