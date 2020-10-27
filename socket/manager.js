const UID = require('../services/uid')
const Cards = require('../services/cards')
const Helper = require('../services/helper')
const Btns = require('../services/btns')
const e = require('express')
let players= {}
let rooms= {}

exports = module.exports = function(io){
    io.on('connection', (socket)=>{
        console.log('A user has connected')

        socket.on('disconnecting', ()=>{
            let room = Object.keys(socket.rooms)
            let roomID = Object.keys(socket.rooms)[1]
            if (room.length > 1) {
                if (rooms[roomID].num !== 1) {
                    rooms[roomID].num -= 1
                    rooms[roomID].player = rooms[roomID].player.filter(function(value){ return value !== players[socket.id]})
                    delete players[socket.id]
                }
                else {
                    UID.updateUID(roomID)
                    delete players[socket.id]
                    delete rooms[roomID]
                }
            }
        });

        socket.on('disconnect', ()=>{
            console.log('user disconnected');
        });

        socket.on('welcomeMessage', (username)=>{
            //store user details
            players[socket.id] = {
                id: socket.id,
                username: username,
                currentRoom: null,
                status: 'normal',
                hand: [],
                discardedCards: []
            }
            //send welcome message
            msg = 'Welcome to Love Letter, ' + players[socket.id].username + '!'
            socket.emit('welcomeMessage', msg)
        })

        socket.on('createRoom', ()=>{
            //generate uid
            let roomUID = UID.makeUID()
            players[socket.id].currentRoom = roomUID
            //create the room
            rooms[roomUID] = {
                id: roomUID,
                deck: Cards.getNewDeck(),
                player: [players[socket.id]],
                num: 1,
                discardedCards: [],
                currentTurn: null
            }
            let [room_msg, player_msg] = Helper.roomInfo(rooms[roomUID])
            //join
            socket.join(roomUID)
            console.log(players[socket.id].username + ' created room ' + roomUID)
            socket.emit('room', true, room_msg, player_msg, Btns.btn_quit, Btns.btn_start)
        })

        socket.on('joinRoom', (roomID)=>{
            //check if room id exists
            if (UID.verifyUID(roomID)) {
                //check if room is full
                if (rooms[roomID].num !== 4) {
                    //join
                    socket.join(roomID)
                    players[socket.id].currentRoom = roomID
                    rooms[roomID].player.push(players[socket.id])
                    rooms[roomID].num += 1
                    console.log(players[socket.id].username + ' joined room ' + roomID)
                    //generate room information
                    let [room_msg, player_msg] = Helper.roomInfo(rooms[roomID])
                    io.in(roomID).emit('room', true, room_msg, player_msg, Btns.btn_quit, Btns.btn_start)
                }
                else {
                    msg = 'Sorry, this room is full'
                    socket.emit('room',false, msg)
                }
            }
            //room does not exist
            else {
                msg = 'Sorry, this room does not exist'
                socket.emit('room',false, msg)
            }
        })

        socket.on('back_room', ()=>{
            //generate room information
            let [room_msg, player_msg] = Helper.roomInfo(rooms[players[socket.id].currentRoom])
            io.in(players[socket.id].currentRoom).emit('room', true, room_msg, player_msg, Btns.btn_quit, Btns.btn_start)
        })

        socket.on('quit', ()=>{
            //check number of players in room
            if (rooms[players[socket.id].currentRoom].num !== 1) {
                socket.leave(players[socket.id].currentRoom)
                rooms[players[socket.id].currentRoom].num -= 1
                rooms[players[socket.id].currentRoom].player = rooms[players[socket.id].currentRoom].player.filter(function(value){ return value !== players[socket.id]})
                let [room_msg, player_msg] = Helper.roomInfo(rooms[players[socket.id].currentRoom])
                io.in(players[socket.id].currentRoom).emit('room', true, room_msg, player_msg, Btns.btn_quit, Btns.btn_start)
                players[socket.id].currentRoom = null
                socket.emit('quit')
            }
            //delete room when user is the only player in room
            else {
                UID.updateUID(players[socket.id].currentRoom)
                socket.leave(players[socket.id].currentRoom)
                delete rooms[players[socket.id].currentRoom]
                players[socket.id].currentRoom = null
                socket.emit('quit')
            }
        })

        socket.on('startGame', ()=>{
            let flag = false
            //check if other players still in game
            for (var i = 0; i < rooms[players[socket.id].currentRoom].player.length; i++) {
                if (rooms[players[socket.id].currentRoom].player[i].status === 'inGame' || rooms[players[socket.id].currentRoom].player[i].status === 'protected') {
                    flag = true
                }
            }
            //start fail situations
            if (rooms[players[socket.id].currentRoom].num === 1) {
                let msg = 'Not enough players to start a game!'
                socket.emit('startFail', msg)
                return false
            }
            if (flag) {
                let msg = 'Other players still in game!'
                socket.emit('startFail', msg)
                return false
            }
            //two players mdoe: remove 3 cards from the top of the deck
            else if (rooms[players[socket.id].currentRoom].num == 2) {
                for (var i = 0; i < 3; i++) {
                    var values = Helper.drawCard(rooms[players[socket.id].currentRoom].deck)
                    rooms[players[socket.id].currentRoom].deck = values[0]
                    discarded = values[1]
                    rooms[players[socket.id].currentRoom].discardedCards.push(discarded)
                }
            }
            //shuffle: 
            for (var i = 0; i < rooms[players[socket.id].currentRoom].player.length; i++) {
                rooms[players[socket.id].currentRoom].player[i].status = 'inGame'
                if (rooms[players[socket.id].currentRoom].player[i].id === socket.id) {
                    for (var j = 0; j < 2; j++) {
                        var values = Helper.drawCard(rooms[players[socket.id].currentRoom].deck)
                        rooms[players[socket.id].currentRoom].deck = values[0]
                        draw = values[1]
                        rooms[players[socket.id].currentRoom].player[i].hand.push(draw)
                    }
                }
                else {
                    var values = Helper.drawCard(rooms[players[socket.id].currentRoom].deck)
                    rooms[players[socket.id].currentRoom].deck = values[0]
                    draw = values[1]
                    rooms[players[socket.id].currentRoom].player[i].hand.push(draw)
                }
            }
            //set current player
            rooms[players[socket.id].currentRoom].currentTurn = players[socket.id]
            //send game infomation
            let [players_msg, discarded_msg, remaining_msg, turn_msg, play_msg, wait_msg] = Helper.gameInfo(rooms[players[socket.id].currentRoom])
            let [countess, countess_msg] = Cards.countessCheck(players[socket.id].hand)

            for (var i = 0; i < rooms[players[socket.id].currentRoom].player.length; i++) {
                if (rooms[players[socket.id].currentRoom].player[i].id === socket.id) {
                    //check countess condition
                    if (countess) {
                        let [card_one, card_two] = Helper.handClickable(rooms[players[socket.id].currentRoom].player[i].hand)
                        socket.emit('startGame', players_msg, discarded_msg, remaining_msg, turn_msg, play_msg, card_one, card_two, null)
                    }
                    else {
                        let [card_one, card_two] = Helper.handPic(rooms[players[socket.id].currentRoom].player[i].hand)
                        socket.emit('startGame', players_msg, discarded_msg, remaining_msg, turn_msg, countess_msg, card_one, card_two, Btns.btn_continue)
                    }
                }
                else {
                    let card = rooms[players[socket.id].currentRoom].player[i].hand[0].pic
                    io.to(rooms[players[socket.id].currentRoom].player[i].id).emit('startGame', players_msg, discarded_msg, remaining_msg, turn_msg, wait_msg, card, null, null)
                }
            }
        })

        socket.on('guard', ()=>{
            const selections = Helper.createSelections(rooms[players[socket.id].currentRoom].player, socket.id)
            const cardTypes = Cards.getCardTypes()
            //remove guard from hand
            var values = Helper.removeFromHand(players[socket.id].hand, players[socket.id].discardedCards, rooms[players[socket.id].currentRoom].discardedCards, 'Guard')
            players[socket.id].hand = values[0]
            players[socket.id].discardedCards = values[1]
            rooms[players[socket.id].currentRoom].discardedCards = values[2]
             // if nobody can be selected
            if (selections === false) {
                let msg = '<p>' + players[socket.id].username + ' discarded Guard, but nobody can be selected</p>'
                socket.emit('one_msg_one_btn', msg, btn_ok)
            }
            else {
                socket.emit('two_selections', selections, cardTypes, Btns.btn_guess)
            }
        })

        socket.on('guess', (index, cardType)=>{
            //guess right
            if (rooms[players[socket.id].currentRoom].player[index].hand[0].name === cardType) {
                var values = Helper.elimination(rooms[players[socket.id].currentRoom], rooms[players[socket.id].currentRoom].player[index])
                rooms[players[socket.id].currentRoom] = values[0]
                rooms[players[socket.id].currentRoom].player[index] = values[1]
                let msg = '<p>' + players[socket.id].username + ' discarded Guard on ' + rooms[players[socket.id].currentRoom].player[index].username + ', guesses ' + cardType + ', ' + rooms[players[socket.id].currentRoom].player[index].username + ' has been eliminated</p>'
                io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
            //guess wrong
            else {
                let msg = '<p>' + players[socket.id].username + ' discarded Guard on ' + rooms[players[socket.id].currentRoom].player[index].username + ', guesses ' + cardType + ', but nothing happens</p>'
                io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
        })

        socket.on('priest', ()=>{
            const selections = Helper.createSelections(rooms[players[socket.id].currentRoom].player, socket.id)
            //remove priest from hand
            var values = Helper.removeFromHand(players[socket.id].hand, players[socket.id].discardedCards, rooms[players[socket.id].currentRoom].discardedCards, 'Priest')
            players[socket.id].hand = values[0]
            players[socket.id].discardedCards = values[1]
            rooms[players[socket.id].currentRoom].discardedCards = values[2]
            // if nobody can be selected
            if (selections === false) {
                let msg = '<p>' + players[socket.id].username + ' discarded Priest, but nobody can be selected</p>'
                socket.emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
            else {
                socket.emit('one_selection', selections, Btns.btn_look)
            }
        })

        socket.on('look', (index)=>{
            //target player hand
            let hand = '<p>' + rooms[players[socket.id].currentRoom].player[index].username + ' hand: ' + rooms[players[socket.id].currentRoom].player[index].hand[0].name + '</p>'
            let msg = '<p>' + players[socket.id].username + ' discarded Priest, ' + players[socket.id].username + ' looks at ' + rooms[players[socket.id].currentRoom].player[index].username + ' hand</p><br>'
            socket.emit('two_msg_one_btn', msg, hand, Btns.btn_ok)
            socket.to(players[socket.id].currentRoom).emit('one_msg', msg)
        })

        socket.on('baron', ()=>{
            const selections = Helper.createSelections(rooms[players[socket.id].currentRoom].player, socket.id)
            //remove baron from hand
            var values = Helper.removeFromHand(players[socket.id].hand, players[socket.id].discardedCards, rooms[players[socket.id].currentRoom].discardedCards, 'Baron')
            players[socket.id].hand = values[0]
            players[socket.id].discardedCards = values[1]
            rooms[players[socket.id].currentRoom].discardedCards = values[2]
            // if nobody can be selected
            if (selections === false) {
                let msg = '<p>' + players[socket.id].username + ' discarded Baron, but nobody can be selected</p>'
                socket.emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
            else {
                socket.emit('one_selection', selections, Btns.btn_compare)
            }
        })

        socket.on('compare', (index)=>{
            //if value > target
            if (players[socket.id].hand[0].value > rooms[players[socket.id].currentRoom].player[index].hand[0].value) {
                //target eliminated
                var values = Helper.elimination(rooms[players[socket.id].currentRoom], rooms[players[socket.id].currentRoom].player[index])
                rooms[players[socket.id].currentRoom] = values[0]
                rooms[players[socket.id].currentRoom].player[index] = values[1]
                let msg = '<p>' + players[socket.id].username + ' discarded Baron, ' + players[socket.id].username + ' compares with ' + rooms[players[socket.id].currentRoom].player[index].username + ', ' + rooms[players[socket.id].currentRoom].player[index].username + ' has been eliminated</p>'
                io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
            //if value < target
            else if (players[socket.id].hand[0].value < rooms[players[socket.id].currentRoom].player[index].hand[0].value) {
                //player eliminated
                var values = Helper.elimination(rooms[players[socket.id].currentRoom], players[socket.id])
                rooms[players[socket.id].currentRoom] = values[0]
                players[socket.id] = values[1]
                let msg = '<p>' + players[socket.id].username + ' discarded Baron, ' + players[socket.id].username + ' compares with ' + rooms[players[socket.id].currentRoom].player[index].username + ', ' + players[socket.id].username + ' has been eliminated</p>'
                io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
            //tie
            else {
                let msg = '<p>' + players[socket.id].username + ' discarded Baron, ' + players[socket.id].username + ' compares with ' + rooms[players[socket.id].currentRoom].player[index].username + ', nothing happens</p>'
                io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
        })

        socket.on('handmaid', ()=>{
            var values = Helper.removeFromHand(players[socket.id].hand, players[socket.id].discardedCards, rooms[players[socket.id].currentRoom].discardedCards, 'Handmaid')
            players[socket.id].hand = values[0]
            players[socket.id].discardedCards = values[1]
            rooms[players[socket.id].currentRoom].discardedCards = values[2]
            //change status
            players[socket.id].status = 'protected'
            let msg = '<p>' + players[socket.id].username + ' discarded Handmaid, ' + players[socket.id].username + ' cannot be chosen until the start of his/her next turn</p>'
            io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
        })

        socket.on('prince', ()=>{
            const selections = Helper.createSelections(rooms[players[socket.id].currentRoom].player, null)
            //remove prince from hand
            var values = Helper.removeFromHand(players[socket.id].hand, players[socket.id].discardedCards, rooms[players[socket.id].currentRoom].discardedCards, 'Prince')
            players[socket.id].hand = values[0]
            players[socket.id].discardedCards = values[1]
            rooms[players[socket.id].currentRoom].discardedCards = values[2]
            //if deck is empty
            if (rooms[players[socket.id].currentRoom].deck.length === 0) {
                let msg = '<p>' + players[socket.id].username + ' discarded Prince, but the deck is empty, so nothing happens</p>'
                io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
            else{
                //if nobody can be selected
                if (selections === false) {
                    //the other card is princess
                    if (players[socket.id].hand[0].name === 'Princess') {
                        //player eliminated
                        var values = Helper.elimination(rooms[players[socket.id].currentRoom], players[socket.id])
                        rooms[players[socket.id].currentRoom] = values[0]
                        players[socket.id] = values[1]
                        let msg = '<p>' + players[socket.id].username + ' discarded Prince, but only self can be selected, Princess has been discarded, ' +  players[socket.id].username + ' has been eliminated</p>'
                        io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
                    }
                    else {
                        var values = Helper.drawCard(rooms[players[socket.id].currentRoom].deck)
                        rooms[players[socket.id].currentRoom].deck = values[0]
                        draw = values[1]
                        players[socket.id].hand.push(draw)
                        let msg = '<p>' + players[socket.id].username + ' discarded Prince, but only self can be selected, ' + players[socket.id].username + ' discards the hand and draws a new one</p><br>'
                        let extra = '<p>You draws ' + draw.name + '</p>'
                        socket.emit('two_msg_one_btn', msg, extra, Btns.btn_ok)
                        io.in(players[socket.id].currentRoom).emit('one_msg', msg)
                    }
                }
                //target other players
                else {
                    socket.emit('one_selection', selections, Btns.btn_draw)
                }
            }
        })

        socket.on('drawCard', (index)=>{
            //target hand is princess
            if (rooms[players[socket.id].currentRoom].player[index].hand[0].name === 'Princess') {
                //player eliminated
                var values = Helper.elimination(rooms[players[socket.id].currentRoom], rooms[players[socket.id].currentRoom].player[index])
                rooms[players[socket.id].currentRoom] = values[0]
                rooms[players[socket.id].currentRoom].player[index] = values[1]
                let msg = '<p>' + players[socket.id].username + ' discarded Prince on ' +  rooms[players[socket.id].currentRoom].player[index].username + ', Princess has been discarded, ' + rooms[players[socket.id].currentRoom].player[index].username + ' has been eliminated</p>'
                io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
            else {
                //remove hand
                var values = Helper.removeFromHand(rooms[players[socket.id].currentRoom].player[index].hand, rooms[players[socket.id].currentRoom].player[index].discardedCards, rooms[players[socket.id].currentRoom].discardedCards, rooms[players[socket.id].currentRoom].player[index].hand[0].name)
                rooms[players[socket.id].currentRoom].player[index].hand = values[0]
                rooms[players[socket.id].currentRoom].player[index].discardedCards = values[1]
                rooms[players[socket.id].currentRoom].discardedCards = values[2]
                //draw new card
                var values = Helper.drawCard(rooms[players[socket.id].currentRoom].deck)
                rooms[players[socket.id].currentRoom].deck = values[0]
                draw = values[1]
                rooms[players[socket.id].currentRoom].player[index].hand.push(draw)
                let msg = '<p>' + players[socket.id].username + ' discarded Prince on ' + rooms[players[socket.id].currentRoom].player[index].username + ', ' + rooms[players[socket.id].currentRoom].player[index].username + ' discards the hand and draws a new one</p>'
                io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
        })

        socket.on('king', ()=>{
            const selections = Helper.createSelections(rooms[players[socket.id].currentRoom].player, socket.id)
            //remove king from hand
            var values = Helper.removeFromHand(players[socket.id].hand, players[socket.id].discardedCards, rooms[players[socket.id].currentRoom].discardedCards, 'King')
            players[socket.id].hand = values[0]
            players[socket.id].discardedCards = values[1]
            rooms[players[socket.id].currentRoom].discardedCards = values[2]
            //if nobody can be selected
            if (selections === false) {
                let msg = '<p>' + players[socket.id].username + ' discarded King, but nobody can be selected</p>'
                socket.emit('one_msg_one_btn', msg, Btns.btn_ok)
            }
            else {
                socket.emit('one_selection', selections, Btns.btn_trade)
            }
        })

        socket.on('trade', (index)=>{
            let temp1 = players[socket.id].hand[0]
            let temp2 = rooms[players[socket.id].currentRoom].player[index].hand[0]
            //trade hand
            rooms[players[socket.id].currentRoom].player[index].hand[0] = temp1
            players[socket.id].hand[0] = temp2
            let msg = '<p>' + players[socket.id].username + ' discarded King, ' + players[socket.id].username + ' trades his/her hand with ' + rooms[players[socket.id].currentRoom].player[index].username + '</p>'
            io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
        })

        socket.on('countess', ()=>{
            //remove countess from hand
            var values = Helper.removeFromHand(players[socket.id].hand, players[socket.id].discardedCards, rooms[players[socket.id].currentRoom].discardedCards, 'Countess')
            players[socket.id].hand = values[0]
            players[socket.id].discardedCards = values[1]
            rooms[players[socket.id].currentRoom].discardedCards = values[2]
            let msg = '<p>' + players[socket.id].username + ' discarded Countess, ' + players[socket.id].username + ' does nothing</p>'
            io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
        })

        socket.on('princess', ()=>{
            //player eliminated
            var values = Helper.elimination(rooms[players[socket.id].currentRoom], players[socket.id])
            rooms[players[socket.id].currentRoom] = values[0]
            players[socket.id] = values[1]
            let msg = '<p>' + players[socket.id].username + ' discarded Princess, ' + players[socket.id].username + ' has been eliminated</p>'
            io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', msg, Btns.btn_ok)
        })

        socket.on('next_turn', ()=>{
            let flag = Helper.winnerCheck(rooms[players[socket.id].currentRoom].player, rooms[players[socket.id].currentRoom].deck)
            //someone wins
            if (flag !== false){
                //win
                console.log('winner:',flag)
                let winner_msg = '<p>' + flag.username + ' wins!</p>'
                //reset
                rooms[players[socket.id].currentRoom] = Helper.reset(rooms[players[socket.id].currentRoom])
                //back to room
                io.in(players[socket.id].currentRoom).emit('one_msg_one_btn', winner_msg, Btns.btn_back)
            }
            else {
                //find next one
                rooms[players[socket.id].currentRoom] = Helper.findNext(rooms[players[socket.id].currentRoom])
                //draw
                var values = Helper.drawCard(rooms[players[socket.id].currentRoom].deck)
                rooms[players[socket.id].currentRoom].deck = values[0]
                draw = values[1]
                rooms[players[socket.id].currentRoom].currentTurn.hand.push(draw)

                //update info
                let [players_msg, discarded_msg, remaining_msg, turn_msg, play_msg, wait_msg] = Helper.gameInfo(rooms[players[socket.id].currentRoom])
                let [countess, countess_msg] = Cards.countessCheck(rooms[players[socket.id].currentRoom].currentTurn.hand)

                for (var i = 0; i < rooms[players[socket.id].currentRoom].player.length; i++) {
                    //next turn player
                    if (rooms[players[socket.id].currentRoom].player[i].id === rooms[players[socket.id].currentRoom].currentTurn.id) {
                        //check countess condition
                        if (countess) {
                            let [card_one, card_two] = Helper.handClickable(rooms[players[socket.id].currentRoom].currentTurn.hand)
                            io.to(rooms[players[socket.id].currentRoom].currentTurn.id).emit('startGame', players_msg, discarded_msg, remaining_msg, turn_msg, play_msg, card_one, card_two, null)
                        }
                        else {
                            let [card_one, card_two] = Helper.handPic(rooms[players[socket.id].currentRoom].currentTurn.hand)
                            io.to(rooms[players[socket.id].currentRoom].currentTurn.id).emit('startGame', players_msg, discarded_msg, remaining_msg, turn_msg, countess_msg, card_one, card_two, Btns.btn_continue)
                        }
                    }
                    //other players
                    else {
                        //players are out
                        if (rooms[players[socket.id].currentRoom].player[i].status === 'out') {
                            //generate room information
                            let [room_msg, player_msg] = Helper.roomInfo(rooms[players[socket.id].currentRoom])
                            io.to(rooms[players[socket.id].currentRoom].player[i].id).emit('room', true, room_msg, player_msg, Btns.btn_quit, Btns.btn_start)
                        }
                        //players are still in game
                        else {
                            //generate game information
                            let [players_msg, discarded_msg, remaining_msg, turn_msg, play_msg, wait_msg] = Helper.gameInfo(rooms[players[socket.id].currentRoom])
                            let card = rooms[players[socket.id].currentRoom].player[i].hand[0].pic
                            io.to(rooms[players[socket.id].currentRoom].player[i].id).emit('startGame', players_msg, discarded_msg, remaining_msg, turn_msg, wait_msg, card, null, null)
                        }
                    }
                }

            }
        })

    })
}