import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from "@mui/material"
import { toast } from "react-toastify"
import { Card } from "flowbite-react"
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Dashboard: React.FC = () => {
  const [topCarLeads, setTopCarLeads] = useState<any[]>([])
  const [totalLeads, setTotalLeads] = useState<number>(0)
  
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
   
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 90); 

 
    const formattedToday = today.toISOString().split("T")[0];
    const formattedLastMonth = lastMonth.toISOString().split("T")[0];

    setEndDate(formattedToday);
    setStartDate(formattedLastMonth);
  }, []);
  useEffect(() => {
    if (startDate && endDate) {
      fetchDashboardData()
    }
  }, [startDate, endDate])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/leaddashboard`, { startDate, endDate })

      const { topCarLeads, totalLeads } = response.data.data

      setTopCarLeads(topCarLeads || [])
      setTotalLeads(totalLeads || 0)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to fetch dashboard data.")
    } finally {
      setIsLoading(false)
    }
  }

  
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
  }

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
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
     <h1 className="mb-6 text-2xl font-bold text-gray-900"> Dashboard</h1>
  
    {/* Date Filters */}
    <div style={{ marginBottom: "24px", display: "flex", gap: "16px" }}>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
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
  
    
      <Card className="shadow-md w-48">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-2xl font-bold text-black-600">{totalLeads}</p>
        </div>
      </Card>
    {/* Loading State */}
    {isLoading ? (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    ) : (
        
      <div style={{ display: "flex", gap: "24px" }} className="mt-10">
        {/* Bar Chart */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "16px",
          }}
        >
          
          <div style={{ height: "400px" }} >
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
  
        {/* Table */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "16px",
          }}
        >
         
          <TableContainer  style={{ whiteSpace: "nowrap" }}>
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
  )
}

export default Dashboard

