//logic
const accountDB = require('../services/mongoServices')

const addAccount=(account,res)=>{
    accountDB.insertAccount(account,res)
}

//export
module.exports={
    addAccount
}