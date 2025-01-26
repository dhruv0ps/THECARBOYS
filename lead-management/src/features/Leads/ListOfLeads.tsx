import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Checkbox
  
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import debounce from 'lodash/debounce';
import showConfirmationModal from "../../components/confirmationUtil";
import { toast } from "react-toastify";
import { FaChevronLeft } from "react-icons/fa";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import CustomModal from "../../components/CustomModal";
import BulkUpdateModal from "../../components/BulkUpdateModal";
import { Lead } from "../../models/Lead";
const ListOfLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [priorityFilter, _setPriorityFilter] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Lead>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;
  const [modelFilter, setModelFilter] = useState<string>(""); 
  const [models, setModels] = useState<string[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]); 
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false); 
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const { model } = useParams<{ model: string }>();
const openModal = (leadId: string) => {
  setSelectedLeadId(leadId);
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
  setSelectedLeadId(null);
};

const handleSendSMS = async (message: string) => {
  if (!selectedLeadId) return;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/send-sms/${selectedLeadId}`,
      { message }
    );

    if (response.status === 201) {
      toast.success("SMS sent successfully!");
    } else {
      toast.error("Failed to send SMS. Please try again.");
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    toast.error("Failed to send SMS. Please check the details and try again.");
  }
};
useEffect(() => {
  fetchData();
  fetchCategories();
  fetchModels();
}, [searchQuery, statusFilter, leadSourceFilter,modelFilter, priorityFilter, sortField, sortOrder]);
useEffect(() => {
  if (model) {
    setModelFilter(model);
  }
}, [model]);
const fetchModels = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/models`);
    const data = response.data;
    const fetchedModels = data.map((car: any) => car.model);
    setModels(fetchedModels);
  } catch (error) {
    console.error("Error fetching models:", error);
    toast.error("Failed to fetch models.");
  }
};

