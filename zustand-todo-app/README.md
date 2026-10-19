# FocusFlow — ToDo App with Zustand

An independent Arabic right-to-left task manager built with React and Zustand. It is hosted as a static sub-project inside the `amr-javascript-tasks` repository and uses ES modules from esm.sh so the GitHub Pages version can run without a build step.

## Features
- Add a task with a title, optional description, category, and priority.
- Mark tasks complete or active again.
- Delete one task or clear all completed tasks.
- Filter all, active, and completed tasks.
- Search titles and descriptions.
- Record Pomodoro focus sessions for each task.
- Summary cards and completion percentage.
- Zustand `persist` middleware saves tasks to localStorage.
- Responsive layout and RTL Arabic interface.

## Run locally
From the repository root, start a static server:

    python -m http.server 8000

Then open:

    http://localhost:8000/zustand-todo-app/

Internet access is required for the React and Zustand ES modules loaded from esm.sh and for optional Google Fonts.

## State management
The store is in `src/store.js`. Components subscribe to the store with Zustand selectors. All task-changing operations update the store, and its persist middleware saves the tasks in localStorage under `amr-focusflow-todos`.

## Project files
- `index.html` — page shell and import map.
- `styles.css` — responsive visual design.
- `src/main.js` — React interface.
- `src/store.js` — Zustand store and persistence.

This is a learning project with its own design and implementation, not a copy of the reference source.
