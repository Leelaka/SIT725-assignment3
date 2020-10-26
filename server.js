// This file is the entry point

const Express = require("express")
let app = new Express()
const PORT = 3000 || process.env.PORT;
const Routes = require('./routes')
const accountDB = require('./services/accountDB')
const roomtDB = require('./services/roomDB')

//setup the socket
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const socket = require('./socket/manager')(io)

//static folder
app.use(Express.static(__dirname + '/public'));

//setup the routes
app.use('/login',Routes.Login.LoginRoute)
app.use('/signup',Routes.Singup.SignupRoute)

//setup the DB
accountDB.connectDB()
roomtDB.connectDB()

server.listen(PORT,()=>{
    console.log('Server is running on ',PORT)
});