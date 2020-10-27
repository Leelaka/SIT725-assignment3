const Cards = require('../services/cards')

function createSelections(players, self){
    selectedPlayers = []
    for (var i = 0; i < players.length; i++) {
        if (players[i].status === 'inGame' && players[i].id !== self) {
            selectedPlayers.push({index: i, name: players[i].username})
        }
    }
    if (selectedPlayers.length === 0) {
        return false
    }
    let selections = '<label>Select your target player</label><select id="targetPlayer">'
    for (var i = 0; i < selectedPlayers.length; i++) {
        if (i === selectedPlayers.length - 1) {
            selections += '<option value=' + selectedPlayers[i].index + '>' + selectedPlayers[i].name + '</option></select><br>'
        }
        else {
            selections += '<option value=' + selectedPlayers[i].index + '>' + selectedPlayers[i].name + '</option>'
        }
    }
    return selections
}

function drawCard(deck) {
    let random = Math.floor(Math.random() * deck.length);
    let card = deck[random]
    deck.splice(random, 1);
    return [deck, card];
}

function removeFromHand(hand, discardedCards, discardedCards_room, card) {
    if (hand.length === 2 && (hand[0].name === hand[1].name)) {
        discardedCards.push(hand[1])
        discardedCards_room.push(hand[1])
        hand.pop()
    }
    else if (hand.length === 2 && (hand[0].name !== hand[1].name)) {
        var discard = hand.filter(function(value, index, arr){ return value.name === card})
        var hand = hand.filter(function(value, index, arr){ return value.name !== card})
        discardedCards.push(discard[0])
        discardedCards_room.push(discard[0])
    }
    else {
        discardedCards.push(hand[0])
        discardedCards_room.push(hand[0])
        hand.pop()
    }
    return [hand, discardedCards, discardedCards_room]
}

function winnerCheck(players, deck) {
    let anlivePlayers = []
    let max_value = 0
    let winner = []
    let score = []
    let sum = 0
    for (var i = 0; i < players.length; i++) {
        if (players[i].status !== 'out') {
            anlivePlayers.push(players[i])
        }
    }
    //only one
    if (anlivePlayers.length === 1) {
        return anlivePlayers[0]
    }
    //deck empty
    if (deck.length === 0) {
        for (var i = 0; i < anlivePlayers.length; i++) {
            if (anlivePlayers[i].hand[0].value > max_value) {
                max_value = anlivePlayers[i].hand[0].value
                winner = []
                winner.push(anlivePlayers[i])
            }
            else if (anlivePlayers[i].hand[0].value === max_value) {
                winner.push(anlivePlayers[i])
            }
        }
        if (winner.length === 1){
            return winner[0]
        }
        else {
            for(var i = 0; i < winner.length; i++) {
                for (var j = 0; j < winner[i].discardedCards.length; j++) {
                    sum += winner[i].discardedCards[j].value
                }
                score.push(sum)
                sum = 0
            }
            max_value = Math.max(score)
            index = score.indexOf(max_value)
            return winner[index]
        }
    }

    return false
}

function roomInfo (room) {
    let player_msg = '<p>'
    room_msg = '<p>You are currently in room ' + room.id + ', players in this room:</p>'
    for (var i = 0; i < room.player.length; i++) {
        if (i === room.player.length - 1) {
            player_msg += room.player[i].username + '(' + room.player[i].tokens + ')' + '</p><p>(The number in brackets is the number of tokens the player has earned in this room)</p>'
        }
        else {
            player_msg += room.player[i].username + '(' + room.player[i].tokens + ')' + ', '
        }
    }
    return [room_msg, player_msg]
}

function gameInfo(room) {
    let remaining_msg = 'Remaining cards: ' + room.deck.length
    let turn_msg = 'This is ' + room.currentTurn.username + ' turn'
    let play_msg = 'Discard one of the following: '
    let wait_msg = 'Your hand is listed below, waiting for ' + room.currentTurn.username + ' to discard card'
    let players_msg = 'Players in this game: '
    let discarded_msg = 'Discarded cards in this game: '
    for (var i = 0; i < room.player.length; i++) {
        if (i === room.player.length - 1) {
            players_msg += room.player[i].username
        }
        else {
            players_msg += room.player[i].username + ', '
        }
    }
    for (var i = 0; i < room.discardedCards.length; i++) {
        if (i === room.discardedCards.length - 1) {
            discarded_msg += room.discardedCards[i].name
        }
        else {
            discarded_msg += room.discardedCards[i].name + ', '
        }
    }

    return [players_msg, discarded_msg, remaining_msg, turn_msg, play_msg, wait_msg]
}

function handClickable(hand) {
    let card_one = hand[0].clickable
    let card_two = hand[1].clickable

    return [card_one, card_two]
}

function handPic(hand) {
    let card_one = hand[0].pic
    let card_two = hand[1].pic

    return [card_one, card_two]
}

function elimination(room, player) {
    room.discardedCards = room.discardedCards.concat(player.hand)
    player.hand = []
    player.discardedCards = []
    player.status = 'out'

    return [room, player]
}

function reset(room) {
    room.deck = Cards.getNewDeck()
    room.discardedCards = []
    room.currentTurn = null
    for (var i = 0; i < room.player.length; i++) {
        room.player[i].status = 'normal'
        room.player[i].hand = []
        room.player[i].discardedCards = []
    }

    return room
}

function findNext(room) {//debuging
    let currentIndex = room.player.indexOf(room.currentTurn)
    let nextIndex = 0
    if (currentIndex !== room.player.length - 1) {
        nextIndex = currentIndex + 1
    }
    while (room.player[nextIndex].status === 'out') {
        if (nextIndex === room.player.length - 1) {
            nextIndex = 0
        }
        else {
            nextIndex += 1
        }
    }
    //change status
    room.currentTurn = room.player[nextIndex]
    if (room.currentTurn.status === 'protected') {
        room.currentTurn.status = 'inGame'
    }
    return room
}

function roomMsgBoard(messages){
    let roomMsgs = ''
    for (var i = 0; i < messages.length; i++) {
        roomMsgs += '<p>' + messages[i] + '</p>'
    }

    return roomMsgs
}

module.exports = {
    createSelections: createSelections,
    drawCard: drawCard,
    removeFromHand: removeFromHand,
    winnerCheck: winnerCheck,
    roomInfo: roomInfo,
    gameInfo: gameInfo,
    handClickable: handClickable,
    handPic: handPic,
    elimination: elimination,
    reset: reset,
    findNext: findNext,
    roomMsgBoard: roomMsgBoard,
}
