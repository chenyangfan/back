const mongoose = require('mongoose')
const validator =require('validator')
mongoose.connect('mongodb://127.0.0.1:27017/rentals',{
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type:String,
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
        required: true,
        trim:true,
        lowercase: true,
        validate(value){
            if( !validator.isEmail(value)){
                throw new Errror('Email is not valid')
            }
        }
    }
})

const user = new User({
    name:'test',
    age: 20,
    email:'abc@'
})

user.save().then(() => {
    console.log(user)
}).catch((error) => {
    console.log('Error',error)
})



const Rental = mongoose.model('Rental', {
    location: {
        type: String
    },
    url: {
        type: String
    }
})

const rental = new Rental({
    location:'University Street',
    url:'dsddasdsafdsa'
})
rental.save().then( () => {
    console.log(rental)
}).catch((error) => {
    console.log(error)
});