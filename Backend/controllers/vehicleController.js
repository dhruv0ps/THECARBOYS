const vehicleService = require('../services/vehicleService');

const createVehicle = async(req,res) => {
        try{
           const vehicleData = req.body;

           const vehicle = await vehicleService.createVehicle(vehicleData);
          return res.status(200).json({status : true ,data : vehicle})
        
        }
        catch(error) {
            console.log(error)
         return res.json({status : false , data : {},})
        }
}
const updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id; 
        const updateData = req.body; 

        const updatedVehicle = await vehicleService.updateVehicle(vehicleId, updateData);

        res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle: updatedVehicle
        });
    } catch (error) {
        console.error("Error in updateVehicle controller:", error);
        res.status(500).json({ error: error.message || "Failed to update vehicle" });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id; 

        const deletedVehicle = await vehicleService.deleteVehicle(vehicleId);

        res.status(200).json({
            message: "Vehicle deleted successfully",
            vehicle: deletedVehicle
        });
    } catch (error) {
        console.error("Error in deleteVehicle controller:", error);
        res.status(500).json({ error: error.message || "Failed to delete vehicle" });
    }
};
const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await vehicleService.getAllVehicles();
        res.status(200).json(vehicles);
    } catch (error) {
        console.error("Error in getAllVehicles controller:", error);
        res.status(500).json({ error: error.message || "Failed to retrieve vehicles" });
    }
};
const getVehicleById = async (req, res) => {
    try {
        const vehicleId = req.params.id; 

        const vehicle = await vehicleService.getVehicleById(vehicleId);

        res.status(200).json(vehicle);
    } catch (error) {
        console.error("Error in getVehicleById controller:", error);
        res.status(500).json({ error: error.message || "Failed to retrieve vehicle" });
    }
};

module.exports = {createVehicle,updateVehicle,deleteVehicle,getAllVehicles,getVehicleById};
