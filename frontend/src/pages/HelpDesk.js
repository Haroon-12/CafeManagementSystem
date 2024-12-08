"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { useToast } from '../components/ui/use-toast';
import { useTheme } from 'next-themes';
import axiosInstance from '../axiosConfig'; 

function HelpDesk() {
  const { theme } = useTheme(); // Handle theme preferences
  const [tickets, setTickets] = useState([]); // Ticket list state
  const [selectedTicket, setSelectedTicket] = useState(null); // State for selected ticket details
  const [dialogOpen, setDialogOpen] = useState(false); // Control the ticket creation dialog
  const { register, handleSubmit, reset, formState: { errors } } = useForm(); // React Hook Form for validation
  const { showToast } = useToast(); // Toast for user feedback

  const getToken = () => {
    return localStorage.getItem('token'); 
  };
  // Fetch tickets on component load
  useEffect(() => {
    fetchTickets();
  }, []);

  // API call to fetch tickets with token
  const fetchTickets = async () => {
    try {
      const token = getToken();
      const response = await axiosInstance.get('/customer/helpdesk', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      showToast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      });
    }
  };

  // Submit a new ticket with token
  const onSubmit = async (data) => {
    try {
      const token = getToken();
      await axiosInstance.post('/customer/helpdesk', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTickets(); // Refresh ticket list
      reset(); // Reset the form
      setDialogOpen(false); // Close the dialog
      showToast({
        title: "Success",
        description: "Ticket submitted successfully",
      });
    } catch (error) {
      console.error('Error submitting ticket:', error);
      showToast({
        title: "Error",
        description: "Failed to submit ticket",
        variant: "destructive",
      });
    }
  };

  // Badge color mapping for ticket statuses
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-yellow-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`container mx-auto p-4 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Help Desk Tickets</h1>
      <Button onClick={() => setDialogOpen(true)} className="mb-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 p-2 rounded-md">
        Create Ticket
      </Button>
      
      {/* Dialog for creating a new ticket */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className={`rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <DialogHeader>
            <DialogTitle>Create Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="subject" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Subject</Label>
              <Input
                type="text"
                name="subject"
                {...register('subject', { required: 'Subject is required' })}
                className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <Label htmlFor="message" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Message</Label>
              <Input
                type="text"
                name="message"
                {...register('message', { required: 'Message is required' })}
                className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>
            <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300 p-2 rounded-md">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ticket list table */}
      <Table className={`min-w-full ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map(ticket => (
            <TableRow key={ticket._id} className={`${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
              <TableCell>{ticket._id}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{ticket.message}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(ticket.status)} text-white px-2 py-1 rounded-full`}>{ticket.status}</Badge>
                <span className="ml-2">{ticket.status}</span>
              </TableCell>
              <TableCell>{new Date(ticket.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {/* View ticket details dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedTicket(ticket)} className={`${theme === "dark" ? "text-white border-gray-700" : "text-black border-gray-300"}`}>
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                    <DialogHeader>
                      <DialogTitle>Ticket Details</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      <p><strong>ID:</strong> {selectedTicket?._id}</p>
                      <p><strong>Subject:</strong> {selectedTicket?.subject}</p>
                      <p><strong>Message:</strong> {selectedTicket?.message}</p>
                      <p><strong>Status:</strong> {selectedTicket?.status}</p>
                      <p><strong>Created At:</strong> {new Date(selectedTicket?.createdAt).toLocaleString()}</p>
                      <h3 className="font-bold mt-4">Replies:</h3>
                      <ul className="list-disc pl-5">
                        {selectedTicket?.replies.map((reply, index) => (
                          <li key={index} className="mt-2">
                            <p><strong>{reply.isStaff ? 'Staff' : 'Admin'}:</strong> {reply.message}</p>
                            <p className="text-sm text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HelpDesk;
