//api
const Express = require('express')
let router = Express.Router()
const bodyParser = require('body-parser');
const Controller = require('../controllers/signupController')

router.use(bodyParser.json());

router.post('/api/account',(req,res)=>{
    let account = req.body;
    console.log(account)
    Controller.addAccount(account,res)
})

//export
module.exports={
    SignupRoute: router
}