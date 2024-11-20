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
 
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from 'lodash/debounce';
import showConfirmationModal from "../../components/confirmationUtil";
import { toast } from "react-toastify";
import { FaChevronLeft } from "react-icons/fa";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
type Lead = {
  leadId?: string;
  id?: string;
  status: string;
  month: string;
  manager: string;
  name: string;
  phoneNumber: string;
  leadSource: string;
  budget: number;
  paymentPlan: string;
  lastFollowUp: string;
  nextFollowUp: string;
  createdDate: string;
  updatedDate: string;
  priorityLevel: string;
  _id? : string
};

const ListOfLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>("");
  const [minPrice, _setMinPrice] = useState<number | "">("");
  const [maxPrice, _setMaxPrice] = useState<number | "">("");
  const [priorityFilter, _setPriorityFilter] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Lead>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;
const navigate = useNavigate();

  useEffect(() => {
    

    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/leads`);
      const fetchedLeads = response.data.data;
  
      // Sort by createdDate in descending order
      const sortedLeads = fetchedLeads.sort((a: { createdDate?: string }, b: { createdDate?: string }) => {
        const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0; // Default to 0 if createdDate is missing
        const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0; // Default to 0 if createdDate is missing
        return dateB - dateA;
      });
  
      setLeads(sortedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
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

  // const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
  //   setCurrentPage(page);
  // };

  // Debounced function for live search
  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  }, 500);

  // Filter, sort, and paginate leads data locally
  const filteredLeads = leads
    .filter((lead) => {
      const matchesStatus = statusFilter ? lead.status === statusFilter : true;
      const matchesLeadSource = leadSourceFilter ? lead.leadSource === leadSourceFilter : true;
      const matchesMinPrice = minPrice !== "" ? lead.budget >= minPrice : true;
      const matchesMaxPrice = maxPrice !== "" ? lead.budget <= maxPrice : true;
      const matchesPriority = priorityFilter ? lead.priorityLevel === priorityFilter : true;
      const matchesSearchQuery = searchQuery
        ? lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.leadId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phoneNumber.trim().includes(searchQuery.trim())
        : true;

      return matchesStatus && matchesLeadSource && matchesMinPrice && matchesMaxPrice && matchesPriority && matchesSearchQuery;
    })
    .sort((a, b) => {
      const aField = sortField === "lastFollowUp" ? new Date(a.lastFollowUp) : a[sortField] as string | number;
      const bField = sortField === "lastFollowUp" ? new Date(b.lastFollowUp) : b[sortField] as string | number;
    
      if (aField < bField) return sortOrder === "asc" ? -1 : 1;
      if (aField > bField) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    

  // Paginate filtered data
  // const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleDelete = async (id: string) => {
    const confirm = await showConfirmationModal("Are you sure you want to delete the lead?");
    if (!confirm) return;
  
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/leads/${id}`);
      toast.success("Lead deleted successfully!");
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete the lead. Please try again.");
    }
  };
  const getSortIcon = (field: keyof Lead) => {
    if (sortField === field) {
      // Show the active arrow for the sorted column
      return sortOrder === "asc" ? <ArrowDropUp fontSize="small" /> : <ArrowDropDown fontSize="small" />;
    }
    // Default inactive arrow for unsorted columns
    return <ArrowDropUp fontSize="small" style={{ color: "white", opacity: 1 }} />;
  };
  
  return (
    <div style={{ padding: "20px" }}>
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
      <button
        onClick={() => navigate("/leads/add")}
        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
      >
        Add New Lead
      </button>
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

        {/* Min Price Filter */}
        
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
       

        <TableHead>
  <TableRow style={{ backgroundColor: "black", color: "white" }}>
    {/* ID Header with Sort Arrow */}
    <TableCell
      style={{ color: "white", fontWeight: "bold", cursor: "pointer" }} // Always pointer
      onClick={() => handleSort("leadId")}
    >
      ID {getSortIcon("leadId")}
    </TableCell>

    {/* Name Header with Sort Arrow */}
    <TableCell
      style={{ color: "white", fontWeight: "bold", cursor: "pointer" }} // Always pointer
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
      onClick={() => handleSort("lastFollowUp")}
    >
      Last Follow-Up {getSortIcon("lastFollowUp")}
    </TableCell>

    {/* Actions Column */}
    <TableCell style={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
  </TableRow>
</TableHead>


          <TableBody>
            {paginatedLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.leadId}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>{lead.manager}</TableCell>
                <TableCell>{lead.phoneNumber}</TableCell>
                <TableCell>{lead.leadSource}</TableCell>
                <TableCell>${lead.budget.toLocaleString()}</TableCell>
                <TableCell>{lead.lastFollowUp.slice(0,10)}</TableCell>
                <TableCell>
                  <IconButton  style={{ color: "black" }}  onClick={() => navigate(`/leads/add/${lead._id}`)}>
                    <Edit />
                  </IconButton>
                  <IconButton style={{ color: "red" }} onClick={() => handleDelete((lead._id!))}>
                    <Delete />
                  </IconButton>
                 
                </TableCell>
            
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
