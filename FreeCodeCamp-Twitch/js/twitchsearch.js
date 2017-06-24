'use strict';







var main = function() {
	// initialisation
	var streamArr = [
						"trick2g",
						"0gamingSC2",
						"asiagodtonegg3be0",
						"beyondthesummit",
						"forsenlol",
						"brunofin",
						"ProfessorBroman",
						"comster404",
						"TrumpSC",
						"markiplier",
						"cretetion",
						"twitchplayspokemon",
						"dansgaming",
						"syndicate",
						"kittyplays",
						"Gronkh",
						"montanablack88",
						"m0e_tv",
						"i_amwildcat",
						"tsm_wildturtle",
						"2mgovercsquared",
						"destiny",
						"monstercat",
						"yogscast",
						"froggen",
						"destructoid",
						"teamsp00ky",
						"dota2ti",
						"Cryaotic",
						"ESL_SC2",
						"esl_csgo",
						"tsm_theoddone",
						"faceittv",
						"nickbunyun",
						"tsm_bjergsen",
						"freecodecamp",
						"versuta",
						"legendarylea",
						"Tsm_dyrus",
						"GiantWaffle",
						"gamesdonequick",
						"xangold",
						"goldglove",
						"habathcx",
						"nadeshot",
						"bobross",
						"HiRezTV",
						"ignproleague",
						"imaqtpie",
						"towelliee",
						"izakooo",
						"joindotared",
						"kungentv",
						"lethalfrag",
						"Voyboy",
						"pewdiepie",
						"leveluplive",
						"lirik",
						"Joshog",
						"castro_1021",
						"mushisgosu",
						"nightblue3",
						"nl_kripp",
						"c9sneaky",
						"noobs2ninjas",
						"nick_28t",
						"OGNGlobal",
						"kinggothalion",
						"kittyplaysgames",
						"sivhd",
						"gassymexican",
						"swiftor",
						"kaypealol",
						"PhantomL0rd",
						"reckful",
						"RobotCaleb",
						"riotgames",
						"captainsparklez",
						"ungespielt",
						"shadbasemurdertv",
						"anomalyxd",
						"cohhcarnage",
						"smitegame",
						"wingsofdeath",
						"sodapoppin",
						"amazhs",
						"mlg",
						"starladder1",
						"iijeriichoii",
						"timthetatman",
						"storbeck",
						"omgitsfirefoxx",
						"Tsm_doublelift",
						"dreamhackcs",
						"summit1g",
						"pashabiceps",
						"doublelift",
						"taketv",
						"shroud",
						"flosd"
					];
	var contentContainer = document.querySelector('.mdl-layout__content');
	var onlineTab = document.getElementById('fixed-tab-1').querySelector('.mdl-grid');
	var offlineTab = document.getElementById('fixed-tab-2').querySelector('.mdl-grid');
	var allTab = document.getElementById('fixed-tab-3').querySelector('.mdl-grid');
	var searchField = document.querySelector('.mdl-textfield__input');
	var refreshButton = document.getElementById('refresh-button');
	var dialogOverlay = document.querySelector('.new-dialog__overlay');
	var dialog = document.getElementById('dialog');
	var refreshSlider = document.getElementById('refreshSlider');
	var timerValueDisplay = document.querySelector('.timer-value');
	var autoRefreshSnackbar = document.getElementById('autoRefreshSnackbar');
	var autoRefreshOn = 0;
	var timerValue = 15;
	// to be used as function for auto-refresh
	var executeAutoRefresh = 0;
	// to be used as function for auto-refresh countdown
	var executeAutoRefreshCountdown = 0;

	// function for hiding and showing relevant cards/cells
	var showHideCells = function() {
		var cards = contentContainer.querySelectorAll('.mdl-cell');
		var searchInput = searchField.value.replace(/[!@#\$%\^&\*\(\)\+=\{}\[\]\|\\;'"<>,.?/]/g, '').toLowerCase();

		for (var card = 0; card < cards.length; card++) {
			// show card/cell if search result matches a username or game
			if (cards[card].querySelector('.mdl-card__title-text').innerHTML.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0 ||
			   (cards[card].querySelector('p').classList.contains('mdl-card__game-text') && cards[card].querySelector('.mdl-card__game-text').innerHTML.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0)) {
				if (cards[card].classList.contains('hide')) {
					cards[card].classList.remove('hide');
				}
			}
			// hide card/cell, otherwise
			else {
				if (!cards[card].classList.contains('hide')) {
					cards[card].className += ' hide';
				}
			}
		}
	};

	// function for calling api and making promise
	var apiPromise = function(array) {
		var dataArr = [];

		for (var a in array) {
			dataArr.push(new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open('GET', 'https://api.twitch.tv/kraken/streams/' + streamArr[a] + '?&client_id=wb9yd7mh8pghumx24i8jppbyxonjac', true);

				request.onload = function() {
					if (request.status >= 200 && request.status < 400) {
						var data = JSON.parse(request.response);

						// pass in entire JSON response to then()
						resolve(data);
					}
				}

				request.send();
			}));
		}

		return dataArr;
	};

	// function for loading cards/cells
	var loadCells = function(promises) {
		// initialise necessary arrays
		var offlineArr = [];
		var onlineArr = [];
		var allArr = [];

		// sort results (username) in alphabetical order (ignoring cases)
		promises.sort(function(first, second) {
			if (first["_links"]["self"].slice(37).toLowerCase() < second["_links"]["self"].slice(37).toLowerCase()) {
				return -1;
			}
			else {
				return 1;
			}
		});

		// separate sorted results into online/offline
		for (var b in promises) {
			// offline
			if (promises[b]["stream"] == null) {
				offlineArr.push(promises[b]);
			}
			// online
			else {
				onlineArr.push(promises[b]);
			}
		}

		// re-combine online and offline users
		allArr.push(onlineArr);
		allArr.push(offlineArr);

		// load online users to online and all tabs
		for (var c in allArr[0]) {
			var allCard = document.createElement('div');
			allCard.className += 'mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone';
			allCard.innerHTML = '<div class="demo-card-wide mdl-card mdl-shadow--2dp">' +
									'<div class="mdl-card__title" style="background: url(' + allArr[0][c]["stream"]["preview"]["medium"] + '); background-size: cover">' +
										'<div class="card-overlay">' +
											'<h2 class="mdl-card__title-text">' + allArr[0][c]["stream"]["channel"]["display_name"] + '</h2>' +
										'</div>' +
									'</div>' +
									'<div class="mdl-card__supporting-text">' + 
										'<p class="mdl-card__game-text">' + allArr[0][c]["stream"]["game"] + '</p>' +
										'<p class="mdl-card__status-text">' + allArr[0][c]["stream"]["channel"]["status"] + '</p>' +
									'</div>' +
									'<div class="mdl-card__actions mdl-card--border">' +
										'<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" target="_blank" href="' + allArr[0][c]["stream"]["channel"]["url"] + '">' +
											'Watch Stream' +
										'</a>' +
									'</div>' +
									'<div class="mdl-card__status-wrapper">' +
										'<div class="mdl-status online">' +
										'</div>' +
									'</div>' +
								'</div>';

			var onlineCard = allCard.cloneNode(true);

			allTab.appendChild(allCard);
			onlineTab.appendChild(onlineCard);
		}

		// load offline users to offline and all tabs
		for (var d in allArr[1]) {
			var allCard = document.createElement('div');
			allCard.className += 'mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone';
			allCard.innerHTML = '<div class="demo-card-wide mdl-card mdl-shadow--2dp">' +
									'<div class="mdl-card__title" style="background: url(img/profile.png); background-size: cover">' +
										'<div class="card-overlay">' +
											'<h2 class="mdl-card__title-text">' + allArr[1][d]["_links"]["self"].slice(37) + '</h2>' +
										'</div>' +
									'</div>' +
									'<div class="mdl-card__supporting-text"><p>' +
										'This user is either offline or not currently streaming.' +
									'</p></div>' +
									'<div class="mdl-card__actions mdl-card--border">' +
										'<a class="mdl-button mdl-js-button" disabled>' +
											'Offline' +
										'</a>' +
									'</div>' +
									'<div class="mdl-card__status-wrapper">' +
										'<div class="mdl-status offline">' +
										'</div>' +
									'</div>' +
								'</div>';

			var offlineCard = allCard.cloneNode(true);

			allTab.appendChild(allCard);
			offlineTab.appendChild(offlineCard);
		}
	};

	// show auto-refresh timer value
	timerValueDisplay.innerHTML = timerValue + "s"

	// set every username to lowercase
	streamArr = streamArr.map(function(username) {
		return username.toLowerCase();
	});

	// load api and cards/cells
	Promise.all(apiPromise(streamArr)).then(function(result) {
		loadCells(result);
	});

	searchField.addEventListener("input", function() {
		showHideCells();
	});

	refreshButton.addEventListener("click", function() {
		var allCells = contentContainer.querySelectorAll('.mdl-cell');
		var currentInput = searchField.value.replace(/[!@#\$%\^&\*\(\)\+=\{}\[\]\|\\;'"<>,.?/]/g, '').toLowerCase();
		
		// delete all cards/cells
		for (var cell = 0; cell < allCells.length; cell++) {
			allCells[cell].parentNode.removeChild(allCells[cell]);
		}

		// load api and cards/cells, then hide/show relevant ones
		Promise.all(apiPromise(streamArr)).then(function(result) {
			loadCells(result);
		}).then(function() {
			showHideCells();
		});		
	});

	// for auto-refresh dialog
	document.getElementById('autorefresh-button').addEventListener('click', function() {
		var autoRefreshToggle = document.querySelector('.mdl-switch');
		// create overlay
		var overlay = document.createElement('div');
		overlay.className += 'new-dialog__overlay';
		document.querySelector('body').insertBefore(overlay, parent.firstChild);

		// IE bug - autoRefreshToggle may be on when it is not supposed to be when dialog is first loaded
		if (autoRefreshOn == 0 && autoRefreshToggle.classList.contains('is-checked')) {
    		autoRefreshToggle.classList.remove('is-checked');
    	}

		// show dialog
		if (!dialog.classList.contains('show')) {
			dialog.className += ' show';
		}
		
	});

    document.getElementById('dialog-cancel').addEventListener('click', function() {
    	var autoRefreshToggle = document.querySelector('.mdl-switch');
    	var overlay = document.querySelector('.new-dialog__overlay');
    	var isIE = window.navigator.userAgent.indexOf("MSIE ");
    	var sliderLower = document.querySelector('.mdl-slider__background-lower');
		var sliderUpper = document.querySelector('.mdl-slider__background-upper');

    	// close dialog
    	if (dialog.classList.contains('show')) {
			dialog.classList.remove('show');
		}

		// clear overlay
		overlay.parentNode.removeChild(overlay);

		// determine state of auto-refresh toggle when dialog is opened
    	if (autoRefreshOn == 1 && !autoRefreshToggle.classList.contains('is-checked')) {
    		autoRefreshToggle.className += (' is-checked');
    	}
    	else if (autoRefreshOn == 0 && autoRefreshToggle.classList.contains('is-checked')) {
    		autoRefreshToggle.classList.remove('is-checked');
    	}

    	// determine state of auto-refresh timer when closed
    	if (timerValue != refreshSlider.value) {
    		refreshSlider.value = timerValue;
    		timerValueDisplay.innerHTML = refreshSlider.value + "s";

    		// changing colors of markers on slider for non-ie browsers
    		if (!(/MSIE \d|Trident.*rv:/.test(navigator.userAgent))) {
	    		switch(parseInt(refreshSlider.value)) {
	    			case 15:
	    				if (!refreshSlider.classList.contains('is-lowest-value')) {
	    					refreshSlider.className += ' is-lowest-value';
	    				}
	    				sliderLower.style.flex = '0 1 0%';
	    				sliderUpper.style.flex = '1 1 0%';
	    				break;
	    			case 30:
	    				if (refreshSlider.classList.contains('is-lowest-value')) {
	    					refreshSlider.classList.remove('is-lowest-value');
	    				}
	    				sliderLower.style.flex = '0.333333 1 0%';
	    				sliderUpper.style.flex = '0.666667 1 0%';
	    				break;
	    			case 45:
	    				if (refreshSlider.classList.contains('is-lowest-value')) {
	    					refreshSlider.classList.remove('is-lowest-value');
	    				}
	    				sliderLower.style.flex = '0.666667 1 0%';
	    				sliderUpper.style.flex = '0.333333 1 0%';
	    				break;
	    			case 60:
	    				if (refreshSlider.classList.contains('is-lowest-value')) {
	    					refreshSlider.classList.remove('is-lowest-value');
	    				}
	    				sliderLower.style.flex = '1 1 0%';
	    				sliderUpper.style.flex = '0 1 0%';
	    				break;
	    		}
	    	}
    	}

    	// verify color of slider thumb (especially IE)
    	if (timerValue == 15 && !refreshSlider.classList.contains('is-lowest-value')) {
    		refreshSlider.className += ' is-lowest-value';
    	}
    	else if (timerValue > 15 && refreshSlider.classList.contains('is-lowest-value')) {
    		refreshSlider.classList.remove('is-lowest-value');
    	}
    });

    document.getElementById('dialog-okay').addEventListener('click', function() {
    	var autoRefreshToggle = document.querySelector('.mdl-switch');
    	var overlay = document.querySelector('.new-dialog__overlay');

    	// close dialog
    	if (dialog.classList.contains('show')) {
			dialog.classList.remove('show');
		}

		// clear overlay
		overlay.parentNode.removeChild(overlay);

    	// start new auto-refresh if there is a new timer value OR 
		// if autoRefresh is not previously switched on
		if ((timerValue != refreshSlider.value) || (autoRefreshToggle.classList.contains('is-checked') && autoRefreshOn == 0)) {
			// initialise countdown timer text
			var countdown = refreshSlider.value;

			// clear all previous intervals
			clearInterval(executeAutoRefresh);
    		clearInterval(executeAutoRefreshCountdown);

			if (autoRefreshSnackbar.classList.contains('hide')) {
				autoRefreshSnackbar.classList.remove('hide');
			}

			// add countdown timer text
			autoRefreshSnackbar.querySelector('.mdl-snackbar__text').innerHTML = 'Auto-refreshing in ' + countdown + ' seconds...';

			// execute countdown with decrements of countdown every second
			executeAutoRefreshCountdown = setInterval(function() {
				countdown -= 1;

				// resets to original countdown timer when hitting 0
				if (countdown == 0) {
					countdown = refreshSlider.value;		
				}

				autoRefreshSnackbar.querySelector('.mdl-snackbar__text').innerHTML = 'Auto-refreshing in ' + countdown + ((countdown == 1) ? ' second...' : ' seconds...');
			}, 1000);

			// execute auto refresh
			executeAutoRefresh = setInterval(function() {
    			var allCells = contentContainer.querySelectorAll('.mdl-cell');
				var currentInput = searchField.value.replace(/[!@#\$%\^&\*\(\)\+=\{}\[\]\|\\;'"<>,.?/]/g, '').toLowerCase();
		
				// delete all cards/cells
				for (var cell = 0; cell < allCells.length; cell++) {
					allCells[cell].parentNode.removeChild(allCells[cell]);
				}
    			
				Promise.all(apiPromise(streamArr)).then(function(result) {
					loadCells(result);
				}).then(function() {
					showHideCells();
				});
			}, refreshSlider.value * 1000);
		}

		// stop auto-refresh if auto-refresh toggle is no longer checked
    	if (!autoRefreshToggle.classList.contains('is-checked')) {
    		autoRefreshSnackbar.className += ' hide';
    		clearInterval(executeAutoRefresh);
    		clearInterval(executeAutoRefreshCountdown);
    	}

    	// save new state of auto-refresh toggle
    	if (autoRefreshToggle.classList.contains('is-checked')) {
    		autoRefreshOn = 1;
    	}
    	else {
    		autoRefreshOn = 0;
    	}

    	// save value of new auto-refresh timer
    	timerValue = refreshSlider.value;    	
    });

    refreshSlider.addEventListener('change', function() {
    	timerValueDisplay.innerHTML = refreshSlider.value + "s";
    });
};

main();