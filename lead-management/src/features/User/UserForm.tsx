import {useState} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Label, TextInput, Select } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiEye, HiEyeOff } from 'react-icons/hi'; 
import * as z from 'zod';
import axios from 'axios';

// Define the validation schema
const formSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  role: z.string().nonempty('Please select a role.'),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

// Infer the type for the form data
type FormData = z.infer<typeof formSchema>;

export default function UserForm() {
    const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      role: '',
      email: '',
      password: '',
    },
  });
  const navigate = useNavigate()

  // Type `data` as FormData
  const onSubmit = async (data: FormData) => {
    try {
      console.log(data);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user`, data);
      console.log(response.data);

      // Show a success message if the response is successful
      if (response.data.status === true) { // or check response.data.status if it's a custom success check
        toast.success('User created successfully. The new user has been added to the system.');
  
    
        setTimeout(() => {
          navigate('/users/view'); 
        }, 1000);
      }
    } catch (error) {
      // Show an error message if the request fails
      console.error(error);
      toast.error('Failed to create user. Please try again.');
    }
  };

  return (
    <div className='max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200'>
    
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
           <h2 className="text-2xl font-semibold text-center">Add User</h2>
      <div>
        <Label htmlFor="username" value="Username" />
        <TextInput
          id="username"
          placeholder="johndoe"
          {...register('username')}
          color={errors.username ? 'failure' : 'default'}
        />
        {errors.username && (
          <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">This is your public display name.</p>
      </div>

      <div>
        <Label htmlFor="role" value="Role" />
        <Select id="role" {...register('role')} color={errors.role ? 'failure' : 'default'}>
          <option value="">Select a role</option>
          <option value="user">User</option>
          <option value="ADMIN">Admin</option>
          <option value="Associate1">Associate1</option>
          
        </Select>
        {errors.role && (
          <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">Select the user's role in the system.</p>
      </div>

      <div>
        <Label htmlFor="email" value="Email" />
        <TextInput
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register('email')}
          color={errors.email ? 'failure' : 'default'}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">Enter the user's email address.</p>
      </div>

      <div>
        <Label htmlFor="password" value="Password" />
        <div className="relative">
          <TextInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            {...register('password')}
            color={errors.password ? 'failure' : 'default'}
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
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">Enter a strong password for the user.</p>
      </div>

      <Button type="submit" color="dark" className="w-full">
        Create User
      </Button>
    </form>
    </div>
  );
}
