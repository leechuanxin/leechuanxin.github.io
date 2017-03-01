'use strict';

// test 1.22 + 5.6 x 1.3
// test "x3"
// test "."
// test ".3"
// test "00000000"
// test "0/0"
// test "0.3 + 0.6"
// test "0.6 / 3"
// test "-3" right after hitting equal
// test "9 x -3"
// add replacer for trailing zeros
// add error notification for NaN and infinity

// "9 + 9 ="
// input display: ''
// 
// "."
// input display: '.'
// 

// "9 + 9 ="
// ans = 18
// "x"
// nothing happens
// 


var test;

// console.log(test == undefined);

// console.log(eval("1- - -  - - -1"));

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
	var	input = document.querySelector('.input'),
		answer = document.querySelector('.answer');

	// init variables
	var	inputText = '',
		answerNum = 0,
		answerText = 'ans'.toUpperCase(),
		isEvaluated = true,
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
		// init indexes
		var	previousInput = inputText[inputText.length - 1],
			divideLastIndex = inputText.lastIndexOf('/'),
			minusLastIndex = inputText.lastIndexOf('-'),
			plusLastIndex = inputText.lastIndexOf('+'),
			timesLastIndex = inputText.lastIndexOf('x'),
			operatorLastIndexArr = [divideLastIndex, minusLastIndex, plusLastIndex, timesLastIndex];

		// init basic conditions
		var	hasDecimalPointAfterLastOperator = (inputText.lastIndexOf('.') > Math.max.apply(null, operatorLastIndexArr)),
			isPreviousInputAnswer = (inputText.slice(inputText.length - answerText.length) == answerText);	
			
		// init complex conditions
		var	hasDigitAfterAnswer = isPreviousInputAnswer && util.isAnswerOrDecimalPointOrNumber(newInput),
			hasDigitBeforeAnswer = util.isAnswer(newInput) && (util.isDecimalPointOrNumber(previousInput) || isPreviousInputAnswer),
			displayAnswerBeforeMinus = util.isMinus(newInput) && (isEvaluated == true) && (answerNum != 0),
			hasMultipleDecimalPoints = util.isDecimalPoint(newInput) && hasDecimalPointAfterLastOperator,
			hasNotNumberAfterDecimalPoint = util.isDecimalPoint(previousInput) && !util.isNumber(newInput),
			hasOperatorAfterOperator = util.isOperator(previousInput) && util.isNotMinusOperator(newInput),
			rejectedConditions = hasDigitAfterAnswer || hasDigitBeforeAnswer || hasMultipleDecimalPoints || hasNotNumberAfterDecimalPoint || hasOperatorAfterOperator;

		// add 'ans' text for all operators (except minus)
		// if minus, add 'ans' if current answer != 0 and input has just been evaluated
		if (inputText == '') {
			if (util.isNotMinusOperator(newInput) || displayAnswerBeforeMinus) {
				renderInput(answerText + newInput);
			}
			else {
				renderInput(inputText + newInput);
			}
		}
		else if (!rejectedConditions) {
			renderInput(inputText + newInput);
		}
		
		// current input not evaluated yet; set isEvaluated to false
		isEvaluated = false;
	};

	// clear all
	function clearAll() {
		inputText = '';
		answerNum = 0;
		isEvaluated = true;

		renderInput();
		renderAnswer();
	};

	// clear entry
	function clearEntry() {
		var previousInput = inputText[inputText.length - 1];

		// if operator, clear it
		if (util.isOperator(previousInput)) {
			inputText = inputText.slice(0, inputText.length - 1);
		}
		// if not operator, clear its entire entry until next operator or empty string
		else {
			while (!util.isOperator(previousInput) && previousInput != undefined) {
				inputText = inputText.slice(0, inputText.length - 1);
				previousInput = inputText[inputText.length - 1];
			}
		}

		renderInput();
	};

	// equal
	function equal() {
		// init regex
		var	ansRegex = new RegExp("(" + answerText + ")", "g"),
			timesRegex = new RegExp("x", "g"),
			trailingMinusRegex = new RegExp("(-{2,})", "g");

		// init replacer functions
		var trailingMinusReplacer = function(match) {
			return match.split('').join(' ');
		};

		// replace all "ans" and 'x' and trailing minuses
		var tempInput = inputText.replace(ansRegex, answerNum.toString())
								 .replace(timesRegex, "*")
								 .replace(trailingMinusRegex, trailingMinusReplacer);

		// init previous input
		var previousInput = tempInput[tempInput.length - 1];

		// evaluates only if last input entry is number
		if (util.isNumber(previousInput)) {
			// eval answer
			renderAnswer(eval(tempInput).toString());

			// clear all input
			inputText = '';

			// set new calculation
			isEvaluated = true;

			renderInput();
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
		var	currentAnswerDisplay = answer.textContent,
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
		var	currentInputDisplay = input.textContent,
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

	// checks if string is answer or number or decimal point
	function isAnswerOrDecimalPointOrNumber(str) {
		return isAnswer(str) || isDecimalPoint(str) || isNumber(str);
	};

	// checks if string is decimal point
	function isDecimalPoint(str) {
		return (str == '.');
	};

	// checks if string is decimal point or number
	function isDecimalPointOrNumber(str) {
		return isDecimalPoint(str) || isNumber(str);
	};

	// checks if string is decimal point or operator
	function isDecimalPointOrOperator(str) {
		return isDecimalPoint(str) || isOperator(str);
	};

	// checks if string is divide
	function isDivide(str) {
		return (str == '/');
	};

	// checks if string is minus
	function isMinus(str) {
		return (str == '-');
	};

	// checks if string is an operator, but not minus
	function isNotMinusOperator(str) {
		return (isTimes(str) || isDivide(str) || isPlus(str));
	};

	// checks if string is number
	function isNumber(str) {
		return !isNaN(Number(str));
	};

	// checks if string is plus
	function isPlus(str) {
		return (str == '+');
	};

	// checks if string is times
	function isTimes(str) {
		return (str == 'x');
	};

	// checks if string is operator
	function isOperator(str) {
		return (isTimes(str) || isDivide(str) || isPlus(str) || isMinus(str));
	};

	return {
		isAnswer: isAnswer,
		isAnswerOrDecimalPointOrNumber: isAnswerOrDecimalPointOrNumber,
		isDecimalPoint: isDecimalPoint,
		isDecimalPointOrNumber: isDecimalPointOrNumber,
		isDecimalPointOrOperator: isDecimalPointOrOperator,
		isMinus: isMinus,
		isNotMinusOperator: isNotMinusOperator,
		isNumber: isNumber,
		isOperator: isOperator
	};
})();
	
