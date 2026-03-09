const CONSTANTS = {
  π: Math.PI,
  e: Math.E,
};

export function evaluatePostfix(postfix, isDeg) {
  // Function execution map
  const FUNCTION_MAP = {
    sin: (x) => Math.sin(isDeg ? (x * Math.PI) / 180 : x),

    cos: (x) => Math.cos(isDeg ? (x * Math.PI) / 180 : x),

    tan: (x) => {
      if (isDeg && x % 90 === 0 && (x / 90) % 2 !== 0) {
        return Infinity;
      }
      return Math.tan(isDeg ? (x * Math.PI) / 180 : x);
    },

    log: (x) => {
      if (x <= 0) {
        throw new Error("log of zero or negative undefined");
      }
      return Math.log10(x);
    },

    ln: (x) => {
      if (x <= 0) {
        throw new Error("ln of zero or negative undefined");
      }
      return Math.log(x);
    },

    "√": (x) => {
      if (x < 0) {
        throw new Error("sqrt of negative number undefined");
      }
      return Math.sqrt(x);
    },
  };

  const stack = [];

  for (let i = 0; i < postfix.length; i++) {
    const token = postfix[i];

    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else if (token === "!") {
      stack.push(factorial(stack.pop()));
    } else if (token === "^") {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(Math.pow(a, b));
    } else if (CONSTANTS[token] !== undefined) {
      stack.push(CONSTANTS[token]);
    } else if (FUNCTION_MAP[token]) {
      const a = stack.pop();
      stack.push(FUNCTION_MAP[token](a));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      let result;

      if (token === "+") result = a + b;
      else if (token === "-") result = a - b;
      else if (token === "*") result = a * b;
      else if (token === "/") {
        if (b === 0) throw new Error("Division by zero");
        result = a / b;
      } else if (token === "%") result = a % b;

      stack.push(result);
    }
  }

  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }

  return parseFloat(stack[0].toFixed(10));
}

// Factorial calculation
export function factorial(n) {
  if (!Number.isInteger(n)) {
    throw new Error("Factorial requires integer");
  }

  if (n < 0) {
    throw new Error("Factorial undefined for negative numbers");
  }

  if (n > 170) {
    throw new Error("Number too large for factorial");
  }

  let result = 1;

  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}
