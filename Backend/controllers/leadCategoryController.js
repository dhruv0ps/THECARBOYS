const leadCategoryService = require("../services/leadCategoryService");

const createLeadCategory = async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

   
    const response = await leadCategoryService.createLeadCategory(data);


    return res.status(201).json({
      message: "Lead category created successfully",
      data: response,
    });
  } catch (error) {
   
    console.error("Error creating lead category:", error);

    return res.status(500).json({
      message: "Failed to create lead category",
      error: error.message || "Internal server error",
    });
  }
};

const getLeadCategory = async(req,res) =>{
    try{
 const response = await leadCategoryService.getLeadCategory();
 return res.status(201).json({
    message: "Lead category fetched successfully",
    data: response,
  });

    }
    catch(error){
        console.log(error)
 return res.status(500).json({
      message: "Failed to fetch Leadcategory",
     
      error: error.message || "Internal server error",
    });
    }

}
const getLeadCategoryByid = async (req,res) => {

    try{
        const id = req.params;
        const response = await leadCategoryService.getLeadCategoryByid(id);
        return res.status(201).json({
            message: "Lead category fetched successfully",
            data: response,
          });

    }
    catch(error){
        console.log(error)
 return res.status(500).json({
      message: "Failed to fetch Leadcategory",
     
      error: error.message || "Internal server error",
    });
    }

    


}

const updateCategory = async(req,res) => {
    try{
    const {id} = req.params;
    const data = req.body; 
     // Validate input
     if (!id) {
        return res.status(400).json({ message: "Category ID is required" });
      }
   const response = await leadCategoryService.updateCategory(id,data);
   return res.status(200).json({
    message: "Category updated successfully",
    data: response,
  });
    }

    catch(error)
    {

    }
}

const deleteCategoryController = async (req, res) => {
    try {
      const { id } = req.params; // Extract the ID from route parameters
  
      // Call the service to delete the category
      const result = await leadCategoryService.deleteCategory(id);
  
      // Respond with success
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in deleteCategoryController:", error.message);
  
      // Handle errors and respond appropriately
      return res.status(500).json({
        message: "Failed to delete category",
        error: error.message || "Internal server error",
      });
    }
  };
module.exports = {
  createLeadCategory,
  getLeadCategory,
  getLeadCategoryByid,
  updateCategory,
  deleteCategoryController,
};
