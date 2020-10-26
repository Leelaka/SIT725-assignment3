const roomDB = require('../services/roomDB')
const users= {}
const rooms= {}

exports = module.exports = function(io){
    io.on('connection', (socket)=>{
        console.log('A user has connected')

        socket.on('disconnecting', ()=>{
            if (Object.keys(socket.rooms).length > 1) {
                roomDB.removeAndDelete(rooms[socket.id])
            }
        });

        socket.on('disconnect', ()=>{
            console.log('user disconnected');
        });

        socket.on('welcomeMessage', (username)=>{
            users[socket.id] = username
            msg = 'Welcome to Love Letter,  ' + users[socket.id] + '!'
            socket.emit('welcomeMessage', msg)
        })

        socket.on('createRoom', (room)=>{
            rooms[socket.id] = room.roomID
            room[users[socket.id]] = socket.id
            room.players.push(users[socket.id])
            let flag = roomDB.createRoom(room)
            flag.then(function(result){
                if (result[0]) {
                    socket.join(room.roomID)
                    console.log(users[socket.id] + ' created room ' + room.roomID)
                }
                socket.emit('createRoom',result)
            })
        })

        socket.on('joinRoom', (room)=>{
            rooms[socket.id] = room.roomID
            let flag = roomDB.joinRoom(room, socket.id, users[socket.id])
            flag.then(function(result){
                if (result[0]) {
                    socket.join(room.roomID)
                    console.log(users[socket.id] + ' joined room ' + room.roomID)
                }
                socket.emit('joinRoom',result)
            })
        })

        socket.on('refresh', ()=>{
            let promise = roomDB.getOneRoom(rooms[socket.id])
            promise.then(function(room){
                socket.emit('refresh',room)
                }
            )
        })

        socket.on('quit', ()=>{
            roomDB.removeAndDelete(rooms[socket.id], socket.id, users[socket.id])
            socket.leave(rooms[socket.id])
            rooms[socket.id] = undefined
            socket.emit('quit')
        })

        socket.on('startGame', ()=>{
            let promise = roomDB.getOneRoom(rooms[socket.id])
            promise.then(function(room){
                if (room.num == 2) {
                    io.in(rooms[socket.id]).emit('startGame')
                }
                else {
                    socket.emit('startFail')
                }
                }
            )
        })

    })
}