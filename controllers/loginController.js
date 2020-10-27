//logic
const accountDB = require('../services/mongoServices')

const verifyAccount=(account,res)=>{
    accountDB.verification(account,res)
}

//export
module.exports={
    verifyAccount
}