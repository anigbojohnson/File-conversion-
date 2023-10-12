const express = require('express')
const color = require('colors')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const connectDB = require('./config/databaseConfig')
const port = process.env.PORT || 9000
const session = require('express-session')
const app = express()
let bodyParser = require('body-parser')

const passport =require('passport')


app.use((request,response,next)=>{
  response.header("Access-Control-Allow-Origin","http://localhost:3000"),
  response.header("Access-Control-Allow-Method","GET,POST"),
  response.header("Access-Control-Allow-Headers","Content-Type,Origin,Authorization"),
  response.header("Access-Control-Allow-Credential",true), 
  next()
}
); 

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100,
  extended: true,
  parameterLimit:1000000
}));

app.use(bodyParser.json({
  limit: '50mb',
}));

require('./config/passport')(passport)


connectDB()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  


 
app.use('/api/users',require('./routes/userRoute'))
app.use('/api/file',require('./routes/fileRoute'))


app.listen(port,()=>console.log(`server started on port ${port}`))







