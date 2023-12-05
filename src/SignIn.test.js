import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios'; // Mock Axios
import SignInPage from './SignInPage';

//jest.mock('axios'); // Mocking Axios

describe('SignInPage component', () => {
  it('submits form and signs in successfully', async () => {
    const mockedToken = 'mockedToken123'; // A mocked token for testing purposes

    // Mocking the axios post function to return a successful response
    axios.post.mockResolvedValue({
      data: {
        token: mockedToken,
      },
    });

    render(<SignInPage />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Enter your password'), { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(screen.getByRole('Submit button'));

    // Wait for the async operation (API call) to resolve
    await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('token', mockedToken);
     // expect(axios.post).toHaveBeenCalledTimes(1); // Ensure axios.post was called once
       // Check local storage for token
      // Add additional assertions based on your application flow
    });
   // expect(localStorage.setItem).toHaveBeenCalledWith('token', mockedToken);
  });

  it('handles unsuccessful sign-in', async () => {
    // Mocking axios.post to return an error response
    axios.post.mockRejectedValue({
      response: {
        status: 400,
      },
    });

    render(<SignInPage />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Enter your email'), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByLabelText('Enter your password'), { target: { value: 'invalidpassword' } });

    // Simulate form submission
    fireEvent.click(screen.getByRole('Submit button'));

    // Wait for the async operation (API call) to resolve
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1); // Ensure axios.post was called once
      // Add assertions for error handling based on your application flow
    });
  });
});
