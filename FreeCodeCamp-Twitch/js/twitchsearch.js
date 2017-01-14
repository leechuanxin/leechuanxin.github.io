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
	var dataArr = [];
	var onlineArr = [];
	var offlineArr = [];
	var allArr = [];
	var contentContainer = document.querySelector('.mdl-layout__content');
	var onlineTab = document.getElementById('fixed-tab-1').querySelector('.mdl-grid');
	var offlineTab = document.getElementById('fixed-tab-2').querySelector('.mdl-grid');
	var allTab = document.getElementById('fixed-tab-3').querySelector('.mdl-grid');
	var searchField = document.querySelector('.mdl-textfield__input');

	// set every username to lowercase
	streamArr = streamArr.map(function(username) {
		return username.toLowerCase();
	});

	// push all promises (when resolving looped requests) to dataArr, for using Promise.all()
	for (var a in streamArr) {
		dataArr.push(new Promise((resolve, reject) => {
			var request = new XMLHttpRequest();
			request.open('GET', 'https://wind-bow.gomix.me/twitch-api/streams/' + streamArr[a], true);

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

	Promise.all(dataArr).then((result) => {
		// sort results (username) in alphabetical order (ignoring cases)
		result.sort(function(first, second) {
			if (first["_links"]["self"].slice(37).toLowerCase() < second["_links"]["self"].slice(37).toLowerCase()) {
				return -1;
			}
			else {
				return 1;
			}
		});

		// separate sorted results into online/offline
		for (var b in result) {
			// offline
			if (result[b]["stream"] == null) {
				offlineArr.push(result[b]);
			}
			// online
			else {
				onlineArr.push(result[b]);
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

		return allArr;

	}).then((array) => {
		searchField.addEventListener("input", function(event) {
			var cards = contentContainer.querySelectorAll('.mdl-cell');
			var searchInput = this.value.replace(/\W/g, '').toLowerCase();

			for (var card = 0; card < cards.length; card++) {
				// show card if search result matches a username or game
				if (cards[card].querySelector('.mdl-card__title-text').innerHTML.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0 ||
				   (cards[card].querySelector('p').classList.contains('mdl-card__game-text') && cards[card].querySelector('.mdl-card__game-text').innerHTML.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0)) {
					if (cards[card].classList.contains('hide')) {
						cards[card].classList.remove('hide');
					}
				}
				// hide card, otherwise
				else {
					if (!cards[card].classList.contains('hide')) {
						cards[card].className += ' hide';
					}
				}
			}
		});
	});
};

main();