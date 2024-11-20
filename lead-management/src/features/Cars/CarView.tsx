import React, { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
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
import FilterListIcon from "@mui/icons-material/FilterList";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import showConfirmationModal from "../../components/confirmationUtil";
import { toast } from "react-toastify";
import { FaChevronLeft } from "react-icons/fa";
type Car = {
  city_mpg: number;
  class: string;
  combination_mpg: number;
  bodyType?: string;
  engineType: string;
  drivetrain: string;
  fuelType: string;
  mileage?: number;
  condition?: string;
  color: string;
  make: string;
  model: string;
  transmission: string;
  year: number;
  vehicleId? : string;
  status? : string;
  _id? : string;
  price? : string;
};

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<any>("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>("");
  const [transmissionFilter, setTransmissionFilter] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Car | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
const navigate = useNavigate();
const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50;

  useEffect(() => {
   

    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vehicles`);
      const data: Car[] = response.data;
  
      // Sort by status: "available" first
      const sortedData = data.sort((a, b) => {
        if (a.status === "Available" && b.status !== "Available") return -1;
        if (a.status !== "Available" && b.status === "Available") return 1;
        return 0; // Maintain existing order for cars with the same status
      });
  
      setCars(sortedData);
      setFilteredCars(sortedData); 
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    let filtered = cars;
    if (statusFilter) {
      filtered = filtered.filter((car) => car.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply filters
    if (searchQuery) {
      filtered = filtered.filter(car =>
        (`${car.make} ${car.model} ${car.vehicleId}`.toLowerCase().includes(searchQuery.toLowerCase()))
      

      );
    }
    if (yearFilter) {
      filtered = filtered.filter(car => car.year.toString().includes(yearFilter));
    }
    if (fuelTypeFilter) {
      filtered = filtered.filter(car => car.engineType.toLowerCase() === fuelTypeFilter.toLowerCase());
    }
    if (transmissionFilter) {
      filtered = filtered.filter(car => car.transmission.toLowerCase() === transmissionFilter.toLowerCase());
    }
console.log(paginatedData);
    // Apply sorting if a field is selected
    if (sortField) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortField as keyof Car];
        const bValue = b[sortField as keyof Car];
    
        // Handle cases where values might be null or undefined
        if (aValue == null || bValue == null) {
          return 0;
        }
    
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    

    setFilteredCars(filtered);
    setCurrentPage(1);
  }, [searchQuery, yearFilter, fuelTypeFilter, transmissionFilter, statusFilter,sortField, sortOrder, cars]);

  // const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedData = filteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
  //   setCurrentPage(page);
  // };

  const handleSortFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(event.target.value as keyof Car);
  };

  const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as "asc" | "desc");
  };

  const handleDeleteChild = async (id: string) => {
    const confirm = await showConfirmationModal("Are you sure you want to delete the car?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/vehicles/${id}`);
      toast.success("Car deleted successfully!");
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete the car. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{padding: "20px"}}>
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
        onClick={() => navigate("/inventory/add")}
        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
      >
        Add New Car
      </button>
    </div>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Car List</h2>

        {/* Search, Filter, and Sort Controls */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
        
        {/* Search Field */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: "200px" }}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-md"
        placeholder="Search by model..."
      />
</div>
      {/* Filter by Year */}
      <div style={{ flex: "0 1 200px", display: "flex", flexDirection: "column" }}>
      <input
        type="number"
        value={yearFilter}
        onChange={(e) => setYearFilter(e.target.value)}
        className="w-full p-2 border rounded-md"
        placeholder="Year"
      />
</div>
<div style={{ flex: "0 1 200px", display: "flex", flexDirection: "column" }}>
      <select
        value={fuelTypeFilter}
        onChange={(e) => setFuelTypeFilter(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="">All Fuel Types</option>
        <option value="gasoline">Gasoline</option>
        <option value="diesel">Diesel</option>
        <option value="electric">Electric</option>
        <option value="hybrid">Hybrid</option>
      </select>
      </div>

      {/* Filter by Transmission */}
      <div style={{ flex: "0 1 200px", display: "flex", flexDirection: "column" }}>
      <select
        value={transmissionFilter}
        onChange={(e) => setTransmissionFilter(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="">All Transmissions</option>
        <option value="automatic">Automatic</option>
        <option value="manual">Manual</option>
        <option value="cvt">CVT</option>
      </select>

    
      </div>
      <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select status</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Pending Approval">Pending Approval</option>
        </select>
    
      <IconButton
        onClick={() => setShowSortOptions(!showSortOptions)}
        style= {{color: "black"}}
        aria-label="toggle sort options"
      >
        <FilterListIcon />
      </IconButton>

  
      {showSortOptions && (
        <>
          {/* Sort By Field */}
          <select
            value={sortField}
            onChange={handleSortFieldChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Sort By</option>
           
            <option value="year">Year</option>
           
            <option value="price">Price</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </>
      )}
    </div>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: 'black', color: 'white' }}>
              <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Vehicle ID</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Make</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Model</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Year</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Body Type</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Engine Type</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Drive</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Fuel Type</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Price</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Color</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Status</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Transmission</TableCell>
                <TableCell style={{ color: 'white',fontWeight: 'bold' }} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"> Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {loading ? (
    <TableRow>
      <TableCell colSpan={12} className="text-center py-4">
        <Spinner aria-label="Loading..." size="lg" />
      </TableCell>
    </TableRow>
  ) : (
    paginatedData.map((car, index) => (
      <TableRow key={index} hover>
        <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
          {car.vehicleId}
        </TableCell>
        <TableCell>{car.make}</TableCell>
        <TableCell>{car.model}</TableCell>
        <TableCell>{car.year}</TableCell>
        <TableCell>{car.bodyType}</TableCell>
        <TableCell>{car.engineType}</TableCell>
        <TableCell>{car.drivetrain}</TableCell>
        <TableCell>{car.fuelType}</TableCell>
        <TableCell>${car.price}</TableCell>
        <TableCell>{car.color}</TableCell>
        <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
          {car.status}
        </TableCell>
        <TableCell>{car.transmission}</TableCell>
        <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
        <IconButton
  style={{ color: "black" }} // Black color for the Edit button
  onClick={() => navigate(`/inventory/add/${car._id}`)}
>
  <Edit fontSize="small" />
</IconButton>
<IconButton
  style={{ color: "red" }} // Red color for the Delete button
  onClick={() => handleDeleteChild(car._id!)}
>
  <Delete fontSize="small" />
</IconButton>

        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        {/* <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
        /> */}
      </div>
    </div>
  );
};

export default CarList;
