var colorPickerArr = [
	{ 
		"bgColor": "#f4f4f4",
		"borderVal": "5px solid #dcd0c0",
		"quoteColor": "#373737",
		"sourceColor": "#c0b283"
	},
	{ 
		"bgColor": "#4abdac",
		"borderVal": "5px solid #f7b733",
		"quoteColor": "#dfdce3",
		"sourceColor": "#f0f4c3"
	},
	{ 
		"bgColor": "#67aeca",
		"borderVal": "5px solid #e52a6f",
		"quoteColor": "#5f0f4e",
		"sourceColor": "#e0e0e0"
	},
	{ 
		"bgColor": "#0e0b16",
		"borderVal": "5px solid #4717f6",
		"quoteColor": "#e7dfdd",
		"sourceColor": "#a239ca"
	},
	{ 
		"bgColor": "#bfd8d2",
		"borderVal": "5px solid #dcb239",
		"quoteColor": "#df744a",
		"sourceColor": "#757575"
	},
	{ 
		"bgColor": "#cf6766",
		"borderVal": "5px solid #8eae8d",
		"quoteColor": "#031424",
		"sourceColor": "#30415d"
	},
	{ 
		"bgColor": "#6e3667",
		"borderVal": "5px solid #1a0315",
		"quoteColor": "#88d317",
		"sourceColor": "#e0e0e0",
	},
	{ 
		"bgColor": "#fedc3d",
		"borderVal": "5px solid #fea680",
		"quoteColor": "#000000",
		"sourceColor": "#01abaa"
	},
	{ 
		"bgColor": "#e7e8ed",
		"borderVal": "5px solid #c0b3a0",
		"quoteColor": "#3f3250",
		"sourceColor": "#e14658"
	},
	{ 
		"bgColor": "#f7f5e6",
		"borderVal": "5px solid #e8e8e8",
		"quoteColor": "#333a56",
		"sourceColor": "#52658f"
	}
];

var renderColor = function(arr, val) {
	$("body").css("background", arr[val]["bgColor"]);
	$("blockquote").css("border-left", arr[val]["borderVal"]);
	$("blockquote .small:before, blockquote footer:before, blockquote small:before").css("color",
		arr[val]["sourceColor"]);
	$("blockquote p").css("color", arr[val]["quoteColor"]);
	$("blockquote footer").css("color", arr[val]["sourceColor"]);
};

var checkForRepeat = function(randomisedNum, currNum, arr) {
	if (randomisedNum == currNum) {
		randomisedNum = (randomisedNum == arr.length - 1) ? 0 : randomisedNum + 1;
	}

	return randomisedNum;
};

var createTweet = function(quote, source) {
	var beforeTweet = '\"' + quote + '\"' + ' - ' + source;

	if (beforeTweet.length > 140) {
		quote = encodeURIComponent(quote.slice(0, quote.length - (beforeTweet.length - 140) - 3)).replace(/\'/g, "%27") + "...";
		return '\"' + quote + '\"' + ' - ' + source.replace(/\'/g, "%27");
	}
	else {
		return '\"' + encodeURIComponent(quote).replace(/\'/g, "%27") + '\"' + ' - ' + source.replace(/\'/g, "%27");
	}
};

$(document).ready(function() {
	var colorPicker = Math.floor(Math.random() * colorPickerArr.length);
	var quotePicker = -1;

	renderColor(colorPickerArr, colorPicker);

	$.getJSON("http://quotes.stormconsultancy.co.uk/quotes.json",
	function(a) {
		quotePicker = Math.floor(Math.random() * a.length);

		var twitQuote = a[quotePicker].quote;
		var twitSource = a[quotePicker].author;

		$("blockquote p").text(twitQuote);
		$("cite").text(twitSource);

		$("#tweetQuote").prop("href", "https://twitter.com/intent/tweet?text=" + createTweet(twitQuote, twitSource));

		$("#generateQuote").on("click", function() {
			var randomNum = Math.floor(Math.random() * colorPickerArr.length);
			var randomQuoteNum = Math.floor(Math.random() * a.length);

			// check if the current (randomised) color scheme and quote are the same as the previous
			// if true, select the next one (to avoid repeating)
			colorPicker = checkForRepeat(randomNum, colorPicker, colorPickerArr);
			quotePicker = checkForRepeat(randomQuoteNum, quotePicker, a);

			renderColor(colorPickerArr, colorPicker);

			twitQuote = a[quotePicker].quote;
			twitSource = a[quotePicker].author;

			$("blockquote p").text(twitQuote);
			$("cite").text(twitSource);


			$("#tweetQuote").prop("href", "https://twitter.com/intent/tweet?text=" + createTweet(twitQuote, twitSource));
		});
	});
});

