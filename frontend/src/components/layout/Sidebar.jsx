import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Users,
  BarChart2,
  FileText,
  Warehouse,
  X,
} from 'lucide-react';
import { closeMobileSidebar, selectMobileSidebarOpen } from '../../redux/uiSlice';
import Drawer from '../ui/Drawer';

const Sidebar = ({ role }) => {
  const dispatch = useDispatch();
  const isMobileOpen = useSelector(selectMobileSidebarOpen);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleNavigation = () => {
      if (window.innerWidth < 768) {
        dispatch(closeMobileSidebar());
      }
    };

    window.addEventListener('resize', handleNavigation);
    return () => window.removeEventListener('resize', handleNavigation);
  }, [dispatch]);

  const getLinks = () => {
    const baseLinks = [
      { name: 'Dashboard', to: `/${role.toLowerCase()}/dashboard`, icon: <LayoutDashboard size={20} /> },
      { name: 'Inventory', to: `/${role.toLowerCase()}/inventory`, icon: <Package size={20} /> },
    ];

    if (['ADMIN', 'MANAGER', 'STAFF'].includes(role)) {
      baseLinks.push({ name: 'Transactions', to: `/${role.toLowerCase()}/transactions`, icon: <ShoppingCart size={20} /> });
    }

    if (['ADMIN', 'MANAGER'].includes(role)) {
      baseLinks.push(
        { name: 'Products', to: `/${role.toLowerCase()}/products`, icon: <Package size={20} /> },
        { name: 'Warehouses', to: `/${role.toLowerCase()}/warehouses`, icon: <Warehouse size={20} /> },
        { name: 'Reports', to: `/${role.toLowerCase()}/reports`, icon: <FileText size={20} /> },
        { name: 'Analytics', to: `/${role.toLowerCase()}/analytics`, icon: <BarChart2 size={20} /> }
      );
    }

    if (role === 'ADMIN') {
      baseLinks.push(
        { name: 'Users', to: '/admin/users', icon: <Users size={20} /> },
        { name: 'Settings', to: '/admin/settings', icon: <Settings size={20} /> }
      );
    }

    return baseLinks;
  };

  const links = getLinks();

  // Sidebar Content Component (shared between desktop and mobile)
  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-neutral-800 dark:border-neutral-700 px-6 flex-shrink-0">
        <span className="text-xl font-bold tracking-wider text-brand-400 dark:text-brand-300">
          SMART ERP
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-smooth ${
                isActive
                  ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-lg'
                  : 'text-neutral-300 dark:text-neutral-400 hover:bg-neutral-800 dark:hover:bg-neutral-800 hover:text-white'
              }`
            }
            onClick={() => {
              if (window.innerWidth < 768) {
                dispatch(closeMobileSidebar());
              }
            }}
          >
            <span className="flex-shrink-0">{link.icon}</span>
            <span className="text-sm">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800 dark:border-neutral-700 flex-shrink-0">
        <div className="bg-neutral-800 dark:bg-neutral-800 rounded-lg p-3 text-sm">
          <p className="text-neutral-400 dark:text-neutral-500">Role:</p>
          <p className="font-bold text-brand-400 dark:text-brand-300 mt-1">{role}</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile, visible on md+ screens */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-neutral-900 dark:bg-neutral-950 text-white flex-shrink-0 h-screen border-r border-neutral-800 dark:border-neutral-700 sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer - Only visible on mobile */}
      <Drawer
        isOpen={isMobileOpen}
        onClose={() => dispatch(closeMobileSidebar())}
        position="left"
        size="sm"
        closeOnEscape
        closeOnBackdropClick
      >
        <div className="bg-neutral-900 dark:bg-neutral-950 text-white h-full flex flex-col">
          <SidebarContent />
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
