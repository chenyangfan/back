const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    contactId: {
        type:String,

    },
    avatar:{
        type:String
    },
})

const Image = mongoose.model('ContactImage', userSchema)

module.exports = Image