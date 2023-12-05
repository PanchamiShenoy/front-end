import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; // Import your authentication context
import { useEmail } from './EmailContext'; // Import your email context
import { useNavigate } from 'react-router-dom';

const AutoLogout = () => {
  const navigate = useNavigate();
  const { signOut, isAuthenticated } = useAuth(); // Your authentication context functions
  const { clearEmail } = useEmail(); // Your user's email from EmailContext
  const [logoutTime, setLogoutTime] = useState(30000); // Initial logout time in milliseconds
  const [alertTime, setAlertTime] = useState(10000); // Time for alert in milliseconds

  useEffect(() => {
    let logoutTimer;

    const handleLogout = () => {
      signOut(); // Logout function from your auth context
      navigate('/signin');
      clearEmail();
    };

    const showAlert = () => {
      const result = window.confirm(`Your session will expire in ${alertTime / 1000} seconds. Click OK to extend your session.`);
        console.log(result);
      if (result) {
        setLogoutTime(prevTime => prevTime + 30000); // Increase logout time by 30 seconds
      } else {
        setLogoutTime(10000); // Reset logout time to default (30 seconds)
       // setLogoutTime(prevTime => alertTime - prevTime);
      }
    };

    if (isAuthenticated) {
      logoutTimer = setInterval(() => {
        if (logoutTime > 10000) {
          showAlert();
        }
      }, alertTime);
    }

    setTimeout(() => {
      clearInterval(logoutTimer);
    }, logoutTime);

    return () => {
      clearInterval(logoutTimer);
    };
  }, [isAuthenticated, logoutTime, signOut, clearEmail, navigate, alertTime]);

  return null; // This component doesn't render anything visible
};

export default AutoLogout;
