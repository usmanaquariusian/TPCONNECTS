const User = require('../models/User');
const { SECRET} = require('../config');
const {Strategy, ExtractJwt}= require('passport-jwt');

const  passFunc = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
}



module.exports = passport => {
    passport.use(new Strategy(passFunc, async (payload, done) =>{
        await  User.findById(payload.user_id).then(user =>{
            if (user) {
                // log function here
                return done(null, user);
            }
            return done(null, false);
        }).catch(err =>{
            return done(null, false);
        });
    })
    );
};