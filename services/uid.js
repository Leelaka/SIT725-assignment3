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

module.exports = {
    makeUID: uidGenerator,
    updateUID: uidUpdater,
    verifyUID: verification,
}