export const questions = [
  {
    value: "virtual-dom",
    question: "What is the Virtual DOM in React, and how does it update the UI?",
    answer: "The Virtual DOM is a lightweight, in-memory representation of the UI. When state or props change, React compares the new representation with the previous one and commits the necessary updates to the real DOM. This reconciliation process helps React update interfaces predictably.",
  },
  {
    value: "props-state",
    question: "What is the difference between props and state in React?",
    answer: "Props are read-only inputs passed from a parent component. State is data a component manages over time, commonly with useState. Updating state asks React to render the component again with the new value.",
  },
  {
    value: "hooks",
    question: "What are React Hooks, and why are they useful?",
    answer: "Hooks are functions that let function components use React features such as state, context, refs, and effects. Common Hooks include useState, useEffect, useContext, useRef, and useMemo. Call Hooks at the top level of a component or custom Hook.",
  },
  {
    value: "keys",
    question: "Why are keys important when rendering lists in React?",
    answer: "Keys give sibling elements stable identities so React can match items between renders. Prefer a stable identifier from your data rather than an array index when items can be inserted, removed, or reordered. Stable keys help React preserve the correct component state.",
  },
  {
    value: "use-effect",
    question: "When should you use the useEffect Hook?",
    answer: "useEffect synchronizes a component with an external system, such as a subscription, timer, browser API, or network connection. Its dependency list describes the reactive values used by the effect, and its cleanup function releases resources before the effect runs again or the component unmounts.",
  },
  {
    value: "controlled",
    question: "What is the difference between controlled and uncontrolled components?",
    answer: "A controlled component receives its current value from props and notifies its parent when it changes. An uncontrolled component manages its own internal state and may accept an initial defaultValue. Controlled state is useful when several parts of an interface must stay in sync.",
  },
  {
    value: "context",
    question: "What problem does the React Context API solve?",
    answer: "Context lets a parent provide a value to deeply nested descendants without passing it through every intermediate component as props. It is commonly used for themes, locale, or authenticated-user data. Keep context values focused because consumers update when the provided value changes.",
  },
  {
    value: "memoization",
    question: "When should you use React.memo, useMemo, or useCallback?",
    answer: "React.memo can skip rendering a component when its props have not changed, useMemo caches the result of a calculation, and useCallback caches a function reference. They are performance tools rather than default requirements. Measure a real performance issue first and keep dependencies correct to avoid stale values.",
  },
];

export const questionByValue = new Map(questions.map((item) => [item.value, item]));
