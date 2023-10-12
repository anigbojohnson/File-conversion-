const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const validEmailCode = require('../models/validate-email')

const protect =  async(req , res, next)=>{
    let token = req.body.headers.authorization.split(' ')[1]; ;
    
    if(req.body.headers.authorization && req.body.headers.authorization.startsWith('Bearer') && token !== ""){
        try{
            
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            req.user = await validEmailCode.find({"emailUser":decoded.email});
            next() 
        }catch(error){
            console.log(error)
            res.status(401).json({tokenErr:'not Authorized'})
        }
    }
    if(!token){
        res.status(401).json({tokenErr:'no token , not Authorized'})
    }
}
module.exports ={ protect }
