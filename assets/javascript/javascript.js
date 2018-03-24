
var config = {
  apiKey: "AIzaSyDk6nZA6N5AT6F-jqdAAlbfVXKmmMlws8Q",
  authDomain: "gangoffour-2c5db.firebaseapp.com",
  databaseURL: "https://gangoffour-2c5db.firebaseio.com",
  projectId: "gangoffour-2c5db",
  storageBucket: "",
  messagingSenderId: "625329872118"
};
firebase.initializeApp(config);
var database = firebase.database();


function initMap() {
  var markerArray = [];


  $("#submit-btn").on("click", function (event) {
    event.preventDefault();
    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;

    var pizza = {
      "async": true,
      "crossDomain": true,
      "url": "https://www.validator.pizza/email/" + $("#email").val(),
      "method": "GET",
      "headers": {
      }
    }

    $.ajax(pizza).done(function (response) {
      console.log(response);
    }).fail(function (error) {
      swal("Error!", "That isn't an email!", "error");
    });
    // Create a map and center it on Manhattan.
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 40.771, lng: -73.974 }

    });

    var userFirst = $("#first").val().trim();
    var userLast = $("#last").val().trim();
    var userAddress = $("#address").val().trim();
    var userCity = $("#city").val().trim();
    var userState = $("#state").val().trim();
    var userZip = $("#zip").val().trim();
    var userEmail = $("#email").val().trim();
    var userTickets = $("#tickets").val().trim();
    //event name input/date?

    var userRef = database.ref("/userDB");
    var eventRef = database.ref("/eventDB");
    var newUserRef = userRef.push();
    var newEventRef = eventRef.push();
    newUserRef.set({
      firstName: userFirst,
      lastName: userLast,
      address: userAddress,
      city: userCity,
      state: userState,
      zip: userZip,
      email: userEmail,
      tickets: userTickets
    })
    newEventRef.set({
      firstName: userFirst,
      lastName: userLast,
      email: userEmail,
      tickets: userTickets
      //which event tickets were bought for
    })
    //Clear Form
    $("#first").val("");
    $("#last").val("");
    $("#address").val("");
    $("#city").val("");
    $("#state").val("");
    $("#zip").val("");
    $("#email").val("");
    $("#tickets").val("");

    // Create a renderer for directions and bind it to the map.
    var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });

    // Instantiate an info window to hold step text.
    var stepDisplay = new google.maps.InfoWindow;

    // Display the route between the initial start and end selections.
    calculateAndDisplayRoute(
      directionsDisplay, directionsService, markerArray, stepDisplay, map);
    // Listen to change events from the start and end lists.
    var onChangeHandler = function () {
      calculateAndDisplayRoute(
        directionsDisplay, directionsService, markerArray, stepDisplay, map);
    };
    // document.getElementById('start').addEventListener('change', onChangeHandler);
    // document.getElementById('end').addEventListener('change', onChangeHandler);
  });
}

database.ref("/userDB").on("child_added", function (snapshot) {
  var userFirst = snapshot.val().firstName;
  var userLast = snapshot.val().lastName;
  var userAddress = snapshot.val().address;
  var userCity = snapshot.val().city;
  var userState = snapshot.val().state;
  var userZip = snapshot.val().zip;
  var userEmail = snapshot.val().email;
  var userTickets = snapshot.val().tickets;
});

