import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useToast } from '../components/ui/use-toast';
import { Toast } from '../components/ui/toast';
import { useTheme } from "next-themes";
import axiosInstance from '../axiosConfig'; // Import the configured Axios instance

function Reservations() {
  const { theme } = useTheme(); // Get the current theme
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({ date: '', time: '', partySize: '' });
  const [reservation ] = useState([]);
  const [formData, setFormData] = useState({ date: '', time: '', partySize: '' });
  const { toast, showToast } = useToast();

  // Helper to get token from storage
  const getToken = () => localStorage.getItem('token'); 

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = getToken();
      const response = await axiosInstance.get('/customer/reservations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched reservations:', response.data); // Log the fetched data
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewReservation({ ...newReservation, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      //get user by token
      const response = await axiosInstance.get('/customer/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          },
        });
      const user = response.data;
      console.log('New reservation:', newReservation); // Log the new reservation data
      await axiosInstance.post('/customer/reservations', newReservation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewReservation({ date: '', time: '', partySize: '' });
      fetchReservations();
      showToast({
        title: "Reservation Request Sent",
      });
      // Send email using Formspree
      const formspreeEndpoint = 'https://formspree.io/f/mrbzddwl';
      await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          partySize: formData.partySize,
          email: 'haroonmust123@gmail.com', // Admin email
          message: `A new reservation has been made by ${user.firstName} ${user.lastName}.\n\nDetails:\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${formData.partySize}\nPhone: ${user.phone}\nEmail: ${user.email}`,
        }),
      });
    } catch (error) {
      console.error('Error making reservation:', error);
    }
  };

  const cancelReservation = async (id) => {
    try {
      const token = getToken();
      //get user by token
      const response = await axiosInstance.get('/customer/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          },
        });
      const user = response.data;
      await axiosInstance.delete(`/customer/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReservations();
      showToast({
        title: "Reservation cancelled",
        variant: "destructive",
      });
      // Send email using Formspree
      const formspreeEndpoint = 'https://formspree.io/f/mrbzddwl';
      await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'haroonmust123@gmail.com', // Admin email
          message: `A reservation has been cancelled by ${user.firstName} ${user.lastName}.\n\nDetails:\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${formData.partySize}\nPhone: ${user.phone}\nEmail: ${user.email}`,
        }),
      });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      showToast({ message: 'Error cancelling reservation', type: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Confirmed': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`container mx-auto p-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-lg shadow-lg`}>
      <h1 className="text-3xl font-bold mb-4 text-center">Reservations</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="date"
          name="date"
          value={newReservation.date}
          onChange={handleInputChange}
          required
          className="border rounded p-2"
        />
        <input
          type="time"
          name="time"
          value={newReservation.time}
          onChange={handleInputChange}
          required
          className="border rounded p-2"
        />
        <input
          type="number"
          name="partySize"
          value={newReservation.partySize}
          onChange={handleInputChange}
          placeholder="Party Size"
          required
          className="border rounded p-2"
        />
        <button type="submit" className={`bg-blue-500 text-white hover:bg-blue-600 transition duration-300 p-2 rounded`}>
          Make Reservation
        </button>
      </form>
      <h2 className="text-2xl font-bold mt-6">Your Reservations</h2>
      <Table>
        <TableCaption>A list of your recent reservations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Party Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map(reservation => (
            <TableRow key={reservation._id}>
              <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
              <TableCell>{reservation.time}</TableCell>
              <TableCell>{reservation.partySize}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                <span className="ml-2">{reservation.status}</span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="bg-red-500 text-white hover:bg-red-600 transition duration-300 p-2 rounded"
                  onClick={() => cancelReservation(reservation._id)}
                >
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Reservations;
