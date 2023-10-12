const mongoose = require('mongoose')

const connectDB = () =>{
    const url = 'mongodb+srv://anigboj:anigboj@cluster0.rjqsbfb.mongodb.net/file_type?retryWrites=true&w=majority'
    mongoose.connect(url,{useNewUrlParser: true})
    .then((result)=>console.log("connected to database"))
    .catch((err)=>console.log(err));
}


module.exports = connectDB



 




