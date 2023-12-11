import React, { useState,useEffect } from 'react';
import './BudgetCategory.css';
import { useEmail } from '../EmailContext';
import axios from 'axios';

const BudgetCategory = () => {
  const { email } = useEmail();
  const [userEmail, setUserEmail] = useState('');
  const [pageAccessible, setPageAccessible] = useState(true);

  const [category, setCategory] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleMaxBudgetChange = (e) => {
    setMaxBudget(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://167.71.176.188:5000/Category', {
        email: email,
        categoryName: category,
        maxBudget: parseFloat(maxBudget),
        contentType: 'text/plain',
      }, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Category added successfully');
        setCategory('');
        setMaxBudget('');
      } else if (response.status === 400) {
        console.error('Bad Request: Check your input data');
      } else if (response.status === 500) {
        console.error('Server Error: Unable to process your request');
      }
    } catch (error) {
      console.error('Error:', error);
    }

  };
  useEffect(() => {
    if (!email) {
      setPageAccessible(false);
    }
  }, [email]);
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const handleEmailChange = () => {
      if (email && email !== userEmail) {
        setUserEmail(email);
        localStorage.setItem('userEmail', email);
      }
    };

    handleEmailChange();
  }, [email, userEmail]);
  if (!pageAccessible) {
    return <h1>Page can't be accessed please log in</h1>;
  }

  return (
    <div className="budget-category-container">
      <h2 className="budget-category-heading">Category and Max Budget</h2>
      <form onSubmit={handleSubmit} className="budget-category">
        <div>
          <label htmlFor="category">Category</label>
          {/* This is an A11y Change */}
          <input
            aria-label="Enter category"
            type="text"
            id="category"
            value={category}
            placeholder="Category"
            onChange={handleCategoryChange}
            required
          />
        </div>
        <div>
          <label htmlFor="maxBudget">Max Budget</label>
          {/* This is an A11y Change */}
          <input
            aria-label="Maximum Budget"
            type="number"
            id="maxBudget"
            value={maxBudget}
            placeholder="Max amount"
            onChange={handleMaxBudgetChange}
            required
          />
        </div>
         {/* This is an A11y Change */}
        <button role = "submit button "type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BudgetCategory;
