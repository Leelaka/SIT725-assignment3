// This file is the entry point

const Express = require("express")
let app = new Express()
const PORT = 3000
const Routes = require('./routes')
const mongo = require('./services/mongoService')

app.use(Express.static(__dirname + '/public'));

//setup the routes
app.use('/login',Routes.Login.LoginRoute)
app.use('/signup',Routes.Singup.SignupRoute)

//setup the DB
mongo.connectDB()

app.listen(PORT,()=>{
    console.log('Server is running on ',PORT)
})