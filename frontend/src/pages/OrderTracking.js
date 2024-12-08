import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useToast } from '../components/ui/use-toast';
import axiosInstance from '../axiosConfig'; // Import the configured Axios instance

function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const { showToast } = useToast(); 

  useEffect(() => {
    fetchOrders();
    
    // Polling for updates every 30 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axiosInstance.get('/customer/orders', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast({
        title: "Error",
        description: "Failed to fetch orders. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Preparing': return 'bg-blue-500';
      case 'Ready for Pickup': return 'bg-green-500';
      case 'Completed': return 'bg-gray-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Your Orders</h2>
      <Table>
        <TableCaption>A list of your recent orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
              <TableCell>${order.total}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                <span className="ml-2">{order.status}</span>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                    </DialogHeader>
                    <div>
                      <p><strong>Order ID:</strong> {order._id}</p>
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p><strong>Total Amount:</strong> ${order.total}</p>
                      <h3 className="font-bold mt-4">Items:</h3>
                      <ul>
                        {order.items.map(item => (
                          <li key={item._id}>
                            {item.menuItem.name} x {item.quantity} - ${(item.menuItem.price * item.quantity).toFixed(2)}
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

export default OrderTracking;
