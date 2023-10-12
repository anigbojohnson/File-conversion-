const User = require('../models/userModel')
const bcript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const emailValidator = require('email-validator')
const validEmailCode = require('../models/validate-email')

const getCode = async( req, res)=>{
    const { email} = req.body         

        if(email =="" || !(emailValidator.validate(email))){
            res.status(400).json({emailErr:'invalid, Please provide your email'})
        } else{
        const userExist = await User.findOne({email})
        
        if(userExist){
            res.status(400).json({emailErr:'User Already registered'});
        } else{
          const randonNumber = Math.floor(Math.random()*1000000)

          const emailExist = await validEmailCode.findOne({emailUser:email})
          if(emailExist){
            let result = await validEmailCode.updateOne({
                emailUser: email
            },
            {
              $set:{code:randonNumber}  
            })
          }else{
            const validUser =  await validEmailCode.create({
                emailUser:email,
                 code: randonNumber+''
             })
          }


        let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'anigbojohnson@outlook.com', // generated ethereal user
            pass: 'Charis123$', // generated ethereal password
        },
        });

  // send mail with defined transport object
        const options = {
                    from: 'anigbojohnson@outlook.com', // sender address
                    to: email, // list of receivers
                    subject: "Verify Email", // Subject line
                    text: "Hello world?", // plain text body
                    html: 'The generated code  is '+ randonNumber  // html body
                };
        transporter.sendMail(options, function (err,info){
        try{
         //   console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            res.status(201).json({email:email,status:true,emailMsg:"please check ,message sent to email ",token:getToken(email)}); 
        }
        catch(err){
            res.status(400).json({status:true}); 
            throw err;
        }
     })
   }
 }
}



const registerUser = async(req, res)=>{
            const { email, password ,confirmPassword , code} = req.body  
            let emailErr= passwordErr = confirmPasswordErr = codeErr = "";
            let status = true;     
            
                if(email !== req.user[0].emailUser){
                    emailErr = 'invalid! , please authenticate your email';
                    status = false;  
                } 
                    let passwordRegEx = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/"
                if(!(!passwordRegEx.match(password) )){
                    passwordErr = 'Must be Minimum of eight characters, at least one uppercase letter, one lowercase letter and one number';
                    status = false;  
                } 
                if(password !== confirmPassword){
                    confirmPasswordErr = 'password do not match';
                    status = false;  
                }

                if(req.user[0].code !== code){
                    codeErr = 'code do not match';
                    status = false;  
                } 
                    
                
            
                        if(status === false){
                            res.send({emailErr:emailErr,passwordErr:passwordErr,confirmPasswordErr:confirmPasswordErr,codeErr:codeErr}); 
                             
                        }else{

                        
                        const salt = await bcript.genSalt(10)
                        const hashedPassword = await bcript.hash(password , salt)
                    const user =  await User.create({
                        email,
                        password: hashedPassword
                      
                    })
                    if(user){
                        res.status(201).json({
                            token: req.body.token
                        })
                    } else{
                        res.status(400).json("invalid user data")
                    }
                }
            }
const loginUser = async(req, res)=>{

        const {email , password} = req.body    
        
        const user = await User.findOne({email})

        if(user && (await bcript.compare(password , user.password))){
            res.status(201).json({
                email,
                token: getToken(user.email)
            })
        } else{
            res.status(400).json({loginErr:"invalid credential"});
        }
    }

const getToken=(email) => {
    return jwt.sign({ email },process.env.JWT_SECRET,{
        expiresIn:'10m',
    })
}
module.exports ={
    registerUser, 
    loginUser,
    getCode
}
