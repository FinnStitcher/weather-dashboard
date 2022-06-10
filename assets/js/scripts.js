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
        displayCurrentWeather(city, data);
    });
};

var displayCurrentWeather = function(city, data) {
    // change city name
    $("#city-name").text(city);

    // change text
    $("#curTemp").text(`Temp.: ${data.current.temp}° F`);
    $("#curWind").text(`Wind: ${data.current.wind_speed} mph`);
    $("#curHumidity").text(`Humidity: ${data.current.humidity}%`);

    // change uv
    var uvNum = data.current.uvi;
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