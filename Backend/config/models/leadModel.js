const mongoose = require("mongoose");
const Leadcategory = require("./leadCategoryModel");

const leadSchema = new mongoose.Schema({
    leadId: {
        type: String,
        unique: true,
        required: true,
    
    },
    leadcategory: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Leadcategory", // Reference to the LeadCategory model
        },
      ],
      
    status: {
        type: String,
        enum: ["New", "Hot", "Cold", "Warm", "Lost", "Closed", "Pending Approval", "Timepass"],
        required: true,
    },
    month: {
        type: Date,
        default: Date.now,
    },
    manager: {
        type: String,
        required: true,
        enum: ["Rajat", "Tanveer", "Vipash"], 
    },
    dlstatus:{
        type: String,
        enum:["G","G1","G2"]
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    leadSource: {
        type: String,
        enum: ["Walk-in", "Instagram", "Facebook", "Marketplace", "Referral", "Ad", "Car Gurus", "Web"],
        required: true,
    },
    interestedModels: {
        type: [String], // Array of strings for multi-select
        default: [],
    },
    budget: {
        type: Number,
        required: false,
    },
    creditScore: {
        type: Number,
        required: false,
    },
    downPaymentAmount: {
        type: Number,
        required: false,
    },
    paymentPlan: {
        type: String,
        enum: ["Bi-weekly", "Monthly", "Cash Deal"],
        required: false,
    },
    lastFollowUp: {
        type: Date,
        required: false,
    },
    nextFollowUp: {
        type: Date,
        required: false,
    },
    tradeInOption: {
        type: Boolean,
        default: false,
    },
    tradeInVehicleDetails: {
        type: String,
        required: false,
    },
    createdDate: {
        type: Date,
        default: Date.now,
        immutable: true, // Ensures this date does not change
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    assignedTo: {
        type: String,
        required: false,
    },
    priorityLevel: {
        type: String,
        enum: ["High", "Medium", "Low"],
        required: false,
    },
    generalComments: {
        type: String,
        required: false,
    },
    budgetFrom:{
        type:Number
    },
    budgetTo: {
        type:Number
    },
    editHistory: [
        {
            editedAt: { type: Date, default: Date.now }, // Date when the edit was made
            editedBy: { type: String, required: false }, // Who made the edit
            changes: { type: Map, of: String } // Stores changed fields and their new values
        }
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } });

leadSchema.pre('save', function (next) {
    if (this.phoneNumber) {
        this.phoneNumber = this.phoneNumber.replace(/[-]/g, ""); // Remove '+' and '-'
    }
    next();
});
const Lead = mongoose.model("Lead",leadSchema);

module.exports = Lead;