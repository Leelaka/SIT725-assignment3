
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
    accountCollection.insert(account,(err,result)=>{
        console.log('Account created')
        res.send({result:200})
    })
}

//retrieval
const getAccounts=(res)=>{
    accountCollection.find().toArray(function(err,result){
        if (err) throw err;
        res.send(result)
    })
}


//export
module.exports={
    connectDB: connectDB,
    insertAccount,
    getAccounts
}

//verify 
const verification=(account,res)=>{
    db.collection('account').findOne({ username: req.body.username}, function(err, user) {
        console.log('User found ');
        // if the username typed is invalid 
        if(err) {
          console.log('Username invalid')
          console.log(res.err)
        } 
        if (user && user.password === req.body.password){
          console.log('Username and password is correct');
          console.log(user);
        } else {
          console.log("Incorrect password or username");
          console.log({data: "Login invalid"});
        }              
    });
}

