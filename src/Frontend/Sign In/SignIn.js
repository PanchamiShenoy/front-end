import React, { useState } from 'react';
import axios from 'axios';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import { useEmail } from '../EmailContext';

const SignInPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { setEmailValue } = useEmail();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://167.71.176.188:5000/signin', {
        email: formData.email,
        password: formData.password,
      });

      console.log('User authenticated:', response.data);
      const token = response.data.token; 
      localStorage.setItem('token', token);
      signIn(); 
      setEmailValue(formData.email);
      navigate('/dashboard'); 
      
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.error('Invalid email or password');
        } else if (error.response.status === 500) {
          console.error('Server error. Please try again later.');
        }
      } else {
        console.error('An error occurred. Please try again.');
      }
    }
    
  };

  return (
    <div>
      <div className="sign-in-container">
        <h2 className="sign-in-heading">Sign In</h2>
        <form onSubmit={handleSubmit} className="sign-in-form">
          <div>
            <label htmlFor="email">Email</label>
             {/* This is an A11y Change */}
            <input
             aria-label="Enter your email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
             {/* This is an A11y Change */}
            <input
             aria-label="Enter your password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
           {/* This is an A11y Change */}
          {/* <button type="submit" name="signin" role = "Submit button" className="sign-in-button">Sign In</button> */}
          <button type="submit" name="signin" role="Submit button" data-testid="signin-button">
  Sign In
</button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
