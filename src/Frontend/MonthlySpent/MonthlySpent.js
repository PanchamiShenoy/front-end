/* eslint-disable jsx-a11y/aria-role */
import React, { useState, useEffect } from 'react';
import './MonthlySpent.css';
import { useEmail } from '../EmailContext';
import axios from 'axios';

const MonthlySpent = () => {
  const { email } = useEmail();
  const [userEmail, setUserEmail] = useState('');
  const [pageAccessible, setPageAccessible] = useState(true);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [moneySpent, setMoneySpent] = useState('');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    if (!email) {
      setPageAccessible(false);
    } else {
      // Fetch categories based on the user's email
      fetchCategories(email);
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

  const fetchCategories = async (userEmail) => {
    try {
      console.log(userEmail);
      const response = await axios.get(`http://167.71.176.188:5000/Category`, {
        params: {
          email: userEmail,
          
        },
        headers:{
          Authorization: localStorage.getItem('token')
        }
      });
      if (response.status === 200) {
        const categories = response.data.categories;
        const categoryNames = categories.map(category => category.name);
        setCategoryOptions(categoryNames);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleMoneySpentChange = (e) => {
    setMoneySpent(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Insert into Expense table
      const response = await axios.post(
        `http://167.71.176.188:5000/spent`,
        {
          email: userEmail,
          name: selectedCategory,
          spent: moneySpent,
          month: selectedMonth,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token')
          },
        }
      );
      
      if (response.status === 200) {
        console.log('Expense added successfully');
        // Clear the form after successful submission
        setSelectedCategory('');
        setMoneySpent('');
        setSelectedMonth('');
        
      } else if (response.status === 400) {
        console.error('Bad Request: Check your input data');
      } else if (response.status === 500) {
        console.error('Server Error: Unable to process your request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  if (!pageAccessible) {
    return <h1>Page can't be accessed please log in</h1>;
  }

  return (
    <div className="money-spent-form-container">
      <h2 className="money-spent-form-heading">Money Spent</h2>
      <form onSubmit={handleSubmit} className="money-spent-form">
        <div>
          <label htmlFor="categorySelect">Select Category:</label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select Category</option>
            {categoryOptions.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="moneySpent">Money Spent:</label>
          <input
          aria-label='Money spent per month'
            type="number"
            id="moneySpent"
            value={moneySpent}
            onChange={handleMoneySpentChange}
            placeholder="Enter amount spent"
            required
          />
        </div>
        <div>
          <label htmlFor="monthSelect">Select Month:</label>
          <select
            id="monthSelect"
            value={selectedMonth}
            onChange={handleMonthChange}
            required
          >
            <option value="">Select Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
         {/* This is an A11y Change */}
        <button role = "submit button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MonthlySpent;
