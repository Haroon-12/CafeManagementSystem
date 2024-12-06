import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from '../components/ui/use-toast';
import { Toast } from '../components/ui/toast';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { toast, showToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/otp/send-otp', { email: formData.email });
      setOtpSent(true);
      showToast({
        title: "Success",
        description: "OTP sent to your email",
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      showToast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Payload for OTP verification:', { email: formData.email, otp });
      await axios.post('http://localhost:5000/api/otp/verify-otp', {
        email: formData.email,
        otp: otp, // Fixing the payload
      });
      console.log('Payload for registering customer:', {
        email: formData.email,
        password: formData.password,
        role: 'customer',
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
      });

      await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "customer",
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
      });
      showToast({
        title: "Success",
        description: "Registration successful",
      });
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
      });
      navigate('/login'); // Navigate to the login page after successful registration
    } catch (error) {
      console.error('Error verifying OTP or registering customer:', error);
      showToast({
        title: "Error",
        description: "Failed to verify OTP or register",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center my-4${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className={`max-w-md w-full space-y-8 p-10 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Register</h1>
        {!otpSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Username</Label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
            </div>
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
            <div>
              <Label htmlFor="confirmPassword" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
            </div>
            <div>
              <Label htmlFor="firstName" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>First Name</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
            </div>
            <div>
              <Label htmlFor="lastName" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Last Name</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
            </div>
            <div>
              <Label htmlFor="phone" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
            </div>
            <div>
              <Label htmlFor="address" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Address</Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 p-2 rounded-md">
              Register
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <Label htmlFor="otp" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>OTP</Label>
              <Input
                type="text"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 p-2 rounded-md">
              Verify OTP
            </Button>
          </form>
        )}
        <div className="mt-4 text-center">
          <p className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
      <Toast toast={toast} />
    </div>
  );
}

export default Register;