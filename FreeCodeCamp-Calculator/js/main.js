'use strict';

// test 1.22 + 5.6 x 1.3

// Buttons
var buttons = (function() {
	// cache DOM
	var button = document.querySelectorAll('button');

	// bind events
	button.forEach(function(el) {
		el.addEventListener("click", function() {
			switch(el.textContent) {
				case "C":
					display.clearAll();
					break;
				case "CE":
					display.clearEntry();
					break;
				case "=":
					display.equal();
					break;
				default:
					display.addInput(el.textContent);
			}
		});
	});
})();


// Display
var display = (function() {
	// cache DOM
	var input = document.querySelector('.input'),
		answer = document.querySelector('.answer');

	// init variables
	var inputText = '',
		answerNum = 0,
		answerText = 'ans'.toUpperCase(),
		limitWarning = 'Limit Reached!'.toUpperCase(),
		maxDisplayLength = 12;

	// init timeout
	var inputWarningTimeout,
		answerWarningTimeout;

	// render
	renderAnswer();
	renderInput();

	// add input
	function addInput(newInput) {
		var previousInput = inputText[inputText.length - 1],
			divideLastIndex = inputText.lastIndexOf('/'),
			minusLastIndex = inputText.lastIndexOf('-'),
			plusLastIndex = inputText.lastIndexOf('+'),
			timesLastIndex = inputText.lastIndexOf('x'),
			operatorLastIndexArr = [divideLastIndex, minusLastIndex, plusLastIndex, timesLastIndex];

		// init basic conditions
		var hasDecimalPointAfterLastOperator = (inputText.lastIndexOf('.') > Math.max.apply(null, operatorLastIndexArr)),
			isDecimalPointOrOperator = function(str) {
				return util.isDecimalPoint(str) || util.isOperator(str);
			};
			
		// init complex conditions
		var digitAfterAnswer = util.isAnswer(inputText) && (util.isNumber(newInput) || util.isDecimalPoint(newInput)),
			multipleDecimalPoints = util.isDecimalPoint(newInput) && hasDecimalPointAfterLastOperator,
			notNumberAfterDecimalPoint = util.isDecimalPoint(previousInput) && !util.isNumber(newInput),
			notNumberBeforeDecimalPoint = isDecimalPointOrOperator(newInput) && isDecimalPointOrOperator(previousInput),
			operatorAfterOperator = util.isOperator(previousInput) && util.isOperator(newInput),
			rejectedConditions = digitAfterAnswer || multipleDecimalPoints || notNumberBeforeDecimalPoint || notNumberAfterDecimalPoint || operatorAfterOperator;

		if (!rejectedConditions) {
			renderInput(inputText + newInput);
		}
	};

	// clear all
	function clearAll() {
		inputText = '';
		answerNum = 0;

		renderInput();
		renderAnswer();
	};

	// clear entry
	function clearEntry() {
		inputText = inputText.slice(0, inputText.length - 1);
		renderInput();
	};

	// equal
	function equal() {
		var previousInput = inputText[inputText.length - 1];

		// evaluates only if last input entry is number or answer
		if (util.isNumber(previousInput) || util.isAnswer(inputText)) {
			var timesRegex = /x/g;

			// convert "ANS" string to actual number for calc
			if (inputText.indexOf(answerText) == 0) {
				inputText = answerNum.toString() + inputText.slice(answerText.length);
			}

			// evaluates answer from converted input text
			renderAnswer(eval(inputText.replace(timesRegex, "*")).toString());

			renderInput(answerText);
		}
	};

	// get answer text
	function getAnswerText() {
		return answerText;
	};

	// hide warning
	function hideWarning(element, elementDisplay) {
		if (element.classList.contains('input')) {
			inputWarningTimeout = setTimeout(function() {
				if (element.classList.contains('warning')) {
					element.classList.remove('warning');
				}

				input.textContent = elementDisplay;
			}, 1000);
		}
		else {
			answerWarningTimeout = setTimeout(function() {
				if (element.classList.contains('warning')) {
					element.classList.remove('warning');
				}

				answer.textContent = elementDisplay;
			}, 1000);
		}
	};

	// render answer
	function renderAnswer(str) {
		var currentAnswerDisplay = answer.textContent,
			nextAnswerDisplay = str || answerNum.toString();

		if (nextAnswerDisplay.length <= maxDisplayLength) {
			answerNum = Number(nextAnswerDisplay);
			answer.textContent = nextAnswerDisplay;
		}
		else if (!answer.classList.contains('warning')) {
			showWarning(answer, currentAnswerDisplay);
		}
	};

	// render input
	function renderInput(str) {
		var currentInputDisplay = input.textContent,
			nextInputDisplay = str || inputText;

		if (nextInputDisplay.length <= maxDisplayLength) {
			inputText = nextInputDisplay;
			input.textContent = inputText;
		}
		else if (!input.classList.contains('warning')) {
			showWarning(input, currentInputDisplay);
		}
	};

	// show warning
	function showWarning(element, elementDisplay) {
		element.className += ' warning';

		if (element.classList.contains('input')) {
			clearTimeout(inputWarningTimeout);

			input.textContent = limitWarning;
		}
		else {
			clearTimeout(answerWarningTimeout);

			answer.textContent = limitWarning;
		}

		hideWarning(element, elementDisplay);
	};

	return {
		addInput: addInput,
		clearEntry: clearEntry,
		clearAll: clearAll,
		equal: equal,
		getAnswerText: getAnswerText
	};
})();


// Utility 
var util = (function() {
	// checks if string is answer text
	function isAnswer(str) {
		return (str == display.getAnswerText());
	};

	// checks if string is decimal point
	function isDecimalPoint(str) {
		return (str == '.');
	};

	// checks if string is number
	function isNumber(str) {
		return !isNaN(Number(str));
	};

	// checks if string is operator
	function isOperator(str) {
		return (str == 'x' || str == '/' || str == '+' || str == '-');
	};

	return {
		isAnswer: isAnswer,
		isDecimalPoint: isDecimalPoint,
		isNumber: isNumber,
		isOperator: isOperator
	};
})();
	
