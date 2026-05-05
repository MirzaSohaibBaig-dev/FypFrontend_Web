import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import './welcomescreen.css'; 

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Logo Section */}
      <img 
        src={logoImage} 
        alt="CodeMide Logo" 
        className="welcome-logo" 
      />

      {/* Text Section */}
      <h1 className="welcome-title">Welcome to CodeMide</h1>
      <p className="welcome-subtitle">
        Measure . Monitor . Manage
      </p>

      {/* Button Section */}
      <button 
        className="start-btn" 
        onClick={() => navigate('/login')}
      >
        Continue
      </button>
    </div>
  );
};

export default WelcomeScreen;