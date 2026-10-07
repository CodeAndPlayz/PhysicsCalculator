const physics = {
  motion: {
    title: "Motion",
    calculations: {
      speed: {
        label: "Speed",
        formula: "v = d / t",
        fields: [
          ["Distance", "d", "m"],
          ["Time", "t", "s"]
        ],
        output: "m/s"
      },
      velocity: {
        label: "Velocity",
        formula: "v = Δx / t",
        fields: [
          ["Displacement", "Δx", "m"],
          ["Time", "t", "s"]
        ],
        output: "m/s"
      },
      acceleration: {
        label: "Acceleration",
        formula: "a = (v₂ − v₁) / t",
        fields: [
          ["Final velocity", "v₂", "m/s"],
          ["Initial velocity", "v₁", "m/s"],
          ["Time", "t", "s"]
        ],
        output: "m/s²"
      }
    }
  },

  force: {
    title: "Force",
    calculations: {
      force: {
        label: "Force",
        formula: "F = ma",
        fields: [
          ["Mass", "m", "kg"],
          ["Acceleration", "a", "m/s²"]
        ],
        output: "N"
      },
      mass: {
        label: "Mass",
        formula: "m = F / a",
        fields: [
          ["Force", "F", "N"],
          ["Acceleration", "a", "m/s²"]
        ],
        output: "kg"
      },
      acceleration: {
        label: "Acceleration",
        formula: "a = F / m",
        fields: [
          ["Force", "F", "N"],
          ["Mass", "m", "kg"]
        ],
        output: "m/s²"
      }
    }
  },

  energy: {
    title: "Work & Energy",
    calculations: {
      work: {
        label: "Work",
        formula: "W = Fd",
        fields: [
          ["Force", "F", "N"],
          ["Distance", "d", "m"]
        ],
        output: "J"
      },
      kinetic: {
        label: "Kinetic Energy",
        formula: "KE = ½mv²",
        fields: [
          ["Mass", "m", "kg"],
          ["Velocity", "v", "m/s"]
        ],
        output: "J"
      },
      power: {
        label: "Power",
        formula: "P = W / t",
        fields: [
          ["Work", "W", "J"],
          ["Time", "t", "s"]
        ],
        output: "W"
      }
    }
  },

  momentum: {
    title: "Momentum",
    calculations: {
      momentum: {
        label: "Momentum",
        formula: "p = mv",
        fields: [
          ["Mass", "m", "kg"],
          ["Velocity", "v", "m/s"]
        ],
        output: "kg·m/s"
      }
    }
  },

  electricity: {
    title: "Electricity",
    calculations: {
      voltage: {
        label: "Voltage",
        formula: "V = IR",
        fields: [
          ["Current", "I", "A"],
          ["Resistance", "R", "Ω"]
        ],
        output: "V"
      },
      current: {
        label: "Current",
        formula: "I = V / R",
        fields: [
          ["Voltage", "V", "V"],
          ["Resistance", "R", "Ω"]
        ],
        output: "A"
      },
      resistance: {
        label: "Resistance",
        formula: "R = V / I",
        fields: [
          ["Voltage", "V", "V"],
          ["Current", "I", "A"]
        ],
        output: "Ω"
      },
      power: {
        label: "Electrical Power",
        formula: "P = VI",
        fields: [
          ["Voltage", "V", "V"],
          ["Current", "I", "A"]
        ],
        output: "W"
      }
    }
  }
};

let currentTopic = "motion";

const unitOptions = {
  m: [["m", 1], ["km", 1000], ["cm", 0.01], ["mm", 0.001], ["ft", 0.3048], ["in", 0.0254], ["mi", 1609.344]],
  s: [["s", 1], ["ms", 0.001], ["min", 60], ["h", 3600]],
  kg: [["kg", 1], ["g", 0.001], ["mg", 0.000001], ["lb", 0.45359237]],
  "m/s": [["m/s", 1], ["km/h", 1 / 3.6], ["ft/s", 0.3048], ["mph", 0.44704]],
  N: [["N", 1], ["kN", 1000], ["dyn", 0.00001], ["lbf", 4.4482216152605]],
  J: [["J", 1], ["kJ", 1000], ["MJ", 1000000], ["Wh", 3600], ["kWh", 3600000], ["cal", 4.184]],
  W: [["W", 1], ["kW", 1000], ["MW", 1000000], ["hp", 745.6998715822702]],
  V: [["V", 1], ["mV", 0.001], ["kV", 1000]],
  A: [["A", 1], ["mA", 0.001], ["µA", 0.000001]],
  "Ω": [["Ω", 1], ["kΩ", 1000], ["MΩ", 1000000]],
  "m/s²": [["m/s²", 1]]
};

