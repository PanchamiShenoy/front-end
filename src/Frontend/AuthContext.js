import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const checkAuthenticated = () => {
  return sessionStorage.getItem('isLoggedIn') === 'true';
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const [signinIn, isIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true'? true : false)
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isLoggedIn') === 'true'? true : false
  );



  // useEffect(() => {
  //   signinIn ?  sessionStorage.setItem('isLoggedIn',  'true' ): sessionStorage.setItem('isLoggedIn',  'false' );
  // }, [signinIn]);

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem('isLoggedIn') === 'true'? true : false)},[signinIn]);

  

  // Inactivity timer
  //let inactivityTimer;

  const signIn = () => {
    isIn(true)
    sessionStorage.setItem('isLoggedIn',  'true' )
    // setIsAuthenticated(true);
    //setInactivityTimer(); // Start the inactivity timer upon successful login
  };

  const signOut = () => {
    sessionStorage.setItem('isLoggedIn',  'false' )
    isIn(false)
   
    // setIsAuthenticated(false);
    //clearTimeout(inactivityTimer); // Clear the inactivity timer on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
