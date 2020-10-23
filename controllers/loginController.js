//logic
const accountDB = require('../services/accountDB')

const verifyAccount=(account,res)=>{
    accountDB.verification(account,res)
}

//export
module.exports={
    verifyAccount
}