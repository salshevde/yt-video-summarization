import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Youtube } from 'lucide-react'; // Updated to use a different Youtube icon from lucide-react
import { Home, Sun, Moon, History, LogOut } from 'lucide-react';
import { nhost } from '../lib/nhost'; // Import nhost client
import toast from 'react-hot-toast';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  user: any; // This will come from Nhost
  onAuthClick: () => void;
}

export function Header({ isDark, setIsDark, user, onAuthClick }: HeaderProps) {
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await nhost.auth.signOut(); // Nhost logout
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <header className="flex justify-between items-center mb-12">
      <Link to="/" className="flex items-center gap-3">
        <div className="bg-red-600 p-2 rounded-lg">
          <Youtube className="w-8 h-8 text-white" />
        </div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Video<span className="text-red-600">Summary</span>
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {user && location.pathname === '/history' &&(
          <Link
            to="/"
            className={`p-3 rounded-full transition-all duration-300 ${
              location.pathname === '/history'
                ? 'bg-red-600 text-white'
                : isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-white hover:bg-gray-100 text-gray-600 shadow-lg'
            }`}
          >
            <Home className="w-5 h-5" />
          </Link>
        )}
        
                {user && location.pathname === '/' &&(
          <Link
            to="/history"
            className={`p-3 rounded-full transition-all duration-300 ${
              location.pathname === '/'
                ? 'bg-red-600 text-white'
                : isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-white hover:bg-gray-100 text-gray-600 shadow-lg'
            }`}
          >
            <History className="w-5 h-5" />
          </Link>
        )}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
              : 'bg-white hover:bg-gray-100 text-gray-600 shadow-lg'
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            className={`p-3 rounded-full transition-all duration-300 ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-white hover:bg-gray-100 text-gray-600 shadow-lg'
            }`}
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onAuthClick}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            { user? user : "Sign In"}
          </button>
        )}
      </div>
    </header>
  );
}
