import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button as FlowbiteButton, Card as FlowbiteCard } from 'flowbite-react';
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/loginUser`, {
        email,
        password,
      });
console.log(response.data)
      const token = response.data.data.token;

      if (token) {
        localStorage.setItem('authToken', token);
        toast.success('Login successful!');
        navigate('/');
      } else {
        throw new Error('Invalid response: no token provided.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  
      <FlowbiteCard className="w-[450px] shadow-lg">
        <div className="p-4 text-center">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-gray-500">Enter your email and password to log in</p>
        </div>
        <form onSubmit={onSubmit} className="px-8 py-6">
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              <AiOutlineMail className="inline-block text-gray-500 mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              <AiOutlineLock className="inline-block text-gray-500 mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>
          <div className="px-4 py-4">
            <FlowbiteButton
              className="w-full bg-black text-white font-semibold rounded-md"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="mr-2">Loading...</span>
              ) : (
                "Sign In"
              )}
            </FlowbiteButton>
          </div>
        </form>
      </FlowbiteCard>
    </div>
  );
};

export default LoginPage;
