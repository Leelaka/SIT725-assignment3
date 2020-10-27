class Card {
    constructor (name, value, pic, clickable){
        this.name = name
        this.value = value
        this.pic = pic
        this.clickable = clickable
    }
}

Guard1 = new Card('Guard', '1', '<img src="../images/Guard.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Guard.jpg" onclick="guard()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Guard2 = new Card('Guard', '1', '<img src="../images/Guard.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Guard.jpg" onclick="guard()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Guard3 = new Card('Guard', '1', '<img src="../images/Guard.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Guard.jpg" onclick="guard()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Guard4 = new Card('Guard', '1', '<img src="../images/Guard.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Guard.jpg" onclick="guard()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Guard5 = new Card('Guard', '1', '<img src="../images/Guard.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Guard.jpg" onclick="guard()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Priest1 = new Card('Priest', '2', '<img src="../images/Priest.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Priest.jpg" onclick="priest()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Priest2 = new Card('Priest', '2', '<img src="../images/Priest.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Priest.jpg" onclick="priest()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Baron1 = new Card('Baron', '3', '<img src="../images/Baron.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Baron.jpg" onclick="baron()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Baron2 = new Card('Baron', '3', '<img src="../images/Baron.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Baron.jpg" onclick="baron()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Handmaid1 = new Card('Handmaid', '4', '<img src="../images/Handmaid.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Handmaid.jpg" onclick="handmaid()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Handmaid2 = new Card('Handmaid', '4', '<img src="../images/Handmaid.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Handmaid.jpg" onclick="handmaid()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Prince1 = new Card('Prince', '5', '<img src="../images/Prince.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Prince.jpg" onclick="prince()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Prince2 = new Card('Prince', '5', '<img src="../images/Prince.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Prince.jpg" onclick="prince()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
King = new Card('King', '7', '<img src="../images/King.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/King.jpg" onclick="king()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Countess = new Card('Countess', '8', '<img src="../images/Countess.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Countess.jpg" onclick="countess()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Princess = new Card('Princess', '9', '<img src="../images/Princess.jpg" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>', '<img src="../images/Princess.jpg" onclick="princess()" style="height: 125px;padding-top: 5px; padding-left: 15px;"></img>')
Types = ['Guard', 'Priest', 'Baron', 'Handmaid', 'Prince', 'King', 'Countess', 'Princess']

function createDeck() {
    cardCollection = [Guard1, Guard2, Guard3, Guard4, Guard5, Priest1, Priest2, Baron1, Baron2, Handmaid1, Handmaid2, Prince1, Prince2, King, Countess, Princess]
    return cardCollection
}

function countessCheck(hand) {
    let countess_msg = 'You have to discard Countess because either the King or a Prince is the other card is your hand, click the button to continue'
    if (hand.includes(Countess) && (hand.includes(King) || hand.includes(Prince1) ||hand.includes(Prince2))) {
        return [false, countess_msg]
    }
    else {
        return [true, null]
    }
}

function getCardTypes() {
    let selections = '<label>Guess the card type</label><select id="cardTypes">'
    for (var i = 1; i < Types.length; i++) {
        if (i === Types.length - 1) {
            selections += '<option value=' + Types[i] + '>' + Types[i] + '</option></select>'
        }
        else {
            selections += '<option value=' + Types[i] + '>' + Types[i] + '</option>'
        }
    }
    return selections
}


module.exports = {
    getNewDeck: createDeck,
    countessCheck: countessCheck,
    getCardTypes: getCardTypes,
}
