const express = require('express')
const { model } = require('mongoose')
const mUser = require('../models/user-model.js')
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/users', async (req, res) => {
    const newUser = new mUser(req.body)

    try {
        await newUser.save()
        const token = await newUser.generateAuthToken()
        res.status(200).send({ newUser, token })
    } catch {
        res.status(400).send(e)
    }
})
//
router.post('/users/login', async (req, res) => {

    try {
        const thisuser = await mUser.findByCredentials(req.body.email)
        const token = await thisuser.generateAuthToken()
        res.send({ thisuser, token })
    }
    catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {  // this token has the object property and _id property
            return token.token != req.token
        })
        await req.user.save()
        res.send('Logged out successfully')
    }
    catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [] // here unlike above, we don't need to filter anything, we delete the while token array
        await req.user.save()
        res.send('Logged out successfully')
    }
    catch (e) {
        res.status(500).send()
    }
})


router.get('/users/me', auth, async (req, res) => {
    try {
        // const allUsers = await mUser.find({})
        // res.status(200).send(allUsers)
        res.status(200).send(req.user)
    }
    catch {
        res.status(404).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    }
    catch {
        res.status(500).send()
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)
    }
    catch {
        res.status(500).send()
    }
})

module.exports = router




//NOT NEEDED
// router.get('/users/:id', auth, async (req, res)=>{
//     const _id = req.params.id
//     try{
//         const thatuser = await mUser.findById(_id)
//         if(!thatuser){
//             return res.status(404).send("not found")
//         }

//         res.status(200).send(thatuser)

//     }
//     catch{
//         res.status(500).send()
//     }
// })