import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useEmail } from './EmailContext';
import { useNavigate } from 'react-router-dom';
const ExtendSession = () => {
  const navigate = useNavigate();
  const { clearEmail } = useEmail();
  const { isAuthenticated, signOut } = useAuth();
  const [resetNavbar, setResetNavbar] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState(null);
  const timeoutIds = [];
  let timerId;

  useEffect(() => {
    sessionStorage.setItem('isLoggedIn', isAuthenticated ? 'true' : 'false');
    if (isAuthenticated) {
      timerId = setTimeout(handleLogout, 50000);
      timeoutIds.push(timerId); 
      setLogoutTimer(timerId);
    }else {
     clearTimeout(logoutTimer); 
    }
    return () => clearTimeout(logoutTimer);
  }, [isAuthenticated]);
  

  const logoutUser = () => {
    clearTimeout(logoutTimer);
    clearAllTimeouts();
    clearEmail();
    signOut();
    navigate('/signin');
  };
  const logoutUser2 = () => {
    clearTimeout(logoutTimer);
    clearAllTimeouts();
    clearEmail();
    signOut();
    navigate('/signin');
  };
  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timeoutIds.length = 0;
  };


  const extendSession = () => {
    
      fetch(`http://167.71.176.188:5000/extend-session?email=${localStorage.getItem('savedEmail')}`, {
  method: 'POST',
  headers: {
    'Authorization': localStorage.getItem('token'), 
    'Content-Type': 'application/json',
  },
})
.then((response) => {
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json(); 
})
.then((data) => {
  const receivedToken = data.token; 
  localStorage.setItem('token', receivedToken);
})
.catch((error) => {
  console.error('Error extending session:', error);
});
    }
      

  const handleLogoutExtension = () => {
  
    const promptUser = () => {
      if (isAuthenticated) {
      const confirmation = window.confirm(
        'You will be logged out in 10 seconds. Do you want to extend your session?'
      );
  
      if (confirmation) {
        const timerId = setTimeout(promptUser, 50000);
        extendSession();
      timeoutIds.push(timerId);
      setLogoutTimer(timerId);
      } else{
        const timerId = setTimeout(logoutUser, 10000);
        timeoutIds.push(timerId); 
       setLogoutTimer(timerId);
      }
    }
    };
    const timerId = setTimeout(promptUser, 50000);
      timeoutIds.push(timerId); 
      setLogoutTimer(timerId);
    
  };

  const handleLogout = () => {
    clearTimeout(logoutTimer);
    if (isAuthenticated) {
    const confirmation = window.confirm(
      'You will be logged out soon. Do you want to extend your session?'
    );
    if (confirmation) {
      extendSession();
      handleLogoutExtension();
    } else {
      const timerId = setTimeout(logoutUser, 10000);
      timeoutIds.push(timerId); 
      setLogoutTimer(timerId);
    }
  }
  };
  return null;
};

export default ExtendSession;
