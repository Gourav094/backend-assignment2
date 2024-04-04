const express = require('express')
const app = express()
const mongoose = require('mongoose')
const distanceRouter = require('./routes/distance.router')
require('dotenv').config()


mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('connected to mongo'))
.catch(() => console.log('Error during connecting to mongo'))

app.use(distanceRouter)

app.listen(3000, () => {
    console.log(`http://localhost:3000`)
})