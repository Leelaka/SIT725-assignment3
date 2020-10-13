// This file is the entry point

const Express = require('express')
let app = new Express()
const PORT = 3000
const Routes = require('./routes')
const mongo = require('./services/mongoService')

//setup the routes


//setup the DB


//testing
app.get('/',(req,res)=>{
    res.send('Testing')
})

app.listen(PORT,()=>{
    console.log('Server is running on ',PORT)
})