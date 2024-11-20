const Lead = require("../config/models/leadModel");
const Counter = require("../config/models/counterModel");
const { model } = require("mongoose");
const { search } = require("../routes");
const Leadcategory = require("../config/models/leadCategoryModel");
const twilioService = require("../services/twilioService");

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
        leadcategory: { $in: leadData.leadCategories }, // Match by name
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

      // Map to ObjectIds
      leadData.leadcategory = categories.map((category) => category._id);
      delete leadData.leadCategories; // Remove frontend-only field
    }

        const leadId = await getNextLead();

        const newLead = new Lead({ ...leadData,leadId});
        const saveLead = await newLead.save();
        if (saveLead.phoneNumber) {
          const message = `Hi ${saveLead.name}, thank you for your interest! Our team will contact you shortly. Your reference ID is ${saveLead.leadId}.`;
          
          // Use Twilio or your SMS service to send the message
          await twilioService.sendSMS(saveLead.phoneNumber, message);
        }
    
      
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

        if(search) {
            query.$or = [
                {name : {$regex : search ,$options : "i"}},
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } },
                {leadId : {$regex : search, $options : 'i'}}
            ]
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

      // Map to ObjectIds
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
        editedBy: editedBy || "System", // Record who made the edit (default to "System" if not specified)
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
        const deletedLead = await Lead.findByIdAndDelete(_id);

        if (!deletedLead) {
            throw new Error("Lead not found");
        }

        return deletedLead;
    } catch (error) {
        console.error("Error in deleting lead:", error);
        throw new Error("Failed to delete lead");
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

module.exports = { createLead, getAllLeads,getSingleId, updateLead, deleteLead,bulkupdates };