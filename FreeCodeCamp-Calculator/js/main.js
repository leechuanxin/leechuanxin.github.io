'use strict';


// Buttons
var buttons = (function() {
	// cache DOM
	var button = document.querySelectorAll('button');

	// bind click events
	for (var i = 0; i < button.length; i++) {
		var currentButton = button[i];
		var currentButtonText = currentButton.textContent;

		bindEvent(currentButton, 'click', buttonClickCallback(currentButtonText));
	}

	// bind events: inclusive of attachEvent for IE
	function bindEvent(el, eventName, eventHandler) {
		if (el.addEventListener) {
			el.addEventListener(eventName, eventHandler, false);
		}
		else if (el.attachEvent) {
			el.attachEvent('on' + eventName, eventHandler);
		}
	};

	// callback for click event handler
	function buttonClickCallback(buttonTextContent) {
		return function() {
			console.log(buttonTextContent);
			switch(buttonTextContent) {
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
					display.addInput(buttonTextContent);
			}
		};
	};
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
		divideByZeroWarning = 'Error: Divide by Zero'.toUpperCase(),
		maxDisplayLength = 12,
		maxNum = Math.pow(10, maxDisplayLength),
		minNum = -Math.pow(10, maxDisplayLength - 1);

	// init timeout
	var	inputWarningTimeout,
		answerWarningTimeout,
		divideByZeroTimeout;

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

		// if operator, clear the characters one at a time
		if (util.isDecimalPointOrNumberOrOperator(previousInput)) {
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
			trailingMinusRegex = new RegExp("(-{2,})", "g"),
			leadingZeroesBeforeNonZeroesRegex = new RegExp("^0+[1-9]|[^\\d.]0+[1-9]", "g"),
			leadingZeroesBeforeZeroesRegex = new RegExp("^0+|[^\\d.]0+", "g");

		// init replacer functions
		var trailingMinusReplacer = function(match) {
			return match.split('').join(' ');
		};
		var leadingZeroesBeforeNonZeroesReplacer = function(match) {
			var firstChar = match[0];
			var lastChar = match[match.length - 1];

			if (firstChar == '+' || firstChar == '-' || firstChar == 'x' || firstChar == '/') {
				return firstChar + lastChar;
			}
			
			return lastChar;
		};
		var leadingZeroesBeforeZeroesReplacer = function(match) {
			var firstChar = match[0];

			if (firstChar == '+' || firstChar == '-' || firstChar == 'x' || firstChar == '/') {
				return firstChar + "0";
			}
			
			return "0";
		};

		// replace all "ans", 'x', leading zeroes and trailing minuses
		var replacedInput =	inputText
							.replace(ansRegex, answerNum.toString())
							.replace(leadingZeroesBeforeNonZeroesRegex, leadingZeroesBeforeNonZeroesReplacer)
							.replace(leadingZeroesBeforeZeroesRegex, leadingZeroesBeforeZeroesReplacer)
							.replace(timesRegex, "*")
							.replace(trailingMinusRegex, trailingMinusReplacer);

		// init previous input
		var previousInput = replacedInput[replacedInput.length - 1];

		// evaluates only if last input entry is number
		if (util.isNumber(previousInput)) {
			// eval answer
			renderAnswer(eval(replacedInput));				
		}
	};

	// get answer text
	function getAnswerText() {
		return answerText;
	};

	// hide warning
	function hideWarning(element, elementDisplay, warning) {
		if (warning == 'divideByZero') {
			divideByZeroTimeout = setTimeout(function() {
				if (element.classList.contains('warning')) {
					element.classList.remove('warning');
				}

				element.textContent = elementDisplay;
			}, 1000);
		}
		else {
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
		}
	};

	// render answer
	function renderAnswer(num) {
		var	currentAnswerDisplay = answer.textContent,
			answerDisplayNum = (num == undefined) ? answerNum : num,
			answerDisplayStr = round(answerDisplayNum.toString()),
			isNextAnswerFinite = isFinite(Number(answerDisplayStr)),
			warningType = (!isNextAnswerFinite) ? 'divideByZero' : 'displayLimit';

		// show warning if max display length or min/max number reached or number is not finite
		if (answerDisplayStr.length <= maxDisplayLength && answerDisplayNum < maxNum && answerDisplayNum > minNum && isNextAnswerFinite) {
			answerNum = answerDisplayNum;
			answer.textContent = answerDisplayStr;

			// clear all input
			inputText = '';

			// set new calculation
			isEvaluated = true;

			renderInput();
		}
		else if (!answer.classList.contains('warning')) {
			showWarning(answer, currentAnswerDisplay, warningType);
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
			showWarning(input, currentInputDisplay, 'displayLimit');
		}
	};

	// round trailing decimal digits
	function round(str) {
		var	decimalPointIndex = str.indexOf('.'),
			divisionPow = 0,
			fractionalLeadingZeroesCount = 0,
			fractionalValue = str.split('.')[1],
			fractionalValueLength,
			integerValue = str.split('.')[0],
			integerValueLength = integerValue.length,
			fractionalExponentIndex,
			fractionalExponentValue,
			fractionalExponentValueLength,
			hasFractionalExponent,
			roundedFractionalValue,
			roundedFractionalValueArr,
			roundedFractionalValueLength,
			roundedNum = integerValue;

		if (decimalPointIndex > -1) {
			fractionalExponentIndex = fractionalValue.indexOf('e');
			fractionalExponentValue = fractionalValue.split('e')[1];
			hasFractionalExponent = (fractionalExponentIndex > -1);
			fractionalExponentValueLength = (hasFractionalExponent) ? fractionalExponentValue.length : 0;

			fractionalValue = (hasFractionalExponent) ? fractionalValue.split('e')[0] : fractionalValue;
			fractionalValueLength = fractionalValue.length;
			roundedFractionalValueLength = (hasFractionalExponent) ? (maxDisplayLength - 2 - integerValueLength - fractionalExponentValueLength) : (maxDisplayLength - 1 - integerValueLength),
			divisionPow = fractionalValueLength - roundedFractionalValueLength;

			// calculate number of leading zeroes
			for (var i = 0; fractionalValue[i] == '0'; i++) {
				fractionalLeadingZeroesCount += 1;
			}

			// round fractional value to its maximum length
			roundedFractionalValue = Math.round(Number(fractionalValue) / Math.pow(10, divisionPow)).toString();

			// re-add leading zeroes to rounded fractional value string
			for (var j = 0; j < fractionalLeadingZeroesCount; j++) {
				roundedFractionalValue = '0' + roundedFractionalValue;
			}

			// remove trailing zeroes
			for (var k = roundedFractionalValue.length - 1; roundedFractionalValue[k] == '0'; k--) {
				roundedFractionalValueArr = roundedFractionalValue.split('');
				roundedFractionalValueArr.pop();
				roundedFractionalValue = roundedFractionalValueArr.join('');
			}

			if (hasFractionalExponent) {
				roundedNum += ((roundedFractionalValue == '') ? '' : '.' + roundedFractionalValue) + 'e' + fractionalExponentValue;
			}
			else {
				roundedNum += (roundedFractionalValue == '') ? '' : '.' + roundedFractionalValue;
			}

			return roundedNum;
		}

		// return original string if no decimal point found
		return str;
	};

	// show warning
	function showWarning(element, elementDisplay, warning) {
		element.className += ' warning';

		if (warning == 'divideByZero') {
			clearTimeout(divideByZeroTimeout);

			element.textContent = divideByZeroWarning;
		}
		else {
			if (element.classList.contains('input')) {
				clearTimeout(inputWarningTimeout);

				input.textContent = limitWarning;
			}
			else {
				clearTimeout(answerWarningTimeout);

				answer.textContent = limitWarning;
			}
		}

		hideWarning(element, elementDisplay, warning);
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
	// checks if char is answer text
	function isAnswer(char) {
		return (char == display.getAnswerText());
	};

	// checks if char is answer or number or decimal point
	function isAnswerOrDecimalPointOrNumber(char) {
		return isAnswer(char) || isDecimalPointOrNumber(char);
	};

	// checks if char is decimal point
	function isDecimalPoint(char) {
		return (char == '.');
	};

	// checks if char is decimal point or number
	function isDecimalPointOrNumber(char) {
		return isDecimalPoint(char) || isNumber(char);
	};

	// checks if char is decimal point or number or operator
	function isDecimalPointOrNumberOrOperator(char) {
		return isDecimalPointOrNumber(char) || isOperator(char);
	};

	// checks if char is divide
	function isDivide(char) {
		return (char == '/');
	};

	// checks if char is minus
	function isMinus(char) {
		return (char == '-');
	};

	// checks if char is an operator, but not minus
	function isNotMinusOperator(char) {
		return isOperator(char) && !isMinus(char);
	};

	// checks if char is number
	function isNumber(char) {
		return !isNaN(Number(char));
	};

	// checks if char is plus
	function isPlus(char) {
		return (char == '+');
	};

	// checks if char is times
	function isTimes(char) {
		return (char == 'x');
	};

	// checks if char is operator
	function isOperator(char) {
		return isTimes(char) || isDivide(char) || isPlus(char) || isMinus(char);
	};

	return {
		isAnswer: isAnswer,
		isAnswerOrDecimalPointOrNumber: isAnswerOrDecimalPointOrNumber,
		isDecimalPoint: isDecimalPoint,
		isDecimalPointOrNumber: isDecimalPointOrNumber,
		isDecimalPointOrNumberOrOperator: isDecimalPointOrNumberOrOperator,
		isMinus: isMinus,
		isNotMinusOperator: isNotMinusOperator,
		isNumber: isNumber,
		isOperator: isOperator
	};
})();