import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Select,
  MenuItem,TextField
} from "@mui/material";
import { toast } from "react-toastify";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [topCarLeads, setTopCarLeads] = useState<any[]>([]);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTrim, setSelectedTrim] = useState("");
  const [budgetMin, setBudgetMin] = useState<number>(2000);
  const [budgetMax, setBudgetMax] = useState<number>(10000);
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const navigate = useNavigate()
  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 90);

    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(lastMonth.toISOString().split("T")[0]);

    fetchVehicles();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchDashboardData();
    }
  }, [startDate, endDate, selectedModel, selectedYear, selectedTrim]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const authToken = localStorage.getItem("authToken");
  
    if (!authToken) {
      toast.error("Unauthorized. Please log in.");
      navigate("/login");
      return;
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/leaddashboard`,
        {
          startDate,
          endDate,
          model: selectedModel,
          year: selectedYear,
          trim: selectedTrim,
          budgetMin: budgetMin || undefined,
          budgetMax: budgetMax || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      const { topCarLeads, totalLeads, budgetData } = response.data.data;
      setTopCarLeads(topCarLeads || []);
      setBudgetData(budgetData || []);
      setTotalLeads(totalLeads || 0);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.data?.error == "Please login again to proceed") {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("authToken"); 
        navigate("/login");
      } else {
        toast.error("Failed to fetch dashboard data.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const fetchVehicles = async () => {
    const authToken = localStorage.getItem("authToken");
  
    if (!authToken) {
      toast.error("Unauthorized. Please log in.");
      navigate("/login");
      return;
    }
  
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vehicles`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setVehicles(response.data);
    } catch (error: any) {
      console.error("Error fetching vehicles:", error);
      if (error.response?.data?.error == "Please login again to proceed") {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("authToken"); 
        localStorage.removeItem("userId")
        navigate("/login");
      } else {
        toast.error("Failed to fetch vehicles.");
      }
    }
  };
  
  

  const models = [...new Set(vehicles.map((vehicle) => vehicle.model))];
  const years = [...new Set(vehicles.map((vehicle) => vehicle.year))];
  const trims = [...new Set(vehicles.map((vehicle) => vehicle.trim))];

  const barChartData = {
    labels: topCarLeads.map((car) => car._id),
    datasets: [
      {
        label: "Total Leads",
        data: topCarLeads.map((car) => car.totalLeads),
        backgroundColor: "black",
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
      },
    ],
  };
  const budgetChartData = {
    labels: budgetData.map((b) => b._id),
    datasets: [
      {
        label: "Number of Leads",
        data: budgetData.map((b) => b.totalLeads),
        backgroundColor: "black",
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
      },
    ],
  };
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Top Car Models by Leads",
      },
    },
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 rounded border border-gray-300"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 rounded border border-gray-300"
        />

        {/* Model Filter */}
        <Select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          displayEmpty
          className=" h-10"
        >
          <MenuItem value="">All Models</MenuItem>
          {models.map((model, index) => (
            <MenuItem key={index} value={model}>
              {model}
            </MenuItem>
          ))}
        </Select>

        {/* Year Filter */}
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          displayEmpty
           className=" h-10"
         
        >
          <MenuItem value="">All Years</MenuItem>
          {years.map((year, index) => (
            <MenuItem key={index} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>

        {/* Trim Filter */}
        <Select
          value={selectedTrim}
          onChange={(e) => setSelectedTrim(e.target.value)}
          displayEmpty
           className=" h-10"
        
        >
          <MenuItem value="">All Trims</MenuItem>
          {trims.map((trim, index) => (
            <MenuItem key={index} value={trim}>
              {trim}
            </MenuItem>
          ))}
        </Select>
        <TextField
          type="number"
          label="Min Budget"
          
          value={budgetMin}
          onChange={(e) => setBudgetMin(Number(e.target.value))} 
          className="p-2"
        />
        <TextField
          type="number"
          label="Max Budget"
          value={budgetMax}
          onChange={(e) => setBudgetMax(Number(e.target.value))}
          className="p-2"
        />

        <Button
          variant="contained"
          onClick={fetchDashboardData}
          disabled={isLoading}
          style={{ backgroundColor: "black", color: "white" }}
        >
          {isLoading ? "Loading..." : "Fetch Data"}
        </Button>
      </div>

      {/* Total Leads Card */}
      <Card className="shadow-md w-48 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-2xl font-bold text-black">{totalLeads}</p>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Bar Chart */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4" style={{ height: "auto" }}>
            <div style={{ height: "400px" }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold">Budget Distribution of Leads</h2>
            <div style={{ height: "400px" }}>
              <Bar data={budgetChartData} options={barChartOptions} />
            </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4" style={{ height: "auto" }}>
            <TableContainer style={{ whiteSpace: "nowrap" }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "black" }}>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>#</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Model</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }} align="right">
                      Total Leads
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topCarLeads.map((car, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{car._id}</TableCell>
                      <TableCell align="right">{car.totalLeads}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