const fetchCategories = async () => {
  
  try {
    const response = await axios.get( `${import.meta.env.VITE_BACKEND_URL}/leadcategory`);
    setCategories(response.data.data);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
const fetchData = async () => {
  setIsLoading(true);
  try {
    const params = {
      search: searchQuery,
      status: statusFilter,
      leadSource: leadSourceFilter,
      priority: priorityFilter,
      interestedModels: modelFilter.trim(),
      sortField,
      sortOrder,
      isActive: true,
    };
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/leads`, {
      params,
    });
    const activeleads = response.data.data.filter((lead: Lead) => lead.isActive);
   
               setLeads(activeleads);
    
  } catch (error) {
    console.error("Error fetching leads:", error);
  }finally {
    setIsLoading(false); 
  }
};
const toggleBulkModal = () => {
  setIsBulkModalOpen(!isBulkModalOpen);
};
  
const handleBulkUpdateSubmit = async (selectedCategories: string[]) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/leads/bulk-update`, {
      leadIds: selectedLeadIds,
      categories: selectedCategories,
    });
    if (response.status === 201) {
      toast.success("Bulk update successful!");
      setSelectedLeadIds([]);
      fetchData(); 
    }
  } catch (error) {
    console.error("Error during bulk update:", error);
    toast.error("Bulk update failed!");
  }
};

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  }, 500);

 
  const filteredLeads = leads

    .sort((a, b) => {
      const aField = sortField === "lastFollowUp" ? new Date(a.lastFollowUp) : a[sortField] as string | number;
      const bField = sortField === "lastFollowUp" ? new Date(b.lastFollowUp) : b[sortField] as string | number;
    
      if (aField < bField) return sortOrder === "asc" ? -1 : 1;
      if (aField > bField) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleDelete = async (id: string) => {
    const confirm = await showConfirmationModal("Are you sure you want to Archive the lead?");
    if (!confirm) return;
  
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/leads/${id}`);
      toast.success("Lead Archive successfully!");
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete the lead. Please try again.");
    }
  };const handleSelectLead = (id: string) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter((leadId) => leadId !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  const handleSelectAllLeads = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map((lead) => lead._id));
    }
  };
 
  
  const getSortIcon = (field: keyof Lead) => {
    if (sortField === field) {  
      return sortOrder === "asc" ? <ArrowDropUp fontSize="small" /> : <ArrowDropDown fontSize="small" />;
    }
    return <ArrowDropUp fontSize="small" style={{ color: "white", opacity: 1 }} />;
  };

  return (
    <div style={{ padding: "20px" 
       }} className="overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
     
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-black rounded-md hover:bg-gray-800"
      >
        <FaChevronLeft size={16} style={{ color: "white" }} />
        <span style={{ color: "white" }}>Back</span>
      </button>

      {/* Add New Lead Button */}
      <div className="flex flex-wrap gap-4  justify-end md:justify-end">
      <button
    onClick={toggleBulkModal}
    className="px-4 py-2  bg-black text-white rounded-md"
  >
    Bulk Update
  </button>
  <button
    onClick={() => navigate("/leads/add")}
    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
  >
    Add New Lead
  </button>
 
</div>

    </div>
      <h2 className="text-3xl flex justify-center" style={{ marginBottom: "20px" }}>List of Leads</h2>

      {/* Search and Filter Controls */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
        
        {/* Search Field */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: "200px" }}>
          <label htmlFor="search" className="text-gray-700 font-medium mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder="Search..."
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ flex: "0 1 200px", display: "flex", flexDirection: "column" }}>
          <label htmlFor="status" className="text-gray-700 font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Hot">Hot</option>
            <option value="Cold">Cold</option>
            <option value="Warm">Warm</option>
            <option value="Lost">Lost</option>
            <option value="Closed">Closed</option>
            <option value="Pending Approval">Pending Approval</option>
          </select>
        </div>

        {/* Lead Source Filter */}
        <div style={{ flex: "0 1 200px", display: "flex", flexDirection: "column" }}>
          <label htmlFor="leadSource" className="text-gray-700 font-medium mb-1">
            Lead Source
          </label>
          <select
            id="leadSource"
            value={leadSourceFilter}
            onChange={(e) => setLeadSourceFilter(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
           <option value="">All Lead Sources</option>
  <option value="Walk-in">Walk-in</option>
  <option value="Instagram">Instagram</option>
  <option value="Facebook">Facebook</option>
  <option value="Marketplace">Marketplace</option>
  <option value="Referral">Referral</option>
  <option value="Ad">Ad</option>
  <option value="Car Gurus">Car Gurus</option>
  <option value="Web">Web</option>
          </select>
        </div>

       
        <div style={{ flex: "0 1 200px", display: "flex", flexDirection: "column" }}>
          <label htmlFor="model" className="text-gray-700 font-medium mb-1">Model</label>
          <select
            id="model"
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
            <option value="">All Models</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        
      </div>
      

      
      <TableContainer component={Paper} style={{
    
    whiteSpace: "nowrap", 
  }}>
        <Table>
       

        <TableHead>
       
  <TableRow style={{ backgroundColor: "black", color: "white" }}>
  <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedLeadIds.length > 0 && selectedLeadIds.length < leads.length
                  }
                  checked={selectedLeadIds.length === leads.length}
                  onChange={handleSelectAllLeads}
                  style={{ backgroundColor: "black", color: "white" }}
                />
              </TableCell>
    <TableCell
      style={{ color: "white", fontWeight: "bold", cursor: "pointer" }} 
      onClick={() => handleSort("leadId")}
    >
      ID {getSortIcon("leadId")}
    </TableCell>
    <TableCell
      style={{ color: "white", fontWeight: "bold", cursor: "pointer" }} // Always pointer
      onClick={() => handleSort("lastFollowUp")}
    >
      Last Follow-Up {getSortIcon("lastFollowUp")}
    </TableCell>
    
    <TableCell
      style={{ color: "white", fontWeight: "bold", cursor: "pointer" }} 
      onClick={() => handleSort("name")}
    >
      Name {getSortIcon("name")}
    </TableCell>

    {/* Other headers */}
    <TableCell style={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
    <TableCell style={{ color: "white", fontWeight: "bold" }}>Manager</TableCell>
    <TableCell style={{ color: "white", fontWeight: "bold" }}>Phone Number</TableCell>
    <TableCell style={{ color: "white", fontWeight: "bold" }}>Lead Source</TableCell>
    <TableCell style={{ color: "white", fontWeight: "bold" }}>Budget</TableCell>

    {/* Last Follow-Up Header with Sort Arrow */}
    <TableCell
      style={{ color: "white", fontWeight: "bold", cursor: "pointer" }} // Always pointer
      onClick={() => handleSort("nextFollowUp")}
    >
      Next Follow-Up {getSortIcon("nextFollowUp")}
    </TableCell>

    <TableCell style={{ color: "white", fontWeight: "bold" }}>interestedModels</TableCell>
    <TableCell style={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
  </TableRow>
</TableHead>

{isLoading ? (
  // Show loader in the middle of the table
  <TableRow>
    <TableCell colSpan={9} style={{ textAlign: "center", padding: "20px" }}>
      <CircularProgress style={{ color: "black" }} />
    </TableCell>
  </TableRow>
) : (
  
  <TableBody>
  {paginatedLeads.length > 0 ? (
    paginatedLeads.map((lead) => (
      <TableRow key={lead.id}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedLeadIds.includes(lead._id)}
            onChange={() => handleSelectLead(lead._id)}
          />
        </TableCell>
        <TableCell>{lead.leadId}</TableCell>
        <TableCell>{lead.lastFollowUp.slice(0, 10)}</TableCell>
        <TableCell>{lead.name}</TableCell>
        <TableCell>
          <select
            value={lead.status}
            onChange={async (e) => {
              const newStatus = e.target.value;
              try {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/leads/${lead._id}`, {
                  status: newStatus,
                });
                toast.success("Status updated successfully!");
                fetchData();
              } catch (error) {
                console.error("Error updating status:", error);
                toast.error("Failed to update status. Please try again.");
              }
            }}
            style={{
              padding: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              color: "black",
              width: "170px",
            }}
          >
            <option value="New">New</option>
            <option value="Hot">Hot</option>
            <option value="Cold">Cold</option>
            <option value="Warm">Warm</option>
            <option value="Lost">Lost</option>
            <option value="Closed">Closed</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Timepass">Timepass</option>
          </select>
        </TableCell>
        <TableCell>{lead.manager}</TableCell>
        <TableCell>{lead.phoneNumber}</TableCell>
        <TableCell>{lead.leadSource}</TableCell>
        <TableCell>${lead.budget.toLocaleString()}</TableCell>
        <TableCell>{lead.nextFollowUp.slice(0, 10)}</TableCell>
        <TableCell>{lead.interestedModels.join(", ")}</TableCell>
        <TableCell>
          <IconButton
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              fontSize: "14px",
            }}
            onClick={() => openModal(lead._id!)}
          >
            Send SMS
          </IconButton>
          <IconButton
            style={{ color: "black" }}
            onClick={() => navigate(`/leads/add/${lead._id}`)}
          >
            <Edit />
          </IconButton>
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleDelete(lead._id!)}
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={12} style={{ textAlign: "center", padding: "20px" }}>
        No Leads Found
      </TableCell>
    </TableRow>
  )}
</TableBody>

)}

        </Table>
      </TableContainer>
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSendSMS}
        title="Send Custom SMS"
        label="Enter your custom message"
      />
       {isBulkModalOpen && (
        <BulkUpdateModal
          isOpen={isBulkModalOpen}
          onClose={toggleBulkModal}
          
          categories={categories}
          onSubmit={handleBulkUpdateSubmit}
        />
      )}
      {/* Pagination */}
      {/* <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
      /> */}
    </div>
  );
};

export default ListOfLeads;
