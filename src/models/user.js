const mongoose = require('mongoose')
const validator =require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        unique:true,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        validate(value){
            if( value < 0){
                throw new error('Age must be a positive number')
            }
        }
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
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim:true
    },
    AuthTokens:[{
        AuthToken:{
            type: String,
            required:true
        }
    }]
})

userSchema.pre('save',async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.statics.Validation = async (name,password) => {
    const user = await User.findOne({name})

    if(!user) {
        throw new Error('unable to login')
    }

    const validate = await bcrypt.compare(password, user.password)
    if(!validate){
        throw new Error('wrong password and username combination')
    }
    return user

}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password 
    delete userObject.AuthTokens
    delete userObject.Authtoken
    return userObject
}
userSchema.methods.AuthToken =  async function () {
    const user = this
    const token = jwt.sign({_id:user._id.toString()}, 'thisismynewcourse')
    user.AuthTokens = user.AuthTokens.concat({ AuthToken:token })
    await user.save()
    return token
}
const User = mongoose.model('User', userSchema)

module.exports = User