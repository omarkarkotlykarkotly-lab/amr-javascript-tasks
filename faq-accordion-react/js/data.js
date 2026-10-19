export const WEB_DEV_LESSONS = [
  {
    value: "html-document",
    category: "HTML",
    question: "What is the basic structure of an HTML page?",
    answer: "HTML describes the structure of a web page. The doctype tells the browser to use modern HTML, the head stores page metadata, and the body contains the content visitors see.",
    exampleTitle: "A minimal HTML document",
    example: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My first page</title>\n</head>\n<body>\n  <h1>Hello, world!</h1>\n  <p>My first paragraph.</p>\n</body>\n</html>'
  },
  {
    value: "html-semantic",
    category: "HTML",
    question: "What are semantic HTML elements?",
    answer: "Semantic elements explain the purpose of their content. Use header for introductory content, nav for navigation, main for the page's main content, section for a themed group, and footer for closing information. Clear semantics help maintainability and assistive technologies.",
    exampleTitle: "A semantic page layout",
    example: '<header>\n  <h1>Learning Web Development</h1>\n</header>\n<nav aria-label="Main navigation">\n  <a href="#lessons">Lessons</a>\n</nav>\n<main id="lessons">\n  <section>\n    <h2>HTML basics</h2>\n    <p>Build a meaningful page structure.</p>\n  </section>\n</main>\n<footer>Keep learning.</footer>'
  },
  {
    value: "html-links-images",
    category: "HTML",
    question: "How do links and images work in HTML?",
    answer: "The anchor element creates a link with href pointing to its destination. The img element embeds an image; its alt text should communicate the image's meaning, or be empty when the image is purely decorative. Use descriptive link text rather than vague labels.",
    exampleTitle: "A link and an accessible image",
    example: '<a href="https://www.w3schools.com/">\n  Explore HTML tutorials\n</a>\n\n<img src="landscape.jpg"\n     alt="Green hills beneath a blue sky"\n     width="480">'
  },
  {
    value: "css-selectors",
    category: "CSS",
    question: "How do CSS selectors target elements?",
    answer: "A type selector targets every element of that kind, a class selector starts with a dot and can be reused, and an ID selector starts with a hash and targets one unique ID. Prefer classes for reusable component styling.",
    exampleTitle: "Type, class, and ID selectors",
    example: 'p {\n  line-height: 1.7;\n}\n\n.lesson-card {\n  padding: 1rem;\n  border-radius: 12px;\n}\n\n#page-title {\n  color: #4f46e5;\n}'
  },
  {
    value: "css-box-model",
    category: "CSS",
    question: "What is the CSS box model?",
    answer: "Every element is laid out as a box: content sits inside padding, then border, then margin. Setting box-sizing to border-box makes the declared width include padding and border, which makes sizing more predictable.",
    exampleTitle: "A predictable content box",
    example: '* {\n  box-sizing: border-box;\n}\n\n.lesson-card {\n  width: 100%;\n  padding: 1.25rem;\n  border: 1px solid #dbe2f0;\n  margin-block: 1rem;\n}'
  },
  {
    value: "css-responsive",
    category: "CSS",
    question: "How can CSS make a page responsive?",
    answer: "Responsive layouts adapt to the available space. Flexible grids can use minmax and auto-fit, while media queries let you adjust details at a chosen viewport width. Start with flexible sizing so the layout works before adding special breakpoints.",
    exampleTitle: "A responsive card grid",
    example: '.lesson-grid {\n  display: grid;\n  grid-template-columns:\n    repeat(auto-fit, minmax(220px, 1fr));\n  gap: 1rem;\n}\n\n@media (max-width: 640px) {\n  .page-title {\n    font-size: 1.75rem;\n  }\n}'
  },
  {
    value: "js-variables",
    category: "JavaScript",
    question: "How do let and const work in JavaScript?",
    answer: "Use const by default when a variable will not be reassigned. Use let when you need to assign it a new value later. Both are block-scoped. A const object can still have its properties changed; const prevents reassignment of the variable itself.",
    exampleTitle: "Declaring values",
    example: 'const course = "JavaScript";\nlet completedLessons = 0;\n\ncompletedLessons += 1;\nconsole.log(course);\nconsole.log(completedLessons);'
  },
  {
    value: "js-functions",
    category: "JavaScript",
    question: "What is a JavaScript function?",
    answer: "A function groups instructions that can be run when needed. Parameters provide input, and return sends a result back to the caller. Functions help you avoid repeating the same logic throughout a program.",
    exampleTitle: "A reusable function",
    example: 'function greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconst message = greet("Alex");\nconsole.log(message);'
  },
  {
    value: "js-dom",
    category: "JavaScript",
    question: "How does JavaScript change a web page?",
    answer: "The DOM represents the document as objects JavaScript can access. Use querySelector to find an element, textContent to update text safely, and addEventListener to respond to a user action such as a button click.",
    exampleTitle: "Update text when a button is clicked",
    example: '<button id="greet-button" type="button">\n  Say hello\n</button>\n<p id="greeting"></p>\n\n<script>\n  const button = document.querySelector("#greet-button");\n  const greeting = document.querySelector("#greeting");\n\n  button.addEventListener("click", () => {\n    greeting.textContent = "Hello, learner!";\n  });\n</script>'
  },
  {
    value: "js-arrays",
    category: "JavaScript",
    question: "What is an array, and how can you loop through it?",
    answer: "An array stores an ordered list of values. You can access an item by its zero-based index and use forEach to run a callback for every item. Use a stable, meaningful value when turning data into interface content.",
    exampleTitle: "Looping through an array",
    example: 'const topics = ["HTML", "CSS", "JavaScript"];\n\ntopics.forEach((topic, index) => {\n  console.log(index + 1, topic);\n});'
  }
];

export const PLAYGROUND_DEFAULTS = Object.freeze({
  count: 10,
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