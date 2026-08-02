const display = document.querySelector(".display");
const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operator]");
const equals = document.querySelector(".equals");
const clear = document.querySelector(".clear");
const backspace = document.getElementById("clearonce");

// ===== STATE (single source of truth) =====
let currentInput = "";
let previousInput = "";
let operator = null;

// ===== HELPERS =====
function updateDisplay() {
  display.textContent =
    previousInput +
    (operator ? operator : "") +
    currentInput;
}

function calculate() {
  if (previousInput === "" || currentInput === "" || !operator) return null;
  const prev = Number(previousInput);
  const curr = Number(currentInput);
  if (operator === "+") return prev + curr;
  if (operator === "-") return prev - curr;
  if (operator === "*") return prev * curr;
  if (operator === "/") return curr === 0 ? "Error" : prev / curr;
  return null;
}

// ===== NUMBER INPUT =====
numbers.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.number;
    // prevent multiple decimals
    if (value === "." && currentInput.includes(".")) return;
    currentInput += value;
    updateDisplay();
  });
});

// ===== OPERATOR INPUT =====
operators.forEach(btn => {
  btn.addEventListener("click", () => {
    const newOperator = btn.dataset.operator;

    // Case 1: operator change (5 + → 5 -)
    if (currentInput === "" && operator) {
      operator = newOperator;
      updateDisplay();
      return;
    }

    // Case 2: chaining (5 + 3 +)
    if (previousInput !== "" && currentInput !== "") {
      const result = calculate();
      if (result === "Error") {
        display.textContent = "Error";
        resetState();
        return;
      }
      previousInput = String(result);
      currentInput = "";
      operator = newOperator;
      updateDisplay();
      return;
    }

    // Case 3: first operator
    if (currentInput !== "") {
      previousInput = currentInput;
      currentInput = "";
      operator = newOperator;
      updateDisplay();
    }
  });
});

// ===== EQUALS =====
equals.addEventListener("click", () => {
  const result = calculate();
  if (result === null) return;
  display.textContent = result;
  currentInput = String(result);
  previousInput = "";
  operator = null;
});

// ===== CLEAR =====
clear.addEventListener("click", () => {
  resetState();
  updateDisplay();
});

function resetState() {
  currentInput = "";
  previousInput = "";
  operator = null;
}

// ===== BACKSPACE =====
backspace.addEventListener("click", () => {
  if (currentInput !== "") {
    currentInput = currentInput.slice(0, -1);
  } else if (operator) {
    operator = null;
  } else if (previousInput !== "") {
    previousInput = previousInput.slice(0, -1);
  }
  updateDisplay();
});