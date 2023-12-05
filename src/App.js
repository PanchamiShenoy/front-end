import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import SignUpPage from './Sign Up/Signup';
import SignInPage from './Sign In/SignIn';
import BudgetCategory from './BudgetCategory/BudgetCategory';
import MonthlySpent from './MonthlySpent/MonthlySpent';
import Dashboard from './Dashboard/Dashborad';
import { AuthProvider } from './AuthContext';
import { EmailProvider } from './EmailContext';

const App = () => {
  const navLinks = [
    { url: '/signup', text: 'Sign Up' },
    { url: '/signin', text: 'Sign In' },
    { url: '/dashboard', text: 'Dashboard' },
    { url: '/Category', text: 'Category' },
    { url: '/spent', text: 'Add' },
  ];

  return (
    <EmailProvider>
      <AuthProvider>
        <Router>
          <div>
            <NavBar links={navLinks} />
            <Routes>
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/Category" element={<BudgetCategory />} />
              <Route path="/spent" element={<MonthlySpent />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </EmailProvider>
  );
};

export default App;
