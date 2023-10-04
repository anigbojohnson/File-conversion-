const User = require('../models/userModel')
const emailValidator = require('email-validator')
const axios = require('axios')
const jwt = require('jsonwebtoken')



const googleLogin = async(req, res)=>{
    const {email,given_name,family_name,picture,name}  = req.body.googleValues; 
    let emailErr= passwordErr = confirmPasswordErr = codeErr = "";
    let status = true;     
    
        if(email =="" || !(emailValidator.validate(email))){
            res.status(400).json({emailErr:'invalid, Please provide your email'})
        }else{

            const userExist = await User.findOne({email})
            if(!userExist){   
                const user =  await User.create({
                    email,
                    given_name,
                    full_name: name,
                    family_name,
                    picture
                })
                res.status(200).json({status:"successfully saved"})
            } else{
                res.status(200).json({status:"existing user, login"})
            }
        
    }
}
 const facebookLogin = async(req, res)=>{
 const {userID , accessToken}  = req.body; 

    let urlGraphFacebook = `https://graph.facebook.com/v16.0/${userID}/?scope=public_profile,email&access_token=${accessToken}`

    await axios(urlGraphFacebook)
    .then(response =>{
        const {email,name} =response;

        let userExist = User.findOne({email});
                if(userExist ){
                    res.json({"token":getToken(email)})            
                }
                else{
                    const userData =  User.create({
                        email,
                        full_name: name,
                    })
                    res.status(200).json({
                        token:getToken(email)
                      
                    })
                }
                
            }
        )
 }
       
 const getToken=(email) => {
    return jwt.sign({ email },process.env.JWT_SECRET,{
        expiresIn:'10m',
    })
}
module.exports ={
    googleLogin,
    facebookLogin
}