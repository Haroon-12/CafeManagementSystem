import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon, XMarkIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { Bars3Icon as MenuIcon } from '@heroicons/react/24/solid';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Outlet } from 'react-router-dom';

function Layout({ children }) {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { to: '/menu', label: 'Menu' },
    { to: '/cart', label: 'Cart' },
    { to: '/orders', label: 'Orders' },
    { to: '/reservations', label: 'Reservations' },
    { to: '/profile', label: 'Profile' },
    { to: '/helpdesk', label: 'Help' },
    { to: '/feedback', label: 'Feedback' },
    //logout
    { to: '/login', label: 'Logout', onClick: handleLogout },
  ];

  const navItems2 = [
    { to: '/menu', label: 'Menu' },
    { to: '/cart', label: 'Cart' },
    { to: '/orders', label: 'Orders' },
    { to: '/reservations', label: 'Reservations' },
    { to: '/profile', label: 'Profile' },
    { to: '/helpdesk', label: 'Help' },
    { to: '/feedback', label: 'Feedback' },
  ];

  return (
    <div
      className={`flex flex-col min-h-screen overflow-hidden ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">University Café</h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              {navItems2.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`hover:underline px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.to ? 'bg-gray-700' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <Button onClick={toggleTheme} className="p-2 rounded-md">
              {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </Button>
            {!sidebarOpen && (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center p-1 rounded-md bg-red-600 hover:bg-red-500 text-white"
                aria-label="Logout"
              >
                Logout
              </button>
            )}
            <button
              className="md:hidden p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition duration-300"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Sidebar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Café</h2>
            <button
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close Sidebar"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`hover:underline px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.to ? 'bg-gray-700' : ''
                }`}
              >
                {item.label === 'Logout' ? <span className="hover:underline px-3 py-2 rounded-md text-sm font-medium text-red-500">{item.label}</span> : item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-grow container mx-auto py-8">
        {children}
        <Outlet />
      </main>

      <footer
        className={`bg-gray-100 py-4 ${
          theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
        }`}
      >
        <div
          className={`container mx-auto text-center text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-600'
          }`}
        >
          © 2024 University Café. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default React.memo(Layout);
