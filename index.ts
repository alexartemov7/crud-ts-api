//1. Import packages
import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb'
import 'dotenv/config'
import bcrypt from 'bcrypt'
//2. Use packages
const app = express()
app.use(cors())

app.use(express.json())

const client = new MongoClient(process.env.MONGO_URI as string)
const db = client.db('dinos-store')
const users = db.collection('users')

client.connect()

const PORT = process.env.PORT || 8080

//3. Listen on port
app.listen(PORT, () => console.log(`App is listening on port 8080`))
//4. Create a get endpoint
app.get('/', async (req, res) => {
    const allUsers = await users.find().toArray()
    res.send(allUsers)
})

//5. Create an end point to create a user
app.post('/', async (req, res) => {
    const userEmail = req.body.email
    const userPassword = req.body.password
    const hashPass = await bcrypt.hash(req.body.password, 10)
    const userAdded = await users.insertOne({ email: userEmail, password: hashPass })
    res.status(201).send(userAdded)
})

//6. Create delete endpoint by email
app.delete('/:_id', async (req, res) => {
    const cleanId = new ObjectId(req.params._id)
    console.log('req.params -->', req.params)
    const userDeleted = await users.findOneAndDelete({ _id: cleanId })
    res.send(userDeleted)
})

//7. Create a patch endpoint by email with params
app.patch('/:_id', async (req, res) => {
    const cleanId = new ObjectId(req.params._id)

    const userUpdated = await users.findOneAndUpdate(
        { _id: cleanId }, { $set: req.body })
    res.send(userUpdated)
})

//8. login endpoint
app.post('/login', async (req, res) => {

    const userPassword = req.body.password
    const foundUser = await users.findOne({ email: req.body.email })

    if (foundUser) {
        const passInDb = foundUser?.password
        const result = await bcrypt.compare(userPassword, passInDb)
        console.log('result -> ', result)
        res.send(foundUser)
    } else {
        res.json('User not found!!! X')
    }
})