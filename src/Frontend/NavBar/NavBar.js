import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './NavBar.css'; // Import your CSS file for NavBar styles
import { useEmail } from '../EmailContext'; // Import your EmailContext
import { useNavigate } from 'react-router-dom';
const NavBar = ({ links }) => {
  const navigate = useNavigate();
  const { clearEmail } = useEmail();
  const { isAuthenticated, signOut } = useAuth();
  const [resetNavbar, setResetNavbar] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState(null);
  // const [token, setToken] = useState('');
  // const [userEmail, setUserEmail] = useState('');
  const timeoutIds = [];

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isAuthenticated ? 'true' : 'false');
    if (isAuthenticated) {
      const timerId = setTimeout(handleLogout, 50000);
      timeoutIds.push(timerId); // Store the timeout ID in the array
      setLogoutTimer(timerId);
    }else {
     clearTimeout(logoutTimer); // Clear the timer when user logs out
    }
    return () => clearTimeout(logoutTimer);
  }, [isAuthenticated]);
  
  // useEffect(() => {
  //   const storedEmail = localStorage.getItem('userEmail');
  //   if (storedEmail) {
  //     setUserEmail(storedEmail);
  //   }
  // }, []);
  // useEffect(() => {
  //   const storedToken = localStorage.getItem('token');
  //   if (storedToken) {
  //     setToken(storedToken);
  //   }
  // }, []);

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
      // Extend session by sending a request to the server
      // For instance, a request to a /extend-session endpoint

      // Example using fetch:
      fetch(`http://167.71.176.188:5000/extend-session?email=${localStorage.getItem('savedEmail')}`, {
  method: 'POST',
  headers: {
    'Authorization': localStorage.getItem('token'), // Use your stored token here
    'Content-Type': 'application/json',
  },
})
.then((response) => {
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json(); // Parse the response body as JSON
})
.then((data) => {
  const receivedToken = data.token; // Assuming the token key in the response is 'token'
  localStorage.setItem('token', receivedToken); // Store the received token in localStorage
  // Now you can update the state or perform other actions with the received token
  // setToken(receivedToken); // Update the token state in your React component
})
.catch((error) => {
  console.error('Error extending session:', error);
  // Handle error extending session (redirect, logout, etc.)
});
    }
      

  const handleLogoutExtension = () => {
  
    // const alertTime = 20000; 
  
    const promptUser = () => {
      if (isAuthenticated) {
      const confirmation = window.confirm(
        'You will be logged out in 10 seconds. Do you want to extend your session?'
      );
  
      if (confirmation) {
        const timerId = setTimeout(promptUser, 50000);
        extendSession();
      timeoutIds.push(timerId); // Store the timeout ID in the array
      setLogoutTimer(timerId);
      } else{
        const timerId = setTimeout(logoutUser, 10000);
        timeoutIds.push(timerId); // Store the timeout ID in the array
       setLogoutTimer(timerId);
      }
    }
    };
    const timerId = setTimeout(promptUser, 50000);
      timeoutIds.push(timerId); // Store the timeout ID in the array
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
      timeoutIds.push(timerId); // Store the timeout ID in the array
      setLogoutTimer(timerId);
    }
  }
  };

  const filteredLinks = resetNavbar
  ? links.filter((link) => link.url === '/signup' || link.url === '/signin')
  : isAuthenticated
  ? links.filter(
      (link) => link.url !== '/signup' && link.url !== '/signin'
    )
  : links.filter((link) => link.url === '/signup' || link.url === '/signin');

const loggedInLinks = [
  { url: '/dashboard', text: 'Dashboard' },
  { url: '/spent', text: 'Spent' },
  { url: '/Category', text: 'Category' },
];


  return (
    <nav className="navbar">
      <ul className="nav-list">
        {isAuthenticated
          ? loggedInLinks.map((link, index) => (
              <li className="nav-item" key={index}>
                <Link to={link.url}>{link.text}</Link>
              </li>
            ))
          : filteredLinks.map((link, index) => (
              <li className="nav-item" key={index}>
                <Link to={link.url}>{link.text}</Link>
              </li>
            ))}
      </ul>
      {isAuthenticated && (
        <button onClick={logoutUser2} className="logout-button">
          Logout
        </button>
      )}
    </nav>
  );
};

export default NavBar;
