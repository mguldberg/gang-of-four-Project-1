$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyDk6nZA6N5AT6F-jqdAAlbfVXKmmMlws8Q",
        authDomain: "gangoffour-2c5db.firebaseapp.com",
        databaseURL: "https://gangoffour-2c5db.firebaseio.com",
        projectId: "gangoffour-2c5db",
        storageBucket: "gangoffour-2c5db.appspot.com",
        messagingSenderId: "625329872118"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    //event name input/date?
    var userRef = database.ref("/userDB");
    var newUserRef = userRef.push();

    // ----------------------------------------------------------------
    // At the page load and subsequent value changes, get a snapshot of the local data.
    // This function allows you to update your page in real-time when the values within the firebase node bidderData changes
    // ----------------------------------------------------------------
    database.ref().on("value", function (snapshot) {
        // console.log(childSnapshot.val())
        console.log(snapshot.val())
        //var to point inside the snapshot to our train information
        var adminRecords = snapshot.val().userDB;
        console.log(snapshot.val().userDB);
        //used for console logging to make sure the loop is incrementing
        var loop = 0;
        //empty the table so we can rerender it with current information
        var tableVar = $("#admin-body");
        tableVar.empty();
        //loop through all objects in the nsap
        for (key in adminRecords) {
            console.log("in for loop");
            //validate # of records in the DB
            loop++;
            // console.log(loop);
            keyForDummyUpdate = key;
            // console.log(key);
            // console.admin[key]);
            console.log(adminRecords[key].firstName);
            console.log(adminRecords[key].lastName);
            console.log(adminRecords[key].email);
            console.log(adminRecords[key].address);
            console.log(adminRecords[key].city);
            console.log(adminRecords[key].state);
            console.log(adminRecords[key].zip);
            console.log(adminRecords[key].date);
            console.log(adminRecords[key].tickets);
            // <th>First Name</th>
            // <th>Last Name</th>
            // <th>Email Address</th>
            // <th>City</th>
            // <th>State</th>
            // <th>Zip</th>
            // <th>Number of Reservations</th>

            var tableRow = $("<tr>");
            tableRow.append('<td>' + adminRecords[key].firstName + '</td>');
            tableRow.append("<td>" + adminRecords[key].lastName + "</td>");
            tableRow.append("<td>" + adminRecords[key].email + "</td>");
            tableRow.append("<td>" + adminRecords[key].address + "</td>")
            tableRow.append("<td>" + adminRecords[key].city + "</td>");
            tableRow.append("<td>" + adminRecords[key].state + "</td>");
            tableRow.append("<td>" + adminRecords[key].zip + "</td>");
            tableRow.append("<td>" + adminRecords[key].date + "</td>");
            tableRow.append("<td>" + adminRecords[key].tickets + "</td>");

            tableVar.append(tableRow);
        }
        // console.log(childSnapshot.val().employeeName)
        // If any errors are experienced, log them to console.
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
})