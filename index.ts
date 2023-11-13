//1. Import packages
import express from 'express'
import cors from 'cors'
import {MongoClient, ObjectId} from 'mongodb'
import 'dotenv/config'
//2. Use packages
const app = express()
app.use(cors())

app.use(express.json())

const client = new MongoClient(process.env.MONGO_URI as string)
   const db = client.db('dinos-store')
   const users = db.collection('users')

client.connect()


//3. Listen on port
app.listen(process.env.PORT, () => console.log(`App is listening on port 8080`))
//4. Create a get endpoint
app.get('/', async (req, res) => {
   const allUsers = await users.find().toArray()
    res.send(allUsers)
})

//5. Create an end point to create a user
app.post('/', async(req, res) => {
    const userAdded = await users.insertOne(req.body)
    res.status(201).send(userAdded)
})

//6. Create delete endpoint by email
app.delete('/:_id', async (req, res) => {
    const cleanId = new ObjectId(req.params._id)
    console.log('req.params -->', req.params)
    const userDeleted = await users.findOneAndDelete({ _id: cleanId})
    res.send(userDeleted)
})

//7. Create a patch endpoint by email with params
app.patch('/:_id', async (req, res) => {
    const cleanId = new ObjectId(req.params._id)

    const userUpdated = await users.findOneAndUpdate(
        { _id: cleanId}, { $set: req.body})
    res.send(userUpdated)
})