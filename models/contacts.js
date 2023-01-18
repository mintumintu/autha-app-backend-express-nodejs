const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name:{type:String,required:true},
    number:{type:String,required:true}
});

module.exports = mongoose.model('contacts',contactSchema);