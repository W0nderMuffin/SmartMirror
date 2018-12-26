// openweather API 2.5
var mEndpoint = 'http://api.openweathermap.org/data/2.5/weather?q=' + city +','+ country + '&units=metric&APPID=' + apiKey;

var mMonthNames = [ "Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni",
		"Juli", "August", "September", "Oktober", "November", "Dezember" ];
var mWeekNames = [ "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", 
		"Freitag", "Samstag" ];

var showComic = false;

var comicInterval = null;

function initialize() {
	shortloop();
	longloop();
	verylongloop();

	comicLoop();
	
	// Setup short refresh loop for 5 seconds
	setInterval(shortloop, 1000 * 5);
	// Setup short refresh loop for 5 minutes
	setInterval(longloop, 1000 * 60 * 5);
	// Setup comic refresh loop for 1 day
	setInterval(verylongloop, 1000 * 60 * 60 * 24);

	document.getElementById('city').innerHTML = city;
	document.getElementById('country').innerHTML = country;
}

function shortloop() {
	refreshDate();
}

function longloop() {
	refreshWeather();
}

function verylongloop() {
	refreshComic();
}

function comicLoop() {
	clearInterval(comicInterval);
	if(showComic){
		document.getElementById('comic').style.display = null;
		document.getElementById('dashboard').style.display = "none";
		showComic = false;
		comicInterval = setInterval(comicLoop, 1000 * 10);
	} else {
		document.getElementById('comic').style.display = "none";
		document.getElementById('dashboard').style.display = null;
		showComic = true;
		comicInterval = setInterval(comicLoop, 1000 * 15);
	}
}

function refreshWeather() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		   // Typical action to be performed when the document is ready:
		   var response = JSON.parse(xhttp.responseText);
		   var temperature = document.getElementById('temperature');
		   var icon = document.getElementById('weather_img');
		   temperature.innerHTML = Math.round(response.main.temp) + '&deg;';
		   var icon_text = '<img src="img/';
		   var icon_name = '';
		   var clouds = response.clouds.all;
		   // Respect sunrise-sunset
		   if (response.dt >= response.sys.sunrise && response.dt <= response.sys.sunset)
			   icon_name = 'sun';
		   else
			   icon_name = 'moon';
		   // Respect clouds
		   if (clouds >= 90)
			   icon_name = 'cloud';
		   else if (clouds > 50)
			   icon_name += '_cloud';
		   else if (clouds > 10)
			 icon_name += '_cloud_less';
		   // Respect rain and snow
		   if (response.rain != null && response.rain['1h'])
			   icon_name += '_rain';
		   else if (response.snow != null && response.snow['1h'])
			   icon_name += '_snow';
		   icon_text += icon_name + '.png"/>';
		   icon.innerHTML = icon_text;
		}
	};
	xhttp.open("GET", mEndpoint, true);
	xhttp.send();
}

function refreshDate() {
	var now = new Date();
	var time = document.getElementById('time');
	if (time != null) {
		var text = now.getHours() + ':' + now.getMinutes();
		if (now.getMinutes() < 10)
			text = now.getHours() + ':0' + now.getMinutes();
		time.innerHTML = text;
	}
	var date = document.getElementById('date');
	if (date != null) {
		date.innerHTML = mWeekNames[now.getDay()] + ', ' + now.getDate() + '. '
				+ mMonthNames[now.getMonth()];
	}
}

function refreshComic() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		   var response = JSON.parse(xhttp.responseText);
		   var comic = document.getElementById('comic');
		   var imageUrl = response.imgRetina ? response.imgRetina : response.img;
		   comic.style.backgroundImage = "url(" + imageUrl + ")";
		}
	};
	xhttp.open("GET", "https://xkcd.now.sh", true);
	xhttp.send();
}
