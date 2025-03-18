const Lead = require("../config/models/leadModel");
const Counter = require("../config/models/counterModel");
const { model } = require("mongoose");
const { search } = require("../routes");
const Leadcategory = require("../config/models/leadCategoryModel");
const twilioService = require("../services/twilioService");
const Vehicle = require("../config/models/vehicleModel");
const getNextLead = async() => {
    const counter = await Counter.findOneAndUpdate(
        {name : "leadId"},
        {$inc : {sequenceValue : 1}},
        { new: true, upsert: true }
    )

    const leadId = `LD${String(counter.sequenceValue).padStart(4,"0")}`;
    console.log(leadId);
    return leadId;
    

}
const createLead = async(leadData) => {
    try{
        if (leadData.leadCategories) {
      const categories = await Leadcategory.find({
        leadcategory: { $in: leadData.leadCategories }, 
      });

      if (categories.length !== leadData.leadCategories.length) {
        const invalidCategories = leadData.leadCategories.filter(
          (cat) =>
            !categories.some(
              (matchedCat) => matchedCat.leadcategory === cat
            )
        );
        throw new Error(`Invalid categories: ${invalidCategories.join(", ")}`);
      }

      
      leadData.leadcategory = categories.map((category) => category._id);
      delete leadData.leadCategories; 
    }

        const leadId = await getNextLead();

        const newLead = new Lead({ ...leadData,leadId});
        const saveLead = await newLead.save();
        // if (saveLead.phoneNumber) {
        //   const message = `Hi ${saveLead.name}, thank you for your interest! Our team will contact you shortly. Your reference ID is ${saveLead.leadId}.`;
          
          
        //   await twilioService.sendSMS(saveLead.phoneNumber, message);
        // }
    
      
        return saveLead;

    }
    catch (error) {
        console.error("Error in creating lead:", error);
        throw new Error("Failed to create lead");
    }
}

const getAllLeads = async ({filters,search,sortBy}) => {
    try{
        const query = {};
      
        if(filters.status) query.status = filters.status;
        if(filters.manager) query.manager = filters.manager;
        if (filters.priorityLevel) query.priorityLevel = filters.priorityLevel;
        if (filters.leadSource) query.leadSource = filters.leadSource;
        if (filters.interestedModels) {
          query.interestedModels = filters.interestedModels; 
      }
          
    
        if(search) {
          const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
          query.$or = [
              { name: { $regex: escapedSearch, $options: "i" } },
              { email: { $regex: escapedSearch, $options: "i" } },
              { phoneNumber: { $regex: escapedSearch, $options: "i" } },
              { leadId: { $regex: escapedSearch, $options: "i" } }
          ];
        }

        const sortCriteria = {};

        if(sortBy) {
            const[key,order] = sortBy.split(":");
            sortCriteria[key] = order === 'desc' ? -1 : 1;

        }
   const leads = await Lead.find(query).sort(sortCriteria);

        return { leads };
    } catch (error) {
        console.error("Error in getAllLeads service:", error);
        throw new Error("Failed to retrieve leads");
    }
}

const getSingleId = async(id) => {
  try {
    const lead = await Lead.findById(id).populate("leadcategory")
    if(!lead) {
        throw new Error("Lead not found");

    }
    return lead;
  }
  catch(error) {
    throw new Error("Failed to find lead")
  }
}

const updateLead = async (_id, updateData,editedBy) => {
    try {
    const existingLead = await Lead.findById(_id);

    if(!existingLead){
        throw new Error("Lead not found");

    }

    const changes = {};
   if (updateData.leadCategories) {
      const categories = await Leadcategory.find({
        leadcategory: { $in: updateData.leadCategories }, // Match by name
      });

      if (categories.length !== updateData.leadCategories.length) {
        throw new Error("Some lead categories are invalid");
      }

      
      updateData.leadcategory = categories.map((category) => category._id);
      delete updateData.leadCategories; // Remove frontend-only field
    }
    for(const key in updateData){
          if(updateData[key] !== existingLead[key]){
            changes[key] = updateData[key];

          }
    }
      if(Object.keys(changes).length === 0)
        {
            return { message: "No changes detected, lead not updated." };

    }  

    existingLead.editHistory.push({
        editedAt: new Date(),
        editedBy: editedBy || "System",
        changes: changes
    });

    
    Object.assign(existingLead, updateData);

   
    const updatedLead = await existingLead.save();

    return updatedLead;

}catch (error) {
        console.error("Error in updating lead:", error);
        throw new Error("Failed to update lead");
    }
};


const deleteLead = async (_id) => {
  try {
      const updatedLead = await Lead.findByIdAndUpdate(
          _id,
          { isActive: false }, 
          { new: true } 
      );

      if (!updatedLead) {
          throw new Error("Lead not found");
      }

      return updatedLead;
  } catch (error) {
      console.error("Error in marking lead as inactive:", error);
      throw new Error("Failed to update lead status");
  }
};


const bulkupdates = async (leadIds, categories) => {
  try {
    // Validate lead IDs
    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      throw new Error("Lead IDs must be a non-empty array");
    }

    // Validate categories
    if (!Array.isArray(categories) || categories.length === 0) {
      throw new Error("Categories must be a non-empty array");
    }

    // Fetch categories and validate them
    const validCategories = await Leadcategory.find({
      _id: { $in: categories },
    });

    if (validCategories.length !== categories.length) {
      const invalidCategories = categories.filter(
        (category) =>
          !validCategories.some((validCat) => validCat.leadcategory === category)
      );
      throw new Error(`Invalid categories: ${invalidCategories.join(", ")}`);
    }

    // Map valid categories to ObjectIds
    // const categoryIds = validCategories.map((category) => category._id);

    // Perform bulk update
    const updatedLeads = await Lead.updateMany(
      { _id: { $in: leadIds } },
      { $set: { leadcategory: validCategories } }
    );

    if (updatedLeads.matchedCount === 0) {
      throw new Error("No leads found to update");
    }

    return {
      message: "Bulk update successful",
      matchedCount: updatedLeads.matchedCount,
      modifiedCount: updatedLeads.modifiedCount,
    };
  } catch (error) {
    console.error("Error in bulkupdates:", error);
    throw new Error("Failed to perform bulk update");
  }
};

