var container = document.querySelector('.container-fluid');
var searchBtn = document.getElementById('searchBtn');
var searchWrapper = document.querySelector('.search-wrapper');
var searchField = document.querySelector('.search-field');
var randomBtn = document.getElementById('randomBtn');
var closeBtn = document.getElementById('closeBtn');
var rowMove = document.querySelector('.row-move');
var rowError = document.querySelector('.row-error');
var inkDiameter = 0;

var timedRemoveSearchRow = function(node) {
	setTimeout(function(){
		node.parentNode.removeChild(node);
	}, 1000);
};

searchBtn.addEventListener('click', function(evt) {
	evt.preventDefault();

	// prevent multiple searches in a short time
	if (searchWrapper.classList.contains('active')) {
		this.disabled = true;
		setTimeout(function(){
			searchBtn.disabled = false;
		}, 1500);
	}

	// gradually remove previous search results
	var hideRows = document.querySelectorAll('.row-card');
	for (var a = 0; a < hideRows.length; a++) {
		hideRows[a].classList.remove('animated');
		hideRows[a].classList.remove('fadeIn');
		hideRows[a].className += ' animated fadeOut';

		timedRemoveSearchRow(hideRows[a]);
	}

	var searchQuery = encodeURIComponent(searchField.value);

	if (!searchWrapper.classList.contains('active')) {
		searchWrapper.className += ' ' + 'active';
	}

	if (searchQuery != '') {
		// temporarily disable close button
		closeBtn.disabled = true;
		setTimeout(function(){
			closeBtn.disabled = false;
		}, 1500);

		$.getJSON('https://en.wikipedia.org/w/api.php?action=opensearch&prop=revisions&rvprop=content&format=json&search=' + searchQuery + '&callback=?', function(data) {
			if (data[1].length == 0) {
				if (rowError.classList.contains('animated')) {
					rowError.classList.remove('animated');
					rowError.classList.remove('fadeIn');
					rowError.className += ' animated fadeOut';
				}

				if (searchWrapper.classList.contains('active')) {
					setTimeout(function(){
						if (rowError.classList.contains('animated')) {
							rowError.classList.remove('animated');
							rowError.classList.remove('fadeOut');
						}
						rowError.className += ' animated fadeIn';
						rowError.querySelector('.text-center').textContent = "Your search '" + data[0] + "' does not match any result.";
						rowError.style.display = 'block';
					}, 500);
				}
			}
			else {
				if (rowError.style.display == 'block') {
					rowError.classList.remove('animated');
					rowError.classList.remove('fadeIn');
					rowError.className += ' animated fadeOut';
					
					setTimeout(function() {
						rowError.style.display = 'none';
					}, 800);
				}

				if (!rowMove.classList.contains('move')) {
					rowMove.className += ' ' + 'move';
				}

				setTimeout(function(){
				    for (var j = 0; j < data[1].length; j++) {
						var newRow = document.createElement('div');
						newRow.className += 'row row-card fadeIn animated';
						newRow.innerHTML = '<div class="col-xs-8 col-xs-offset-2 col-md-6 col-md-offset-3">' + 
												'<div class="panel panel-default panel-search">' +
													'<div class="panel-color"></div>' + 
													'<div class="panel-heading">' +
														'<h2 class="panel-title">' + data[1][j] + '</h2>' +
														'<p class="panel-desc">' + ((data[2][j].split(" ").length > 20) ? data[2][j].split(" ").slice(0, 20).join(" ").concat("...") : data[2][j]) + '</p>' +
													'</div>' +
													'<div class="panel-body">' +
														'<div class="link-wrapper">' +
															'<a href="' + data[3][j] +'" class="link-block">READ</a>' +
														'</div>' +
													'</div>' +
												'</div>' +
											'</div>';
						container.appendChild(newRow);
						var linkBlock = newRow.querySelector('.link-block');

						linkBlock.addEventListener('click', function(evt) {
							evt.preventDefault();

							var url = this.href;
							var parent = this.parentNode;

							// initialise ink
							var ink = document.createElement('span');
							if (!ink.classList.contains('ink')) {
								ink.className += 'ink';
							}

							// if ink does not exist, create ink
							if (parent.querySelectorAll('.ink').length == 0) {
								parent.insertBefore(ink, parent.firstChild);
							}

							// select the present ink
							ink = parent.querySelector('.ink');

							// stop previous animation in case of quick double clicks
							if (ink.classList.contains('animate')) {
								ink.classList.remove('animate');
							}

							// set ink size, if its height and width are not already defined
							if (!Boolean(ink.style.height) && !Boolean(ink.style.width)) {
								inkDiameter = Math.max(parent.offsetWidth, parent.offsetHeight);
								ink.style.height = inkDiameter + 'px';
								ink.style.width = inkDiameter + 'px';
							}

							// get click coordinates
							var xCoord = evt.pageX - (parent.getBoundingClientRect().left + document.body.scrollLeft) - inkDiameter / 2;
							var yCoord = evt.pageY - (parent.getBoundingClientRect().top + document.body.scrollTop) - inkDiameter / 2;

							// set ink position and animate it
							ink.style.top = yCoord + 'px';
							ink.style.left = xCoord + 'px';
							if (!ink.classList.contains('animate')) {
								ink.className += ' ' + 'animate';
							}

							// new window opens after animation
							setTimeout(function(){
							    window.open(url);
							}, 450);
						});
					}
				}, 750);
			}
		});
	}
});

randomBtn.addEventListener('click', function(evt) {
	evt.preventDefault();

	window.open('https://en.wikipedia.org/wiki/Special:Random');
});

closeBtn.addEventListener('click', function(evt) {
	evt.preventDefault();

	if (rowError.style.display == 'block') {
		rowError.style.display = 'none';
	}

	searchField.value = '';

	searchWrapper.classList.remove('active');

	// gradually remove previous search results
	var hideRows = document.querySelectorAll('.row-card');
	for (var a = 0; a < hideRows.length; a++) {
		hideRows[a].classList.remove('animated');
		hideRows[a].classList.remove('fadeIn');
		hideRows[a].className += ' animated fadeOut';

		timedRemoveSearchRow(hideRows[a]);
	}

	// move search button back to center after closing animation
	setTimeout(function() {
		if (rowMove.classList.contains('move')) {
			rowMove.classList.remove('move');
		}
	}, 1000);

	// disable all buttons throughout closing animation
	// if the search button is already vertically centered,
	// buttons should only be disabled for a shorter time
	closeBtn.disabled = true;
	randomBtn.disabled = true;
	searchBtn.disabled = true;

	if (rowMove.classList.contains('move')) {
		setTimeout(function(){
			closeBtn.disabled = false;
			randomBtn.disabled = false;
			searchBtn.disabled = false;
		}, 2100);
	}
	else {
		setTimeout(function(){
			closeBtn.disabled = false;
			randomBtn.disabled = false;
			searchBtn.disabled = false;
		}, 800);
	}
});