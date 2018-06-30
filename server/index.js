var calendar = require('node-calendar');
var sqlite3 = require('sqlite3').verbose();
var express = require('express');

// console.log(new calendar.Calendar(0).monthdatescalendar(2018, 7))

var db = new sqlite3.Database('schedule.db');
var app = express();

db.serialize(checkSchema)
//   db.run("CREATE TABLE lorem (info TEXT)");

//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();

function checkSchema() {
    db.run("SELECT 1 FROM schedule", function(err, row) {
        if (err) {
            console.log("No schema found, creating...")
            createSchema()
        } else {
            console.log("Found schema.")
            printSummary()
        }
    })
}

function createSchema() {
    db.run("CREATE TABLE schedule ( year NUMERIC, month NUMERIC, day NUMERIC, shift NUMERIC )", function(err, row) {
        if (err) {
            console.log("Could not create schema.")
            console.log(err)
        } else {
            console.log("Created blank schema")
        }
    })
}

function printSummary() {
    db.each("SELECT year, month, count(day) from schedule group by year, month order by year, month", function(err, row) {
        console.log(row)
    })
}

app.get('/', function (req, res) {
    res.send("Hello")
})

app.listen(1616, function() {
    console.log("Listening on port 1616")
})
