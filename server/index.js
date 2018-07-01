var calendar = require('node-calendar');
var sqlite3 = require('sqlite3').verbose();
var express = require('express');

var db = new sqlite3.Database('schedule.db');
var app = express();

db.serialize(checkSchema)

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

function createEmptyRowsAndSendThem(year, month, res) {

    var days_in_month = calendar.monthrange(year, month)[1]
    
    var stmt = db.prepare("INSERT INTO schedule VALUES (?, ?, ?, 0)");
    for (var i=0; i < days_in_month; i++) {
        stmt.run(year, month, i+1);
    }
    
    stmt.finalize(function () {
        queryAndSend(year, month, res)
    });
}

function queryAndSend(year, month, res) {
    var query = 
        "SELECT year, month, day, shift from schedule where year = " + 
        year + 
        " and month = " + 
        month + 
        " order by year, month, day"
    
    db.all(query, function(err, rows) {
    
        if (rows.length == 0) {
            console.log(
                "No data found for year " + 
                year + 
                ", month " + 
                month
            )
            console.log("Creating empty rows...")
            createEmptyRowsAndSendThem(year, month, res)
        } else {
            console.log(
                "Found " + 
                rows.length + 
                " days for year " + 
                year + 
                ", month " + 
                month
            )
            res.send(rows)
        }
    
    })
}

app.use(express.static('../client'))

app.get('/', function (req, res) {
    res.send("Root")
})

app.get('/state/year/:year_number/month/:month_number', function (req, res) {
    
    var year = req.params.year_number
    var month = req.params.month_number

    if ( month < 1 || month > 12 ) {
        res.send("")
        console.log("ERROR: Querying state for invalid date! " + year + ", " + month)
    } else {
        queryAndSend(year, month, res)
    }

})

app.get('/days/year/:year_number/month/:month_number', function (req, res) {
    
    var year = req.params.year_number
    var month = req.params.month_number

    if ( month < 1 || month > 12 ) {
        console.log("ERROR: Querying days for invalid date! " + year + ", " + month)
        res.send("")
    } else {
        console.log("Serving days for year " + year + ", month " + month)
        res.send(new calendar.Calendar(0).monthdatescalendar(year, month))
    }

})

app.listen(1616, function() {
    console.log("Listening on port 1616")
})
