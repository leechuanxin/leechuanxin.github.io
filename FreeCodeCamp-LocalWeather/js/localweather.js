var quoteArr = [
	{
		"quote": "I go where the sound of thunder is.",
		"source": "Alfred M. Gray"
	},
	{
		"quote": "It is not light that we need, but fire; it is not the gentle shower, but thunder. We need the storm, the whirlwind, and the earthquake.",
		"source": "Frederick Douglass"
	},
	{
		"quote": "They say marriages are made in Heaven. But so is thunder and lightning.",
		"source": "Clint Eastwood"
	},
	{
		"quote": "Thunder is good, thunder is impressive; but it is lightning that does the work.",
		"source": "Mark Twain"
	},
	{
		"quote": "The sound of 'gentle stillness' after all the thunder and wind have passed will the ultimate Word from God.",
		"source": "Jim Elliot"
	},
	{
		"quote": "Life is full of beauty. Notice it. Notice the bumble bee, the small child, and the smiling faces. Smell the rain, and feel the wind. Live your life to the fullest potential, and fight for your dreams.",
		"source": "Ashley Smith"
	},
	{
		"quote": "Like a welcome summer rain, humor may suddenly cleanse and cool the earth, the air and you.",
		"source": "Langston Hughes"
	},
	{
		"quote": "The way I see it, if you want the rainbow, you gotta put up with the rain.",
		"source": "Dolly Parton"
	},
	{
		"quote": "Tears of joy are like the summer rain drops pierced by sunbeams.",
		"source": "Hosea Ballou"
	},
	{
		"quote": "I don't consider myself a pessimist. I think of a pessimist as someone who is waiting for it to rain. And I feel soaked to the skin.",
		"source": "Leonard Cohen"
	},
	{
		"quote": "We build statues out of snow, and weep to see them melt.",
		"source": "Walter Scott"
	},
	{
		"quote": "Snow provokes responses that reach right back to childhood.",
		"source": "Andy Goldsworthy"
	},
	{
		"quote": "A lot of people like snow. I find it to be an unnecessary freezing of water.",
		"source": "Carl Reiner"
	},
	{
		"quote": "Snow and adolescence are the only problems that disappear if you ignore them long enough.",
		"source": "Earl Wilson"
	},
	{
		"quote": "This morning of the small snow I count the blessings, the leak in the faucet which makes of the sink time",
		"source": "Charles Olson"
	},
	{
		"quote": "The farther reason looks the greater is the haze in which it loses itself.",
		"source": "Johann Georg Hamann"
	},
	{
		"quote": "Romance is the glamour which turns the dust of everyday life into a golden haze.",
		"source": "Carolyn Gold Heilbrun"
	},
	{
		"quote": "Derive happiness in oneself from a good day's work, from illuminating the fog that surrounds us.",
		"source": "Henri Matisse"
	},
	{
		"quote": "Walk on a rainbow trail; walk on a trail of song, and all about you will be beauty. There is a way out of every dark mist, over a rainbow trail.",
		"source": "Robert Motherwell"
	},
	{
		"quote": "All action takes place, so to speak, in a kind of twilight, which like a fog or moonlight, often tends to make things seem grotesque and larger than they really are.",
		"source": "Carl von Clausewitz"
	},
	{
		"quote": "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.",
		"source": "Jimmy Dean"
	},
	{
		"quote": "The pessimist complains about the wind; the optimist expects it to change; the realist adjusts the sails.",
		"source": "William Arthur Ward"
	},
	{
		"quote": "If you reveal your secrets to the wind, you should not blame the wind for revealing them to the trees.",
		"source": "Khalil Gibran"
	},
	{
		"quote": "The fragrance of flowers spreads only in the direction of the wind. But the goodness of a person spreads in all directions.",
		"source": "Chanakya"
	},
	{
		"quote": "Kites rise highest against the wind - not with it.",
		"source": "Winston Churchill"
	},
	{
		"quote": "Your vision will become clear only when you can look into your own heart. Who looks outside, dreams; who looks inside, awakes.",
		"source": "Carl Jung"
	},
	{
		"quote": "For every complex problem there is an answer that is clear, simple, and wrong.",
		"source": "H. L. Mencken"
	},
	{
		"quote": "When your values are clear to you, making decisions becomes easier.",
		"source": "Roy E. Disney"
	},
	{
		"quote": "The trouble with lying and deceiving is that their efficiency depends entirely upon a clear notion of the truth that the liar and deceiver wishes to hide.",
		"source": "Hannah Arendt"
	},
	{
		"quote": "If you have God on your side, everything becomes clear.",
		"source": "Ayrton Senna"
	},
	{
		"quote": "Above the cloud with its shadow is the star with its light. Above all things reverence thyself.",
		"source": "Pythagoras"
	},
	{
		"quote": "Heavy hearts, like heavy clouds in the sky, are best relieved by the letting of a little water.",
		"source": "Christopher Morley"
	},
	{
		"quote": "Try to be a rainbow in someone's cloud.",
		"source": "Maya Angelou"
	},
	{
		"quote": "Happiness is like a cloud, if you stare at it long enough, it evaporates.",
		"source": "Sarah McLachlan"
	},
	{
		"quote": "Every cloud has its silver lining but it is sometimes a little difficult to get it to the mint.",
		"source": "Don Marquis"
	}
];

