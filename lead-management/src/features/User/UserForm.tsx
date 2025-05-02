import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Label, TextInput, Select, Checkbox } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaChevronLeft } from 'react-icons/fa';
import { observer } from 'mobx-react';
import { authStore } from '../../store/authStore';

import * as z from "zod";
import axios from "axios";

// Validation schema
const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  role: z.string().nonempty("Please select a role."),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    
    .optional()
    .or(z.literal("")), 
});

type FormData = z.infer<typeof formSchema>;

const UserForm = () => {
  const { id } = useParams<{ id: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      role: "",
      email: "",
      password: id ? "" : undefined, 
    },
  });

  useEffect(() => {
    // Check if user is admin
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (id && authStore.user?.email?.includes('admin')) {
      fetchUserData(id);
    }
  }, [id, authStore.user]);

  const checkAdminAccess = async () => {
    try {
      // If user is not authenticated yet, getCurrentUser will handle it
      if (!authStore.user) {
        await authStore.getCurrentUser();
      }
      
      // Check if user email contains 'admin' to determine admin status
      if (!authStore.user?.email?.includes('admin')) {
        toast.error("You don't have permission to access this page");
        navigate('/');
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate('/');
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("Unauthorized! Please log in again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const { username, role, email } = response.data.data;
      
      // Prevent editing admin users
      if (email.includes('admin')) {
        toast.error("Admin users cannot be edited.");
        navigate("/users/view");
        return;
      }

      setValue("username", username);
      setValue("role", role);
      setValue("email", email);
      setValue("password", ""); 
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("Unauthorized! Please log in again.");
        navigate("/login");
        return;
      }
  
      let payload = { ...data };
      if (id && !updatePassword) {
        delete payload.password; 
      }
  
      let response;
      if (id) {
        response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } else {
        // Ensure password is provided for new user
        if (!payload.password) {
          toast.error("Password is required for new users.");
          setLoading(false);
          return;
        }
        response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user`, payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }
  
   
      if (response.data.status === true) {
        toast.success(id ? "User updated successfully!" : "User created successfully!");
        setTimeout(() => {
          navigate("/users/view");
        }, 1000);
      } else {
        
        const errorMessage = response.data.err || response.data.data.err || 
          (id ? "Failed to update user. Please try again." : "Failed to create user. Please try again.");
        toast.error(errorMessage);
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      const errorMessage = error.response?.data?.err || error.response?.data?.data?.err || 
        (id ? "Failed to update user. Please try again." : "Failed to create user. Please try again.");
      toast.error(errorMessage);
      console.error("Error submitting user form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="mb-8 flex items-center justify-between mt-4 ml-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2" color="black">
          <FaChevronLeft /> Back
        </button>
      </div>
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">{id ? "Edit User" : "Add User"}</h2>
 
        <div>
          <Label htmlFor="username" value="Username" />
          <TextInput
            id="username"
            placeholder="johndoe"
            {...register("username")}
            color={errors.username ? "failure" : "default"}
          />
          {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
        </div>

        <div>
          <Label htmlFor="role" value="Role" />
          <Select id="role" {...register("role")} color={errors.role ? "failure" : "default"}>
            <option value="">Select a role</option>
            <option value="User">User</option>
            <option value="Associate1">Associate1</option>
            <option value="Associate2">Associate2</option>
          </Select>
          {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            color={errors.email ? "failure" : "default"}
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {id && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="updatePassword"
              checked={updatePassword}
              onChange={() => setUpdatePassword(!updatePassword)}
            />
            <Label htmlFor="updatePassword">Update Password</Label>
          </div>
        )}

        {(updatePassword || !id) && (
          <div>
            <Label htmlFor="password" value="Password" />
            <div className="relative">
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
                color={errors.password ? "failure" : "default"}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <HiEyeOff className="h-5 w-5 text-gray-500" aria-hidden="true" />
                ) : (
                  <HiEye className="h-5 w-5 text-gray-500" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          </div>
        )}

        <Button type="submit" color="dark" className="w-full" disabled={loading}>
          {loading ? "Processing..." : id ? "Update User" : "Create User"}
        </Button>
      </form>
    </div></>
  );
}

export default observer(UserForm);