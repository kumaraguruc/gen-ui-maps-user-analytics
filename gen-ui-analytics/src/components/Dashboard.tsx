import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    // Show content for 3 seconds
    const hideTimer = setTimeout(() => {
      // Start hiding animation
      setHiding(true);
      
      // After animation completes, set to not visible
      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 1000); // Animation duration
      
      return () => clearTimeout(removeTimer);
    }, 3000);
    
    return () => clearTimeout(hideTimer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className={`dashboard ${hiding ? 'hiding' : ''}`}>
      <h1 className="gradient-text">Hello world!</h1>
      <h2 className="gradient-text">Welcome to GenUI Dashboard</h2>
      <p className="subtitle">Explore the power of generative UI with Maps analytics</p>
    </div>
  );
};

export default Dashboard;
