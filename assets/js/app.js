const searchFieldEl = document.querySelector("#search-field");
const searchBtnEl = document.querySelector("#search-btn");
const recentEl = document.querySelector("#recent-searches");
const weatherContentEl = document.querySelector("#weather-content");

let recentArr = [];

const pageLoad = function() {
	loadThis = localStorage.getItem("recentQueries");
	recentArr = JSON.parse(loadThis);
	if (recentArr) {
		recentSearches();
	} else {
		recentArr = [];
		return;
	}
};

// Get todays weather data based on search query
const getWeather = searchQuery => {
	fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchQuery + "&units=imperial&appid=1433428c54ebfc06c679ee5966e161bb")
		.then(function(response) {
			if (response.ok) {
				response.json()
					.then(function(data) {
						currentWeather(data);
						// get UV data
						fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=1433428c54ebfc06c679ee5966e161bb")
							.then(function(response) {
								response.json()
									.then(function(data) {
										uvIndex(data);
									});
							});
						// get 5-day data
						getFiveDay(data.coord.lat, data.coord.lon)
					});
			} else {
				alert("Failed to get data from API");
			}
		});
};

const getFiveDay = (lat, lon) => {
	fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly&units=imperial&appid=1433428c54ebfc06c679ee5966e161bb")
		.then(function(response) {
			response.json()
				.then(function(data) {
					fiveDay(data);
				});
		});
};

// Display weather data for today
const currentWeather = data => {
	weatherContentEl.innerHTML = "";
	
	console.log(data);
	
	const weatherCardEl = document.createElement("div");
	weatherCardEl.classList = "card mb-3";
	const cardContentEl = document.createElement("div");
	cardContentEl.classList = "card-body";
	cardContentEl.id = "today-content"
	const cardTitleEl = document.createElement("h4");
	cardTitleEl.classList = "card-title";
	cardTitleEl.textContent = data.name + " (" + moment().format("M/D/yyyy") + ") ";
	const iconEl = document.createElement("img");
	iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")
	const tempTextEl = document.createElement("p");
	tempTextEl.classList = "text-secondary";
	tempTextEl.textContent = "Temperature: " + data.main.temp + " °F";
	const humidityTextEl = document.createElement("p");
	humidityTextEl.classList = "text-secondary";
	humidityTextEl.textContent = "Humidity: " + data.main.humidity + "%";
	const windTextEl = document.createElement("p");
	windTextEl.classList = "text-secondary";
	windTextEl.textContent = "Wind Speed: " + data.wind.speed + " MPH";

	weatherContentEl.appendChild(weatherCardEl);
	weatherCardEl.appendChild(cardContentEl);
	cardContentEl.appendChild(cardTitleEl);
	cardTitleEl.appendChild(iconEl);
	cardContentEl.appendChild(tempTextEl);
	cardContentEl.appendChild(humidityTextEl);
	cardContentEl.appendChild(windTextEl);
};

// Display UV index for today
const uvIndex = data => {
	const uvTextEl = document.createElement("p");
	uvTextEl.classList = "text-secondary";
	uvTextEl.textContent = "UV Index: ";
	const uvBadge = document.createElement("span");
	uvBadge.textContent = data.value;
	if (data.value >= 8) {
		uvBadge.classList = "badge bg-danger"
	} else if (data.value <= 2) {
		uvBadge.classList = "badge bg-success"
	} else {
		uvBadge.classList = "badge bg-warning"
	}

	document.querySelector("#today-content").appendChild(uvTextEl);
	uvTextEl.appendChild(uvBadge);
};

// Display 5-day forcast
const fiveDay = data => {
	const fiveDayHeadingEl = document.createElement("h4");
	fiveDayHeadingEl.textContent = "5-Day Forcast:"
	const fiveDayRowEl = document.createElement("div");
	fiveDayRowEl.classList = "row";

	weatherContentEl.appendChild(fiveDayHeadingEl);
	weatherContentEl.appendChild(fiveDayRowEl);

	for (let i = 0; i < 5; i++) {
		const columnEl = document.createElement("div");
		columnEl.classList = "col-12 col-md p-1";
		const cardEl = document.createElement("div");
		cardEl.classList = "card bg-primary";
		const cardContentEl = document.createElement("div");
		cardContentEl.classList = "card-body";

		const dateEl = document.createElement("h5");
		dateEl.classList = "text-white";
		dateEl.textContent = moment()
			.add(i + 1, "days")
			.format("M/D/yyyy")
		const iconEl = document.createElement("img");
		iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png")
		const tempTextEl = document.createElement("p");
		tempTextEl.classList = "text-white";
		tempTextEl.textContent = "Temp: " + data.daily[i + 1].temp.day + " °F";
		const humidityTextEl = document.createElement("p");
		humidityTextEl.classList = "text-white";
		humidityTextEl.textContent = "Humidity: " + data.daily[i + 1].humidity + "%";

		fiveDayRowEl.appendChild(columnEl);
		columnEl.appendChild(cardEl);
		cardEl.appendChild(cardContentEl);
		cardContentEl.appendChild(dateEl);
		cardContentEl.appendChild(iconEl);
		cardContentEl.appendChild(tempTextEl);
		cardContentEl.appendChild(humidityTextEl);
	}
};

// Add last query to recents, display in order of most recent, and save to localStorage
const recentSearches = searchQuery => {
	recentEl.innerHTML = "";
	
	if (searchQuery) {
		recentArr.push(searchQuery);
	}

	if (recentArr.length > 5) {
		recentArr.shift();
	}
	
	recentArr.reverse();
	
	const listEl = document.createElement("ul");
	listEl.classList = "list-group mt-3";
	recentEl.appendChild(listEl);
	
	for (let i = 0; i < recentArr.length; i++) {
		const listItemEl = document.createElement("li");
		listItemEl.classList = "list-group-item list-group-item-action";
		listItemEl.textContent = recentArr[i];
		
		listEl.appendChild(listItemEl);
	}
	
	recentArr.reverse();
	
	const storeThis = JSON.stringify(recentArr);
	
	localStorage.setItem("recentQueries", storeThis);
	
};

pageLoad();

searchBtnEl.addEventListener("click", function() {
	event.preventDefault();
	const searchQuery = searchFieldEl.value;
	
	if (!searchQuery) {
		alert("Please enter a city or ZIP");
		searchFieldEl.focus();
		return;
	}
	
	searchFieldEl.value = "";
	recentSearches(searchQuery);
	getWeather(searchQuery);
});

recentEl.addEventListener("click", function() {
	getWeather(event.target.textContent)	
});


