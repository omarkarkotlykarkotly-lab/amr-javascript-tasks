export const REACT_QUESTIONS = [
  {
    value: "virtual-dom",
    question: "What is the Virtual DOM in React?",
    answer: "The Virtual DOM is a lightweight, in-memory representation of the UI. When state or props change, React creates an updated representation, compares it with the previous one, and commits necessary changes to the real DOM. This reconciliation process helps React update interfaces predictably."
  },
  {
    value: "props-state",
    question: "What is the difference between props and state?",
    answer: "Props are inputs passed from a parent component and should be treated as read-only by the receiving component. State is data a component manages over time, commonly with a Hook such as useState. Updating state schedules a render with the new value."
  },
  {
    value: "hooks",
    question: "What are React Hooks?",
    answer: "Hooks let function components use React features such as state, context, refs, and effects. Common examples include useState, useEffect, useContext, useRef, and useMemo. Call Hooks at the top level of a function component or custom Hook, not inside loops or conditions."
  },
  {
    value: "keys",
    question: "Why are keys important when rendering lists?",
    answer: "Keys give sibling elements stable identities so React can match items between renders. Prefer a stable identifier from your data rather than an array index when items may be inserted, removed, or reordered. Good keys help React preserve component state and avoid unnecessary DOM changes."
  },
  {
    value: "use-effect",
    question: "When should you use useEffect?",
    answer: "useEffect synchronizes a component with an external system, such as a subscription, browser API, timer, or network connection. Its dependency list describes the reactive values used by the effect, and its cleanup function releases resources before the effect runs again or the component unmounts."
  },
  {
    value: "controlled",
    question: "What is the difference between controlled and uncontrolled components?",
    answer: "A controlled component receives its current value from props and notifies its parent about changes through a callback. An uncontrolled component keeps its own internal state and may accept an initial defaultValue. Controlled state is useful when multiple parts of an interface must stay in sync."
  },
  {
    value: "context",
    question: "What problem does the Context API solve?",
    answer: "Context lets a parent provide a value to deeply nested descendants without passing it through every intermediate component as props. It is commonly used for themes, locale, or authenticated-user data. Keep context values focused, because consumers update when the provided value changes."
  },
  {
    value: "memoization",
    question: "When should you use React.memo, useMemo, or useCallback?",
    answer: "React.memo can skip rendering a component when its props have not changed, useMemo caches a calculation result, and useCallback caches a function reference. They are performance tools, not default requirements. Measure a real performance issue first, and keep dependencies correct to avoid stale values."
  }
];

export const PLAYGROUND_DEFAULTS = Object.freeze({
  count: 8,
  type: "single",
  collapsible: true,
  variant: "filled",
  size: "md",
  icon: "caret",
  iconPosition: "end",
  headingLevel: "h3",
  animated: true,
  dir: "ltr"
});