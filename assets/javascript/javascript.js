townToSearchOn= "Seattle";
stateToSearchOn = "WA";
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
    var newRow1 = $("<div class='row align-items-center' id='weather-child-current'>")
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
    var tableVar = $('<table class="container table table-bordered">');
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
    var newRow1 = $("<div class='row align-items-center ' id='weather-child-current'>")
    var newCol1 = $("<div id='weather-col-1' class='col-6 px-0'>")
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
    var newCol2 = $("<div id='weather-col-2' class='col-6 px-0'>")
    var tableVar = $('<table class="container table table-bordered">');
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

    var newRow2 = $("<div class='row d-flex align-items-center bg-inverse ' id='weather-child-current'>")
    var newCol1 = $("<div id='weather-underground-image'>")
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
