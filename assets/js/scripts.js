var appId = "39a500d5662d1686e6e49030185b149b";

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
        console.log("data is", data);
    });
}

createGeoLink("Las Vegas");