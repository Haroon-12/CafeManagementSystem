"use client";

import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig'; 
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from '../components/ui/use-toast';
import { Toast } from '../components/ui/toast';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useTheme } from "next-themes";

const stripePromise = loadStripe('pk_test_51QQp5SIjmfzbMvK4LqHhnqwVqQsiAekhSWViVJSkL6kVykUbd2aNCOsAglIdDSXHkAoOkcik0wc1w3ZqmeXs4wZ100MJN42lsz');

const getToken = () => localStorage.getItem('token'); 

function CheckoutForm({ amount, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useToast();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    try {
      const token = getToken();
      const { data } = await axiosInstance.post(
        '/customer/create-payment-intent',
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await axiosInstance.post(
          '/customer/orders',
          { items: [], total: amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast({
          title: "Payment Successful",
          description: "Your order has been placed successfully.",
        });
        onClose();
      }
    } catch (err) {
      setError('An error occurred while processing your payment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border rounded p-2" />
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit" disabled={!stripe || processing} className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
        Pay ${amount}
      </Button>
    </form>
  );
}

function Cart() {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const { theme } = useTheme();
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    updateTotalAmount();
  }, [cart]);

  const fetchCart = async () => {
    try {
      const token = getToken();
      const response = await axiosInstance.get('/customer/cart/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      showToast({
        title: "Error",
        description: "Failed to fetch cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const token = getToken();
      await axiosInstance.put(
        `/customer/update/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart((prevCart) =>
        prevCart.map((item) => (item._id === itemId ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error('Error updating item quantity:', error);
      showToast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = getToken();
      await axiosInstance.delete(`/customer/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
      showToast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      showToast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      const token = getToken();
      await axiosInstance.delete('/customer/clear', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
      showToast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      showToast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateTotalAmount = () => {
    const total = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
    setTotalAmount(total);
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-lg shadow-lg`}>
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-4">
              <div>
                <h3 className="text-xl">{item.menuItem.name}</h3>
                <p>Price: ${item.menuItem.price}</p>
                <div className="flex items-center">
                  <Button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300">-</Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="bg-green-500 text-white hover:bg-green-600 transition duration-300">+</Button>
                </div>
              </div>
              <Button onClick={() => removeFromCart(item._id)} className="bg-red-500 text-white hover:bg-red-600 transition duration-300">Remove</Button>
            </div>
          ))}
          <h2 className="text-2xl font-bold mt-4">Total: ${totalAmount.toFixed(2)}</h2>
          <Button onClick={clearCart} className="mt-4 w-full bg-red-600 text-white hover:bg-red-700 transition duration-300">Clear Cart</Button>
          <Button onClick={() => setShowCheckout(true)} className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300">Proceed to Checkout</Button>
        </>
      )}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              Checkout
            </DialogTitle>
          </DialogHeader>
          <Elements stripe={stripePromise}>
            <CheckoutForm amount={totalAmount} onClose={() => setShowCheckout(false)} />
          </Elements>
        </DialogContent>
      </Dialog>
      <Toast toast={toast} />
    </div>
  );
}

export default Cart;
