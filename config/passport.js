const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const config = require('./config')
const User = require('../../class39-materials/models/User')


module.exports = function(passport){
  passport.use(
     new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
         //   console.log(profile);
           
           const newUser = {
              googleId: profile.id,
              displayName: profile.displayName
           }

           try {
              let user = await User.findOne({googleId: profile.id})

              if(user){
                 done(null, user)
              } else {
                 user = await User.create(newUser)
                 done(null, user)
              }
           } catch (err) {
              console.error(err)
           } 
        })),

     passport.serializeUser((user, done) => {
      done(null, user.id)
     })

     passport.deserializeUser( async (id, done) => {
        
        const user = await User.findById(id);
        done(null, user)
     }
  )
}