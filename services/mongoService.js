const MongoClient = require('mongodb').MongoClient;

//database connection
const uri = "mongodb+srv://sit725:sit725@test.plk2u.mongodb.net/accountManager?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

let accountCollection;

const connectDB=()=>{
    client.connect((err,db) => {
        accountCollection = client.db('accountManager').collection('account');
        if (!err) {
            console.log('Database connected')
        }
    });
}

//insetion
const insertAccount=(account,res)=>{
    accountCollection.findOne({username: account.username},function(err,exist){
        if (exist) {
            console.log('Account creation failed')
            res.send({result:404})
        }
        else {
            accountCollection.insert(account,(err,result)=>{
                console.log('Account created')
                res.send({result:200})
            })
        }
      })
}

//retrieval
const getAccounts=(res)=>{
    accountCollection.find().toArray(function(err,result){
        if (err) throw err;
        res.send(result)
    })
}

//verification
const verification=(account,res)=>{
    accountCollection.findOne({username: account.username, password: account.password},function(err,exist){
        if (exist) {
            console.log('Login successful')
            res.send({result:200})
        }
        else {
            console.log('Login failed')
            res.send({result:404})
        }
      })
}

//export
module.exports={
    connectDB: connectDB,
    insertAccount,
    getAccounts,
    verification
}