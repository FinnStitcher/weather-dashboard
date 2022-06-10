var appId = "39a500d5662d1686e6e49030185b149b";

var formEl = $("#search-form");
var city = null;

$("#search-form").on("submit", function(event) {
    event.preventDefault();

    var searchValue = $("#search-input").val();
    createGeoLink(searchValue);
    city = searchValue;
});

var createGeoLink = function(input) {
    var city = input.replace(" ", "-").toLowerCase();
    var geoEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city},US&appid=${appId}`;

    getCoordinates(geoEndpoint);
};

var getCoordinates = function(url) {
    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        var latitude = data[0].lat;
        var longitude = data[0].lon;

        var weatherEndpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=imperial&appid=${appId}`;

        getWeather(weatherEndpoint);
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
    // change city name
    // referring to the global variable, here
    $("#city-name").text(city);

    // change text
    $("#curTemp").text(`Temp.: ${currentData.temp}° F`);
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

    for (var i = 0; i < forecast.length; i++){
        var dayDivEl = $("<div>").addClass("forecast col-12 col-sm");

        dayDivEl.append("<h3>day</h3>");
        dayDivEl.append("<p>weather</p>");
        dayDivEl.append(`<p>Temp.: ${forecast[i].temp.day}° F</p>`);
        dayDivEl.append(`<p>Wind: ${forecast[i].wind_speed} mph`);
        dayDivEl.append(`<p>Humidity: ${forecast[i].humidity}%`);

        forecastRowEl.append(dayDivEl);
    };
};