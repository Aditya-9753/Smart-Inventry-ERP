import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Breadcrumb from '../components/layout/Breadcrumb';

const StaffLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <Sidebar role="STAFF" />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Breadcrumb />
            <div className="mt-6 bg-neutral-0 dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 min-h-[calc(100vh-200px)]">
              <div className="p-6 md:p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
