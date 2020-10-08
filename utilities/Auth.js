const  User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {SECRET} = require('../config');
const passport = require('passport');


//------------------------------------------------------------------------------------

// Registration of the User.
const userRegister = async (userDets, role , res) =>{

    try {
        // Username Validation
        let usernameNotTaken = await validateUsername(userDets.username);
        if(!usernameNotTaken){
            return res.status(400).json({
                message: `Username is already taken`,
                success: false
            });
        }

// email Validation
        let emailNotRegistered = await validateEmail(userDets.email);
        if(!emailNotRegistered){
            return res.status(400).json({
                message: `Email is already Registered`,
                success: false
            });
        }

        //Password hashed
        const password = await  bcrypt.hash(userDets.password, 12);
        // create new user
        const newUser = new User({
            ...userDets,
            password,
            role
        });
        await  newUser.save();
        return  res.status(201).json({
            message: "Registered Successfully, Login Please", success: true
        });
    }catch (err) {
        return  res.status(500).json({
            message: "Error Creating Account", success: false
        });
    }
};

//-------------------------------------------------------------------------------------------------

const userLogin = async  (userCred, role, res) =>
{
    let { username, password} = userCred;
    //Check username in DB
    const user = await  User.findOne({username});
    if(!user) {
        return res.status(404).json({
            message: "Invalid Credentials",
            success: false
        });
    }
    if (user.role !== role) {
        return  res.status(403).json({
            message: "Please make sure you are login to right portal",
            success:false
        });
    }
    // check pass, user is in DB
    let  isMatch = await bcrypt.compare(password,user.password);
    if(isMatch) {
        let  token = jwt.sign({
            user_id: user._id,
            role: user.role,
            username: user.username,
            email: user.email
        }, SECRET, {expiresIn: "10 days"});
        let result = { username: user.username,
        role: user.role,
        email: user.email,
        token: `Bearer ${token}`,
        expiresIn: 170};
        return  res.status(200).json({
            ...result,
            message: "Logged In",
            success:true } )
    }else {
        return  res.status(403).json({
            message: "Incorrect Password",
            success:false } )
}};

//--------------------------------------------------------------------------------------

// Validations
const validateUsername = async username => {
    let user = await User.findOne({username: username});
    return user ? false : true;
};

const validateEmail = async email => {
    let user = await User.findOne({email:email});
    return user ? false : true;
};

//-----------------------------------------------------------------------------
//passpoert Middleware

const userAuth = passport.authenticate("jwt", { session: false});

//----------------------------------------------------------------
//Serializing password
const serializeUser = user => {
    return {
        username: user.username,
        email: user.email,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    };
};
//---------------------------------------------------------------------------
// Role Based Middleware
const checkRole = roles => (req,res,next) => !roles.
includes(req.user.role) ?
    res.status(401).json("Unauthorized") : next();

//----------------------------------------------------------------------------------------

module.exports= { checkRole, serializeUser, userAuth, userLogin, userRegister };