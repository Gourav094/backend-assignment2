const express = require('express')
const {getDistance} = require('./distance.controller')

const distanceRouter = express.Router()

distanceRouter.get('/distance',getDistance)

module.exports = distanceRouter