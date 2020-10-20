//api
const Express = require('express')
let router = Express.Router()
const bodyParser = require('body-parser');
const Controller = require('../controllers/loginController')

router.use(bodyParser.json());

router.post('/api/verify',(req,res)=>{
    let account = req.body;
    console.log(account)
    Controller.verifyAccount(account,res)
})

//export
module.exports={
    LoginRoute: router
}
