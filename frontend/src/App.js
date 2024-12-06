import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Layout from './components/Layout';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import HelpDesk from './pages/HelpDesk';
import Reservations from './pages/Reservations';
import Feedback from './pages/Feedback';
import Register from './pages/Register';
import Login from './pages/Login';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/register" />} />
            <Route element={<Layout />}>
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<OrderTracking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/helpdesk" element={<HelpDesk />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/feedback" element={<Feedback />} />
            </Route>
          </Routes>
        </Elements>
      </Router>
    </ThemeProvider>
  );
}

export default App;