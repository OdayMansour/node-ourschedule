const Shift = {
    OFF: 0,
    MORNING: 1,
    DAY: 2,
    EVENING: 3
}

const CurrentShiftStyles = {
    OFF: "",
    MORNING: "currentselectedmorning",
    DAY: "currentselectedday",
    EVENING: "currentselectedevening",
}

const NewShiftStyles = {
    OFF: "",
    MORNING: "newselectedmorning",
    DAY: "newselectedday",
    EVENING: "newselectedevening",
}


const current_state = getState(2018,7)
const days = getDays(2018,7)

var new_state = []
for (var i=0; i<current_state.length; i++) {
    new_state = new_state.concat([JSON.parse(JSON.stringify(current_state[i]))])
}


var current_month = 5
const day_names = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

createTable()

function createTable() {

    var month_number = 7 - 1

    var calendar = document.getElementById('calendar')
    var tbl = document.createElement('table')
    tbl.style.width = '100%'
    tbl.setAttribute('border', '1')
    var tbdy = document.createElement('tbody')
    var tr = document.createElement('tr')

    for (var i = 0; i < day_names.length; i++ ) {
        var td = document.createElement('td')
        td.classList.add('day')
        td.innerHTML = day_names[i]
        tr.appendChild(td)
    }

    tbdy.appendChild(tr)
    
    for (var i = 0; i < days.length; i++) {
        var tr = document.createElement('tr')
    
        for (var j = 0; j < days[i].length; j++) {
            var td = document.createElement('td')
    
            if ( days[i][j].getMonth() == month_number ) {
                td.appendChild(document.createTextNode(days[i][j].getDate() ) )
                td.onclick = cycleItem
            }
    
            tr.appendChild(td)
        }
    
        tbdy.appendChild(tr)
    
    }
    tbl.appendChild(tbdy)
    calendar.appendChild(tbl)

    console.log(current_state)
    console.log(new_state)

    applyCurrentState(current_state)
}

function applyCurrentState(current_state) {

    var cells = document.getElementsByTagName('td')
    for (var i=0; i<cells.length; i++) {
        if ( Number(cells[i].innerText) == cells[i].innerText && cells[i].innerText.length > 0 ) {
            var day_number = Number(cells[i].innerText)
            var day_index = day_number - 1
            applyCellState(cells[i], current_state[day_index]["shift"], true)
        }
    }
}

function applyCellState(cell, state, current) {
    if ( current ) {
        if ( state == Shift.OFF ) {
            cell.className = CurrentShiftStyles.OFF
        }
        if ( state == Shift.MORNING ) {
            cell.className = CurrentShiftStyles.MORNING
        }
        if ( state == Shift.DAY ) {
            cell.className = CurrentShiftStyles.DAY
        }
        if ( state == Shift.EVENING ) {
            cell.className = CurrentShiftStyles.EVENING
        }

    } else {
        if ( state == Shift.OFF ) {
            cell.className = NewShiftStyles.OFF
        }
        if ( state == Shift.MORNING ) {
            cell.className = NewShiftStyles.MORNING
        }
        if ( state == Shift.DAY ) {
            cell.className = NewShiftStyles.DAY
        }
        if ( state == Shift.EVENING ) {
            cell.className = NewShiftStyles.EVENING
        }
    }
}

function cycleItem() {

    var day_number = Number(this.innerText)
    var day_index = day_number - 1

    console.log("current_state = ")
    console.log(current_state[day_index])
    console.log("new_state = ")
    console.log(new_state[day_index])

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

    console.log(this)

}

