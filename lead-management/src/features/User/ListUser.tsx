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
  Pagination,
  Button
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from 'react-icons/fa';

type User = {
  id: number;
  username: string;
  role: string;
  email: string;
};

const UserTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();
  const rowsPerPage = 5;

  const authToken = localStorage.getItem("authToken"); // Get auth token

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchQuery, roleFilter, sortField, sortOrder]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        headers: { Authorization: `Bearer ${authToken}` } // Add auth token to request
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = users;
  
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }
  
    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
  
        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue, undefined, { sensitivity: "base" }) * (sortOrder === "asc" ? 1 : -1);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          return (aValue - bValue) * (sortOrder === "asc" ? 1 : -1);
        }
        return 0;
      });
    }
  
    setFilteredUsers(filtered);
  };
  

  const handleEdit = (id: number) => {
    console.log("Edit user with ID:", id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` } // Add auth token to request
      });
      setUsers(users.filter(user => user.id !== id));
      console.log("Deleted user with ID:", id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedData = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-3xl flex justify-center ">List of Users</h1>
      <div className="mb-8 flex items-center justify-between">
        <Button onClick={() => navigate(-1)} className="flex items-center gap-2">
          <FaChevronLeft /> Back
        </Button>
      </div>

      <div style={{ padding: "16px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ width: "100%", maxWidth: "300px" }}>
          <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Username or Email
          </label>
          <input
            type="text"
            id="searchQuery"
            placeholder="Search by Username or Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <div style={{ width: "100%", maxWidth: "200px" }}>
          <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Role
          </label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="user">User</option>
            <option value="Associate1">Associate1</option>
          </select>
        </div>
      </div>

      <Paper style={{ maxWidth: "1200px", margin: "0 auto", marginTop: "16px" }}>
        <TableContainer>
          <Table aria-label="user table">
            <TableHead>
              <TableRow style={{ backgroundColor: 'black', color: 'white' }}>
                <TableCell style={{ fontWeight: "bold", cursor: "pointer", color: 'white' }} onClick={() => handleSort("username")}>
                  Username
                </TableCell>
                <TableCell style={{ fontWeight: "bold", cursor: "pointer", color: 'white' }} onClick={() => handleSort("role")}>
                  User Role
                </TableCell>
                <TableCell style={{ fontWeight: "bold", cursor: "pointer", color: 'white' }} onClick={() => handleSort("email")}>
                  User Email
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: 'white' }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(user.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
      />
    </div>
  );
};

export default UserTable;
