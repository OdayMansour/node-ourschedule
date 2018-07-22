var calendar = require('node-calendar');
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var bodyParser = require('body-parser');

var db = new sqlite3.Database('schedule.db');
var app = express();

db.serialize(checkSchema)

app.listen(1616, function() {
    console.log("Listening on port 1616")
})

// To serve the frontend page
app.use(express.static('../client'))
// To parse content of POST requests
app.use(bodyParser.json())

// Checks for the schema, creates it if it's missing
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

// Creates the schema when missing
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

// Writes a summary of database contents and prints it out
function printSummary() {
    db.each("SELECT year, month, count(day) from schedule group by year, month order by year, month", function(err, row) {
        console.log(row)
    })
}

// Creates the blank state for missing months
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

// Will query the state from the DB
// If no state for a year, month combo is found,
// creates a blank state for the month then calls itself again to serve it
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

function queryAndProcessAndSend(year, month, process, res) {
    
    var query = 
        "SELECT year, month, day, shift from schedule where year = " + 
        year + 
        " and month = " + 
        month + 
        " order by year, month, day"

    db.all(query, function(err, rows) {
        process(rows, res)
    })

}

function generateFree(rows, res) {

    const month_names = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    const day_names = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    const shift_names = ['matin', 'jour', 'soir']
    var return_text = ""
    var last = 0
    var skipped = false

    return_text += "Disponibilite en " + month_names[rows[0].month - 1]+ ": \n"

    for (var i=0; i<rows.length; i++) {
        if ( rows[i].shift == 0 ) {
            var day = new Date(rows[i].year, rows[i].month-1, rows[i].day)
            return_text += day_names[day.getDay()] + " " + rows[i].day + "\n"
            last = i
            skipped = false
        }
        if ( i > last && !skipped ) {
            return_text += "\n"
            skipped = true
        }
    }

    res.setHeader('Content-Type', 'text/plain')
    res.send(return_text)

}

function generateBusy(rows, res) {

    const month_names = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    const day_names = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    const shift_names = ['matin', 'jour', 'soir']
    var return_text = ""
    var last = 0
    var skipped = false

    return_text += "Travail en " + month_names[rows[0].month - 1]+ ": \n"

    for (var i=0; i<rows.length; i++) {
        if ( rows[i].shift != 0 ) {
            var day = new Date(rows[i].year, rows[i].month-1, rows[i].day)
            return_text += day_names[day.getDay()] + " " + rows[i].day + ", " + shift_names[rows[i].shift-1] + "\n"
            last = i
            skipped = false
        }
        if ( i > last && !skipped ) {
            return_text += "\n"
            skipped = true
        }
    }

    res.setHeader('Content-Type', 'text/plain')
    res.send(return_text)

}

///////////////
// GET Requests

// Returns the state for a given year and month
// Used to populate the calendar on the frontend
app.get('/state/year/:year_number/month/:month_number', function (req, res) {
    
    var year = req.params.year_number
    var month = req.params.month_number

    if ( month < 1 || month > 12 || month == "NaN" || year == "NaN" ) {
        res.send("")
        console.log("ERROR: Querying state for invalid date! " + year + ", " + month)
    } else {
        queryAndSend(year, month, res)
    }

})

// Returns the days for a given year and month
// Used to build the calendar on the frontend
app.get('/days/year/:year_number/month/:month_number', function (req, res) {
    
    var year = req.params.year_number
    var month = req.params.month_number

    if ( month < 1 || month > 12 || month == "NaN" || year == "NaN" ) {
        console.log("ERROR: Querying days for invalid date! " + year + ", " + month)
        res.send("")
    } else {
        console.log("Serving days for year " + year + ", month " + month)
        res.send(new calendar.Calendar(0).monthdatescalendar(year, month))
    }

})

app.get('/text/free/year/:year_number/month/:month_number', function (req, res) {

    var year = req.params.year_number
    var month = req.params.month_number

    queryAndProcessAndSend(year, month, generateFree, res)

})

app.get('/text/busy/year/:year_number/month/:month_number', function (req, res) {

    var year = req.params.year_number
    var month = req.params.month_number

    queryAndProcessAndSend(year, month, generateBusy, res)

})

///////////////
// POST Requests

// Saves submitted state into the database
app.post('/state/year/:year_number/month/:month_number', function (req, res) {
    
    var new_state = req.body

    var stmt = db.prepare("UPDATE schedule SET shift = ? where year = ? and month = ? and day = ?");
    for (var i=0; i < new_state.length; i++) {
        stmt.run(new_state[i].shift, new_state[i].year, new_state[i].month, new_state[i].day);
    }

    stmt.finalize(function () {
        res.send("")
        console.log(
            "Applied state change for year " + 
            req.params.year_number + 
            ", month " + 
            req.params.month_number
        )
    });

})
