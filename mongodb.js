//mongodb setup

const mongodb = require('mongodb')
const mongodbClient = mongodb.MongoClient

const connnectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'WorkerWageDB'


//whenever you do like (error, client)=>{}, this is a callback, will be called by an error or a client
mongodbClient.connect(connnectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('unable to connect to database')
    }
    const db = client.db(databaseName)
})
