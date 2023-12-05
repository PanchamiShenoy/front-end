import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const checkAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    // Set your authentication state based on the value in localStorage
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  

  // Inactivity timer
  //let inactivityTimer;

  const signIn = () => {
    setIsAuthenticated(true);
    //setInactivityTimer(); // Start the inactivity timer upon successful login
  };

  const signOut = () => {
    setIsAuthenticated(false);
    //clearTimeout(inactivityTimer); // Clear the inactivity timer on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
