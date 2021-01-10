const mongoose = require('mongoose')
const User = require('./user-model')

const workerSchema = new mongoose.Schema({
    name : {
        type: String, 
        required : true
    },
    phoneNumber :{
        type : String
    },
    workerType :{
        type : Number,
        required : true
    },
    wage :{
        type : Number,
        required : true
    },
    paymentHistory :[{
        paymentAmount:{
            type: Number
        },
        paymentDate :{
            type : Date
        },
        paymentDescprition:{
            type : String
        }

    }],
    attendanceHistory :[{
        date :{
            type : Date 
        },
        attendanceType :{
            type : Number
        }
    }],
    manager:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User' // this comes from userSchema, see you have exported something at the bottom, this is it, 'User'
    }

})



const Worker = mongoose.model('Worker', workerSchema)
module.exports = Worker

