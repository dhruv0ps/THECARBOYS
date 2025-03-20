const mongoose = require("mongoose");

require('dotenv').config();


// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myProjectDB';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carboys';

mongoose.connect(MONGO_URI);


let db = mongoose.connection

db.on("error",console.error.bind(console,"Database connection error"))

db.once("open",() => {
    console.log("Database connected suucessfully");

})

module.exports = db;