const topicButtons = document.querySelectorAll(".topic");
const topicTitle = document.getElementById("topic-title");
const solve = document.getElementById("solve");
const fields = document.getElementById("fields");
const solution = document.getElementById("solution");

function populateCalculations() {
  const topic = physics[currentTopic];

  topicTitle.textContent = topic.title;
  solve.innerHTML = "";

  Object.entries(topic.calculations).forEach(([key, calculation]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = calculation.label;
    solve.appendChild(option);
  });

  renderFields();
  clearSolution();
}

function renderFields() {
  const calculation = physics[currentTopic].calculations[solve.value];

  fields.innerHTML = "";

  calculation.fields.forEach(([name, symbol, unit], index) => {
    const label = document.createElement("label");
    label.htmlFor = `field-${index}`;
    label.textContent = `${name} (${symbol})`;

    const row = document.createElement("div");
    row.className = "field-row";

    const input = document.createElement("input");
    input.id = `field-${index}`;
    input.type = "number";
    input.step = "any";
    input.placeholder = "Enter value";
    input.dataset.index = index;
    input.setAttribute("aria-label", name);

    const unitSelect = document.createElement("select");
    unitSelect.className = "unit-select";
    unitSelect.setAttribute("aria-label", `${name} unit`);
    unitOptions[unit].forEach(([unitName]) => {
      const option = document.createElement("option");
      option.value = unitName;
      option.textContent = unitName;
      unitSelect.appendChild(option);
    });

    row.append(input, unitSelect);
    fields.append(label, row);
  });
}

function clearSolution() {
  solution.className = "empty";
  solution.textContent = "Enter your values and press Calculate.";
}

function formatNumber(value) {
  if (Number.isInteger(value)) return value.toString();
  return Number(value.toFixed(8)).toString();
}

