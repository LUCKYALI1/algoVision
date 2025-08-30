import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GuestGuard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can optionally show a loading spinner here
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default GuestGuard;
