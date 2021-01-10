const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router()
const Worker = require('../models/worker-model')
const { Router } = require('express')

router.post('/workers', auth, async (req, res) => {
    //green is Worker constructor function
    const worker = new Worker({
        ...req.body,   // ... is ES6 spread operator
        //this operator is gonna copy all the property of req body over to this object inside curly braces
        manager : req.user._id
        // auth will handle the above line, no need to fetch it separately
    })

    try {
        await worker.save()
        res.status(201).send(worker)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/workers', auth, async (req, res) => {
    try {
        const workers = await Worker.find({ manager : req.user._id})
        //or just
        //await req.user.populate('workers').execPopulate()
        res.send(workers)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/workers/:id', auth , async (req, res) => {
    const _id = req.params.id

    try { 
        //const worker = await Worker.findById(_id)
        //need some change, so, 
         
        const worker = await Worker.findOne({_id, manager : req.user._id})
        if (!worker) {
            return res.status(404).send()
        }

        res.send(worker)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/workers/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
//    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    // if (!isValidOperation) {
    //     return res.status(400).send({ error: 'Invalid updates!' })
    // }
 
    try {
        const worker = await Worker.findOne({_id:req.params.id, manager : req.user._id})
        //const worker = await Worker.findById(req.params.id)

        if (!worker) {
            return res.status(404).send()
        }
        updates.forEach((update) => worker[update] = req.body[update])
        await worker.save() 
        res.send(worker)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/workers/:id', auth , async (req, res) => {
    try {
        //const worker = await Worker.findByIdAndDelete(req.params.id)
        const worker = await Worker.findOneAndDelete({_id:req.params.id, manager:req.user._id})

        if (!worker) {
            res.status(404).send()
        }

        res.send(worker)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router


