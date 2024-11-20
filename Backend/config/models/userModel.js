const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true,

    },

    email : {
        type : String,
        required: true,
        unique : true
    },

    password : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },

    role : {
        type : String,
        require : true,
        enum: ['ADMIN', 'Associate1', 'Associate2',"user"],
    }
})

module.exports = mongoose.model('User',UserSchema);
