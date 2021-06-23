const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'rentals'

MongoClient.connect(connectionURL, { useNewUrlParser: true,useUnifiedTopology: true }, (error, client) => {

    if(error) {
        return console.log('Unable to coonnect to db')
    }

    const db = client.db(database);

    db.collection('users').insertOne({
        name:'Andrew',
        age:27
    })
    
});