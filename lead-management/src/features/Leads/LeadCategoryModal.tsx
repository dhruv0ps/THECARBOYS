import { useState, useEffect } from "react";
import { Button, Modal, Label, TextInput } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { FaChevronLeft } from "react-icons/fa";
import showConfirmationModal from "../../components/confirmationUtil";
export default function LeadCategoryModal(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ leadcategory: string }>({
    leadcategory: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [currentEdit, setCurrentEdit] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/leadcategory`
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching lead categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentEdit) {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/updatecategory/${currentEdit}`,
          formData
        );
        console.log("Updated category:", response.data);
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/leadcategory/add`,
          formData
        );
        console.log("Added category:", response.data);
      }

      setFormData({ leadcategory: "" });
      setCurrentEdit(null);
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, leadcategory: e.target.value });
  };

  const handleEdit = (id: string, name: string) => {
    setCurrentEdit(id);
    setFormData({ leadcategory: name });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirm = await showConfirmationModal("Are you sure want to delete");
    if(!confirm) return

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/leadcategory/${id}`);
      console.log("Deleted category with ID:", id);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="p-4">
           <div className="flex items-center justify-between mb-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-black rounded-md hover:bg-gray-800"
      >
        <FaChevronLeft size={16} style={{ color: "white" }} />
        <span style={{ color: "white" }}>Back</span>
      </button>

      {/* Add New Lead Button */}
      <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800" onClick={() => setIsModalOpen(true)}>
        Add Lead Category
      </button>
    </div>
      {/* Button to open the modal */}
    

      {/* Material-UI Table */}
      <TableContainer className="mt-4 rounded-lg shadow-md border">
        <Table>
          <TableHead style={{ backgroundColor: "black", color: "white" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>Lead Category</TableCell>
              <TableCell style={{ color: "white" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.leadcategory}</TableCell>
                <TableCell align="center">
                  <IconButton
                    style={{ color: "black" }}
                    onClick={() =>
                      handleEdit(category._id, category.leadcategory)
                    }
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    style={{ color: "red" }}
                    onClick={() => handleDelete(category._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal component */}
      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
         className="bg-transparent shadow-none  flex items-center mt-40 ml-48 justify-center "
      popup>
        <div >
          <div className="p-4 rounded-lg shadow-lg bg-transparent border border-gray-300 ">
            <Modal.Header >
              {currentEdit ? "Edit Lead Category" : "Add Lead Category"}
            </Modal.Header>
            <Modal.Body className="bg-transparent">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="leadcategory" value="Category" />
                  <TextInput
                    id="leadcategory"
                    type="text"
                    placeholder="Enter lead category"
                    value={formData.leadcategory}
                    onChange={handleChange}
                    required
                    className="mt-2 bg-transparent"
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer className="flex justify-center gap-4 bg-transparent">
              <Button type="submit" onClick={handleSubmit} className="w-full" color="dark">
                Submit
              </Button>
              <Button
                color="gray"
                onClick={() => setIsModalOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
}