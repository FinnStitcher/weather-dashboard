var appId = "39a500d5662d1686e6e49030185b149b";

// this stuff needs to be accessed in multiple functions
var emojis = {
    "01": "☀️",
    "02": "🌤️",
    "03": "⛅",
    "04": "☁️",
    "09": "🌧️",
    "10": "🌧️",
    "11": "🌩️",
    "13": "❄️",
    "50": "🌫️",
};
var searchHistory = null;
var city = null;
var state = null;

$("#search-form").on("submit", function(event) {
    event.preventDefault();

    // store searchValue in global variables so it can be accessed elsewhere
    var searchValue = $("#search-input").val();
    searchHistory.unshift(searchValue);
    city = searchValue;

    if (!searchValue) {
        alert("Please enter the name of a city.");
        return false;
    };

    createGeoLink(searchValue);

    localStorage.setItem("weatherdashboard", JSON.stringify(searchHistory));

    $("#search-input").val("");
});

$("#search-history").on("click", "button", function(event) {
    var searchValue = $(this).text();
    city = searchValue;

    createGeoLink(searchValue);
});

var createGeoLink = function(searchedCity) {
    searchedCity = searchedCity.replace(" ", "-").toLowerCase();
    var geoEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${searchedCity},US&appid=${appId}`;

    getCoordinates(geoEndpoint);
};

var getCoordinates = function(url) {
    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        state = data[0].state;
        var latitude = data[0].lat;
        var longitude = data[0].lon;

        var weatherEndpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=imperial&appid=${appId}`;

        // displaySearch() is here because this code only runs if the input was valid
        // this way bad searches dont end up in the DOM
        // also avoids good searches being cut out of the history due to a bad one
        getWeather(weatherEndpoint);
        displaySearch();
    })
    .catch((error) => {
        var errorMessage = error.message;
        if (errorMessage.indexOf("NetworkError") !== -1) {
            alert("There was a network error and your request could not be fulfilled. Try again later.");
        } else {
            alert("No data could be found. Either the city you looked up has no data, does not exist, or is not in the United States.");
        };
        // remove bad value from global variables
        searchHistory.shift();
        city = null;
    });
};

var getWeather = function(url) {
    fetch(url)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        displayCurrentWeather(data.current);
        displayForecast(data.daily)
    });
};

var displayCurrentWeather = function(currentData) {
    // change header
    var today = moment().format("MM/DD/YYYY");
    var weatherIconCode = currentData.weather[0].icon.slice(0, 2);

    $("#current-header").text(`
        ${city}, ${state} (${today}) ${emojis[weatherIconCode]}
    `);

    // change text
    $("#curTemp").text(`Temp: ${currentData.temp}° F`);
    $("#curWind").text(`Wind: ${currentData.wind_speed} mph`);
    $("#curHumidity").text(`Humidity: ${currentData.humidity}%`);

    // change uv
    var uvNum = currentData.uvi;
    var uvSpanEl = $("<span>").addClass("uv-index").text(uvNum);
    if (uvNum <= 2) {
        uvSpanEl.addClass("uv-low")
    } else if (uvNum <= 5) {
        uvSpanEl.addClass("uv-med")
    } else if (uvNum <= 7) {
        uvSpanEl.addClass("uv-high")
    } else if (uvNum <= 10) {
        uvSpanEl.addClass("uv-v-high")
    } else {
        uvSpanEl.addClass("uv-extreme")
    };

    $("#curUV span").remove();
    $("#curUV").append(uvSpanEl);
};

var displayForecast = function(futureData) {
    var forecast = futureData.slice(0, 5);
    var forecastRowEl = $("#forecast-row");

    // remove old data
    forecastRowEl.children().remove();

    for (var i = 0; i < forecast.length; i++){
        // create formatted date
        var date = moment().add(i + 1, 'days').format("MM/DD/YYYY");

        // get weather icon code
        var weatherIconCode = forecast[i].weather[0].icon.slice(0, 2);

        // create div for the content
        var dayDivEl = $("<div>").addClass("forecast col-12 col-sm");

        // creating the tags inside the append() for simplicity
        dayDivEl.append(`<h4>${date}</h4>`);
        dayDivEl.append(`<p class="big-icon">${emojis[weatherIconCode]}</p>`);
        dayDivEl.append(`<p>Temp: ${forecast[i].temp.day}° F</p>`);
        dayDivEl.append(`<p>Wind: ${forecast[i].wind_speed} mph`);
        dayDivEl.append(`<p>Humidity: ${forecast[i].humidity}%`);

        forecastRowEl.append(dayDivEl);
    };
};

var displaySearch = function(searchText) {
    var searchListEl = $("#search-history");
    $(".history-btn").remove();

    if (searchHistory.length > 5) {
        searchHistory.pop();
    };

    for (var i = 0; i < searchHistory.length; i++) {
        var listEl = $("<button>").addClass("history-btn").text(searchHistory[i]);
        // append works rather than prepend because the list is already in reverse chrono order
        searchListEl.append(listEl);
    };
};

var loadHistory = function() {
    var storedSearchHistory = localStorage.getItem("weatherdashboard");

    if (storedSearchHistory) {
        searchHistory = JSON.parse(storedSearchHistory);
        city = searchHistory[0];
        displaySearch();
        createGeoLink(searchHistory[0]);
    } else {
        searchHistory = [];
    };
    
    city = "New York";
    createGeoLink("new york");
};

loadHistory();