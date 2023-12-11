
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import { useEmail } from '../EmailContext';
import './Signup.css'; 
import axios from 'axios';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { setEmailValue } = useEmail();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
      const response = await axios.post('http://167.71.176.188:5000/signup', {
        fname: formData.firstName,
        lname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      console.log('Signup successful:', response.data);
      signIn();
      setEmailValue(formData.email);
      navigate('/dashboard');
      } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.error('Bad Request: Check your input data');
        } else if (error.response.status === 500) {
          console.error('Server Error: Unable to process your request');
        }
      } else {
        console.error('Error during signup:', error.message);
      }
    }
  };

  return (
    <div>
    <div className="sign-up-container">
      <h2 className="sign-up-heading">Sign Up</h2>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <div>
          <label htmlFor="firstName">First Name</label>
           {/* This is an A11y Change */}
          <input
            aria-label="First Name"
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
           {/* This is an A11y Change */}
          <input
            aria-label="Last Name"
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
           {/* This is an A11y Change */}
          <input
            aria-label="Email ID"
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
            aria-label="Password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
         {/* This is an A11y Change */}
        <button type="submit" role = "submit" className="sign-up-button">Sign Up</button>
      </form>
    </div>
    </div>
  );
};

export default SignUpPage;
