const dummy = 
[ [ new Date("2018-05-27T22:00:00.000Z"),
    new Date("2018-05-28T22:00:00.000Z"),
    new Date("2018-05-29T22:00:00.000Z"),
    new Date("2018-05-30T22:00:00.000Z"),
    new Date("2018-05-31T22:00:00.000Z"),
    new Date("2018-06-01T22:00:00.000Z"),
    new Date("2018-06-02T22:00:00.000Z") ],
  [ new Date("2018-06-03T22:00:00.000Z"),
    new Date("2018-06-04T22:00:00.000Z"),
    new Date("2018-06-05T22:00:00.000Z"),
    new Date("2018-06-06T22:00:00.000Z"),
    new Date("2018-06-07T22:00:00.000Z"),
    new Date("2018-06-08T22:00:00.000Z"),
    new Date("2018-06-09T22:00:00.000Z") ],
  [ new Date("2018-06-10T22:00:00.000Z"),
    new Date("2018-06-11T22:00:00.000Z"),
    new Date("2018-06-12T22:00:00.000Z"),
    new Date("2018-06-13T22:00:00.000Z"),
    new Date("2018-06-14T22:00:00.000Z"),
    new Date("2018-06-15T22:00:00.000Z"),
    new Date("2018-06-16T22:00:00.000Z") ],
  [ new Date("2018-06-17T22:00:00.000Z"),
    new Date("2018-06-18T22:00:00.000Z"),
    new Date("2018-06-19T22:00:00.000Z"),
    new Date("2018-06-20T22:00:00.000Z"),
    new Date("2018-06-21T22:00:00.000Z"),
    new Date("2018-06-22T22:00:00.000Z"),
    new Date("2018-06-23T22:00:00.000Z") ],
  [ new Date("2018-06-24T22:00:00.000Z"),
    new Date("2018-06-25T22:00:00.000Z"),
    new Date("2018-06-26T22:00:00.000Z"),
    new Date("2018-06-27T22:00:00.000Z"),
    new Date("2018-06-28T22:00:00.000Z"),
    new Date("2018-06-29T22:00:00.000Z"),
    new Date("2018-06-30T22:00:00.000Z") ] ]

var current_month = 5
const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

createTable()

function createTable() {
    var body = document.getElementsByTagName('body')[0]
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
    
    for (var i = 0; i < dummy.length; i++) {
        var tr = document.createElement('tr')
    
        for (var j = 0; j < dummy[i].length; j++) {
            var td = document.createElement('td')
    
            if ( dummy[i][j].getMonth() == 5 ) {
                if ( dummy[i][j].getDay() == 0 || dummy[i][j].getDay() == 6 ) {
                    td.classList.add('weekend')
                }
                td.classList.add('unselected')
                td.appendChild(document.createTextNode(dummy[i][j].getDate() ) )
                td.onclick = selectItem
            }
    
            tr.appendChild(td)
        }
    
        tbdy.appendChild(tr)
    
    }
    tbl.appendChild(tbdy)
    body.appendChild(tbl)
}

function selectItem() {

    if ( this.classList.contains('unselected') ) {
        this.classList.remove('unselected')
        this.classList.add('selectedmorning')
    } else if ( this.classList.contains('selectedmorning') ) {
        this.classList.remove('selectedmorning')
        this.classList.add('selectedevening')
    } else {
        this.classList.remove('selectedevening')
        this.classList.add('unselected')
    }

}
