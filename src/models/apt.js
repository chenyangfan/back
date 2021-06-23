const mongoose = require('mongoose')

const Apt = mongoose.model('Apt', {
    name: {
        type:String,
        required: true,
        trim: true
    },
    rent: {
        type: Number,
        required: true,
        validate(value){
            if( value < 0){
                throw new error('Age must be a positive number')
            }
        }
    },
    location: {
        type:String,
        required: true,
        trim:true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    comments:{
      type: Array,
      required:false
    }
})

module.exports = Apt