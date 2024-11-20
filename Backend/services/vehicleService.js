const Vehicle = require("../config/models/vehicleModel");
const Counter = require("../config/models/counterModel");

const getNextvehicleId = async() => {
    const counter = await Counter.findOneAndUpdate(
        {name : "vehicleId"},
        {
            $inc : {sequenceValue : 1}
        },
        {
            new: true,upsert: true
        }
    )

    return `VH${String(counter.sequenceValue).padStart(4,"0")}`
}


const createVehicle = async (vehicleData) => {
    try{
        const vehicleId = await getNextvehicleId();

        const newVehicle = new Vehicle({
            ...vehicleData,vehicleId
        });

        return await newVehicle.save();

    }
    catch(error) {
        console.log("ERROR CREATEING VEHICLE ",error)
        throw new Error("Failed to create vehicle");
      
    }
    
}

const updateVehicle = async (vehicleId, updateData) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, updateData, {
            new: true, // Return the updated document
            runValidators: true // Ensure that validation is applied to the update
        });

        if (!updatedVehicle) {
            throw new Error("Vehicle not found");
        }

        return updatedVehicle;
    } catch (error) {
        console.error("Error updating vehicle:", error);
        throw new Error("Failed to update vehicle");
    }
};

const deleteVehicle = async (vehicleId) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId);

        if (!deletedVehicle) {
            throw new Error("Vehicle not found");
        }

        return deletedVehicle;
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        throw new Error("Failed to delete vehicle");
    }
};
const getAllVehicles = async () => {
    try {
        const vehicles = await Vehicle.find();
        return vehicles;
    } catch (error) {
        console.error("Error retrieving all vehicles:", error);
        throw new Error("Failed to retrieve vehicles");
    }
};
const getVehicleById = async (vehicleId) => {
    try {
        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            throw new Error("Vehicle not found");
        }

        return vehicle;
    } catch (error) {
        console.error("Error retrieving vehicle by ID:", error);
        throw new Error("Failed to retrieve vehicle");
    }
};
module.exports = {createVehicle,updateVehicle,deleteVehicle, getAllVehicles, getVehicleById}