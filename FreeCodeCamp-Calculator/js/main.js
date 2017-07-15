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
				case "-":
					display.addEntry('\u2011');
					break;
				default:
					display.addEntry(buttonTextContent);
			}
		};
	};
})();


// Display
var display = (function() {
	// cache DOM
	var input = document.querySelector('.input').querySelector('span'),
	    answer = document.querySelector('.answer');

	// init variables
	var inputText = '',
	    answerNum = 0,
	    answerText = 'ans'.toUpperCase(),
	    isEvaluated = true,
	    displayLimitWarning = 'Error: Limit Reached'.toUpperCase(),
	    divideByZeroWarning = 'Error: Divide by Zero'.toUpperCase(),
	    maxAnswerLength = 12,
	    maxInputWidth = 209; // input limit determined by width in px, not number of chars

	// init timeout
	var displayLimitTimeout,
	    divideByZeroTimeout;

	// render
	renderAnswer();
	renderInput();

	// add input
	function addEntry(newInput) {
		// init indexes
		var previousInput = inputText[inputText.length - 1],
		    divideLastIndex = inputText.lastIndexOf('/'),
		    minusLastIndex = inputText.lastIndexOf('\u2011'),
		    plusLastIndex = inputText.lastIndexOf('+'),
		    timesLastIndex = inputText.lastIndexOf('x'),
		    operatorLastIndexArr = [divideLastIndex, minusLastIndex, plusLastIndex, timesLastIndex];

		// init basic conditions
		var hasDecimalPointAfterLastOperator = (inputText.lastIndexOf('.') > Math.max.apply(null, operatorLastIndexArr)),
		    isPreviousInputAnswer = (inputText.slice(inputText.length - answerText.length) == answerText);	
			
		// init complex conditions
		var hasDigitAfterAnswer = isPreviousInputAnswer && util.isAnswerOrDecimalPointOrNumber(newInput),
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
		var ansRegex = new RegExp("(" + answerText + ")", "g"),
		    timesRegex = new RegExp("x", "g"),
		    trailingMinusRegex = new RegExp("(\u2011{2,})", "g"),
		    leadingZeroesBeforeNonZeroesRegex = new RegExp("^0+[1-9]|[^\\d.]0+[1-9]", "g"),
		    leadingZeroesBeforeZeroesRegex = new RegExp("^0+|[^\\d.]0+", "g"),
		    minusRegex = new RegExp("\u2011", "g");

		// init replacer functions
		var trailingMinusReplacer = function(match) {
			return match.split('').join(' ');
		};
		var leadingZeroesBeforeNonZeroesReplacer = function(match) {
			var firstChar = match[0];
			var lastChar = match[match.length - 1];

			if (firstChar == '+' || firstChar == '\u2011' || firstChar == 'x' || firstChar == '/') {
				return firstChar + lastChar;
			}
			
			return lastChar;
		};
		var leadingZeroesBeforeZeroesReplacer = function(match) {
			var firstChar = match[0];

			if (firstChar == '+' || firstChar == '\u2011' || firstChar == 'x' || firstChar == '/') {
				return firstChar + "0";
			}
			
			return "0";
		};

		// replace all "ans", 'x', leading zeroes and trailing minuses
		var replacedInput = inputText
		                    .replace(ansRegex, answerNum.toString())
		                    .replace(leadingZeroesBeforeNonZeroesRegex, leadingZeroesBeforeNonZeroesReplacer)
		                    .replace(leadingZeroesBeforeZeroesRegex, leadingZeroesBeforeZeroesReplacer)
		                    .replace(timesRegex, "*")
		                    .replace(trailingMinusRegex, trailingMinusReplacer)
		                    .replace(minusRegex, "-");

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

	// hide warning (after timeout)
	function hideWarning(displayAfterWarning, warningType) {
		if (warningType == 'divideByZero') {
			divideByZeroTimeout = setTimeout(function() {
				if (answer.classList.contains('warning')) {
					answer.classList.remove('warning');
				}

				answer.textContent = displayAfterWarning;
			}, 1000);
		}
		else if (warningType == 'displayLimit') {
			displayLimitTimeout = setTimeout(function() {
				if (answer.classList.contains('warning')) {
					answer.classList.remove('warning');
				}

				answer.textContent = displayAfterWarning;
			}, 1000);
		}
	};

	// render answer
	function renderAnswer(num) {
		var currentAnswerDisplay = answer.textContent,
		    answerDisplayNum = (num == undefined) ? answerNum : num,
		    answerDisplayStr = round(answerDisplayNum.toString()), // round numbers with length > maxAnswerLength
		    isNextAnswerFinite = isFinite(Number(answerDisplayStr)),
		    warningType = (!isNextAnswerFinite) ? 'divideByZero' : 'displayLimit';

		// render input if number is finite; otherwise show warning
		if (isNextAnswerFinite) {
			answerNum = answerDisplayNum;
			answer.textContent = answerDisplayStr;

			// clear all input
			inputText = '';

			// set new calculation
			isEvaluated = true;

			renderInput();
		}
		else if (!answer.classList.contains('warning')) {
			showWarning(currentAnswerDisplay, inputText);
		}
	};

	// render input
	function renderInput(str) {
		// set inputText
		inputText = str || inputText;

		// render input.textContent with inputText
		input.textContent = inputText;

		// prepend ellipsis to input.textContent if input.textContent's width >= maxInputWidth
		if (input.offsetWidth > maxInputWidth) {
			input.textContent = '...' + inputText;

			// slice characters until input (with ellipsis) fits display
			for (var k = 1; input.offsetWidth > maxInputWidth; k++) {
				input.textContent = '...' + inputText.substring(k);
			}
		};
	};

	// round numbers with length > maxAnswerLength
	function round(str) {
		var hasDecimalPoint = (str.indexOf('.') > -1),
		    hasExpSign = (str.indexOf('e') > -1),
		    integerStr,
		    decimalStr,
		    decimalStrLeadingZeroesCount = 0,
		    roundedDecimalStr, // decimalStr after rounding, to be compared with decimalStr
		    expVal = 0, // initial and final exp val
		    addedExpVal, // exp value to add to initial exp value should str.length > maxAnswerLength
		    droppedCharCount = 0; // number of characters to drop after rounding

		// set decimalStr
		if (hasDecimalPoint) {
			if (hasExpSign) {
				decimalStr = str.split('.')[1].split('e')[0];
			}
			else {
				decimalStr = str.split('.')[1];
			}
		}

		// rounds if str.length > maxAnswerLength
		if (str.length > maxAnswerLength) {
			// set addedExpVal
			if (hasDecimalPoint && str.indexOf('-') != 0) { // all positve number str with decimal points including those with exp
				// decimal point will be newly placed next to first non-zero integer
				addedExpVal = str.indexOf('.') - 1;
			}
			else if (hasDecimalPoint) { // all negative number str with decimal points, including those with exp
				// deduct 1 more from new decimal point index because of negative sign
				addedExpVal = str.indexOf('.') - 1 - 1;
			}
			else if (str.indexOf('-') == 0) { // negative integers
				addedExpVal = str.length - 2;
			}
			else { // positive integers
				addedExpVal = str.length - 1;
			}

			// set integerStr
			integerStr = (Number(str) / Math.pow(10, addedExpVal)).toString().split('.')[0];

			// get exp val (if any) and set decimalStr
			if (hasExpSign) {
				expVal = (Number(str) / Math.pow(10, addedExpVal)).toString().split('.')[1].split('e')[1];
			}
			decimalStr = (Number(str) / Math.pow(10, addedExpVal)).toString().split('.')[1].split('e')[0];

			// set new exp val (from addedExpVal)
			expVal = (Number(expVal) + Number(addedExpVal)).toString();

			// add '+' sign to expVal, if not negative
			if (expVal[0] != '-') {
				expVal = '+' + expVal;
			}

			// determine number of chars to drop (from decimalStr)
			droppedCharCount = (integerStr + '.' + decimalStr + ((expVal[1] == '0') ? ('') : ('e' + expVal))).length 
			                   - maxAnswerLength;

			// round decimalStr (and drop chars)
			roundedDecimalStr = (Math.round(Number(decimalStr) / Math.pow(10, droppedCharCount))).toString();

			// determine number of leading zeroes in decimalStr
			for (var i = 0; decimalStr[i] == '0'; i++) {
				decimalStrLeadingZeroesCount += 1;
			}

			// re-add leading zeroes to roundedDecimalStr
			for (var j = 0; j < decimalStrLeadingZeroesCount; j++) {
				roundedDecimalStr = '0' + roundedDecimalStr;
			}

			// reset decimalStr after rounding
			// if there's carryover, drop all decimalStr char & increase integerStr by 1
			if (decimalStr[0] == '9' && roundedDecimalStr[0] == '1') {
				decimalStr = '';
				integerStr = (Number(integerStr) + 1).toString();
			}
			else {
				decimalStr = roundedDecimalStr;
			}

			// drop trailing zeroes from decimalStr
			while (decimalStr[decimalStr.length - 1] == '0') {
				decimalStr = decimalStr.split('');
				decimalStr.pop();
				decimalStr = decimalStr.join('');
			}

			// reset str
			str = integerStr 
			      + ((decimalStr == '') ? ('') : ('.' + decimalStr)) + ((Number(expVal) != 0) ? ('e' + expVal) : '');
		}

		return str;
	};

	// show warning
	function showWarning(displayAfterWarning, currentInput) {
		// init
		var divideByZeroRegex = /\/(\u2011)*(0*\.)*(0+[^0-9.]|0+$)/,
		    warningType = '';

		// add warning class
		answer.className += ' warning';

		// give divide-by-zero error if string matches regex
		if (divideByZeroRegex.test(currentInput)) {
			clearTimeout(divideByZeroTimeout);

			warningType = 'divideByZero';

			answer.textContent = divideByZeroWarning;
		}
		else {
			clearTimeout(displayLimitTimeout);

			warningType = 'displayLimit';

			answer.textContent = displayLimitWarning;
		}

		// hide warning (timeout in function)
		hideWarning(displayAfterWarning, warningType);
	};

	return {
		addEntry: addEntry,
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
		return (char == '\u2011');
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