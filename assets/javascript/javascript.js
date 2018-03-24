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
