const LeadService = require("../services/LeadService");
const ExcelService = require("../services/excelService")
const fs = require('fs').promises;
const createLead = async(req,res) => {

    try{
const leadData = req.body;
const user = req.user.id
const saveLead = await LeadService.createLead(leadData,user);

res.status(201).json({
    status : true ,message : "Lead created succeefully",
    data : saveLead,

})
    }
    catch (error) {
        console.error("Error in createLead controller:", error);
        res.status(400).json({ status: false, data: {}, err: error.message });

    }
}

const getAllLeads = async(req,res) => {
  
    try{
        const filters = {
            status: req.query.status,
            manager: req.query.manager,
            priorityLevel: req.query.priorityLevel,
            leadSource: req.query.leadSource,
            interestedModels : req.query.interestedModels
        };
        const search = req.query.search || ''; 
        const sortBy = req.query.sortBy; 
 const {leads} = await LeadService.getAllLeads({filters,search,sortBy});
  res.status(200).json({status : true , data : leads })
    }
    catch (error) {
        console.error("Error in getAllLeads controller:", error);
        res.status(500).json({ error: "Failed to retrieve leads" });
    }
}
const getSinglelead = async(req,res) => {
    try{
        const id = req.params.id;
     

     const lead = await LeadService.getSingleId(id);
     res.status(200).json({status : true , data : lead })
     
       
    }
    catch(error)
    {
        console.error("Error in getAllLeads controller:", error);
        res.status(500).json({ error: "Failed to retrieve leads" });
    }
}
const updateLead = async (req, res) => {
    try {
        const _id = req.params.id;
        const updateData = req.body; 

        const updatedLead = await LeadService.updateLead(_id, updateData);

        if (updateLead.message === "No changes detected, lead not updated.") {
            return res.status(200).json({ message: updateLead.message });
        }

        res.status(200).json({
            message: "Lead updated successfully",
            lead: updatedLead
        });
    } catch (error) {
        console.error("Error in updateLead controller:", error);
        res.status(500).json({ error: error.message || "Failed to update lead" });
    }
};


const deleteLead = async (req, res) => {
    try {
        const _id = req.params.id; 

        const deletedLead = await LeadService.deleteLead(_id);

        res.status(200).json({
            message: "Lead deleted successfully",
            lead: deletedLead
        });
    } catch (error) {
        console.error("Error in deleteLead controller:", error);
        res.status(500).json({ error: error.message || "Failed to delete lead" });
    }
};
const topLead = async(req,res) => {
    try{
       const toplead = await LeadService.gettopLead(req.body);
       return res.json({ status: true, data: toplead, err: {} });
    }catch (error) {
        console.error("Error in deleteLead controller:", error);
        res.status(500).json({ error: error.message || "Failed to delete lead" });
    }
}
const bulkUpload = async (req, res) => {
    try {
      // console.log(req.file);
      const uploadedFile = req.files?.[0] || req.file;
      if (!uploadedFile) {
        return res.status(400).json({
          status: false,
          data: {},
          err: "No file uploaded"
        });
      }

      let productData;
      try {
        if (req.file.mimetype === 'text/csv') {
          productData = await ExcelService.parseCSV(req.file.path);
        } else {
          productData = ExcelService.parseExcel(req.file.path);
        }
      } catch (error) {
        return res.status(400).json({
          status: false,
          data: {},
          err: `Error parsing file: ${error.message}`
        });
      }

      const result = await LeadService.bulkLeads(productData);

      return res.json({
        status: true,
        data: result,
        err: null
      });
    } catch (error) {
      // console.log(error)
      return res.status(500).json({
        status: false,
        data: {},
        err: error.message
      });
    } finally {
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }
    }
  };
const bulkupdates = async(req,res) => {
    try{
        const { leadIds, categories } = req.body;

        if (!leadIds || !categories) {
          return res.status(400).json({ error: "Lead IDs and categories are required" });
        }
        
        const result = await LeadService.bulkupdates(leadIds,categories);
        res.status(201).json({ success: true, data: result });

    }
    catch (error) {
    console.error("Error in bulk update:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
module.exports = { createLead,getAllLeads,getSinglelead ,updateLead, deleteLead,bulkupdates,topLead,bulkUpload};