const { MongoNetworkError } = require('mongodb')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Worker = require('../models/worker-model')
//const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    totalDue: {
        type: Number
    },
    totalReceivable: {
        type: Number
    },
    totalCashInCM :{  //CM means, of current month
        type : Number
    },
    totalCashOutCM :{
        type : Number
    },
    totalBusinesses: [{
        businessName: {
            type: String,
            required: true
        }
    }],
    totalCashBooks:[{
        cashBook :{
            type:String
        }
    }],

    tokens: [{ //{} this is object,    [{}] this is array of object
        token: {
            type: String,
            required: true
        }
    }]
    // paymentList:{
    //     type : Array
    // },
    // attendaceList:{

    // },
})

//it is vitual because we are not changing anything, we are just creating some link
userSchema.virtual('workers', {
    ref: 'Worker',
    localField: '_id',
    foreignField: 'manager'
})


userSchema.statics.findByCredentials = async (email) => {
    const thatuser = await User.findOne({ email })
    if (!thatuser) {
        throw new Error('Unable to login')
    }

    // const isMatch = await bcrypt.compare(password, thatuser.password)
    // if(!isMatch){
    //     throw new Error('Unable to login')
    // } 
    return thatuser

}

/* When user is logging in, I am returning the whole user data whereas it is also returning 
   the secret info like password and token which is unnecessary
   so below function will return only public data.

   You can replace this getPublicProfile with .. toJSON .. it is a standart fun from NODE.JS
   after doing so, remove getPublicProfile method from login router 
*/

userSchema.methods.toJSON = function () {
    const thisuser = this
    const userObject = thisuser.toObject()

    delete userObject.tokens
    return userObject

}


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisuser')
    user.tokens = user.tokens.concat({ token })
    await user.save() // generating token and saving it to database

    return token
}

//if the user is deleted, all workers related to him will also be deleted
userSchema.pre('remove', async function(next){
    const user = this
    await Worker.deleteMany({manager : user._id})
    next()
})

// Hash the plain text password before saving
// userSchema.pre('save', async function (next) {
//     const user = this

//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next()
// })

const User = mongoose.model('User', userSchema)
module.exports = User