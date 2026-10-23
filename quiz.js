import { quizQuestions } from "./quiz-data.js";

const BEST_SCORE_KEY = "skillspark-best-score";
let storageWarningShown = false;

function warnStorage(error) {
  if (storageWarningShown) return;
  console.warn("SkillSpark could not access browser storage; the best score may not persist.", error);
  storageWarningShown = true;
}

export function initQuiz() {
  const startPanel = document.querySelector("#quiz-start");
  const playPanel = document.querySelector("#quiz-play");
  const resultsPanel = document.querySelector("#quiz-results");
  if (!startPanel || !playPanel || !resultsPanel) return;

  const startButton = document.querySelector("#start-quiz");
  const submitButton = document.querySelector("#submit-answer");
  const nextButton = document.querySelector("#next-question");
  const restartButton = document.querySelector("#restart-quiz");
  const optionsContainer = document.querySelector("#answer-options");
  const feedback = document.querySelector("#quiz-feedback");
  const questionText = document.querySelector("#question-text");
  const questionCounter = document.querySelector("#question-counter");
  const progress = document.querySelector("#quiz-progress");
  const progressFill = document.querySelector("#quiz-progress-fill");
  const bestDisplay = document.querySelector("#best-score");
  const quizBestDisplay = document.querySelector("#quiz-best-score");
  const resultsBestDisplay = document.querySelector("#results-best-score");
  const review = document.querySelector("#answer-review");
  const scoreDisplay = document.querySelector("#results-score");
  const percentDisplay = document.querySelector("#results-percent");
  const resultsMessage = document.querySelector("#results-message");

  let questions = [];
  let currentIndex = 0;
  let score = 0;
  let selectedIndex = null;
  let answers = [];
  let isSubmitted = false;

  function readBestScore() {
    try {
      const scoreValue = Number(localStorage.getItem(BEST_SCORE_KEY));
      return Number.isFinite(scoreValue) && scoreValue >= 0 && scoreValue <= 100 ? scoreValue : null;
    } catch (error) {
      warnStorage(error);
      return null;
    }
  }

  function displayBestScore() {
    const best = readBestScore();
    const label = best === null ? "Not yet recorded" : `${best}%`;
    if (bestDisplay) bestDisplay.textContent = label;
    if (quizBestDisplay) quizBestDisplay.textContent = best === null ? "—" : `${best}%`;
    if (resultsBestDisplay) resultsBestDisplay.textContent = best === null ? "—" : `${best}%`;
  }

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  }

  function startQuiz() {
    questions = shuffle(quizQuestions).slice(0, 10);
    currentIndex = 0;
    score = 0;
    selectedIndex = null;
    answers = [];
    isSubmitted = false;
    startPanel.hidden = true;
    resultsPanel.hidden = true;
    playPanel.hidden = false;
    displayBestScore();
    renderQuestion();
  }

  function renderQuestion() {
    const question = questions[currentIndex];
    selectedIndex = null;
    isSubmitted = false;
    questionCounter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    progress.setAttribute("aria-valuemax", String(questions.length));
    progress.setAttribute("aria-valuenow", String(currentIndex));
    progressFill.style.width = `${(currentIndex / questions.length) * 100}%`;
    questionText.textContent = question.question;
    feedback.hidden = true;
    feedback.className = "quiz-feedback";
    submitButton.hidden = false;
    submitButton.disabled = true;
    nextButton.hidden = true;
    nextButton.textContent = "Next question →";
    optionsContainer.querySelectorAll(".answer-option").forEach((option) => option.remove());

    question.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "answer-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "quiz-answer";
      input.value = String(optionIndex);
      input.addEventListener("change", () => {
        selectedIndex = optionIndex;
        submitButton.disabled = false;
        optionsContainer.querySelectorAll(".answer-option").forEach((option, index) => {
          option.classList.toggle("is-selected", index === optionIndex);
        });
      });
      const text = document.createElement("span");
      text.textContent = option;
      label.append(input, text);
      optionsContainer.append(label);
    });
  }

  function submitAnswer() {
    if (isSubmitted || selectedIndex === null) return;
    isSubmitted = true;
    const question = questions[currentIndex];
    const isCorrect = selectedIndex === question.answer;
    if (isCorrect) score += 1;
    answers.push({ selectedIndex, isCorrect });
    submitButton.disabled = true;
    submitButton.hidden = true;
    nextButton.hidden = false;
    feedback.hidden = false;
    feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
    feedback.textContent = `${isCorrect ? "Correct!" : "Not quite."} ${question.explanation}`;
    [...optionsContainer.querySelectorAll(".answer-option")].forEach((option, index) => {
      option.classList.add("is-locked");
      const input = option.querySelector("input");
      input.disabled = true;
      if (index === question.answer) option.classList.add("is-correct");
      else if (index === selectedIndex) option.classList.add("is-incorrect");
    });
    if (currentIndex === questions.length - 1) nextButton.textContent = "See results";
  }

  function showResults() {
    playPanel.hidden = true;
    resultsPanel.hidden = false;
    const percentage = Math.round((score / questions.length) * 100);
    const oldBest = readBestScore();
    const best = oldBest === null ? percentage : Math.max(oldBest, percentage);
    try {
      localStorage.setItem(BEST_SCORE_KEY, String(best));
    } catch (error) {
      warnStorage(error);
    }
    scoreDisplay.textContent = `${score} / ${questions.length}`;
    percentDisplay.textContent = `${percentage}%`;
    resultsMessage.textContent = percentage === 100
      ? "Brilliant — a perfect score!"
      : percentage >= 70
        ? "Great work — your skills are sparking!"
        : percentage >= 40
          ? "Nice effort — keep that curiosity going!"
          : "Every expert starts somewhere. Give it another go!";
    displayBestScore();
    review.textContent = "";
    questions.forEach((question, index) => {
      const answer = answers[index];
      const item = document.createElement("article");
      item.className = "review-item";
      const title = document.createElement("h4");
      title.textContent = `${index + 1}. ${question.category}: ${question.question}`;
      const selected = document.createElement("p");
      selected.textContent = `Your answer: ${question.options[answer.selectedIndex]}`;
      const correct = document.createElement("p");
      correct.textContent = `Correct answer: ${question.options[question.answer]}`;
      const result = document.createElement("p");
      result.className = `review-result ${answer.isCorrect ? "is-correct" : "is-incorrect"}`;
      result.textContent = answer.isCorrect ? "You got it!" : "Review this one";
      item.append(title, selected, correct, result);
      review.append(item);
    });
  }

  startButton.addEventListener("click", startQuiz);
  submitButton.addEventListener("click", submitAnswer);
  nextButton.addEventListener("click", () => {
    if (!isSubmitted) return;
    if (currentIndex === questions.length - 1) {
      showResults();
      return;
    }
    currentIndex += 1;
    renderQuestion();
  });
  restartButton.addEventListener("click", startQuiz);
  displayBestScore();
}
