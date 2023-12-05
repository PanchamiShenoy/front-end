import React, { createContext, useState, useContext, useEffect } from 'react';

const EmailContext = createContext();

export const useEmail = () => {
  return useContext(EmailContext);
};

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState(
    localStorage.getItem('savedEmail') || ''
  );

  const setEmailValue = (value) => {
    setEmail(value);
    localStorage.setItem('savedEmail', value);
  };

  const clearEmail = () => {
    setEmail('');
    localStorage.removeItem('savedEmail');
  };

  return (
    <EmailContext.Provider value={{ email, setEmailValue, clearEmail }}>
      {children}
    </EmailContext.Provider>
  );
};
