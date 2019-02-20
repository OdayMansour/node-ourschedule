///////////////////////////////////////
// Static stuff
///////////////////////////////////////
const Shift = {
    OFF: 0,
    MORNING: 1,
    DAY: 2,
    EVENING: 3
}

const CurrentShiftStyles = {
    OFF: "currentunselected",
    MORNING: "currentselectedmorning",
    DAY: "currentselectedday",
    EVENING: "currentselectedevening",
}

const NewShiftStyles = {
    OFF: "newunselected",
    MORNING: "newselectedmorning",
    DAY: "newselectedday",
    EVENING: "newselectedevening",
}

const day_names = ['Lun.', 'Mar.', 'Med.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.']
const month_names = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

///////////////////////////////////////
// Globals variables
///////////////////////////////////////
var globals_year = new Date().getFullYear()
var globals_month = new Date().getMonth() + 1 // getMonth() -> Jan = 0, Dec = 11

var current_state = []
var days = []
var clients = []
var new_state = []

///////////////////////////////////////
// Starts all the magic
///////////////////////////////////////
getState()

function shiftMonth(shift) {
    globals_month = globals_month + shift

    if ( globals_month == 0 ) {
        globals_month = 12
        globals_year = globals_year - 1
    } else if ( globals_month >12 ) {
        globals_month = 1
        globals_year = globals_year + 1
    }

    redrawCalendar()
}

function redrawCalendar() {
    var calendar = document.getElementById('calendar-body')
    calendar.parentNode.removeChild(calendar)

    getState()
}
// Got all the server-side stuff
function startWork() {
    new_state = []

    for (var i=0; i<current_state.length; i++) {
        new_state = new_state.concat([JSON.parse(JSON.stringify(current_state[i]))])
    }

    createTable()
}

// Create the calendar
// Calls applyCurrentState() when done
function createTable() {
    var month_index = globals_month - 1

    document.getElementById('title').innerText = month_names[month_index] + " - " + globals_year

    var calendar = document.getElementById('calendar')
    var tbl = document.createElement('table')
    tbl.id = 'calendar-body'
    tbl.style.width = '100%'
    tbl.setAttribute('border', '1')
    var tbdy = document.createElement('tbody')
    var tr = document.createElement('tr')

    for (var i = 0; i < day_names.length; i++ ) {
        var th = document.createElement('th')
        th.classList.add('day')
        th.innerHTML = day_names[i]
        tr.appendChild(th)
    }

    tbdy.appendChild(tr)

    for (var i = 0; i < days.length; i++) {
        var tr = document.createElement('tr')

        for (var j = 0; j < days[i].length; j++) {
            var td = document.createElement('td')

            var day_object = new Date(days[i][j])

            if ( day_object.getMonth() == month_index ) {

                if ( day_object.getDay() == 0 || day_object.getDay() == 6 ) {
                    td.classList.add('weekend')
                }

                var day_of_month = day_object.getDate()
                td.id = day_of_month
                td.appendChild(document.createTextNode( day_of_month ) )

                td.onclick = cycleItem
            }

            tr.appendChild(td)
        }

        tbdy.appendChild(tr)

    }
    tbl.appendChild(tbdy)
    calendar.appendChild(tbl)

    applyCurrentState(current_state)
}

// Colors the cells based on the current state
function applyCurrentState(current_state) {

    for (var i=0; i<current_state.length; i++) {
        applyCellState(document.getElementById(current_state[i].day), current_state[i].shift, current_state[i].client)
    }
}

// Removes functional classes from style, keeping custom classes
function removeClasses(cell) {
    cell.classList=""
}

function applyCellState(cell, state, client) {
    var target_class = ""
    if ( state == Shift.OFF ) {
        removeClasses(cell)
    }
    if ( state == Shift.MORNING ) {
        removeClasses(cell)
        target_class = "state_morning_" + client
        cell.classList.add(target_class)
    }
    if ( state == Shift.DAY ) {
        removeClasses(cell)
        target_class = "state_day_" + client
        cell.classList.add(target_class)
    }
    if ( state == Shift.EVENING ) {
        removeClasses(cell)
        target_class = "state_evening_" + client
        cell.classList.add(target_class)
    }
}

function cycleShift(shift) {
    if ( shift ==  Shift.OFF ) {
        return Shift.MORNING
    } else if ( shift ==  Shift.MORNING ) {
        return Shift.DAY
    } else if ( shift ==  Shift.DAY ) {
        return Shift.EVENING
    } else {
        return Shift.OFF
    }
}

function cycleItem() {

    var day_number = Number(this.id)

    var state_index = -1
    var old_shift = 0
    var old_client = 0

    for (var i=0; i<current_state.length; i++) {
        if ( current_state[i].day == day_number ) {
            old_shift = current_state[i].shift
            old_client = current_state[i].client
            state_index = i
        }
    }

    var new_client = 1
    var new_shift = cycleShift(old_shift)

    if (state_index > -1) { // Found a line for the state already
        if (new_shift == 0) {
            current_state.splice(state_index,1)
        } else {
            current_state[state_index].shift = new_shift
        }
    } else {
        var new_state_item = {
            year: globals_year,
            month: globals_month,
            day: day_number,
            shift: new_shift,
            client: new_client
        }
        current_state.push(new_state_item)
    }

    applyCellState(this, new_shift, new_client)
}

function getClients() {
    var request = new XMLHttpRequest();

    request.open('GET', '/clients/active', true);
    request.onload = function () {
        clients = JSON.parse(this.responseText)
        startWork()
        }

    request.send();
}

function getDays() {
    var request = new XMLHttpRequest();

    request.open('GET', '/days/year/' + globals_year + '/month/' + globals_month, true);
    request.onload = function () {
        days = JSON.parse(this.responseText)
        getClients()
        }

    request.send();
}

function getState() {
    var request = new XMLHttpRequest();

    request.open('GET', '/state/year/' + globals_year + '/month/' + globals_month + "?_=" + (new Date().getTime()), true);
    request.onload = function () {
        current_state = JSON.parse(this.responseText)
        getDays()
        }

    request.send();
}

function sendState() {
    var request = new XMLHttpRequest();

    request.open('POST', '/state/year/' + globals_year + '/month/' + globals_month, true);
    request.setRequestHeader("Content-type", "application/json")
    request.send(JSON.stringify({year: globals_year, month: globals_month, state: current_state}))
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            redrawCalendar()
        }
    }
}

function getTextFree() {
    window.location.href = '/text/free/year/' + globals_year + '/month/' + globals_month
}

function getTextBusy() {
    window.location.href = '/text/busy/year/' + globals_year + '/month/' + globals_month
}
