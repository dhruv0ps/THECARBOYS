const mongoose = require("mongoose");

const leadCategorySchema = new mongoose.Schema({
    leadcategory :{
        type: String
    } 
})

const Leadcategory = mongoose.model("Leadcategory",leadCategorySchema)

module.exports = Leadcategory