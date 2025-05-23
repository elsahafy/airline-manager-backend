import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Airlines Manager" 
              className="h-10 w-auto"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/40x40?text=AM';
              }}
            />
            <h1 className="text-xl font-bold">Airlines Manager Optimizer</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">
                {user.airline?.name} | Balance: ${user.airline?.balance.toLocaleString()}
              </span>
              <button 
                onClick={() => logout()}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="bg-blue-700">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto py-2 space-x-4">
              <button 
                onClick={() => handleNavigation('/dashboard')}
                className="px-4 py-2 text-white hover:bg-blue-600 rounded whitespace-nowrap"
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleNavigation('/aircraft-finder')}
                className="px-4 py-2 text-white hover:bg-blue-600 rounded whitespace-nowrap"
              >
                Aircraft Finder
              </button>
              <button 
                onClick={() => handleNavigation('/route-finder')}
                className="px-4 py-2 text-white hover:bg-blue-600 rounded whitespace-nowrap"
              >
                Route Finder
              </button>
              <button 
                onClick={() => handleNavigation('/cabin-configurator')}
                className="px-4 py-2 text-white hover:bg-blue-600 rounded whitespace-nowrap"
              >
                Cabin Configurator
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Airlines Manager Optimizer &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
