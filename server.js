// This file is the entry point

const Express = require("express")
let app = new Express()
const PORT = 3000 || process.env.PORT;
const Routes = require('./routes')
const mongo = require('./services/mongoService')
const socketio = require('socket.io');

//new changes for room creation
const http = require('http');
const server = http.createServer(app);
const io = socketio(server);

//static folder
app.use(Express.static(__dirname + '/public'));

//Run sockets when client connects
io.on('connection', socket => {
    console.log('client connected');
    socket.emit('message', "Welcome to Love Letters");

    //one to many when user connects
    socket.broadcast.emit('message', "Yay a user joined! Let's begin the game!");

    //io.emit();
    //whenever the user discount 
    socket.on('disconnect', ()=>{
        console.log('Client disconnected');
        io.emit('message', "Oh no! The user has disconnected!");
    });
});

//setup the routes
app.use('/login',Routes.Login.LoginRoute)
app.use('/signup',Routes.Singup.SignupRoute)

//setup the DB
mongo.connectDB()

server.listen(PORT,()=>{
    console.log('Server is running on ',PORT)
})

//sockets