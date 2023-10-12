const FacebookStrategy = require('passport-facebook').Strategy
const user = require('../models/userModel')

module.exports = (passport)=>{
  
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/users/facebook/oauth20/facebook-oauth20",
        profileFields:['id','displayName','name','gender','picture.type(large)','email'],
        
      },

      async (accessToken, refreshToken, profile, done) =>{
        console.log(profile)

      }
    ))
        passport.serializeUser((userCreate, done) =>{
        done(null, userCreate.id);
      });
      
      passport.deserializeUser((id, done) =>{
      user.findById(id,  (err, userCreate) =>{
          done(err, userCreate);
        })
      })
}



