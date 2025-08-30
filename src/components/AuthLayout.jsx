import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ title, subtitle, children, error, success }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg m-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>

        {error && (
          <div className="p-3 text-center text-sm text-red-800 dark:text-red-300 bg-red-200 dark:bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-center text-sm text-green-800 dark:text-green-300 bg-green-200 dark:bg-green-900/30 rounded-lg">
            {success}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
