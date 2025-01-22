import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, ShoppingBag, User, LogOut } from 'lucide-react';

export function Navigation() {
  const { user, signOut } = useAuthStore();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl">FoodHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-indigo-600">
              <Home className="w-5 h-5" />
            </Link>
            
            {user ? (
              <>
                <Link to="/orders" className="text-gray-600 hover:text-indigo-600">
                  <ShoppingBag className="w-5 h-5" />
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-indigo-600">
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}