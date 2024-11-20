const LeadService = require("../services/LeadService");

const createLead = async(req,res) => {

    try{
const leadData = req.body;

const saveLead = await LeadService.createLead(leadData);

res.status(201).json({
    status : true ,message : "Lead created succeefully",
    lead : saveLead,

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
        };
        const search = req.query.search || ''; 
        const sortBy = req.query.sortBy; // Example: "createdDate:desc"
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
module.exports = { createLead,getAllLeads,getSinglelead ,updateLead, deleteLead};