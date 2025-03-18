const Vehicle = require("../config/models/vehicleModel");
const Counter = require("../config/models/counterModel");

const getNextvehicleId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "vehicleId" },
    {
      $inc: { sequenceValue: 1 },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return `VH${String(counter.sequenceValue).padStart(4, "0")}`;
};

const createVehicle = async (vehicleData) => {
  try {
    const vehicleId = await getNextvehicleId();

    const newVehicle = new Vehicle({
      ...vehicleData,
      vehicleId,
    });

    return await newVehicle.save();
  } catch (error) {
    console.log("ERROR CREATEING VEHICLE ", error);
    throw new Error("Failed to create vehicle");
  }
};

const updateVehicle = async (vehicleId, updateData) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure that validation is applied to the update
      }
    );

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

const getUniqueVehicleModels = async () => {
  try {
    const uniqueModels = await Vehicle.aggregate([
      {
        $group: {
          _id: "$model",
        },
      },
      {
        $project: {
          _id: 0,
          model: "$_id",
        },
      },
    ]);

    return uniqueModels;
  } catch (error) {
    console.error("Error retrieving unique vehicle models:", error);
    throw new Error("Failed to retrieve unique vehicle models");
  }
};
const parseDate = (dateString) => {
  if (!dateString) return null; 
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};
const bulkUpload = async (data) => {
  const results = {
    successful: [],
    skipped: [],
  };
  try {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
      
        const vehicleId = await getNextvehicleId();
        const newVehicle = new Vehicle({
          vehicleId,
          make: row["make"] || "Unknown",
          model: row["model"] || "Unknown",
          year: parseInt(row["year"], 10) || null,
          vin: row["vin"],
          trim: row["trim"] || "",
          bodyType: row["body Type"] || "SUV",
          color: row["color"] || "",
          mileage: parseFloat(row["mileage"]) || null,
          engineType: row["engineType"] || "Gasoline",
          transmission: row["transmission"] || "Automatic",
          fuelType: row["fuelType"] || "Petrol",
          drivetrain: row["drivetrain"] || "FWD",
          condition: row["condition"] || "Used",
          price: parseFloat(row["price"]) || null,
          cost: parseFloat(row["cost"]) || null,
          status: row["status"] || "Available",
          location: row["location"] || "Unknown",
          features: row["features"] ? row["features"].split(",") : [],
          warranty: row["warranty"] || "",
          inspectionDate: parseDate(row["inspectionDate"]),
          dateSold: parseDate(row["Date Sold"]),
          dateAddedToInventory:parseDate(row["dateAddedToInventory"]),
          notes: row["notes"] || "",
        });

        
        await newVehicle.save();
      } catch (innerError) {
        results.skipped.push({ index: i, reason: innerError.message, row });
    }
    }
    return results;
  } catch (error) {
    console.error("Error in bulk upload:", error);
    throw error;
}
};
module.exports = {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleById,
  getUniqueVehicleModels,bulkUpload
};
