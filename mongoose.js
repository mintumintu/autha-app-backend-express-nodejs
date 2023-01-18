const mongoose = require('mongoose');
require('dotenv').config();

const mongoConnect = function (){mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Successfully connected to the Mongodb");
}).catch(error=>{
    console.log("Unable to Connect to the Database");
})
}

module.exports =mongoConnect();
