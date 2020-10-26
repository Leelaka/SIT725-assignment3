const MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectID;

//database connection
const url = "mongodb+srv://sit725:sit725@test.plk2u.mongodb.net/roomManager?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

let roomCollection;

const connectDB=()=>{
    client.connect((err,db) => {
        roomCollection = client.db('roomManager').collection('room');
        if (!err) {
            console.log('Room database connected')
        }
    });
}

//insetion
const createRoom=(room,res)=>{
    return new Promise((resolve, reject) => {
        roomCollection.findOne({roomID: room.roomID},function(err,exist){
            array = []; 
            if (exist) {
                console.log('Room creation failed')
                array[0] = false
                resolve(array);
            }
            else {
                roomCollection.insertOne(room,(err,result)=>{
                    console.log('Room created')
                    array[0] = true
                    array[1] = result.ops[0]
                    resolve(array);
                })
            }
        })
    })
}

//get a room
const getOneRoom=(roomID)=>{
    return new Promise((resolve, reject) => {
        roomCollection.findOne({roomID: roomID},function(err,exist){
            if (exist) {
                resolve(exist);
            }
        })
    })
}

// join
const joinRoom=(room, id, username)=>{
    return new Promise((resolve, reject) => {
        roomCollection.findOne({roomID: room.roomID},function(err,exist){
            array = []
            if (exist) {
                if (exist.num < 2) {
                    update = {}
                    update["$set"] = {}
                    update["$set"][username] = id
                    update_num = exist.num + 1
                    update["$set"]["num"] = update_num
                    update_array = exist.players
                    update_array.push(username)
                    update["$set"]["players"] = update_array
                    roomCollection.findOneAndUpdate({_id: ObjectId(exist._id)}, update, { returnOriginal: false }, (err,result)=>{
                        console.log('Join room successful')
                        array[0] = true
                        array[1] = result.value
                        resolve(array);
                    })
                }
                else {
                    console.log('Join room failed')
                    array[0] = false
                    resolve(array);
                }
            }
            else {
                console.log('Join room failed')
                array[0] = false
                resolve(array);
            }
          })
    })
}

//remove&delete
const removeAndDelete=(roomID, id, username)=>{
    roomCollection.findOne({roomID: roomID},function(err,exist){
        if (exist.num == 1) {
            console.log(roomID+' has been deleted.')
            roomCollection.deleteOne({roomID: roomID})
        }
        else {
            update = {}
            update["$set"] = {}
            update["$unset"] = {}
            update["$unset"][username] = id
            update_num = exist.num - 1
            update["$set"]["num"] = update_num
            update_array = exist.players.filter(function(value, index, arr){return value !== username;})
            update["$set"]["players"] = update_array
            roomCollection.updateOne({_id: ObjectId(exist._id)}, update)
        }
    })
}

//export
module.exports={
    connectDB,
    createRoom,
    joinRoom,
    getOneRoom,
    removeAndDelete,
}