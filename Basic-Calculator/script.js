//Main JavaScript file for Calculator functionality

let display = document.getElementById("display");

function appendValue(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

//Calculate the expression in the display
function calculate() {
  try {
    if (display.value.includes("/0")) {
      display.value = "Error: Division by 0";
      return;
    }
    // Replace % with /100 for percentage
    let expression = display.value.replace(/%/g, "/100");
    display.value = eval(expression);
  } catch (error) {
    display.value = "Error";
  }
}

//Square root function
function sqrt() {
  try {
    let value = parseFloat(display.value);
    if (isNaN(value)) {
      display.value = "Error";
    } else if (value < 0) {
      display.value = "Error: Negative √ not allowed";
    } else {
      display.value = Math.sqrt(value);
    }
  } catch (error) {
    display.value = "Error";
  }
}


// Keyboard support
document.addEventListener("keydown", (event) => {
  if ((/[0-9+\-*/.]/).test(event.key)) {
    appendValue(event.key);
  } else if (event.key === "Enter") {
    calculate();
  } else if (event.key === "Backspace") {
    display.value = display.value.slice(0, -1);
  } else if (event.key.toLowerCase() === "c") {
    clearDisplay();
  }
});

//EOF