// vehicleModel.js

const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    vehicleId: {
        type: String,
        unique: true,
        required: true,
        // auto: true // Auto-generated, can be handled in the service layer
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    vin: {
        type: String,
        unique: true,
        required: true
    },
    trim: {
        type: String
    },
    bodyType: {
        type: String,
        enum: ["Sedan", "SUV", "Coupe", "Truck", "Convertible", "Minivan"]
    },
    color: {
        type: String
    },
    mileage: {
        type: Number
    },
    engineType: {
        type: String,
        enum: ["Gasoline", "Diesel", "Hybrid", "Electric"]
    },
    transmission: {
        type: String,
        enum: ["Automatic", "Manual", "CVT"]
    },
    fuelType: {
        type: String,
        enum: ["Petrol", "Diesel", "Electric", "Hybrid"]
    },
    drivetrain: {
        type: String,
        enum: ["FWD", "RWD", "AWD", "4WD"]
    },
    condition: {
        type: String,
        enum: ["New", "Used", "Certified Pre-Owned"],
        required: true
    },
    price: {
        type: Number
    },
    cost: {
        type: Number
    },
    status: {
        type: String,
        enum: ["Available", "Reserved", "Sold", "Maintenance", "Pending Approval"]
    },
    location: {
        type: String
    },
    features: {
        type: [String] // Array of strings for multi-select options
    },
    warranty: {
        type: String
    },
    inspectionDate: {
        type: Date
    },
    dateAddedToInventory: {
        type: Date,
        default: Date.now // Auto-generated
    },
    dateSold: {
        type: Date
    },
    notes: {
        type: String
    }
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