function calculate() {
  const calculation = physics[currentTopic].calculations[solve.value];
  const inputs = [...fields.querySelectorAll("input")];
  const originalValues = inputs.map(input => Number(input.value));

  if (inputs.some(input => input.value.trim() === "") ||
      originalValues.some(value => !Number.isFinite(value))) {
    solution.className = "";
    solution.innerHTML = '<div class="error">Please enter a valid value in every field.</div>';
    return;
  }

  const selectedUnits = [...fields.querySelectorAll(".unit-select")].map(select => select.value);
  const standardValues = originalValues.map((value, index) => {
    const standardUnit = calculation.fields[index][2];
    const factor = unitOptions[standardUnit].find(([unit]) => unit === selectedUnits[index])[1];
    return value * factor;
  });

  let answer;
  let substitution;

  const [a, b, c] = standardValues;

  if (currentTopic === "motion" && solve.value === "speed") {
    if (b === 0) return showError("Time cannot be zero.");
    answer = a / b;
    substitution = `${formatNumber(a)} m ÷ ${formatNumber(b)} s`;
  }

  if (currentTopic === "motion" && solve.value === "velocity") {
    if (b === 0) return showError("Time cannot be zero.");
    answer = a / b;
    substitution = `${formatNumber(a)} m ÷ ${formatNumber(b)} s`;
  }

  if (currentTopic === "motion" && solve.value === "acceleration") {
    if (c === 0) return showError("Time cannot be zero.");
    answer = (a - b) / c;
    substitution = `(${formatNumber(a)} m/s − ${formatNumber(b)} m/s) ÷ ${formatNumber(c)} s`;
  }

  if (currentTopic === "force" && solve.value === "force") {
    answer = a * b;
    substitution = `${formatNumber(a)} kg × ${formatNumber(b)} m/s²`;
  }

  if (currentTopic === "force" && solve.value === "mass") {
    if (b === 0) return showError("Acceleration cannot be zero.");
    answer = a / b;
    substitution = `${formatNumber(a)} N ÷ ${formatNumber(b)} m/s²`;
  }

  if (currentTopic === "force" && solve.value === "acceleration") {
    if (b === 0) return showError("Mass cannot be zero.");
    answer = a / b;
    substitution = `${formatNumber(a)} N ÷ ${formatNumber(b)} kg`;
  }

  if (currentTopic === "energy" && solve.value === "work") {
    answer = a * b;
    substitution = `${formatNumber(a)} N × ${formatNumber(b)} m`;
  }

  if (currentTopic === "energy" && solve.value === "kinetic") {
    answer = 0.5 * a * b * b;
    substitution = `½ × ${formatNumber(a)} kg × (${formatNumber(b)} m/s)²`;
  }

  if (currentTopic === "energy" && solve.value === "power") {
    if (b === 0) return showError("Time cannot be zero.");
    answer = a / b;
    substitution = `${formatNumber(a)} J ÷ ${formatNumber(b)} s`;
  }

  if (currentTopic === "momentum") {
    answer = a * b;
    substitution = `${formatNumber(a)} kg × ${formatNumber(b)} m/s`;
  }

  if (currentTopic === "electricity" && solve.value === "voltage") {
    answer = a * b;
    substitution = `${formatNumber(a)} A × ${formatNumber(b)} Ω`;
  }

  if (currentTopic === "electricity" && solve.value === "current") {
    if (b === 0) return showError("Resistance cannot be zero.");
    answer = a / b;
    substitution = `${formatNumber(a)} V ÷ ${formatNumber(b)} Ω`;
  }

  if (currentTopic === "electricity" && solve.value === "resistance") {
    if (b === 0) return showError("Current cannot be zero.");
    answer = a / b;
    substitution = `${formatNumber(a)} V ÷ ${formatNumber(b)} A`;
  }

  if (currentTopic === "electricity" && solve.value === "power") {
    answer = a * b;
    substitution = `${formatNumber(a)} V × ${formatNumber(b)} A`;
  }

  if (!Number.isFinite(answer)) {
    return showError("The calculation produced an invalid result.");
  }

  const result = formatNumber(answer);

  solution.className = "";
  solution.innerHTML = `
    <div class="formula">${calculation.formula}</div>
    <div class="answer">${result} ${calculation.output}</div>

    <div class="step">
      <strong>Step 1 — Identify the formula</strong>
      ${calculation.formula}
    </div>

    <div class="step">
      <strong>Step 2 — Identify the given values</strong>
      ${calculation.fields.map((field, i) => {
        const converted = formatNumber(standardValues[i]);
        return `${field[1]} = ${formatNumber(originalValues[i])} ${selectedUnits[i]} → ${converted} ${field[2]}`;
      }).join("<br>")}
    </div>

    <div class="step">
      <strong>Step 3 — Substitute</strong>
      ${substitution}
    </div>

    <div class="step">
      <strong>Step 4 — Calculate</strong>
      ${result}
    </div>

    <div class="step">
      <strong>Step 5 — Final answer</strong>
      ${result} ${calculation.output}
    </div>
  `;
}

function showError(message) {
  solution.className = "";
  solution.innerHTML = `<div class="error">${message}</div>`;
}

topicButtons.forEach(button => {
  button.addEventListener("click", () => {
    topicButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    currentTopic = button.dataset.topic;
    populateCalculations();
  });
});

solve.addEventListener("change", () => {
  renderFields();
  clearSolution();
});

document.getElementById("calculate").addEventListener("click", calculate);

document.getElementById("reset").addEventListener("click", () => {
  fields.querySelectorAll("input").forEach(input => {
    input.value = "";
  });
  fields.querySelectorAll(".unit-select").forEach(select => {
    select.selectedIndex = 0;
  });
  clearSolution();
});

populateCalculations();
