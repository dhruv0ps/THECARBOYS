import React, { useEffect, useState } from "react"
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
  Checkbox,
  Button,
} from "@mui/material"
import { Edit, Delete, UploadFile, FileDownload, Search, FilterList } from "@mui/icons-material"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import debounce from "lodash/debounce"
import showConfirmationModal from "../../components/confirmationUtil"
import { toast } from "react-toastify"
import { FaChevronLeft } from "react-icons/fa"
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material"
import CustomModal from "../../components/CustomModal"
import BulkUpdateModal from "../../components/BulkUpdateModal"
import UploadLead from "./upload-lead"
import type { Lead } from "../../models/Lead"
import { observer } from 'mobx-react'
import { authStore } from '../../store/authStore'

const ListOfLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [priorityFilter, _setPriorityFilter] = useState<string>("")
  const [sortField, setSortField] = useState<keyof Lead>("nextFollowUp")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [showFilters, setShowFilters] = useState<boolean>(false)

  const [modelFilter, setModelFilter] = useState<string>("")
  const [models, setModels] = useState<string[]>([])
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([])
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false)
  const [categories, setCategories] = useState<any[]>([])
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const { model } = useParams<{ model: string }>()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  const [_uploadCount, setUploadCount] = React.useState(0)
  const [isUploadLeadVisible, setIsUploadLeadVisible] = useState<boolean>(false)
  const authToken = localStorage.getItem("authToken")
  const [totalLeads, setTotalLeads] = useState<number>(0);
  axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`
  
  useEffect(() => {
    if (authStore.user?.role === 'ADMIN') {
      setIsAdmin(true)
    }
  }, [authStore.user])

  const handleUploadSuccess = () => {
    setUploadCount((prev) => prev + 1)
  }
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  }
  
  const openModal = (leadId: string) => {
    setSelectedLeadId(leadId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedLeadId(null)
  }

  const handleSendSMS = async (message: string) => {
    if (!selectedLeadId) return

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/send-sms/${selectedLeadId}`,
        { message },
        { headers: { Authorization: `Bearer ${authToken}` } },
      )

      if (response.status === 201) {
        toast.success("SMS sent successfully!")
      } else {
        toast.error("Failed to send SMS. Please try again.")
      }
    } catch (error) {
      console.error("Error sending SMS:", error)
      toast.error("Failed to send SMS. Please check the details and try again.")
    }
  }

  useEffect(() => {
    if (!isUploadLeadVisible) {
      fetchData()
      fetchCategories()
      fetchModels()
    }
  }, [
    searchQuery,
    statusFilter,
    leadSourceFilter,
    modelFilter,
    priorityFilter,
    sortField,
    sortOrder,
    isUploadLeadVisible,
  ])
  useEffect(() => {
    if (model) {
      setModelFilter(model)
    }
  }, [model])
  const fetchModels = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/models`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      const data = response.data
      const fetchedModels = data.map((car: any) => car.model)
      setModels(fetchedModels)
    } catch (error) {
      console.error("Error fetching models:", error)
      toast.error("Failed to fetch models.")
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/leadcategory`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setCategories(response.data.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }
  const fetchData = async () => {
    setIsLoading(true)
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
      }
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/leads`, {
        params,
        headers: { Authorization: `Bearer ${authToken}` },
      })
      const activeleads = response.data.data.filter((lead: Lead) => lead.isActive)

      setLeads(activeleads)
      setTotalLeads(activeleads.length);
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setIsLoading(false)
    }
  }
  const toggleBulkModal = () => {
    setIsBulkModalOpen(!isBulkModalOpen)
  }

  const handleBulkUpdateSubmit = async (selectedCategories: string[]) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/leads/bulk-update`,
        { leadIds: selectedLeadIds, categories: selectedCategories },
        { headers: { Authorization: `Bearer ${authToken}` } },
      )
      if (response.status === 201) {
        toast.success("Bulk update successful!")
        setSelectedLeadIds([])
        fetchData()
      }
    } catch (error) {
      console.error("Error during bulk update:", error)
      toast.error("Bulk update failed!")
    }
  }

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
  }, 500)

  const filteredLeads = leads.sort((a, b) => {
    let aField = sortField === "lastFollowUp" ? new Date(a.lastFollowUp || 0) : a[sortField]
    let bField = sortField === "lastFollowUp" ? new Date(b.lastFollowUp || 0) : b[sortField]

    // Ensure undefined values are handled
    if (aField == null) return sortOrder === "asc" ? 1 : -1
    if (bField == null) return sortOrder === "asc" ? -1 : 1

    // Convert to lowercase if string
    if (typeof aField === "string" && typeof bField === "string") {
      aField = aField.toLowerCase()
      bField = bField.toLowerCase()
    }

    if (aField < bField) return sortOrder === "asc" ? -1 : 1
    if (aField > bField) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const handleDelete = async (id: string) => {
    const confirm = await showConfirmationModal("Are you sure you want to Archive the lead?")
    if (!confirm) return

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/leads/${id}`)
      toast.success("Lead Archive successfully!")
      await fetchData()
    } catch (error) {
      toast.error("Failed to delete the lead. Please try again.")
    }
  }
  const handleSelectLead = (id: string) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter((leadId) => leadId !== id))
    } else {
      setSelectedLeadIds([...selectedLeadIds, id])
    }
  }

  const handleSelectAllLeads = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([])
    } else {
      setSelectedLeadIds(leads.map((lead) => lead._id))
    }
  }

  const getSortIcon = (field: keyof Lead) => {
    if (sortField === field) {
      return sortOrder === "asc" ? <ArrowDropUp fontSize="small" /> : <ArrowDropDown fontSize="small" />
    }
    return <ArrowDropUp fontSize="small" style={{ color: "white", opacity: 1 }} />
  }

  const toggleUploadLead = () => {
    setIsUploadLeadVisible(!isUploadLeadVisible)
  }

  const exportLeadsToCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads to export")
      return
    }

    try {
      const headers = [
        "Name",
        "Status",
        "Manager",
        "Phone Number",
        "Lead Source",
        "Interested Models",
        "Next Follow-Up",
        "Last Follow-Up",
        "Created Date"
      ]

      const csvRows = [
        headers.join(","),

        ...filteredLeads.map(lead => [
          `"${lead.name || ''}"`,
          `"${lead.status || ''}"`,
          `"${lead.manager || ''}"`,
          `"${lead.phoneNumber || ''}"`,
          `"${lead.leadSource || ''}"`,
          `"${(lead.interestedModels || []).join('; ')}"`,
          `"${lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : ''}"`,
          `"${lead.lastFollowUp ? new Date(lead.lastFollowUp).toLocaleDateString() : ''}"`,
          `"${lead.createdDate ? new Date(lead.createdDate).toLocaleDateString() : ''}"`,
        ].join(','))
      ]
      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Leads exported successfully")
    } catch (error) {
      console.error("Error exporting leads:", error)
      toast.error("Failed to export leads")
    }
  }

  return (
    <>
      {isUploadLeadVisible ? (
        <UploadLead
          onUploadSuccess={() => {
            handleUploadSuccess()
            setIsUploadLeadVisible(false)
            fetchData()
          }}
          apiUrl={`${import.meta.env.VITE_BACKEND_URL}/lead/bulkupload`}
        />
      ) : (
        <div className="p-4 md:p-6 max-w-full">
          {/* Header Section with Navigation and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-black rounded-md text-white hover:bg-gray-800 transition-all"
            >
              <FaChevronLeft size={16} />
              <span>Back</span>
            </button>

            <div className="flex flex-wrap gap-3 items-center">
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<FileDownload />}
                  className="bg-black hover:bg-gray-800 normal-case"
                  style={{ backgroundColor: "#000", borderRadius: "6px" }}
                  onClick={exportLeadsToCSV}
                >
                  Export
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<UploadFile />}
                className="bg-black hover:bg-gray-800 normal-case"
                style={{ backgroundColor: "#000", borderRadius: "6px" }}
                onClick={toggleUploadLead}
              >
                Upload
              </Button>
              <Button
                variant="contained"
                className="bg-black hover:bg-gray-800 normal-case"
                style={{ backgroundColor: "#000", borderRadius: "6px" }}
                onClick={toggleBulkModal}
              >
                Bulk Update
              </Button>
              <Button
                variant="contained"
                className="bg-black hover:bg-gray-800 normal-case"
                style={{ backgroundColor: "#000", borderRadius: "6px" }}
                onClick={() => navigate("/leads/add")}
              >
                Add Lead
              </Button>
            </div>
          </div>
          
          {/* Title and Stats Section */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Lead Management</h1>
              <div className="bg-black text-white px-4 py-2 rounded-lg text-md font-medium">
                Total: <span className="font-bold">{totalLeads}</span>
              </div>
            </div>
            <p className="text-gray-600">Manage and track all your potential customers</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" fontSize="small" />
                </div>
                <input
                  type="text"
                  onChange={(e) => debouncedSearch(e.target.value)}
                  placeholder="Search by name, email, phone or ID..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                />
              </div>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={toggleFilters}
                className="border-gray-300 text-gray-700"
                style={{ borderColor: "#e5e7eb", color: "#374151" }}
              >
                Filters
              </Button>
            </div>
            
            {/* Collapsible Filter Controls */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col">
                  <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                  >
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Hot">Hot</option>
                    <option value="Cold">Cold</option>
                    <option value="Warm">Warm</option>
                    <option value="Lost">Lost</option>
                    <option value="Closed">Closed</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="leadSource" className="text-sm font-medium text-gray-700 mb-1">
                    Lead Source
                  </label>
                  <select
                    id="leadSource"
                    value={leadSourceFilter}
                    onChange={(e) => setLeadSourceFilter(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                  >
                    <option value="">All Sources</option>
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

                <div className="flex flex-col">
                  <label htmlFor="model" className="text-sm font-medium text-gray-700 mb-1">
                    Car Model
                  </label>
                  <select
                    id="model"
                    value={modelFilter}
                    onChange={(e) => setModelFilter(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
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
            )}
          </div>

          {/* Table Section */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <CircularProgress style={{ color: "black" }} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <TableContainer component={Paper} elevation={0} style={{ border: "none" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox" style={{ backgroundColor: "#f9fafb" }}>
                          <Checkbox
                            indeterminate={selectedLeadIds.length > 0 && selectedLeadIds.length < leads.length}
                            checked={selectedLeadIds.length === leads.length && leads.length > 0}
                            onChange={handleSelectAllLeads}
                            style={{ color: selectedLeadIds.length > 0 ? "black" : undefined }}
                          />
                        </TableCell>
                        <TableCell style={{ backgroundColor: "#f9fafb", fontWeight: "600" }}>
                          Actions
                        </TableCell>
                        <TableCell 
                          style={{ backgroundColor: "#f9fafb", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center">
                            Name {getSortIcon("name")}
                          </div>
                        </TableCell>
                        <TableCell 
                          style={{ backgroundColor: "#f9fafb", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => handleSort("nextFollowUp")}
                        >
                          <div className="flex items-center">
                            Next Follow-Up {getSortIcon("nextFollowUp")}
                          </div>
                        </TableCell>
                        <TableCell 
                          style={{ backgroundColor: "#f9fafb", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => handleSort("lastFollowUp")}
                        >
                          <div className="flex items-center">
                            Last Follow-Up {getSortIcon("lastFollowUp")}
                          </div>
                        </TableCell>
                        <TableCell
                          style={{ backgroundColor: "#f9fafb", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center">
                            Status {getSortIcon("status")}
                          </div>
                        </TableCell>
                        <TableCell style={{ backgroundColor: "#f9fafb", fontWeight: "600" }}>
                          Manager
                        </TableCell>
                        <TableCell style={{ backgroundColor: "#f9fafb", fontWeight: "600" }}>
                          Phone
                        </TableCell>
                        <TableCell style={{ backgroundColor: "#f9fafb", fontWeight: "600" }}>
                          Source
                        </TableCell>
                        <TableCell style={{ backgroundColor: "#f9fafb", fontWeight: "600" }}>
                          Models
                        </TableCell>
                        <TableCell 
                          style={{ backgroundColor: "#f9fafb", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => handleSort("createdDate")}
                        >
                          <div className="flex items-center">
                            Created {getSortIcon("createdDate")}
                          </div>
                        </TableCell>
                        <TableCell 
                          style={{ backgroundColor: "#f9fafb", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => handleSort("createdBy")}
                        >
                          <div className="flex items-center">
                            By {getSortIcon("createdBy")}
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    
                    <TableBody>
                      {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead) => (
                          <TableRow 
                            key={lead.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedLeadIds.includes(lead._id)}
                                onChange={() => handleSelectLead(lead._id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 md:gap-2">
                                <IconButton
                                  size="small"
                                  className="bg-blue-50 hover:bg-blue-100"
                                  style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}
                                  onClick={() => openModal(lead._id!)}
                                >
                                  SMS
                                </IconButton>
                                <IconButton
                                  size="small"
                                  className="hover:bg-gray-100"
                                  onClick={() => navigate(`/leads/add/${lead._id}`)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  className="hover:bg-red-50"
                                  style={{ color: "#ef4444" }}
                                  onClick={() => handleDelete(lead._id!)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{lead.name}</span>
                            </TableCell>
                            <TableCell>{lead?.nextFollowUp?.slice(0, 10)}</TableCell>
                            <TableCell>{lead?.lastFollowUp?.slice(0, 10)}</TableCell>
                            <TableCell>
                              <select
                                value={lead.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value
                                  try {
                                    await axios.put(`${import.meta.env.VITE_BACKEND_URL}/leads/${lead._id}`, {
                                      status: newStatus,
                                    })
                                    toast.success("Status updated")
                                    fetchData()
                                  } catch (error) {
                                    console.error("Error updating status:", error)
                                    toast.error("Failed to update status")
                                  }
                                }}
                                className={`text-sm px-2 py-1 rounded-md border ${getStatusColor(lead.status)}`}
                              >
                                <option value="New">New</option>
                                <option value="Hot">Hot</option>
                                <option value="Cold">Cold</option>
                                <option value="Warm">Warm</option>
                                <option value="Lost">Lost</option>
                                <option value="Closed">Closed</option>
                                <option value="Pending Approval">Pending Approval</option>
                                <option value="Timepass">Timepass</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Declined">Declined</option>
                              </select>
                            </TableCell>
                            <TableCell>{lead.manager}</TableCell>
                            <TableCell>{lead.phoneNumber}</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                                {lead.leadSource}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">{lead.interestedModels.join(", ")}</TableCell>
                            <TableCell>{new Date(lead.createdDate).toLocaleDateString()}</TableCell>
                            <TableCell>{lead.createdBy ? lead.createdBy.username : "Admin"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                            No leads found. Try adjusting your filters or add new leads.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          )}
          
          {/* Mobile View of Selected Data (shows up on small screens) */}
          <div className="md:hidden mt-6">
            {filteredLeads.length > 0 ? (
              <div className="space-y-4">
                {filteredLeads.slice(0, 5).map((lead) => (
                  <div key={lead._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{lead.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p><span className="font-medium">Phone:</span> {lead.phoneNumber}</p>
                      <p><span className="font-medium">Source:</span> {lead.leadSource}</p>
                      <p><span className="font-medium">Next Follow-up:</span> {lead?.nextFollowUp?.slice(0, 10)}</p>
                      <p><span className="font-medium">Models:</span> {lead.interestedModels.join(", ")}</p>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/leads/add/${lead._id}`)}
                        className="text-blue-600 px-2 py-1 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openModal(lead._id!)}
                        className="text-gray-600 px-2 py-1 text-sm"
                      >
                        Send SMS
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id!)}
                        className="text-red-600 px-2 py-1 text-sm"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
                {filteredLeads.length > 5 && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    + {filteredLeads.length - 5} more leads. Use a larger screen to view all.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
                <p className="text-gray-500">No leads found. Try adjusting your filters or add new leads.</p>
              </div>
            )}
          </div>
          
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
        </div>
      )}
    </>
  )
}

// Helper function to get appropriate status colors
const getStatusColor = (status: string) => {
  switch(status) {
    case 'Hot':
      return 'border-red-300 bg-red-50 text-red-700';
    case 'Warm': 
      return 'border-orange-300 bg-orange-50 text-orange-700';
    case 'Cold':
      return 'border-blue-300 bg-blue-50 text-blue-700';
    case 'New':
      return 'border-green-300 bg-green-50 text-green-700';
    case 'Lost':
      return 'border-gray-300 bg-gray-50 text-gray-700';
    case 'Closed':
      return 'border-purple-300 bg-purple-50 text-purple-700';
    default:
      return 'border-gray-300 bg-gray-50 text-gray-700';
  }
};

// Helper function for mobile status badges
const getStatusBadgeColor = (status: string) => {
  switch(status) {
    case 'Hot':
      return 'bg-red-100 text-red-800';
    case 'Warm': 
      return 'bg-orange-100 text-orange-800';
    case 'Cold':
      return 'bg-blue-100 text-blue-800';
    case 'New':
      return 'bg-green-100 text-green-800';
    case 'Lost':
      return 'bg-gray-200 text-gray-800';
    case 'Closed':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default observer(ListOfLeads)

