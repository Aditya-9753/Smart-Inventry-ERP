import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: false,
  isMobileSidebarOpen: false,
  theme: localStorage.getItem('theme') || 'light',
  isLoading: false,
  activeModal: null,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar Controls
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },

    // Mobile Sidebar Controls
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action) => {
      state.isMobileSidebarOpen = action.payload;
    },
    closeMobileSidebar: (state) => {
      state.isMobileSidebarOpen = false;
    },

    // Theme Controls
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },

    // Loading State
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Modal Management
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },

    // Notifications
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  closeSidebar,
  openSidebar,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  closeMobileSidebar,
  setTheme,
  toggleTheme,
  setLoading,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state) => state.ui.isSidebarOpen;
export const selectMobileSidebarOpen = (state) => state.ui.isMobileSidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectActiveModal = (state) => state.ui.activeModal;
export const selectNotifications = (state) => state.ui.notifications;

export default uiSlice.reducer;
