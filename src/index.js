const express = require('express')
const userRouter = require('./routers/user-router.js')
const workerRouter = require('./routers/workers-router.js')

require('./db/mongoose') 

const app = express()   //app is an object of express class
const jwt = require('jsonwebtoken')

//  app.listen(3000)
const port = process.env.PORT || 4000

app.use(express.json())
app.use(userRouter)
app.use(workerRouter)


const myFunction = async()=>{
    const token = jwt.sign({_id:'123'}, 'thisisuser')  //'thisisuser' is a secret to use this jwt, 
    //you can again type ..  ,{expiresIn: '7 days}   .. after thisuser 
    const data = jwt.verify(token, 'thisisuser')
}

myFunction()

const Worker = require('./models/worker-model.js')
const User = require('./models/user-model.js')

// const main = async () => {
//     // const worker = await Worker.findById('5c2e505a3253e18a43e612e6')
//     // await worker.populate('owner').execPopulate()
//     // console.log(worker.owner)

//     const user = await User.findById('5ffae1367c0181186dd214bc')
//     await user.populate('workers').execPopulate()
//     console.log(user.workers)
// }

// main()

app.listen(port , ()=>{
    console.log('server running on port')
})



