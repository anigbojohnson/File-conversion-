const mongoose = require('mongoose')

const userEmailSchema = new mongoose.Schema({
    emailUser:{
        type: String,
        required:[true,'please provide your email'],
        unique: true
    },
    code:{
        type: String,
        required:[true,'please provide your code']
    }

},{
    timestamps:true,
})

module.exports = mongoose.model('validate_email',userEmailSchema)


