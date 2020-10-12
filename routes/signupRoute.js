//api
const Express = require('express')
let router = Express.Router()
const Controller = require('../controllers/signupController')

router.get('/',(req,res)=>{
    console.log('Testing')
    res.send('Testing')
})









//export
module.exports={
    SignupRoute: router
}