//logic
const accountDB = require('../services/accountDB')

const addAccount=(account,res)=>{
    accountDB.insertAccount(account,res)
}

//export
module.exports={
    addAccount
}