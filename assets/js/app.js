const searchFieldEl = document.querySelector("#search-field");
const searchBtnEl = document.querySelector("#search-btn");
const weatherContentEl = document.querySelector("#weather-content");

const placeholder = "00";

// Get todays weather data based on search query
const getWeather = searchQuery => {
	fetch("http://api.openweathermap.org/data/2.5/weather?q=" + searchQuery + "&units=imperial&appid=1433428c54ebfc06c679ee5966e161bb")
		.then(function(response) {
			if (response.ok) {
				response.json()
					.then(function(data) {
						currentWeather(data);
						// get UV data
						fetch("http://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=1433428c54ebfc06c679ee5966e161bb")
							.then(function(response) {
								response.json()
									.then(function(data) {
										uvIndex(data);
									});
							});
						
						// get 5-day data
						fiveDay();
					});
			} else {
				alert("Failed to get data from API");
			}
		});
};


// Display weather data for today
const currentWeather = data => {
	const weatherCardEl = document.createElement("div");
	weatherCardEl.classList = "card mb-3";
	const cardContentEl = document.createElement("div");
	cardContentEl.classList = "card-body";
	cardContentEl.id = "today-content"
	const cardTitleEl = document.createElement("h4");
	cardTitleEl.classList = "card-title";
	cardTitleEl.textContent = data.name + " (" + moment().format("M/D/yyyy") + ")";
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
	cardContentEl.appendChild(tempTextEl);
	cardContentEl.appendChild(humidityTextEl);
	cardContentEl.appendChild(windTextEl);

};

// Display UV index for today
const uvIndex = data => {
	const uvTextEl = document.createElement("p");
	uvTextEl.classList = "text-secondary";
	uvTextEl.innerHTML = "UV Index: <span class='badge bg-danger'>" + data.value + "</span>";
	
	document.querySelector("#today-content").appendChild(uvTextEl);
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
		columnEl.classList = "col";
		const cardEl = document.createElement("div");
		cardEl.classList = "card bg-primary";
		const cardContentEl = document.createElement("div");
		cardContentEl.classList = "card-body";
		
		const dateEl = document.createElement("h5");
		dateEl.classList = "text-white";
		dateEl.textContent = moment().add(i + 1, "days").format("M/D/yyyy")
		const tempTextEl = document.createElement("p");
		tempTextEl.classList = "text-white";
		tempTextEl.textContent = "Temp: " + placeholder + " °F";
		const humidityTextEl = document.createElement("p");
		humidityTextEl.classList = "text-white";
		humidityTextEl.textContent = "Humidity: " + placeholder + "%";
		
		fiveDayRowEl.appendChild(columnEl);
		columnEl.appendChild(cardEl);
		cardEl.appendChild(cardContentEl);
		cardContentEl.appendChild(dateEl);
		cardContentEl.appendChild(tempTextEl);
		cardContentEl.appendChild(humidityTextEl);
	}
	
};

searchBtnEl.addEventListener("click", function() {
	event.preventDefault();
	
	weatherContentEl.innerHTML = "";

	const searchQuery = searchFieldEl.value;

	getWeather(searchQuery);

});