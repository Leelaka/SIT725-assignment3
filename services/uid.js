const e = require("express")

var uidArray = []

function uidGenerator(){
    var uid = ''
    var flag = false
    const length = 4
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    while (!flag) {
        for (var i=0; i<length; i++) {
            uid += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        if (uidArray.indexOf(uid) === -1) {
            flag = true
            uidArray.push(uid)
            return uid
        }
    }
}

function uidUpdater(uid) {
    uidArray = uidArray.filter(function(value){ return value !== uid})
}

function verification(roomID) {
    return uidArray.includes(roomID)
}

function allRooms () {
    if (uidArray.length === 0) {
        return false
    }
    rooms_msg = '<label>Select the room</label><select id="selectRoom">'
    for (var i = 0; i < uidArray.length; i++) {
        if (i === uidArray.length - 1) {
            rooms_msg += '<option value=' + uidArray[i] + '>' + uidArray[i] + '</option></select>'
        }
        else {
            rooms_msg += '<option value=' + uidArray[i] + '>' + uidArray[i] + '</option>'
        }
        
    }

    return rooms_msg
}

module.exports = {
    makeUID: uidGenerator,
    updateUID: uidUpdater,
    verifyUID: verification,
    allRooms: allRooms,
}