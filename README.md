# JavaScript from Zero — AMR Practice Repository

A beginner-friendly JavaScript workbook with 13 exercises across five levels. It includes standalone solution files, interactive browser demos, and a small dependency-free Node.js test suite.

## Curriculum

- Level 1 — Basics: console output, variables, operators, and data types.
- Level 2 — Logic: functions, conditions, loops, and FizzBuzz.
- Level 3 — Data: arrays, objects, and map/filter/find/reduce.
- Level 4 — DOM: selectors, events, a click counter, and a tip calculator.
- Level 5 — Mini project: a Todo app with add, toggle, delete, and clear-completed actions.

## Run locally

Open this repository in VS Code. Run a local server from the project directory with:

    python -m http.server 8000

Then open http://localhost:8000 in your browser. You can also open index.html directly for the workbook.

## Run the tests

Install Node.js, open a terminal in this directory, and run:

    node tests/run-tests.js

The test suite checks the main functions and edge cases. No third-party packages are required.

## Publish with GitHub Pages

Open Settings → Pages. Choose Deploy from a branch, select main and the root folder (/), then save. GitHub will show the published URL once deployment completes.

## About this project

This is an independent learning implementation of common JavaScript practice topics. It is not the source student's repository and does not modify anyone else's project.
