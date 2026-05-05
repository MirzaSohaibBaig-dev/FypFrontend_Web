import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, BarChart2, LogOut, PlayCircle } from 'lucide-react';
import logoImage from '../assets/logo.png';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sid } = location.state || {};
  const studentId = sid || localStorage.getItem('sid');

  const menuItems = [
    { name: 'Home', icon: <Home size={22} />, path: '/student/home' },
    { name: 'Take Test', icon: <PlayCircle size={22} />, path: '/student/test-screen' },
    { name: 'Reports', icon: <BarChart2 size={22} />, path: '/student/reports' },
    { name: 'Profile', icon: <User size={22} />, path: '/student/profile' },
  ];

  return (
    <aside className="student-sidebar">
      <div className="sidebar-header">
        <img src={logoImage} alt="Logo" className="sidebar-logo" />
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path, { state: { sid: studentId } })}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

    <button
  className="logout-btn"
  onClick={() => {
    // ❌ localStorage.clear();  ← REMOVE THIS

    // ✅ Only remove auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sid');

    navigate('/');
  }}
>
  <LogOut size={22} />
  <span>Logout</span>
</button>
    </aside>
  );
};

export default Sidebar;