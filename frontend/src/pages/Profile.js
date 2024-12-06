import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import axiosInstance from '../axiosConfig'; // Import the configured Axios instance
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useTheme } from 'next-themes';
import { useToast } from '../components/ui/use-toast';
import { Toast } from '../components/ui/toast';

function Profile() {
  const { theme } = useTheme();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dietaryPreferences: '',
    allergies: ''
  });
  const [message, setMessage] = useState(null);
  const { toast, showToast } = useToast();

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        console.log('No token found');
        return;
      }
      try {
        const response = await axiosInstance.get('/customer/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve token again on submit
    if (!token) {
      setMessage('No token found');
      return;
    }
    try {
      await axiosInstance.put('/customer/profile', user, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers for update
        },
      });
      showToast({
        title: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    }
  };

  return (
    <div className={`container mx-auto p-4 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>First Name</Label>
          <Input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
            className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>
        <div>
          <Label htmlFor="lastName" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Last Name</Label>
          <Input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
            className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>
        <div>
          <Label htmlFor="email" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Email</Label>
          <Input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>
        <div>
          <Label htmlFor="phone" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Phone</Label>
          <Input
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>
        <div>
          <Label htmlFor="address" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Address</Label>
          <Input
            name="address"
            value={user.address}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>
        <div>
          <Label htmlFor="dietaryPreferences" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Dietary Preferences</Label>
          <Input
            name="dietaryPreferences"
            value={user.dietaryPreferences}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>
        <div>
          <Label htmlFor="allergies" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Allergies</Label>
          <Input
            name="allergies"
            value={user.allergies}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>
        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300 p-2 rounded-md">
          Update Profile
        </Button>
      </form>
      <Toast toast={toast} />
    </div>
  );
}

export default Profile;