database.ref("/eventDB").on("child_added", function (snapshot) {
  var userFirst = snapshot.val().firstName;
  var userLast = snapshot.val().lastName;
  var userEmail = snapshot.val().email;
  var userTickets = snapshot.val().tickets;
});
function calculateAndDisplayRoute(directionsDisplay, directionsService,
  markerArray, stepDisplay, map) {
  // First, remove any existing markers from the map.
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

  // Retrieve the start and end locations and create a DirectionsRequest using
  // WALKING directions.

  var home = $("#address").val() + "," + $("#zip").val()
  var gangTour = "215 Wabasha Street South, 55107"

  console.log(home);
  directionsService.route({
    origin: home,
    destination: gangTour,
    travelMode: 'DRIVING'
  }, function (response, status) {
    // Route the directions and pass the response to a function to create
    // markers for each step.
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      var myRoute = response.routes[0].legs[0];
      var distance = response.routes[0].legs[0].distance;
      var distanceDiv = $("<div id='distanceDisplay'>")
      distanceDiv.append("<h1> Distance to Caves: " + distance.text + "</h1>");
      $("#mapDiv").append(distanceDiv);
      console.log(distance);
      attachInstructionText(
        stepDisplay, myRoute.steps[i].instructions, map);
      //     }
      // showSteps(response, markerArray, stepDisplay, map);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, 'click', function () {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}

var townToSearchOn= "Seattle";
var stateToSearchOn = "WA";
var settingsCurrent = {
    "async": true,
    "crossDomain": true,
    "url": "http://api.wunderground.com/api/33c0d83ac9bce956/forecast/conditions/q/"+stateToSearchOn+"\\/"+ townToSearchOn+".json",
    "method": "GET",
    "headers": {
        //     "Cache-Control": "no-cache",
        //     "Postman-Token": "c43e28f9-121e-44a3-8a1d-bb8833978e73"
    }
}

$.ajax(settingsCurrent).done(function (wuResponse) {
    console.log(wuResponse);

    //current forecast
    var newRow1 = $("<div class='row align-items-center mx-1' id='weather-child-current'>")
    var newCol1 = $("<div id='weather-col-1' class='col-6 p-0'>")
    var weatherImage = $("<img>");
    weatherImage.attr("src", wuResponse.current_observation.icon_url);
    weatherImage.attr("class", "img-fluid");
    weatherImage.attr("style", "width:100%");
    weatherImage.attr("alt", "Current Conditions for " +townToSearchOn+", "+stateToSearchOn);
    weatherImage.attr("title", "Current Conditions for " +townToSearchOn+", "+stateToSearchOn);
    newCol1.append(weatherImage);
    newRow1.append(newCol1);

    //create table for weather Div information
    // if clicked takes you to the current conditions
    //-------------------------------
    // Currently:  /  weather text  |
    // Location:   /  townToSearchOn|
    // Temp:       /  actual-temp   |
    // Wind:       /  actual-wind   |
    //-------------------------------
    //
    var newCol2 = $("<div id='weather-col-2' class='col-6 p-0'>")
    var tableVar = $('<table class=" table table-bordered m-0">');
    var tableRow = $("<tr>");
    console.log(moment().format("MM/DD/YYYY"));
    tableRow.append("<th class='p-0 text-center' colspan='2'>" + moment().format("MM/DD/YYYY") + "</th>");
    tableVar.append(tableRow);
    var tableRow = $("<tr>");
    tableRow.append("<th class='p-0'>Currently:</th>");
    tableRow.append("<td class='p-0'>" + wuResponse.current_observation.weather + '</td>');
    tableVar.append(tableRow);
    var tableRow = $("<tr>");
    tableRow.append("<th class='p-0'>City:</th>");
    tableRow.append("<td class='p-0'>" + townToSearchOn+ ", "+stateToSearchOn+'</td>');
    tableVar.append(tableRow);
    var tableRow = $("<tr>");
    tableRow.append("<th class='p-0'>Temp:</th>");
    tableRow.append("<td class='p-0'>" + wuResponse.current_observation.temp_f + "&#176 F</td>");
    tableVar.append(tableRow);
    var tableRow = $("<tr>");
    tableRow.append("<th class='p-0'>Wind:</th>");
    tableRow.append("<td class='p-0'>"+ wuResponse.current_observation.wind_dir +" @ "+ wuResponse.current_observation.wind_mph+" mph</td>");
    tableVar.append(tableRow);
    newCol2.append(tableVar);
    newRow1.append(newCol2);

    //create var for entire div to go inside so clicking it opens a new window
    var weatherLink = $('<a id="current-conditions-download-link" target="_blank">');
    weatherLink.attr("href", wuResponse.current_observation.ob_url);
    weatherLink.append(newRow1);

    var newRow2 = $("<div class='row' id='weather-logo-div'>")
    var newCol1 = $("<div class='col' id='weather-underground-image'>")
    var weatherImage = $("<img>");
    weatherImage.attr("src", "assets/images/wundergroundLogo_4c_horz.jpg");
    weatherImage.attr("class", "img-fluid")
    weatherImage.attr("alt", "Weather Underground Logo");
    weatherImage.attr("title", "Weather Underground Logo");
    newCol1.append(weatherImage);
    newRow2.append(newCol1);
    weatherLink.append(newRow2);
    $("#weather").prepend(weatherLink);
});

var date = "04/01/2018"
var settingsFuture = {
    "async": true,
    "crossDomain": true,
    "url": "http://api.wunderground.com/api/33c0d83ac9bce956/forecast10day/q/MN\\/"+townToSearchOn+".json",
    "method": "GET",
    "headers": {
        //     "Cache-Control": "no-cache",
        //     "Postman-Token": "c43e28f9-121e-44a3-8a1d-bb8833978e73"
    }
}

$.ajax(settingsFuture).done(function (wuResponse) {
    console.log(wuResponse);

    var momentDate = moment(date, 'MM/DD/YYYY');

    var jsDate = momentDate.toDate();
    var jsDate2 = momentDate.format('DD');
    var reservationDate = 0;
    console.log(jsDate);
    console.log(jsDate2);

    for (i = 0; i < wuResponse.forecast.simpleforecast.forecastday.length; i++) {
        console.log(wuResponse.forecast.simpleforecast.forecastday[i].date.day);
        if (wuResponse.forecast.simpleforecast.forecastday[i].date.day == jsDate2) {
            reservationDate = i;
            console.log("find date: " + reservationDate);
        }

    }

    // future forecast 
    var newRow1 = $("<div class='row align-items-center mx-1 ' id='weather-child-current'>")
    var newCol1 = $("<div id='weather-col-1' class='col-6 p-0'>")
    var weatherImage = $("<img>");
    weatherImage.attr("src", wuResponse.forecast.txt_forecast.forecastday[reservationDate].icon_url);
    weatherImage.attr("class", " img-fluid")
    weatherImage.attr("style", "width:100%");
    weatherImage.attr("alt", "Forecast Conditions for "+townToSearchOn+", "+stateToSearchOn);
    weatherImage.attr("title", "Forecast Conditions for " +townToSearchOn+", "+stateToSearchOn);
    newCol1.append(weatherImage);
    // newCol1.append("<p class='text-center'>" + wuResponse.current_observation.weather + "</p>")
    newRow1.append(newCol1);

    //create table for weather Div information
    // if clicked takes you to the current conditions
    //-------------------------------
    // Lcoation:   /  townToSearchOn      |
    // Temp:       /  actual-temp   |
    // Wind:       /  actual-wind   |
    //-------------------------------
    //
    var newCol2 = $("<div id='weather-col-2' class='col-6 p-0'>")
    var tableVar = $('<table class=" table table-bordered m-0">');
    var tableRow = $("<tr>");
    tableRow.append("<th class='p-0 text-center' colspan='2'>" + date + "</th>");
    tableVar.append(tableRow);
    var tableRow = $("<tr>");
    tableRow.append("<th class='p-0'>Forecast:</th>");
    tableRow.append("<td class='p-0'>" + wuResponse.forecast.simpleforecast.forecastday[reservationDate].conditions + '</td>');
    tableVar.append(tableRow);
    var tableRow = $("<tr>");
    tableRow.append("<th class='p-0'>Location:</th>");
    tableRow.append("<td class='p-0'>" +townToSearchOn+ ", "+stateToSearchOn+"</td>");
    tableVar.append(tableRow);
    var tableRow = $("<tr>");
    tableRow.append("<th class='p-0'>Temp:</th>");
    tableRow.append("<td class='p-0'>" +wuResponse.forecast.simpleforecast.forecastday[reservationDate].high.fahrenheit + "&#176 F</td>");
    tableVar.append(tableRow);
    var tableRow = $("<tr>");
    tableRow.append("<th class='p-0'>Wind:</th>");
    tableRow.append("<td class='p-0'>" + wuResponse.forecast.simpleforecast.forecastday[reservationDate].avewind.dir +" @ "+ wuResponse.forecast.simpleforecast.forecastday[reservationDate].avewind.mph+" mph</td>");
    tableVar.append(tableRow);
    newCol2.append(tableVar);
    newRow1.append(newCol2);
    
    //create var for entire div to go inside so clicking it opens a new window
    var weatherLink = $('<a id="future-forecast-download-link" target="_blank">');
    weatherLink.attr("href", "https://www.wunderground.com/forecast/us/"+stateToSearchOn+"/"+townToSearchOn);
    weatherLink.append(newRow1);

    var newRow2 = $("<div class='row' id='weather-logo-div'>")
    var newCol1 = $("<div class='col' id='weather-underground-image'>")
    var weatherImage = $("<img>");
    weatherImage.attr("src", "assets/images/wundergroundLogo_4c_horz.jpg");
    weatherImage.attr("class", "img-fluid")
    weatherImage.attr("alt", "Weather Underground Logo");
    weatherImage.attr("title", "Weather Underground Logo");
    newCol1.append(weatherImage);
    newRow2.append(newCol1);
    weatherLink.append(newRow2);
    $("#weather").prepend(weatherLink);

});
