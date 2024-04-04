const mongoose = require('mongoose')

const schema = mongoose.Schema({
    originPin:{
        type:Number,
        required:true,
    },
    destPin:{
        type:Number,
        required:true
    },
    totalDistance:{
        type:JSON,
        required:true
    }
})

const Distance = mongoose.model('Distance',schema)

module.exports = Distance