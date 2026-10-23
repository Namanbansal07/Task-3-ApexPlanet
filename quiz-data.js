export const quizQuestions = [
  {
    category: "HTML",
    question: "Which HTML element represents the main content of a page?",
    options: ["<main>", "<content>", "<body-content>", "<section-main>"],
    answer: 0,
    explanation: "The semantic <main> element identifies the page's primary content."
  },
  {
    category: "CSS",
    question: "Which CSS property controls the space inside an element's border?",
    options: ["margin", "padding", "gap", "outline"],
    answer: 1,
    explanation: "Padding is the inner space between the content and the border."
  },
  {
    category: "JavaScript",
    question: "Which keyword declares a block-scoped variable that can be reassigned?",
    options: ["const", "var", "let", "static"],
    answer: 2,
    explanation: "Use let for a variable that can be reassigned and is limited to its block."
  },
  {
    category: "HTML",
    question: "What is the purpose of the alt attribute on an image?",
    options: ["Set image dimensions", "Provide a text alternative", "Load the image faster", "Add a caption below it"],
    answer: 1,
    explanation: "Alternative text communicates an image's meaning when it cannot be seen or loaded."
  },
  {
    category: "CSS",
    question: "Which declaration creates a two-column CSS Grid?",
    options: ["grid-template-columns: 1fr 1fr;", "grid-columns: 2;", "columns: grid(2);", "display: columns;"],
    answer: 0,
    explanation: "Two 1fr tracks share the available grid space equally."
  },
  {
    category: "JavaScript",
    question: "Which array method returns a new array containing items that pass a test?",
    options: ["forEach()", "filter()", "findIndex()", "push()"],
    answer: 1,
    explanation: "filter() creates a new array with every element that passes its callback test."
  },
  {
    category: "HTML",
    question: "Which attribute connects a label to a form input?",
    options: ["name", "for", "target", "role"],
    answer: 1,
    explanation: "The label's for value should match the input's id."
  },
  {
    category: "CSS",
    question: "Which unit is relative to the root element's font size?",
    options: ["em", "rem", "px", "vh"],
    answer: 1,
    explanation: "rem is based on the root (html) element's font size."
  },
  {
    category: "JavaScript",
    question: "What does === check in JavaScript?",
    options: ["Only whether values are equal after conversion", "Whether types match only", "Strict equality of value and type", "Whether two variables have the same name"],
    answer: 2,
    explanation: "Strict equality compares both type and value without coercion."
  },
  {
    category: "HTML",
    question: "Which element is the most appropriate for a site's main navigation links?",
    options: ["<nav>", "<aside>", "<menuitem>", "<links>"],
    answer: 0,
    explanation: "The semantic <nav> element groups major navigation links."
  },
  {
    category: "CSS",
    question: "Which media query checks whether a user prefers reduced motion?",
    options: ["@media (low-motion)", "@media (prefers-reduced-motion: reduce)", "@media (motion: off)", "@media (reduce: true)"],
    answer: 1,
    explanation: "prefers-reduced-motion: reduce lets styles respect the user's motion preference."
  },
  {
    category: "JavaScript",
    question: "Which method safely sets an element's plain text content?",
    options: ["innerHTML", "outerHTML", "textContent", "insertAdjacentHTML"],
    answer: 2,
    explanation: "textContent inserts text without parsing it as HTML markup."
  }
];
