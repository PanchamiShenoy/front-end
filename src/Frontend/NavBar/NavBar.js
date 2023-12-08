import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './NavBar.css'; 
import { useEmail } from '../EmailContext';
import { useNavigate } from 'react-router-dom';
const NavBar = ({ links }) => {
  const navigate = useNavigate();
  const { clearEmail } = useEmail();
  const { isAuthenticated, signOut } = useAuth();
  const [resetNavbar, setResetNavbar] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState(null);
  const timeoutIds = [];

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
