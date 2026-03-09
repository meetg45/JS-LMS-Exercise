import { FUNCTIONS, CONSTANTS } from "./constants.js";

export function infixToPostfix(tokens) {
  const output = [];
  const stack = [];

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "(") {
      stack.push(tokens[i]);
    } else if (FUNCTIONS.includes(tokens[i])) {
      stack.push(tokens[i]);
    } else if (tokens[i] === ")") {
      while (stack.length && stack[stack.length - 1] !== "(") {
        output.push(stack.pop());
      }

      stack.pop();

      if (stack.length && FUNCTIONS.includes(stack[stack.length - 1])) {
        output.push(stack.pop());
      }
    } else if (!isNaN(tokens[i]) || CONSTANTS[tokens[i]] !== undefined) {
      output.push(tokens[i]);
    } else if (tokens[i] === "!") {
      output.push(tokens[i]);
    } else {
      // Operator precedence handling
      while (
        stack.length > 0 &&
        precedence(stack[stack.length - 1]) >= precedence(tokens[i]) &&
        tokens[i] !== "^"
      ) {
        output.push(stack.pop());
      }

      stack.push(tokens[i]);
    }
  }

  while (stack.length > 0) {
    output.push(stack.pop());
  }

  return output;
}

export function precedence(op) {
  if (op == "+" || op == "-") {
    return 1;
  }

  if (op == "*" || op == "/" || op == "%") {
    return 2;
  }

  if (op === "^") {
    return 3;
  }

  // Functions have highest precedence
  if (
    op === "!" ||
    op === "log" ||
    op === "ln" ||
    op === "sin" ||
    op === "tan" ||
    op === "cos" ||
    op === "√"
  ) {
    return 4;
  }

  return 0;
}
