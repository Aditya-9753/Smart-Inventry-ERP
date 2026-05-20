import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-0 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-neutral-0 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-10 rounded-lg shadow-card">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
