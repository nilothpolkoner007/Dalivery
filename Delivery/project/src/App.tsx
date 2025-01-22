import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { RestaurantDetails } from './pages/RestaurantDetails';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import { DeliveryDashboard } from './pages/DeliveryDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navigation } from './components/Navigation';
import { useAuthStore } from './store/authStore';

// Protected route wrapper
function ProtectedRoute({ children, allowedTypes }: { 
  children: React.ReactNode; 
  allowedTypes?: string[];
}) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(user.user_type || 'customer')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                user?.user_type === 'admin' ? (
                  <ProtectedRoute allowedTypes={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                ) : user?.user_type === 'delivery' ? (
                  <ProtectedRoute allowedTypes={['delivery']}>
                    <DeliveryDashboard />
                  </ProtectedRoute>
                ) : (
                  <Home />
                )
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/restaurant/:id" 
              element={
                <ProtectedRoute>
                  <RestaurantDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/delivery"
              element={
                <ProtectedRoute allowedTypes={['delivery']}>
                  <DeliveryDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedTypes={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}