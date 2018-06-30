const Work = {
    OFF: 0,
    MORNING: 1,
    DAY: 2,
    EVENING: 3
}

const CurrentWorkStyles = {
    OFF: "",
    MORNING: "currentselectedmorning",
    DAY: "currentselectedday",
    EVENING: "currentselectedevening",
}

const NewWorkStyles = {
    OFF: "",
    MORNING: "newselectedmorning",
    DAY: "newselectedday",
    EVENING: "newselectedevening",
}

var current_state = []
var new_state = []

var current_month = 5
const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

createTable()

function createTable() {

    var state = getState(6)
    var month_days = state.days
    var month_number = state.month
    current_state = state.state
    new_state = current_state.slice()

    var calendar = document.getElementById('calendar')
    var tbl = document.createElement('table')
    tbl.style.width = '100%'
    tbl.setAttribute('border', '1')
    var tbdy = document.createElement('tbody')
    var tr = document.createElement('tr')

    for (var i = 0; i < 7; i++ ) {
        var td = document.createElement('td')
        td.classList.add('day')
        td.innerHTML = days[i]
        tr.appendChild(td)
    }

    tbdy.appendChild(tr)
    
    for (var i = 0; i < month_days.length; i++) {
        var tr = document.createElement('tr')
    
        for (var j = 0; j < month_days[i].length; j++) {
            var td = document.createElement('td')
    
            if ( month_days[i][j].getMonth() == month_number ) {
                td.appendChild(document.createTextNode(month_days[i][j].getDate() ) )
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

function applyCurrentState(current_state) {

    var cells = document.getElementsByTagName('td')
    for (var i=0; i<cells.length; i++) {
        if ( Number(cells[i].innerText) == cells[i].innerText ) {
            var day_number = Number(cells[i].innerText)
            var day_index = day_number - 1
            applyCellState(cells[i], current_state[day_index], true)
        }
    }
}

function applyCellState(cell, state, current) {
    if ( current ) {
        if ( state == Work.OFF ) {
            cell.className = CurrentWorkStyles.OFF
        }
        if ( state == Work.MORNING ) {
            cell.className = CurrentWorkStyles.MORNING
        }
        if ( state == Work.DAY ) {
            cell.className = CurrentWorkStyles.DAY
        }
        if ( state == Work.EVENING ) {
            cell.className = CurrentWorkStyles.EVENING
        }

    } else {
        if ( state == Work.OFF ) {
            cell.className = NewWorkStyles.OFF
        }
        if ( state == Work.MORNING ) {
            cell.className = NewWorkStyles.MORNING
        }
        if ( state == Work.DAY ) {
            cell.className = NewWorkStyles.DAY
        }
        if ( state == Work.EVENING ) {
            cell.className = NewWorkStyles.EVENING
        }
    }
}

function cycleItem() {

    var day_number = Number(this.innerText)
    var day_index = day_number - 1

    if ( new_state[day_index] == Work.OFF ) {
        new_state[day_index] = Work.MORNING
    } else if ( new_state[day_index] == Work.MORNING ) {
        new_state[day_index] = Work.DAY
    } else if ( new_state[day_index] == Work.DAY ) {
        new_state[day_index] = Work.EVENING
    } else {
        new_state[day_index] = Work.OFF
    }

    if ( current_state[day_index] == new_state[day_index] ) {
        applyCellState(this, new_state[day_index], true)
    } else {
        applyCellState(this, new_state[day_index], false)
    }

}

function getState(month_number) {

    const month_days = 
[ [ new Date("2018-06-24T22:00:00.000Z"),
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
    new Date("2018-08-04T22:00:00.000Z") ] ]

    // const month_number = 6 // January = 0

    const current_state = [
        0, // 01
        0, // 02
        2, // 03
        2, // 04
        0, // 05
        0, // 06
        0, // 07
        0, // 08
        3, // 09
        3, // 10
        0, // 11
        0, // 12
        3, // 13
        3, // 14
        3, // 15
        0, // 16
        0, // 17
        0, // 18
        3, // 19
        2, // 20
        0, // 21
        0, // 22
        0, // 23
        0, // 24
        0, // 25
        0, // 26
        3, // 27
        3, // 28
        3, // 29
        0, // 30
        0 // 31
    ]

    return {
        "month": month_number,
        "days": month_days,
        "state": current_state
    }
}

function sendState() {
    console.log({
        "month": month_number,
        "state": new_state
    })
}
