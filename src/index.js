document.querySelectorAll(".calculator__btn").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    calculate(e);
  })
);

window.addEventListener("keydown", (e) => {
  if (!isNaN(Number(e.key) && e.key !== "0")) {
    calculate(e, e.key);
  } else {
    switch (e.key) {
      case "Backspace":
        calculate(e, "del");
        break;
      case "=":
        calculate(e, "=");
        break;
      case "+":
        calculate(e, "+");
        break;
      case "-":
        calculate(e, "-");
        break;
      case "c":
        calculate(e, "C");
        break;
      case "C":
        calculate(e, "C");
        break;
      case "/":
        calculate(e, "÷");
        break;
      case "*":
        calculate(e, "*");
        break;
      case "0":
        calculate(e, "0");
        break;
      case ".":
        calculate(e, ".");
        break;
    }
  }
});

function calculate(e, key) {
  const displayValue = document.querySelector(".calculator__displayValue");
  const displayPrevValue = document.querySelector(
    ".calculator__displayPrevValue"
  );
  const target = key || e.target.textContent;
  const value = isNaN(+target) ? target : +target;
  const numbersArray = Array.from(displayValue.textContent);
  let error = false;

  if (
    displayValue.textContent === "Przepełnienie" ||
    displayValue.textContent === "NIE można dzielić przez 0!" ||
    displayValue.textContent === "NIE ma takiej liczby!"
  ) {
    error = true;
  }

  if (typeof value === "number") {
    if (displayValue.textContent === "0" || error) {
      displayValue.textContent = value;
    } else {
      if (numbersArray.length <= 21) displayValue.textContent += value;
    }
  } else {
    let a = displayValue.textContent;

    switch (value) {
      case "CE":
        displayValue.textContent = "0";
        break;
      case "C":
        displayValue.textContent = "0";
        displayPrevValue.textContent = "";
        break;
      case "del":
        if (error) break;
        numbersArray.pop();
        displayValue.textContent = +numbersArray.join("");
        break;
      case "1/x":
        if (error) break;
        displayValue.textContent = 1 / a;
        if (displayValue.textContent === "Infinity") {
          displayValue.textContent = "NIE można dzielić przez 0!";
          break;
        }
        writeToHistory(a, "1/", displayValue.textContent);
        break;
      case "x²":
        if (error) break;
        displayValue.textContent = a * a;
        if (displayValue.textContent === "Infinity") {
          displayValue.textContent = "Przepełnienie";
          break;
        }
        writeToHistory(a, "²", displayValue.textContent);
        break;
      case "√x":
        if (error) break;
        displayValue.textContent = Math.pow(a, 0.5);
        if (displayValue.textContent === "NaN") {
          displayValue.textContent = "NIE ma takiej liczby!";
          break;
        }
        writeToHistory(a, "√", displayValue.textContent);
        break;
      case "+/-":
        if (error) break;
        displayValue.textContent = a * -1;
        break;
      case ".":
        if (error) break;
        if (!numbersArray.includes(".")) {
          displayValue.textContent += ".";
        }
        break;
      case "=":
        if (displayPrevValue.textContent !== "")
          showResult(displayPrevValue.textContent, displayValue.textContent);
        break;
      default:
        if (error) break;
        else if (displayPrevValue.textContent === "") {
          displayPrevValue.textContent = `${displayValue.textContent} ${target}`;
          displayValue.textContent = "0";
        }
        break;
    }
  }

  if (Array.from(displayValue.textContent).length > 10) {
    displayValue.style.fontSize = "25px";
  } else {
    displayValue.style.fontSize = "35px";
  }

  function showResult(valueAAndOperator, bValue) {
    const indexOfSpace = valueAAndOperator.indexOf(" ") + 1;
    const operator = valueAAndOperator.substring(indexOfSpace);
    const a = Number(valueAAndOperator.substr(0, indexOfSpace));
    const b = Number(bValue);

    let result;

    switch (operator) {
      case "%":
        result = a * (b / 100);
        break;
      case "÷":
        result = a / b;
        break;
      case "*":
        result = a * b;
        break;
      case "-":
        result = a - b;
        break;
      case "+":
        result = a + b;
        break;
    }

    displayValue.textContent = result;
    displayPrevValue.textContent = "";
    if (displayValue.textContent === "Infinity") {
      displayValue.style.fontSize = "25px";
      displayValue.textContent = "NIE można dzielić przez 0!";
      return;
    }

    writeToHistory(a, operator, result, b);
  }

  function writeToHistory(a, operator, result, b) {
    const historyContent = document.querySelector(
      ".calculator__historyContent"
    );
    const clearBtn = document.querySelector(".calculator__historyDelete");
    clearBtn.classList.remove("calculator__historyDelete--hide");
    const p = document.createElement("p");
    if (b || b === 0) {
      p.textContent = `${a} ${operator} ${b} = ${result}`;
    } else if (operator === "²") {
      p.textContent = `${a}${operator} = ${result}`;
    } else {
      p.textContent = `${operator}${a} = ${result}`;
    }
    historyContent.append(p);

    clearBtn.addEventListener("click", () => {
      const pElements = document.querySelectorAll(
        ".calculator__historyContent p"
      );
      pElements.forEach((p) => p.remove());
      clearBtn.classList.add("calculator__historyDelete--hide");
    });
  }
}
