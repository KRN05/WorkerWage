const jwt = require('jsonwebtoken')
const mUser = require('../models/user-model')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        //below is the decoded payload for the token, and it has _id property already
        const decoded = jwt.verify(token, 'thisisuser')
        const thatuser = await mUser.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!thatuser) {
            throw new Error()
        }
        req.token = token
        req.user = thatuser
        next()
    }
    catch (e) {
        res.status(401).send('error: Please authenticate')
    }
}

module.exports = auth