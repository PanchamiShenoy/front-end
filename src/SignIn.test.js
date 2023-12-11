import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import SignInPage from './Frontend/Sign In/SignIn'; 
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from './Frontend/AuthContext';
import { EmailProvider } from './Frontend/EmailContext';
jest.mock('axios');
describe('SignInPage Component', () => {
  it('submits the form with valid data', async () => {
    // Mock useNavigate from react-router-dom
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    const mockSignIn = jest.fn();
    const mockSetEmailValue = jest.fn();
    jest.mock('/Users/panchamishenoy/Desktop/nbad_project/budget-final-app/src/Frontend/AuthContext.js', () => ({
      useAuth: () => ({ signIn: mockSignIn }),
    }));
    jest.mock('/Users/panchamishenoy/Desktop/nbad_project/budget-final-app/src/Frontend/EmailContext.js', () => ({
      useEmail: () => ({ setEmailValue: mockSetEmailValue }),
    }));

    const { getByLabelText, getByRole, getByTestId } = render(<Router>
      <AuthProvider>
      <EmailProvider>
    <SignInPage />
  </EmailProvider>
  </AuthProvider>
         </Router>);

    fireEvent.change(getByLabelText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getByLabelText('Enter your password'), {
      target: { value: 'password123' },
    });
    
    const signInButton = getByTestId('signin-button');
    fireEvent.click(signInButton);
  });
});
