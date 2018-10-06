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

                    var circle = document.createElement('div')
                    circle.classList.add('circle')
                    circle.id = day_of_month + "_right"
                    td.appendChild(circle)

                    circle = document.createElement('div')
                    circle.classList.add('circle')
                    circle.id = day_of_month + "_mid"
                    td.appendChild(circle)

                    circle = document.createElement('div')
                    circle.classList.add('circle')
                    circle.id = day_of_month + "_left"
                    td.appendChild(circle)

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
    var cells = document.getElementsByTagName('td')
    for (var i=0; i<cells.length; i++) {
        if ( Number(cells[i].id) == cells[i].id && cells[i].id.length > 0 ) {
            var day_number = Number(cells[i].id)
            var day_index = day_number - 1
            applyCellState(cells[i], current_state[day_index]["shift"], true)
        }
    }
}

// Removes functional classes from style, keeping custom classes
function removeClasses(cell) {
    cell.classList.remove(CurrentShiftStyles.OFF)
    cell.classList.remove(CurrentShiftStyles.MORNING)
    cell.classList.remove(CurrentShiftStyles.DAY)
    cell.classList.remove(CurrentShiftStyles.EVENING)
    cell.classList.remove(NewShiftStyles.OFF)
    cell.classList.remove(NewShiftStyles.MORNING)
    cell.classList.remove(NewShiftStyles.DAY)
    cell.classList.remove(NewShiftStyles.EVENING)
}

function applyCellState(cell, state, current) {
    removeClasses(cell)
    if ( current ) {
        if ( state == Shift.OFF ) {
            cell.classList.add(CurrentShiftStyles.OFF)
        }
        if ( state == Shift.MORNING ) {
            cell.classList.add(CurrentShiftStyles.MORNING)
        }
        if ( state == Shift.DAY ) {
            cell.classList.add(CurrentShiftStyles.DAY)
        }
        if ( state == Shift.EVENING ) {
            cell.classList.add(CurrentShiftStyles.EVENING)
        }

    } else {
        if ( state == Shift.OFF ) {
            cell.classList.add(NewShiftStyles.OFF)
        }
        if ( state == Shift.MORNING ) {
            cell.classList.add(NewShiftStyles.MORNING)
        }
        if ( state == Shift.DAY ) {
            cell.classList.add(NewShiftStyles.DAY)
        }
        if ( state == Shift.EVENING ) {
            cell.classList.add(NewShiftStyles.EVENING)
        }
    }
}

function cycleItem() {
    console.log("Cycling item:")
    console.log(this)
    console.log(this.id)
    var day_number = Number(this.id)
    var day_index = day_number - 1

    if ( new_state[day_index]["shift"] == Shift.OFF ) {
        new_state[day_index]["shift"] = Shift.MORNING
    } else if ( new_state[day_index]["shift"] == Shift.MORNING ) {
        new_state[day_index]["shift"] = Shift.DAY
    } else if ( new_state[day_index]["shift"] == Shift.DAY ) {
        new_state[day_index]["shift"] = Shift.EVENING
    } else {
        new_state[day_index]["shift"] = Shift.OFF
    }

    if ( current_state[day_index]["shift"] == new_state[day_index]["shift"] ) {
        applyCellState(this, new_state[day_index]["shift"], true)
    } else {
        applyCellState(this, new_state[day_index]["shift"], false)
    }
}

function getDays() {
    var request = new XMLHttpRequest();

    request.open('GET', '/days/year/' + globals_year + '/month/' + globals_month, true);
    request.onload = function () {
        days = JSON.parse(this.responseText)
        startWork()
        }

    request.send();
}

function getState() {
    var request = new XMLHttpRequest();

    request.open('GET', '/state/year/' + globals_year + '/month/' + globals_month, true);
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
    request.send(JSON.stringify(new_state))
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