const bulkLeads = async(data) => {
  const results = {
    successful: [],
    skipped: []
  };
  
  try {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const leadId = await getNextLead();
        
        // Handle month logic - set 2025 for Jan, Feb, March and 2024 for other months
        let monthDate = new Date();
        if (row["Month"]) {
          // Create a mapping of month abbreviations to their numeric values (0-based)
          const monthMap = {
            "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
            "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
          };
          
          const monthNum = monthMap[row["Month"]];
          if (monthNum !== undefined) {
            // If month is Jan, Feb, or Mar, use 2025, otherwise use 2024
            const year = (monthNum <= 2) ? 2025 : 2024;
            monthDate = new Date(year, monthNum, 1);
          }
        }
        
        // Parse date strings in format DD-MM-YYYY
        const parseDate = (dateStr) => {
          if (!dateStr) return null;
          
          const dateString = String(dateStr).trim();
          if (dateString.includes('-')) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
              const year = parseInt(parts[2], 10);
              return new Date(year, month, day);
            }
          } 
          // Also handle slash format as a fallback
          else if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              return new Date(year, month, day);
            }
          }
        
          return null;
        };
        
        const newLead = new Lead({
          leadId,
          status: row["Status"] || "New",
          month: monthDate,
          manager: row["Manager"] || "",
          name: row["Name"] || "Unknown",
          phoneNumber: row["Phone"] || "00000",
          leadSource: row["Lead Source"] || "Unknown",
          interestedModels: row["Interested Models"] ? row["Interested Models"].split(",") : [],
          budget: parseFloat(row["Budget"]) || null,
          budgetFrom: parseFloat(row["Budget From"]) || null,
          budgetTo: parseFloat(row["Budget To"]) || null,
          generalComments: row["Comments"] || "",
          lastFollowUp: parseDate(row["Last (latest) Follow-up"]),
          nextFollowUp: parseDate(row["Next Follow-up"]),
          createdDate: new Date(),
          updatedDate: new Date(),
          isActive: true,
          editHistory: []
        });
        
        await newLead.save();
        results.successful.push({
          index: i,
          name: row["Name"] || "Unknown"
        });
      } catch (rowError) {
        results.skipped.push({
          index: i,
          name: row["Name"] || "Unknown",
          error: rowError.message
        });
        console.error(`Error processing row ${i}:`, rowError);
        // Continue to next row instead of stopping the entire process
      }
    }
    
    // Log summary of results
    console.log(`Import completed: ${results.successful.length} leads imported, ${results.skipped.length} rows skipped with errors`);
    
    return results;
  } catch (error) {
    console.error("Error in bulk import process:", error);
    throw error; // Re-throw the error for the calling function
  }
};

const gettopLead = async (filters = {}) => {
  try {
    const { startDate, endDate, model, year, trim, budgetMin, budgetMax } = filters;

    let query = {};

    // Date Filtering
    if (startDate) query.month = { ...query.month, $gte: new Date(startDate) };
    if (endDate) query.month = { ...query.month, $lte: new Date(endDate) };

    // Vehicle Filtering
    let vehicleMatch = {};
    if (model) vehicleMatch.model = model;
    if (year) vehicleMatch.year = parseInt(year);
    if (trim) vehicleMatch.trim = trim;

    // Fetch matching vehicles based on filters
    const vehicles = await Vehicle.find(vehicleMatch).select("model");
    if (!vehicles.length) {
      return { topCarLeads: [], leadsByStatus: [], totalLeads: 0, budgetData: [] };
    }

    const vehicleModels = vehicles.map((v) => v.model);

    // Budget Filtering
    if (budgetMin || budgetMax) {
      query.$or = [];

      if (budgetMin) query.$or.push({ budgetTo: { $gte: parseInt(budgetMin) } });
      if (budgetMax) query.$or.push({ budgetFrom: { $lte: parseInt(budgetMax) } });

      if (query.$or.length === 0) delete query.$or;
    }

    // Aggregate Top Car Leads
    const topCarLeads = await Lead.aggregate([
      { $match: { ...query, interestedModels: { $in: vehicleModels } } },
      { $unwind: "$interestedModels" },
      { $match: { interestedModels: { $in: vehicleModels } } },
      {
        $group: {
          _id: "$interestedModels",
          totalLeads: { $sum: 1 },
        },
      },
      { $sort: { totalLeads: -1 } },
      { $limit: 7 },
    ]);

  
    const leadsByStatus = await Lead.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          totalLeads: { $sum: 1 },
        },
      },
    ]);

    // Aggregate Budget Distribution
    const budgetData = await Lead.aggregate([
      { $match: query },
      {
        $project: {
          budgetRange: {
            $concat: [
              { $toString: "$budgetFrom" },
              " - ",
              { $toString: "$budgetTo" }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$budgetRange",
          totalLeads: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } 
    ]);
    

    const totalLeads = await Lead.countDocuments(query);

    return { topCarLeads, leadsByStatus, totalLeads, budgetData };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data.");
  }
};





module.exports = { createLead, getAllLeads,getSingleId, updateLead, deleteLead,bulkupdates,gettopLead,bulkLeads };