const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:[true,'please provide your email'],
        unique: true
    },
    password:{
        type: String,         
    },    
    full_name:{
        type: String,   
    },
    given_name:{
        type: String,     
    },

    family_name:{
        type: String,   
    },
    picture:{
        type: String,     
    }
},{
    timestamps:true,
})

module.exports = mongoose.model('user',userSchema)