function getDays(year, month) {
    const days = [ 
        [ new Date("2018-06-24T22:00:00.000Z"),
          new Date("2018-06-25T22:00:00.000Z"),
          new Date("2018-06-26T22:00:00.000Z"),
          new Date("2018-06-27T22:00:00.000Z"),
          new Date("2018-06-28T22:00:00.000Z"),
          new Date("2018-06-29T22:00:00.000Z"),
          new Date("2018-06-30T22:00:00.000Z") ],
        [ new Date("2018-07-01T22:00:00.000Z"),
          new Date("2018-07-02T22:00:00.000Z"),
          new Date("2018-07-03T22:00:00.000Z"),
          new Date("2018-07-04T22:00:00.000Z"),
          new Date("2018-07-05T22:00:00.000Z"),
          new Date("2018-07-06T22:00:00.000Z"),
          new Date("2018-07-07T22:00:00.000Z") ],
        [ new Date("2018-07-08T22:00:00.000Z"),
          new Date("2018-07-09T22:00:00.000Z"),
          new Date("2018-07-10T22:00:00.000Z"),
          new Date("2018-07-11T22:00:00.000Z"),
          new Date("2018-07-12T22:00:00.000Z"),
          new Date("2018-07-13T22:00:00.000Z"),
          new Date("2018-07-14T22:00:00.000Z") ],
        [ new Date("2018-07-15T22:00:00.000Z"),
          new Date("2018-07-16T22:00:00.000Z"),
          new Date("2018-07-17T22:00:00.000Z"),
          new Date("2018-07-18T22:00:00.000Z"),
          new Date("2018-07-19T22:00:00.000Z"),
          new Date("2018-07-20T22:00:00.000Z"),
          new Date("2018-07-21T22:00:00.000Z") ],
        [ new Date("2018-07-22T22:00:00.000Z"),
          new Date("2018-07-23T22:00:00.000Z"),
          new Date("2018-07-24T22:00:00.000Z"),
          new Date("2018-07-25T22:00:00.000Z"),
          new Date("2018-07-26T22:00:00.000Z"),
          new Date("2018-07-27T22:00:00.000Z"),
          new Date("2018-07-28T22:00:00.000Z") ],
        [ new Date("2018-07-29T22:00:00.000Z"),
          new Date("2018-07-30T22:00:00.000Z"),
          new Date("2018-07-31T22:00:00.000Z"),
          new Date("2018-08-01T22:00:00.000Z"),
          new Date("2018-08-02T22:00:00.000Z"),
          new Date("2018-08-03T22:00:00.000Z"),
          new Date("2018-08-04T22:00:00.000Z") ] 
    ]

    return days

}

function getState(year, month) {

    return [
        {"year":2018,"month":7,"day":1,"shift":0},
        {"year":2018,"month":7,"day":2,"shift":0},
        {"year":2018,"month":7,"day":3,"shift":0},
        {"year":2018,"month":7,"day":4,"shift":1},
        {"year":2018,"month":7,"day":5,"shift":1},
        {"year":2018,"month":7,"day":6,"shift":0},
        {"year":2018,"month":7,"day":7,"shift":0},
        {"year":2018,"month":7,"day":8,"shift":2},
        {"year":2018,"month":7,"day":9,"shift":0},
        {"year":2018,"month":7,"day":10,"shift":0},
        {"year":2018,"month":7,"day":11,"shift":2},
        {"year":2018,"month":7,"day":12,"shift":2},
        {"year":2018,"month":7,"day":13,"shift":0},
        {"year":2018,"month":7,"day":14,"shift":0},
        {"year":2018,"month":7,"day":15,"shift":1},
        {"year":2018,"month":7,"day":16,"shift":0},
        {"year":2018,"month":7,"day":17,"shift":2},
        {"year":2018,"month":7,"day":18,"shift":3},
        {"year":2018,"month":7,"day":19,"shift":3},
        {"year":2018,"month":7,"day":20,"shift":0},
        {"year":2018,"month":7,"day":21,"shift":0},
        {"year":2018,"month":7,"day":22,"shift":3},
        {"year":2018,"month":7,"day":23,"shift":2},
        {"year":2018,"month":7,"day":24,"shift":0},
        {"year":2018,"month":7,"day":25,"shift":1},
        {"year":2018,"month":7,"day":26,"shift":0},
        {"year":2018,"month":7,"day":27,"shift":1},
        {"year":2018,"month":7,"day":28,"shift":2},
        {"year":2018,"month":7,"day":29,"shift":0},
        {"year":2018,"month":7,"day":30,"shift":0},
        {"year":2018,"month":7,"day":31,"shift":0}
    ]
}

function sendState() {
    console.log({
        "month": month_number,
        "state": new_state
    })
}
