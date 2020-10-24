// This file is the entry point
const express = require("express");
const PORT = process.env.PORT || 3000;
const Routes = require('./routes');
const mongo = require('./services/mongoService');
const path = require("path");

const app = new express();

//socket
const socket = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socket(server);

//static folder
// app.use("/public", express.static(path.resolve(__dirname, "public")));

// app.get("/*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "public", "index.html"));
// });

app.use(express.static(__dirname + '/public'));

//setup the routes

app.use('/login',Routes.Login.LoginRoute);
app.use('/signup',Routes.Singup.SignupRoute);

//setup the DB
mongo.connectDB();


server.listen(PORT,()=>{
    console.log('Server is running on ',PORT);
});


//requirements 
const { makeid } = require('./utils');


//global state 
const clientRooms = {};

//sockets

io.on('connection', client => {
    console.log('client connected');

    client.on('newGame', handleNewGame);
    // client.on('GameCode', gameCodeSend);

    client.emit('message', "Welcome to Love Letters");

    function handleNewGame() {
        let roomName = makeid(4);
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);
    }

    //whenever the user discount 
    client.on('disconnect', ()=>{
        console.log('Client disconnected');
    });
});
