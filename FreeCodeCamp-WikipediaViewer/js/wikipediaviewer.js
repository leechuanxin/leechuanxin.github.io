var searchBtn = document.getElementById('searchBtn');
var searchWrapper = document.querySelector('.search-wrapper');
var searchField = document.querySelector('.search-field');
var randomBtn = document.getElementById('randomBtn');
var closeBtn = document.getElementById('closeBtn');
var rowMove = document.querySelector('.row-move');
var linkBlocks = document.querySelectorAll('.link-block');
var inkDiameter = 0;

searchBtn.addEventListener('click', function(evt) {
	evt.preventDefault();

	var searchQuery = searchField.value;

	if (!searchWrapper.classList.contains('active')) {
		searchWrapper.className += ' ' + 'active';
	}

	if (searchQuery != '') {
		if (!rowMove.classList.contains('move')) {
			rowMove.className += ' ' + 'move';
		}

		$.getJSON('https://en.wikipedia.org/w/api.php?action=opensearch&prop=revisions&rvprop=content&format=json&limit=5&search=' + searchQuery + '&callback=?', function(data) {
			console.log('You searched ' + data[0]);
		});
	}
});

randomBtn.addEventListener('click', function(evt) {
	evt.preventDefault();

	window.open('https://en.wikipedia.org/wiki/Special:Random');
});

closeBtn.addEventListener('click', function(evt) {
	evt.preventDefault();

	searchField.value = '';

	searchWrapper.classList.remove('active');
});

for (var i = 0; i < linkBlocks.length; i++) {
	linkBlocks[i].addEventListener('click', function(evt) {
		var parent = this.parentNode;
		var ink = document.createElement('span');

		if (!ink.classList.contains('ink')) {
			ink.className += 'ink';
		}

		if (parent.querySelectorAll('.ink').length == 0) {
			parent.insertBefore(ink, parent.firstChild);
		}

		ink = parent.querySelector('.ink');

		if (ink.classList.contains('animate')) {
			ink.classList.remove('animate');
		}

		if (!Boolean(ink.style.height) && !Boolean(ink.style.width)) {
			inkDiameter = Math.max(parent.offsetWidth, parent.offsetHeight);
			ink.style.height = inkDiameter + 'px';
			ink.style.width = inkDiameter + 'px';
		}

		var xCoord = evt.pageX - (parent.getBoundingClientRect().left + document.body.scrollLeft) - inkDiameter / 2;
		var yCoord = evt.pageY - (parent.getBoundingClientRect().top + document.body.scrollTop) - inkDiameter / 2;

		ink.style.top = yCoord + 'px';
		ink.style.left = xCoord + 'px';

		if (!ink.classList.contains('animate')) {
			ink.className += ' ' + 'animate';
		}

		setTimeout(function(){
		    window.open('https://www.google.com');
		}, 600);
	});
}