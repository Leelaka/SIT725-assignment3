//api
const Express = require('express')
let router = Express.Router()
const Controller = require('../controllers/loginController')

router.get('/',(req,res)=>{
    console.log('Testing')
    res.send('Testing')
})









//export
module.exports={
    LoginRoute: router
}