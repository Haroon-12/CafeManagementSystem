import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { FaSmile, FaStar } from 'react-icons/fa';
import { useToast } from '../components/ui/use-toast';
import { Toast } from '../components/ui/toast';

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <FaStar
              size={30}
              className={`cursor-pointer ${ratingValue <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
            />
          </label>
        );
      })}
    </div>
  );
};

function Feedback() {
  const { theme } = useTheme();
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast, showToast } = useToast();

  const handleInputChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const getToken = () => {
    return localStorage.getItem('token'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken(); // Retrieve the token
      await axios.post(
        'http://localhost:5000/api/customer/feedback', 
        feedback, 
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      setFeedback({ rating: 0, comment: '' });
      setDialogOpen(true);
      showToast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className={`max-w-md w-full space-y-8 p-10 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Provide Feedback</h1>
        <form onSubmit={handleSubmit} className={`space-y-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          <div>
            <Label htmlFor="rating" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Rating</Label>
            <StarRating rating={feedback.rating} setRating={(rating) => setFeedback({ ...feedback, rating })} />
          </div>
          <div>
            <Label htmlFor="comment" className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Comment</Label>
            <Input
              type="text"
              name="comment"
              value={feedback.comment}
              onChange={handleInputChange}
              placeholder="Your comments"
              required
              className={`mt-1 block w-full border rounded-md shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            />
          </div>
          <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 p-2 rounded-md">
            Submit Feedback
          </Button>
        </form>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} className="fixed inset-0 z-10 overflow-y-auto">
          <DialogContent
            className={`flex flex-col items-center justify-center text-center rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} p-8`}
          >
            <DialogHeader>
              <DialogTitle className="text-center mb-4 text-2xl font-semibold">Thank You!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <FaSmile className="text-6xl text-yellow-500 mb-4" />
              <p className="text-lg">Feedback Submitted</p>
            </div>
          </DialogContent>
        </Dialog>

        <Toast toast={toast} />
      </div>
    </div>
  );
}

export default Feedback;
