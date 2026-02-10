const display = document.getElementById("display");
const buttons = document.querySelectorAll("button[data-value], button[data-action]");

let expression = "";

const updateDisplay = () => {
	display.value = expression || "0";
};

const appendValue = (value) => {
	if (value === ".") {
		const parts = expression.split(/[^0-9.]/);
		const lastPart = parts[parts.length - 1];
		if (lastPart.includes(".")) {
			return;
		}
	}

	if (/^[+\-*/%]$/.test(value)) {
		if (expression === "" && value !== "-") {
			return;
		}
		if (/^[+\-*/%]$/.test(expression.slice(-1))) {
			expression = expression.slice(0, -1);
		}
	}

	expression += value;
	updateDisplay();
};

const clearAll = () => {
	expression = "";
	updateDisplay();
};

const deleteLast = () => {
	expression = expression.slice(0, -1);
	updateDisplay();
};

const toggleSign = () => {
	if (!expression) {
		expression = "-";
		updateDisplay();
		return;
	}

	const match = expression.match(/(.*?)(-?\d+\.?\d*)$/);
	if (!match) {
		return;
	}

	const [, before, number] = match;
	if (number.startsWith("-")) {
		expression = `${before}${number.slice(1)}`;
	} else {
		expression = `${before}-${number}`;
	}

	updateDisplay();
};

const calculate = () => {
	if (!expression) {
		return;
	}

	try {
		const sanitized = expression.replace(/%/g, "/100");
		// eslint-disable-next-line no-new-func
		const result = Function(`"use strict"; return (${sanitized})`)();
		expression = Number.isFinite(result) ? String(result) : "";
	} catch (error) {
		expression = "";
	}

	updateDisplay();
};

buttons.forEach((button) => {
	button.addEventListener("click", () => {
		const value = button.getAttribute("data-value");
		const action = button.getAttribute("data-action");

		if (value) {
			appendValue(value);
			return;
		}

		switch (action) {
			case "clear":
				clearAll();
				break;
			case "delete":
				deleteLast();
				break;
			case "toggle-sign":
				toggleSign();
				break;
			case "equals":
				calculate();
				break;
			default:
				break;
		}
	});
});

updateDisplay();
