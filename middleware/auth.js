const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/users');
//model is optional

const auth = (req,res,next)=>{
    // const token  = req.header('Authorization').replace('Bearer ','')|| req.cookies.token || req.body.token ;
    const token = req.cookies.token;

    if(!token){
        return res.status(403).send("token is missing")
    }
    try{
        const decode = jwt.verify(token,process.env.SECRET_KEY);
        // console.log(decode);
        const {email} = decode;
        req.user = decode;
        //bring in info from DB also
        User.findOne({email});

    }catch(error){
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = auth;