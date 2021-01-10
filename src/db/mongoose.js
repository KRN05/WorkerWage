const mongodb = require('mongodb')
const mongoose =require('mongoose')
//put the database name after the url.. 
const mConnnectionURL = 'mongodb://127.0.0.1:27017/workerDB'
mongoose.connect(mConnnectionURL, {
     useNewUrlParser:true,
     useCreateIndex:true
})

