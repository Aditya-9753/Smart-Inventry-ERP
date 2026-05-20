import React, { useState } from 'react';
import { Bell, Menu, Moon, Sun, User, LogOut, Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toggleMobileSidebar } from '../../redux/uiSlice';
import NotificationBell from '../notifications/NotificationBell';
import Button from '../ui/Button';

const Navbar = () => {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-neutral-0 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between px-4 md:px-6 transition-colors duration-200 z-40 sticky top-0">
      {/* Left Section - Mobile Menu Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(toggleMobileSidebar())}
          className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-ring"
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} className="text-neutral-700 dark:text-neutral-300" />
        </button>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-ring"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={20} className="text-neutral-600 dark:text-neutral-400" />
          ) : (
            <Moon size={20} className="text-neutral-600 dark:text-neutral-400" />
          )}
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-ring"
            aria-label="User menu"
            aria-expanded={isUserMenuOpen}
          >
            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center font-medium">
              <User size={18} />
            </div>
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-neutral-0 dark:bg-neutral-900 rounded-lg shadow-dropdown border border-neutral-200 dark:border-neutral-700 py-1 z-50"
              role="menu"
              aria-orientation="vertical"
            >
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                role="menuitem"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={() => {
                  navigate('/settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                role="menuitem"
              >
                <Settings size={16} />
                Settings
              </button>

              <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-status-critical-600 dark:text-status-critical-400 hover:bg-status-critical-50 dark:hover:bg-status-critical-900/20 transition-colors"
                role="menuitem"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Navbar;
