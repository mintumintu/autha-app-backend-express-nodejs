const express = require('express');
const mongoConnect = require('./mongoose');
const User = require('./models/users')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const Contact = require('./models/contacts')
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.status(200).send("<h1>Welcome to the AuthAppNew")
    console.log("Welcome to Auth App")
})
app.get('/Home',(req,res)=>{
    res.status(200).json({
        message:"Welcome"
    })
})

app.get('/secret',auth, async (req,res)=>{
const {email} = req.body;
const user = await User.findOne({email})
    res.status(200).json({
        name:user.name,
        email:user.email
    })
})

app.get('/data', async (req,res)=>{
    try{
        const token  = req.header('Authorization')
        const decode = jwt.verify(token,process.env.SECRET_KEY);
        const {email} = decode
        const data = await User.findOne({email})
        res.status(200).send(data)
    }
    catch(error){
        res.status(401).send(error)
    }

})

app.post('/register',async (req,res)=>{
try{
    const {name,email,password}= req.body;
    if(!(email && password && name)){
        res.status(401).send("All fields are required");
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        res.status(400).send("User already exists");
    }
    const myencpassword = await bcrypt.hash(password,10)
    const user = await User.create({
        name,
        email:email.toLowerCase(),
        password:myencpassword
    })

    user.save();
    res.status(200).send({message:"data saved successfully"});
}
catch(error){
    console.log(error);
}
});

app.post('/login',async (req,res)=>{
    try{
        const {email,password}= req.body;
        if(!(email && password)){
            res.status(400).send("Field is missing");
        }
    const user = await User.findOne({email})
    if(!user){
        res.status.sendI("You are not registered");
    }

   if(user && (await bcrypt.compare(password,user.password))){
    const token = jwt.sign(
       { user_id:user._id,email},
       process.env.SECRET_KEY,
       {
        expiresIn:"2h"
       }
    )
    user.token = token
    user.password = undefined
    // res.status(200).json(user)
    //    const options ={
    //     expires : new Date(Date.now() +3*24 * 60 * 60 * 1000),
    //     httpOnly :true,
    //    }
    // res.status(200).cookie('token',token,options).json({
    //     success: true,
    //     token
    // });
    res.status(200).send(token)
};

    res.status(400).send("Email or password is incorrect");

    }catch(error){
        console.log(error);
    }
})

app.get('/contacts',auth,async (req,res)=>{
    res.status(200).send("All the contacts")
})

app.post('/addcontact',async (req,res)=>{
    try{
        const {name,number}= req.body;
        if(!(name && number)){
            res.status(400).send("All the fields are required");
        }
      const contact = await  Contact.create({
            name,number
        })
        contact.save()
        res.send("Contact Saved Successfully");
    }
    catch(error){
        console.log(error)
    }
    
})

app.listen(4000,()=>{
    console.log("Connected Successfully port 4000");
})