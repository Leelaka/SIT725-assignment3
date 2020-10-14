//logic
const DB = require('../services/mongoService')

const verifyAccount=(account,res)=>{
    DB.verification(account,res)
}

//export
module.exports={
    verifyAccount
}