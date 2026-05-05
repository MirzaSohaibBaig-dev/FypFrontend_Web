import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './StudentLayout.css';

export default function StudentLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {/* The Outlet represents the child route (e.g., HomeScreen, ProfileScreen) */}
        <Outlet />
      </main>
    </div>
  );
}
