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


} from "@mui/material";
import { Edit, Restore } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from 'lodash/debounce';
import showConfirmationModal from "../../components/confirmationUtil";
import { toast } from "react-toastify";
import { FaChevronLeft } from "react-icons/fa";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";

import { Lead } from "../../models/Lead";
const InActiveLeads: React.FC = () => {
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

    // const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const navigate = useNavigate();




    useEffect(() => {
        fetchData();
        fetchCategories();
    }, [searchQuery, statusFilter, leadSourceFilter, priorityFilter, sortField, sortOrder]);
    const fetchCategories = async () => {
        const authToken = localStorage.getItem("authToken");
    
        if (!authToken) {
            toast.error("Unauthorized. Please log in.");
            navigate("/login");
            return;
        }
    
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/leadcategory`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setCategories(response.data.data);
            console.log(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to fetch categories.");
        }
    };
    
    const fetchData = async () => {
        setIsLoading(true);
        const authToken = localStorage.getItem("authToken");
    
        if (!authToken) {
            toast.error("Unauthorized. Please log in.");
            navigate("/login");
            return;
        }
    
        try {
            const params = {
                search: searchQuery,
                status: statusFilter,
                leadSource: leadSourceFilter,
                priority: priorityFilter,
                sortField,
                sortOrder,
                isActive: false,
            };
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/leads`, {
                params,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
    
            const inactiveLeads = response.data.data.filter((lead: Lead) => !lead.isActive);
            setLeads(inactiveLeads);
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast.error("Failed to fetch leads.");
        } finally {
            setIsLoading(false);
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
        setCurrentPage(1); // Reset to first page on new search
    }, 500);


    const filteredLeads = leads

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
    const handleRestore = async (id: string) => {
        const confirm = await showConfirmationModal("Are you sure you want to restore the lead?");
        if (!confirm) return;
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
            toast.error("Unauthorized. Please log in.");
            navigate("/login");
            return;
        }
    
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/leads/${id}`,
                { isActive: true },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            toast.success("Lead Restored successfully!");
            await fetchData();
        } catch (error) {
            toast.error("Failed to delete the lead. Please try again.");
        }
    };
    
    // const handleSelectLead = (id: string) => {
    //     if (selectedLeadIds.includes(id)) {
    //         setSelectedLeadIds(selectedLeadIds.filter((leadId) => leadId !== id));
    //     } else {
    //         setSelectedLeadIds([...selectedLeadIds, id]);
    //     }
    // };

    // const handleSelectAllLeads = () => {
    //     if (selectedLeadIds.length === leads.length) {
    //         setSelectedLeadIds([]);
    //     } else {
    //         setSelectedLeadIds(leads.map((lead) => lead._id));
    //     }
    // };


    const getSortIcon = (field: keyof Lead) => {
        if (sortField === field) {
            // Show the active arrow for the sorted column
            return sortOrder === "asc" ? <ArrowDropUp fontSize="small" /> : <ArrowDropDown fontSize="small" />;
        }
        // Default inactive arrow for unsorted columns
        return <ArrowDropUp fontSize="small" style={{ color: "white", opacity: 1 }} />;
    };

    return (
        <div style={{
            padding: "20px"
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
                {/* <div className="flex flex-wrap gap-4  justify-end md:justify-end">
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
 
</div> */}

            </div>
            <h2 className="text-3xl flex justify-center" style={{ marginBottom: "20px" }}> Archive Leads</h2>

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



            <TableContainer component={Paper} style={{

                whiteSpace: "nowrap",
            }}>
                <Table>


                    <TableHead>

                        <TableRow style={{ backgroundColor: "black", color: "white" }}>
                          
                            <TableCell
                                style={{ color: "white", fontWeight: "bold", cursor: "pointer" }}
                                onClick={() => handleSort("leadId")}
                            >
                                ID {getSortIcon("leadId")}
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
                                onClick={() => handleSort("lastFollowUp")}
                            >
                                Last Follow-Up {getSortIcon("lastFollowUp")}
                            </TableCell>

                            {/* Actions Column */}
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
                        // Render table content when not loading
                        <TableBody>
                            {paginatedLeads.map((lead) => (
                                <TableRow key={lead.id}>
                                    {/* <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedLeadIds.includes(lead._id)}
                                            onChange={() => handleSelectLead(lead._id)}
                                        />
                                    </TableCell> */}
                                    <TableCell>{lead?.leadId}</TableCell>
                                    <TableCell>{lead?.name}</TableCell>
                                    <TableCell>{lead?.status}</TableCell>
                                    <TableCell>{lead?.manager}</TableCell>
                                    <TableCell>{lead?.phoneNumber}</TableCell>
                                    <TableCell>{lead?.leadSource}</TableCell>
                                    <TableCell>${lead?.budget?.toLocaleString()}</TableCell>
                                    <TableCell>{lead?.lastFollowUp?.slice(0, 10)}</TableCell>
                                    <TableCell>

                                        <IconButton
                                            style={{ color: "black" }}
                                            onClick={() => navigate(`/leads/add/${lead._id}`)}
                                        >
                                            <Edit />
                                        </IconButton>
                                      
                                            <IconButton
                                                style={{
                                                    color: "green"
                                                }}
                                                onClick={() => handleRestore(lead._id!)}
                                            >
                                                <Restore />
                                            </IconButton>
                                        

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}

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

export default InActiveLeads;
