var Temperature = {
  Celsius: 0,
  Fahrenheit: 1,
};

var scale = Temperature.Celsius;
var temperature = undefined;

$(document).ready(setup());

function setup() {
  $("footer").css("position", "absolute");
  $(".footer-span").show();
  $("#noscript").hide();

  $("#location").prop("hidden", true);
  $("#weather").prop("hidden", true);
  $("#weather-icon").prop("hidden", true);

  $("#clouds").css("transition-duration", "5s")
     .css("opacity", "0.0");

  scale = Temperature.Fahrenheit;
  toggleScale();

  $("#scale-button").click(function() {
    toggleScale();
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayCoords);
  }
  else {
    $("#location").prop("hidden", false);
    $("#location").html("Geolocation is not support by this browser");
  }
}

function displayCoords (location) {
  var lat = Math.round(location.coords.latitude * 100) / 100;
  var lon = Math.round(location.coords.longitude * 100) / 100;
  var here = "";

  here += Math.abs(lat) + "&deg;";
  here += (lat > 0) ? 'N' : 'S';
  here += "<br />";
  here += Math.abs(lon) + "&deg;";
  here += (lon > 0) ? 'W' : 'E';

  $("#location").html(here);
  $("#location").prop("hidden", false);

  geoLocation(location);
}

function geoLocation(location) {
  var request = '';

  request += 'https://cors-anywhere.herokuapp.com/';
  request += 'http://nominatim.openstreetmap.org/reverse';
  request += '?format=json';
  request += '&lat=' + location.coords.latitude;
  request += '&lon=' + location.coords.longitude;
  request += '&zoom=18&addressdetails=1';

  $.getJSON(request, function(response) {
    displayLocation(response);
  });

  request = '';
  request += 'https://fcc-weather-api.glitch.me/api/';
  request += 'current?';
  request += '&lat=' + location.coords.latitude;
  request += '&lon=' + location.coords.longitude;

  $.getJSON(request, function(response) {
    displayWeather(response);
  });
}

function displayLocation(json) {
  var location = "";

  if (json.address.city != undefined)
    location += json.address.city;
  else
    location += json.address.village;

  location += "<br />";

  if (json.address.country_code == "us")
    location += json.address.state;
  else
    location += json.address.country;

  $("#location").html(location);
}

function displayWeather(json) {
  $("#temperature").html(formatTemperature(json.main.temp));
  $("#scale-button").html(temperatureScale());
  $("#weather-term").html(json.weather[0].main);
  $("#weather").prop("hidden", false);

  $("#icon").attr("src", "");
  $("#icon").attr("src", json.weather[0].icon);
  $("#weather-icon").prop("hidden", false);
  $("#weather-icon").addClass("movement");
}

function toggleScale() {
  if (scale == Temperature.Celsius) {
    scale = Temperature.Fahrenheit;
    $("#scale-button").prop("title", "Click for Celsius");
  }
  else {
    scale = Temperature.Celsius;
    $("#scale-button").prop("title", "Click for Fahrenheit");
  }

  if (temperature != undefined) {
    $("#temperature").html(formatTemperature(temperature));
    $("#scale-button").html(temperatureScale());
  }
}

function formatTemperature (temp) {
  temperature = temp;

  temp = (scale == Temperature.Celsius)
    ? temp : temp * 9 / 5 + 32;

  return String(Math.round(temp)) + "&deg;";
}

function temperatureScale() {
  return (scale == Temperature.Celsius) ? "C" : "F";
}