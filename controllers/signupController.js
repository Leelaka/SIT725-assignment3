//logic
const DB = require('../services/mongoService')

const addAccount=(account,res)=>{
    DB.insertAccount(account,res)
}

//export
module.exports={
    addAccount
}