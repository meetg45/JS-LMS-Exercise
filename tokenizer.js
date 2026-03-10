import { FUNCTIONS, CONSTANTS } from "./constants.js";

export function tokenize(expression) {
  let myToken = [];
  let currentInput = "";
  let hasDot = false;

  for (let i = 0; i < expression.length; i++) {
    let foundFunction = false;

    // Detect functions like sin, cos etc.
    for (const func of FUNCTIONS) {
      if (expression.slice(i, i + func.length) == func) {
        myToken.push(func);
        i += func.length - 1;
        foundFunction = true;
        break;
      }
    }

    if (foundFunction) {
      continue;
    }

    let foundConstant = false;

    // Detect constants π and e
    for (const key in CONSTANTS) {
      if (expression.slice(i, i + key.length) === key) {
        myToken.push(key);
        i += key.length - 1;
        foundConstant = true;
        break;
      }
    }

    if (foundConstant) {
      continue;
    }

    let val = expression[i];

    if (!isNaN(val)) {
      currentInput += val;
    }
    // Handle decimal point
    else if (val === ".") {
      if (hasDot) {
        throw new Error("Invalid Number format");
      }

      if (currentInput === "") {
        currentInput = "0";
      } else if (currentInput === "-") {
        currentInput = "-0";
      }

      currentInput += val;
      hasDot = true;
    }
    // Handle operators
    else if ("+-*/!%^".includes(val)) {
      // Detect unary minus
      if (
        val == "-" &&
        (i == 0 || "+-*/(^%(".includes(expression[i - 1])) &&
        !FUNCTIONS.includes(myToken[myToken.length - 1])
      ) {
        if (expression[i + 1] === "(") {
          if (currentInput !== "") {
              myToken.push(currentInput);
              currentInput = "";
          }    

      myToken.push("-1");
      myToken.push("*");
  } else {
          currentInput += val;
          hasDot = false;
        }
      } else {
        if (currentInput !== "") {
          if (currentInput.endsWith(".")) {
            currentInput += "0";
          }

          myToken.push(currentInput);
          currentInput = "";
          hasDot = false;
        }

        myToken.push(val);
      }
    }
    // Handle parentheses
    else if ("()".includes(val)) {
      if (currentInput !== "") {
        if (currentInput.endsWith(".")) {
          currentInput += "0";
        }

        myToken.push(currentInput);
        currentInput = "";
        hasDot = false;
      }

      myToken.push(val);
    }
  }

  // Push remaining number
  if (currentInput !== "") {
    if (currentInput.endsWith(".")) {
      currentInput += "0";
    }

    myToken.push(currentInput);
  }

  return myToken;
}
