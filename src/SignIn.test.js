import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from './SignInPage';
import axios from 'axios';

jest.mock('axios');

describe('SignInPage Component', () => {
  test('Submits the form with valid data', async () => {
    const { getByLabelText, getByRole } = render(<SignInPage />);
    const emailInput = getByLabelText('Enter your email');
    const passwordInput = getByLabelText('Enter your password');
    const submitButton = getByRole('button', { name: 'Sign In' });

  
    axios.post.mockResolvedValueOnce({ data: { token: 'mockedToken' } });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton); // Submit the form

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/signin', {
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });
});
