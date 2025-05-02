import React, { useEffect, useState } from "react";
import {
  Pagination
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from 'react-icons/fa';
import { MdPersonAdd } from 'react-icons/md';
import showConfirmationModal from "../../components/confirmationUtil";
import { toast } from "react-toastify";
import { observer } from 'mobx-react';
import { authStore } from '../../store/authStore';

type User = {
  _id: number;
  username: string;
  role: string;
  email: string;
  status?: string;
};

const UserTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const rowsPerPage = 5;

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    // Check if user is admin
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (authStore.user?.email) {
      fetchUsers();
    }
  }, [authStore.user]);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchQuery, roleFilter, sortField, sortOrder]);

  const checkAdminAccess = async () => {
    try {
      if (!authStore.user) {
        await authStore.getCurrentUser();
      }

      if (!authStore.user?.email?.includes('admin')) {
        toast.error("You don't have permission to access this page");
        navigate('/');
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate('/');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const filteredData = response.data.data.filter(
        (user: User) => !user.email.includes('admin@example.com')
      );
      setUsers(filteredData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
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
    navigate(`/users/${id}`);
  };

  const handleDelete = async (id: number) => {
    const userToDelete = users.find(user => user._id === id);

    if (userToDelete && userToDelete.role === 'ADMIN') {
      toast.error("Admin users cannot be deleted.");
      return;
    }

    const confirm = await showConfirmationModal("Are you sure you want to delete the user?");
    if (!confirm) return;

    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data?.status) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        toast.success("User deleted successfully!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete user. Please try again.";
      toast.error(errorMessage);
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
    <div className="bg-inherit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-between mb-6 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaChevronLeft className="mr-2" />
            Back
          </button>
          <button
            onClick={() => navigate('/users/add')}
            className="flex items-center text-white bg-black hover:bg-gray-800 transition-colors border border-black rounded-lg px-3 py-1.5"
          >
            <MdPersonAdd className='mr-2 text-xl' />
            New User
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
          <p className="text-base text-gray-600">Manage and view all user accounts</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px]">
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
              Search by Username or Email
            </label>
            <input
              type="text"
              id="searchQuery"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded w-full focus:ring-2 focus:ring-black focus:border-black transition-shadow"
            />
          </div>

          <div className="w-[200px]">
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Role
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 border rounded w-full focus:ring-2 focus:ring-black focus:border-black transition-shadow"
            >
              <option value="">All Roles</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-black"
                      onClick={() => handleSort("username")}
                    >
                      Username
                      {sortField === "username" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-black"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      {sortField === "email" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-black"
                      onClick={() => handleSort("role")}
                    >
                      Role
                      {sortField === "role" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{user.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(user._id)}
                          className="px-3 py-1 text-white bg-black border border-black rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-3 py-1 text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default observer(UserTable);
