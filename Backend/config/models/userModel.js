const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        require: true,
        trim: true
    },

    role: {
        type: String,
        require: true,
        enum: ['ADMIN', 'Associate1', 'Associate2', "User"],
    }
})

module.exports = mongoose.model('User', UserSchema);