console.log(quoteArr.length);

$(document).ready(function() {
	$.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(geoData) {
		var currLat = geoData.geoplugin_latitude;
		var currLong = geoData.geoplugin_longitude;

		$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + currLat.toString() + '&lon=' +
		currLong.toString() + '&appid=151dc0526d32096987fa829bc9c642ce', function(weatherData) {
			var weatherID = weatherData.weather[0].id;
			var weatherSign = weatherData.weather[0].icon;
			var weatherTime = weatherSign.split("").splice(weatherSign.length - 1, 1);
			var temperatureCelsius = Math.round(weatherData.main.temp - 273.15);
			var temperatureFahrenheit = Math.round((weatherData.main.temp - 273.15) * (9 / 5) + 32);
			var tempMode = "C";

			var randNum = Math.floor(Math.random() * 5);
			var quoteNum = 0;

			$('#cityCountry').text(weatherData.name + ', ' + weatherData.sys.country);
			$('#weatherTemperature').html(temperatureCelsius.toString() + '&deg;C');
			$('#weatherText').text(weatherData.weather[0].description.replace(/(^| )[a-z]/g, (L) => L.toUpperCase()).replace("With", "with"));

			switch(weatherID) {
				case 200:
				case 201:
				case 202:
				case 210:
				case 211:
				case 212:
				case 221:
				case 230:
				case 231:
				case 232:
				case 901:
				case 960:
				case 961:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/thunderstorm.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/thunderstorm.jpg")',
						'background-size': 'cover'
					});

					document.getElementById('bgVid').playbackRate = 2;

					if (weatherTime == "n") {
						$('#weatherIcon').attr('class', 'wi wi-night-alt-thunderstorm');
					}
					else {
						$('#weatherIcon').attr('class', 'wi wi-day-thunderstorm');
					}

					quoteNum = randNum;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="http://www.beachfrontbroll.com/2014/12/FreeLightningStockFootage.html" target="_blank">Beachfront B-Roll</a>.');
					break;
				case 300:
				case 301:
				case 302:
				case 310:
				case 311:
				case 312:
				case 313:
				case 314:
				case 321:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/drizzle.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/drizzle.jpg")',
						'background-size': 'cover'
					});

					if (weatherTime == "n") {
						$('#weatherIcon').attr('class', 'wi wi-night-alt-showers');
					}
					else {
						$('#weatherIcon').attr('class', 'wi wi-day-showers');
					}

					quoteNum = randNum + 5;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="http://www.lifeofvids.com/gallery/window-reflection/" target="_blank">Life Of Vids</a>.');
					break;
				case 500:
				case 501:
				case 502:
				case 503:
				case 504:
				case 511:
				case 520:
				case 521:
				case 522:
				case 531:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/rain.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/rain.jpg")',
						'background-size': 'cover'
					});

					if (weatherTime == "n") {
						$('#weatherIcon').attr('class', 'wi wi-night-alt-rain');
					}
					else {
						$('#weatherIcon').attr('class', 'wi wi-day-rain');
					}

					quoteNum = randNum + 5;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="https://www.videezy.com/nature/2403-rain-on-a-window-hd-stock-video" target="_blank">bk-vids</a>.');
					break;
				case 600:
				case 601:
				case 611:
				case 612:
				case 615:
				case 616:
				case 620:
				case 621:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/lightsnow.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/lightsnow.jpg")',
						'background-size': 'cover'
					});

					if (weatherTime == "n") {
						$('#weatherIcon').attr('class', 'wi wi-night-alt-snow');

						if (weatherID == 611 || weatherID == 612) {
							$('#weatherIcon').attr('class', 'wi wi-night-alt-sleet');
						}
					}
					else {
						$('#weatherIcon').attr('class', 'wi wi-day-snow');

						if (weatherID == 611 || weatherID == 612) {
							$('#weatherIcon').attr('class', 'wi wi-day-sleet');
						}
					}

					quoteNum = randNum + 10;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="https://pixabay.com/en/videos/snowing-snowfall-light-lamp-1972/" target="_blank">mploscar</a>.');
					break;
				case 602:
				case 622:
				case 906:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/snowstorm.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/snowstorm.jpg")',
						'background-size': 'cover'
					});

					if (weatherTime == "n") {
						$('#weatherIcon').attr('class', 'wi wi-night-alt-snow-thunderstorm');
					}
					else {
						$('#weatherIcon').attr('class', 'wi wi-day-snow-thunderstorm');
					}

					quoteNum = randNum + 10;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="https://pixabay.com/en/videos/snow-flurry-snowfall-snow-2502/" target="_blank">SlowMoJoe</a>.');
					break;
				case 701:
				case 711:
				case 721:
				case 731:
				case 741:
				case 751:
				case 761:
				case 762:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/mist.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/mist.jpg")',
						'background-size': 'cover'
					});

					if (weatherID == 701 || weatherID == 721 || weatherID == 741) {
						$('#weatherIcon').attr('class', 'wi wi-fog');
					}
					else if (weatherID == 711) {
						$('#weatherIcon').attr('class', 'wi wi-smoke');
					}
					else {
						$('#weatherIcon').attr('class', 'wi wi-dust');
					}

					quoteNum = randNum + 15;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="http://www.lifeofvids.com/gallery/haze/" target="_blank">Life Of Vids</a>.');
					break;
				case 952:
				case 953:
				case 954:
				case 955:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/breeze.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/breeze.jpg")',
						'background-size': 'cover'
					});

					if (weatherTime == "n") {
						$('#weatherIcon').attr('class', 'wi wi-night-alt-cloudy-windy');
					}
					else {
						$('#weatherIcon').attr('class', 'wi wi-day-light-wind');
					}

					quoteNum = randNum + 20;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="https://pixabay.com/en/videos/lotus-lotus-anapji-anapji-flowers-1977/" target="_blank">Free World</a>.');
					break;
				case 771:
				case 781:
				case 900:
				case 902:
				case 905:
				case 956:
				case 957:
				case 958:
				case 959:
				case 962:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/wind.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/wind.jpg")',
						'background-size': 'cover',
						'opacity': '0.3'
					});

					$('#bgVid').css('opacity', '0.3');

					if (weatherTime == "n") {
						$('#weatherIcon').attr('class', 'wi wi-night-alt-cloudy-gusts');
					}
					else {
						$('#weatherIcon').attr('class', 'wi wi-day-cloudy-gusts');
					}

					if (weatherID == 781 || weatherID == 900) {
						$('#weatherIcon').attr('class', 'wi wi-tornado');
					}
					else if (weatherID == 902 || weatherID == 962) {
						$('#weatherIcon').attr('class', 'wi wi-hurricane');
					}

					quoteNum = randNum + 20;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="http://www.lifeofvids.com/gallery/blown-leaves-asphalt/" target="_blank">Life Of Vids</a>.');
					break;
				case 800:
				case 903:
				case 904:
				case 951:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/clearsky.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/clearsky.jpg")',
						'background-size': 'cover'
					});

					if (weatherTime == "n") {
						$('#weatherIcon').attr('class', 'wi wi-night-clear');
					}
					else {
						$('#weatherIcon').attr('class', 'wi wi-day-sunny');
					}

					quoteNum = randNum + 25;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="https://pixabay.com/en/videos/eagle-landing-catching-slow-motion-748/" target="_blank">Vimeo-Free-Videos</a>.');
					break;
				case 801:
				case 802:
				case 803:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/fewclouds.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/fewclouds.jpg")',
						'background-size': 'cover'
					});

					if (weatherTime == "n") {
						$('#weatherIcon').attr('class', 'wi wi-night-alt-cloudy');
					}
					else {
						$('#weatherIcon').attr('class', 'wi wi-day-cloudy');
					}

					quoteNum = randNum + 30;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="http://www.lifeofvids.com/gallery/automnal-sky-motion/" target="_blank">Life Of Vids</a>.');
					break;
				case 804:
					$('#loadVid').attr({
						src: 'https://github.com/leechuanxin/leechuanxin.github.io/raw/master/FreeCodeCamp-LocalWeather/videos/overcastclouds.mp4',
						type: 'video/mp4'
					});

					$('#bgPhoto').css({
						'background': 'url("img/overcastclouds.jpg")',
						'background-size': 'cover'
					});

					$('#weatherIcon').attr('class', 'wi wi-cloudy');

					quoteNum = randNum + 30;

					$('#attrHolder').css('display', 'block');
					$('#attribution').html('The original video/photo is by <a href="https://www.videezy.com/clouds/2302-storm-clouds-time-lapse-free-footage" target="_blank">orangehd</a>. <a href="http://www.videezy.com" target="_blank">Free Stock Videos by Videezy!</a>');
					break;
			}

			$('#bgVid')[0].load();

			$('#weatherQuote').text(quoteArr[quoteNum]["quote"]);
			$('#weatherSource').text(quoteArr[quoteNum]["source"]);
			$('blockquote').attr('class', 'add-punctuation');

			$('#changeTempMode').on('click', function() {
				if (tempMode == "C") {
					$('#weatherTemperature').html(temperatureFahrenheit.toString() + '&deg;F');
					$('#changeTempMode').html('<i class="wi wi-thermometer"></i>&nbsp;&nbsp;Celsius');
					tempMode = "F";
				}
				else {
					$('#weatherTemperature').html(temperatureCelsius.toString() + '&deg;C');
					$('#changeTempMode').html('<i class="wi wi-thermometer"></i>&nbsp;&nbsp;Fahrenheit');
					tempMode = "C";
				}
			});
		});
	});
});