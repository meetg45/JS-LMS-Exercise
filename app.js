// converts expression string into tokens
import { tokenize } from "./tokenizer.js";

// converts infix expression to postfix
import { infixToPostfix } from "./parser.js";

// history functions
import { addToHistory, clearHistory } from "./history.js";

// evaluates postfix expression
import { evaluatePostfix } from "./evaluator.js";

const displayinput = document.querySelector(".display-area input");
const displaybtn = document.querySelectorAll(".buttons-area");
const FUNCTIONS = ["sin", "cos", "tan", "log", "ln", "√"];
const CONSTANTS = {
  π: Math.PI,
  e: Math.E,
};

// Handle all button clicks
displaybtn.forEach((a) => {
  a.addEventListener("click", handleButtonClick);
});

let expression = "";
let lastAnswer = "";
let isResult = false;
let isDeg = true;
// let historyList = [];

function handleButtonClick(e) {
  if (e.target.classList.contains("clear")) {
    clearDisplay();
  } else if (e.target.classList.contains("backspace")) {
    backspace();
  } else if (e.target.classList.contains("equal")) {
    calculate();
  } else if (e.target.classList.contains("inverse")) {
    if (expression !== "") {
      expression = "1/(" + expression + ")";
      updateDisplay();
    }
  } else if (e.target.classList.contains("x2")) {
    if (expression !== "") {
      appendValue("^2");
    }
  } else if (e.target.classList.contains("xy")) {
    if (expression !== "") {
      appendValue("^");
    }
  } else if (e.target.classList.contains("ANS")) {
    if (lastAnswer !== "") {
      if (isResult === true) {
        expression = "";
        isResult = false;
      }
      appendValue(lastAnswer);
    }
  } else if (e.target.classList.contains("deg")) {
    isDeg = !isDeg;
    e.target.innerHTML = isDeg ? "DEG <sub>RAD</sub>" : "RAD <sub>DEG</sub>";
    document.getElementById("modeLabel").textContent = isDeg ? "DEG" : "RAD";
  } else if (e.target.classList.contains("btn")) {
    appendValue(e.target.dataset.value);
  }
  displayinput.scrollLeft = displayinput.scrollWidth;
}

function appendValue(value) {
  const operator = "+-*/%^";
  const lastChar = expression.slice(-1);
  const secondLastChar = expression.slice(-2, -1);

  if (value === "00" || value === "0") {
    if (
      expression === "" ||
      ((lastChar === "0" || lastChar === "00") &&
        operator.includes(secondLastChar)) ||
      ((lastChar === "0" || lastChar === "00") && expression.length === 1)
    ) {
      return;
    }
  }
  if (isResult) {
    if (!isNaN(value) && value !== " ") {
      expression = "";
    }
    isResult = false;
  }

  if (value == "(") {
    if (
      (lastChar && (!isNaN(lastChar) || lastChar === ")")) ||
      lastChar === "π"
    ) {
      if (lastChar === "2" && secondLastChar === "^") {
        return;
      } else {
        expression += "*(";
      }
    } else {
      expression += "(";
    }
  } else if (operator.includes(value)) {
    if (expression === "") {
      if (value === "-") {
        expression += value;
        updateDisplay();
      }
      return;
    }
    if (operator.includes(lastChar)) {
      if (value === "-" && lastChar !== "-") {
        expression += value;
      } else {
        if (operator.includes(secondLastChar)) {
          expression = expression.slice(0, -2) + value;
        } else {
          expression = expression.slice(0, -1) + value;
        }
      }
    } else {
      expression += value;
    }
  } else {
    // auto * before functions
    if (
      FUNCTIONS.some((f) => value.startsWith(f)) &&
      expression !== "" &&
      (!isNaN(lastChar) || lastChar === ")")
    ) {
      expression += "*";
    }
    // auto * before pi
    if (
      (value === "π" || value === "e") &&
      expression !== "" &&
      (!isNaN(lastChar) || lastChar === ")")
    ) {
      expression += "*";
    }

    // auto * after pi,e when number pressed

    if (!isNaN(value) && (lastChar === "π" || lastChar === "e")) {
      expression += "*";
    }

    if (
      value === "10^" &&
      expression !== "" &&
      (!isNaN(lastChar) || lastChar === ")")
    ) {
      expression += "*";
    }

    if (!isNaN(value) && value !== " " && lastChar === ")") {
      expression += "*";
    }
    expression += value;
  }
  updateDisplay();
}

function updateDisplay() {
  displayinput.value = expression;
}

// Handle clear button
function clearDisplay() {
  expression = "";
  updateDisplay();
}

// // Remove last character
function backspace() {
  if (expression.endsWith("√")) {
    expression = expression.slice(0, -1);
  } else if (/(sin|cos|tan|log)$/.test(expression)) {
    expression = expression.slice(0, -3);
  } else if (expression.endsWith("ln")) {
    expression = expression.slice(0, -2);
  } else if (expression.endsWith("π")) {
    expression = expression.slice(0, -1);
  } else if (expression.endsWith("Error")) {
    expression = expression.slice(0, -5);
  } else {
    expression = expression.slice(0, -1);
  }
  updateDisplay();
}

function calculate() {
  try {
    if (
      expression === "" ||
      (!/\d/.test(expression) &&
        !expression.includes("π") &&
        !expression.includes("e"))
    ) {
      return;
    }
    const originalExpr = expression;
    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;

    if (closeCount > openCount) {
      throw new Error("Mismatched parentheses");
    }

    for (let i = 0; i < openCount - closeCount; i++) {
      expression += ")";
    }

    const tokens = tokenize(expression);
    console.log(tokens);
    const postfix = infixToPostfix(tokens);
    console.log(postfix);
    // const result = evaluatePostfix(postfix);
    const result = evaluatePostfix(postfix, isDeg);
    console.log(result);

    if (result === Infinity || isNaN(result)) {
      expression = "Error";
      updateDisplay();
      return;
    }
    expression = result.toString();
    lastAnswer = expression;
    isResult = true;
    addToHistory(originalExpr, result);
    updateDisplay();
  } catch (err) {
    expression = "Error";
    updateDisplay();
  }
}
document
  .querySelector(".clear-history")
  .addEventListener("click", clearHistory);
