import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for requests
import axiosInstance from '../axiosConfig'; // Import the configured Axios instance
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useToast } from '../components/ui/use-toast';
import { Toast } from '../components/ui/toast';
import { useTheme } from "next-themes";

const UNSPLASH_ACCESS_KEY = 'jzIvKkSz0QKWozgGs8muY7YuWfp0Ep9sjg5eQK88nsI'; // Replace with your Unsplash API key

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [images, setImages] = useState({});
  const { toast, showToast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    fetchMenu();
  }, []);

  const getToken = () => {
    return localStorage.getItem('token'); // Adjust based on where the token is stored
  };

  const fetchMenu = async () => {
    try {
      const token = getToken();
      const response = await axiosInstance.get('/customer/menu', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const uniqueCategories = ['All', 'Dessert', 'Snacks', ...new Set(response.data.map(item => item.category))];
      setMenuItems(response.data);
      setCategories(uniqueCategories);
      fetchImages(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      showToast({
        title: "Error",
        description: "Failed to fetch menu. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchImages = async (menuItems) => {
    const imagePromises = menuItems.map(async (item) => {
      const query = encodeURIComponent(item.name);
      const response = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`);
      if (response.data.results.length > 0) {
        const suitableImage = response.data.results.find(img => img.width > img.height);
        return { name: item.name, imageUrl: suitableImage ? suitableImage.urls.small : null };
      }
      return { name: item.name, imageUrl: null };
    });

    const results = await Promise.all(imagePromises);
    const imageMap = results.reduce((acc, { name, imageUrl }) => {
      acc[name] = imageUrl;
      return acc;
    }, {});
    setImages(imageMap);
  };

  const addToCart = async (item) => {
    try {
      const token = getToken();
      const quantity = 1; // You can modify this to allow users to choose quantity
      const response = await axiosInstance.post('/customer/add', {
        menuItemId: item._id,
        quantity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optionally update local cart state if needed
      showToast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} rounded-lg`}>
      <h2 className="text-3xl font-bold mb-6 text-center">Our Menu</h2>
      <div className="mb-6 flex justify-center flex-wrap">
        {categories.map(category => (
          <Button 
            key={category} 
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? "default" : "outline"}
            className="mr-2 mb-2 transition duration-300 transform hover:scale-105"
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item._id} className="flex flex-col h-full shadow-lg rounded-lg overflow-hidden transition duration-300 transform hover:scale-105">
            <CardHeader className="p-4">
              <div className="h-24 flex flex-col justify-between">
                <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                <CardDescription className="text-">{item.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className={`flex-grow flex flex-col justify-between p-4 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"}`}>
              <img 
                src={images[item.name] || 'placeholder_image_url'} 
                alt={item.name} 
                className="w-full h-32 object-cover mb-4 rounded" 
                style={{ objectFit: 'cover' }} 
              />
              <div className="flex-grow"></div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-2xl font-bold">${item.price.toFixed(2)}</p>
                <Button onClick={() => addToCart(item)} className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300">Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Toast toast={toast} />
    </div>
  );
}

export default Menu;
