const searchFieldEl = document.querySelector("#search-field");
const searchBtnEl = document.querySelector("#search-btn");
const weatherContentEl = document.querySelector("#weather-content");

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
						
					});
			} else {
				alert("Failed to get data from API");
			}
		});
};


// Display weather data for today
const currentWeather = data => {
	const weatherCard = document.createElement("div");
	weatherCard.classList = "card m-3";
	const cardContentEl = document.createElement("div");
	cardContentEl.classList = "card-body";
	cardContentEl.id = "today-content"
	const cardTitleEl = document.createElement("h5");
	cardTitleEl.classList = "card-title";
	cardTitleEl.textContent = data.name + " (" + moment().format("M/D/yyyy") + ")";
	const tempTextEl = document.createElement("p");
	tempTextEl.classList = "text-secondary";
	tempTextEl.textContent = "Temperature: " + data.main.temp + "°F";
	const humidityTextEl = document.createElement("p");
	humidityTextEl.classList = "text-secondary";
	humidityTextEl.textContent = "Humidity: " + data.main.humidity + "%";
	const windTextEl = document.createElement("p");
	windTextEl.classList = "text-secondary";
	windTextEl.textContent = "Wind Speed: " + data.wind.speed + " MPH";

	
	weatherContentEl.appendChild(weatherCard);
	weatherCard.appendChild(cardContentEl);
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


searchBtnEl.addEventListener("click", function() {
	event.preventDefault();
	
	weatherContentEl.innerHTML = "";

	const searchQuery = searchFieldEl.value;

	getWeather(searchQuery);

});