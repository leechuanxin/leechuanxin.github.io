var searchBtn = document.getElementById('searchBtn');
var searchWrapper = document.querySelector('.search-wrapper');
var searchField = document.querySelector('.search-field');
var randomBtn = document.getElementById('randomBtn');
var closeBtn = document.getElementById('closeBtn');
var rowMove = document.querySelector('.row-move');

// var wikiScript = document.createElement('script');

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