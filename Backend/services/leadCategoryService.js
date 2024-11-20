const Leadcategory = require("../config/models/leadCategoryModel");

const createLeadCategory = async(data) => {
  const newCategory = new Leadcategory(data);
  return await newCategory.save();

} 

const getLeadCategory = async() => {
    const data = await Leadcategory.find();
   return data;

}

const getLeadCategoryByid = async (id) => {
    const data =  await Leadcategory.findById(id);
    return data;

}

const updateCategory = async (id, data) => {
    try {
      // Validate input
      if (!id || !data) {
        throw new Error("ID and data are required to update the category");
      }
  
      
      const response = await Leadcategory.findByIdAndUpdate(
        id,
        data, 
        { new: true, runValidators: true } 
      );
  
      
      if (!response) {
        throw new Error(`Category with ID ${id} not found`);
      }
  
      return response;
    } catch (error) {
      console.error("Error updating category:", error.message);
      throw error; 
    }
  };
  const deleteCategory = async (id) => {
    try {
    
      if (!id) {
        throw new Error("ID is required to delete the category");
      }
  
     
      const response = await Leadcategory.findByIdAndDelete(id);
  
   
      if (!response) {
        throw new Error(`Category with ID ${id} not found`);
      }
  
      return { message: "Category deleted successfully", data: response };
    } catch (error) {
      console.error("Error deleting category:", error.message);
      throw error; 
    }
  };
  
  module.exports = {
    createLeadCategory,
    getLeadCategory,
    getLeadCategoryByid,
    updateCategory,
    deleteCategory, 
  };
  