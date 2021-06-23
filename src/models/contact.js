const mongoose = require('mongoose')
const validator =require('validator')

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        unique:true,
        required: true,
        trim: true
    },
    lastName: {
        type:String,
        unique:true,
        required: true,
        trim: true
    },
    email: {
        type:String,
        unique: true,
        required: true,
        trim:true,
        lowercase: true,
        validate(value){
            if( !validator.isEmail(value)){
                throw new Errror('Email is not valid')
            }
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 8,
        trim:true
    }
})


const Contact = mongoose.model('Contact', userSchema)

module.exports = Contact