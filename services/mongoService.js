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




//export
module.exports={
    connectDB: connectDB
}