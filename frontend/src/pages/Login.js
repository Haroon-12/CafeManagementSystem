import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from '../components/ui/use-toast';
import { Toast } from '../components/ui/toast';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { toast, showToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      showToast({
        title: "Success",
        description: "Login successful",
      });
      // Save the token and navigate to the menu page
      localStorage.setItem('token', response.data.token);
      navigate('/menu');
    } catch (error) {
      console.error('Error logging in:', error);
      showToast({
        title: "Error",
        description: "Failed to log in",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className={`max-w-md w-full space-y-8 p-10 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            />
          </div>
          <div>
            <Label htmlFor="password" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            />
          </div>
          <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 p-2 rounded-md">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
          </p>
        </div>
      </div>
      <Toast toast={toast} />
    </div>
  );
}

export default Login;