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

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem('isLoggedIn') === 'true'? true : false)},[signinIn]);


  const signIn = () => {
    isIn(true)
    sessionStorage.setItem('isLoggedIn',  'true' )
  };

  const signOut = () => {
    sessionStorage.setItem('isLoggedIn',  'false' )
    isIn(false)
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
