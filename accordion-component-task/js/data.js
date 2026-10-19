export const questions = [
  {
    value: "html-intro",
    topic: "HTML",
    question: "What is HTML, and what is it used for?",
    answer: "HTML stands for HyperText Markup Language. It defines the structure and meaning of a web page using elements such as headings, paragraphs, links, images, lists, and forms. HTML describes the content; CSS styles it, and JavaScript adds behavior.",
    example: '<h1>Welcome to my website</h1>\n<p>This is my first web page.</p>',
  },
  {
    value: "html-elements",
    topic: "HTML",
    question: "What are HTML elements, tags, and attributes?",
    answer: "An element is usually made from an opening tag, content, and a closing tag. Tags identify the element type. Attributes add information to an element, such as an image source or a link destination. Some elements, such as img and br, do not use a closing tag.",
    example: '<a href="https://example.com">Visit the website</a>\n<img src="photo.jpg" alt="A mountain view">',
  },
  {
    value: "html-semantic",
    topic: "HTML",
    question: "What are semantic HTML elements, and why should I use them?",
    answer: "Semantic elements describe the purpose of the content they contain. For example, header, nav, main, section, article, and footer make a document easier to understand for people, browsers, search engines, and assistive technology. Prefer a meaningful element over a generic div when one fits.",
    example: '<header><h1>My Site</h1></header>\n<main>\n  <section><h2>About</h2><p>Hello!</p></section>\n</main>\n<footer>Copyright 2026</footer>',
  },
  {
    value: "css-intro",
    topic: "CSS",
    question: "What is CSS, and how do I apply a style?",
    answer: "CSS stands for Cascading Style Sheets. A CSS rule contains a selector and a declaration block. The selector chooses the elements to style, and each declaration pairs a property with a value. Keep styles in an external .css file for easier maintenance.",
    example: '/* Style every paragraph */\np {\n  color: #334155;\n  font-size: 1rem;\n}',
  },
  {
    value: "css-box-model",
    topic: "CSS",
    question: "What is the CSS box model?",
    answer: "Every element is laid out as a box. The content is surrounded by padding, then a border, and then margin. Using box-sizing: border-box makes declared widths include the padding and border, which often makes layouts easier to reason about.",
    example: '* {\n  box-sizing: border-box;\n}\n.card {\n  padding: 1rem;\n  border: 1px solid #dbe2ee;\n  margin-block: 1rem;\n}',
  },
  {
    value: "css-layout",
    topic: "CSS",
    question: "When should I use Flexbox or CSS Grid?",
    answer: "Flexbox is ideal for arranging items in one dimension, such as a row of buttons or a navigation bar. CSS Grid is designed for two-dimensional layouts with rows and columns. Both can be combined; choose the tool that makes the layout rules simplest.",
    example: '.toolbar {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n\n.page-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}',
  },
  {
    value: "css-responsive",
    topic: "CSS",
    question: "How do I make a page responsive on phones and desktops?",
    answer: "Start with a flexible layout, relative units, and images that can shrink. Then use media queries when a layout needs to change at a certain viewport width. Test narrow screens and make sure text, navigation, and interactive controls remain readable and usable.",
    example: '.cards {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 1rem;\n}\n\n@media (max-width: 700px) {\n  .cards { grid-template-columns: 1fr; }\n}',
  },
  {
    value: "js-variables",
    topic: "JavaScript",
    question: "What are let, const, and var in JavaScript?",
    answer: "Use const when you do not reassign a variable, and let when the value needs to be reassigned. var is the older declaration and has different scoping behavior, so modern code generally prefers const and let. A const object can still have its properties changed; const prevents reassignment of the variable itself.",
    example: 'const course = "JavaScript";\nlet completedLessons = 0;\ncompletedLessons = completedLessons + 1;\n\nconsole.log(course, completedLessons);',
  },
  {
    value: "js-functions-events",
    topic: "JavaScript",
    question: "What is a function, and how do click events work?",
    answer: "A function is a reusable block of code. An event listener runs a function when a browser event happens, such as a button click. Keeping the behavior in a named function makes it easier to understand, reuse, and test.",
    example: 'const button = document.querySelector("#start");\n\nfunction showMessage() {\n  console.log("Let’s start learning!");\n}\n\nbutton.addEventListener("click", showMessage);',
  },
  {
    value: "js-dom",
    topic: "JavaScript",
    question: "What is the DOM, and how can JavaScript change a page?",
    answer: "The Document Object Model (DOM) represents a web page as objects that scripts can read and update. Use querySelector to find an element, then update its text, classes, or attributes. Prefer textContent for plain user-visible text instead of inserting untrusted HTML.",
    example: 'const title = document.querySelector("h1");\ntitle.textContent = "Learning Web Development";\ntitle.classList.add("highlight");',
  },
];

export const questionByValue = new Map(questions.map((item) => [item.value, item]));
