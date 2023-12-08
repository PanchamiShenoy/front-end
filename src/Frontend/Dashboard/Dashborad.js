import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './Dashboard.css'; 
import { useEmail } from '../EmailContext';
import axios from 'axios';


const Dashboard = () => {
  const [budgetData, setBudgetData] = useState({
    labels: [],
    maxBudgets: [],
    monthlyMoneySpent: [],
  });
  const { email } = useEmail();
  const [userEmail, setUserEmail] = useState('');
  const [pageAccessible, setPageAccessible] = useState(true);
  const [token, setToken] = useState('');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [selectedMonth, setSelectedMonth] = useState('January');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    
  }, [setToken]);

  useEffect(() => {
    // Function to handle token changes in localStorage
    const handleTokenChange = (e) => {
      if (e.key === 'token') {
        const updatedToken = e.newValue;
        setToken(updatedToken);
      }
    };
  
    // Add an event listener to listen for changes in localStorage
    window.addEventListener('storage', handleTokenChange);
  
    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener('storage', handleTokenChange);
    };
  }, [setToken]);
  

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  // useEffect(() => {
  //   const handleEmailChange = () => {
  //     if (email && email !== userEmail) {
  //       setUserEmail(email);
  //       localStorage.setItem('userEmail', email);
  //     }
  //   };

  //   handleEmailChange();
  // }, [email, userEmail]);

  useEffect(() => {
    // let v= localStorage.getItem('token');
    if (!email) {
      setPageAccessible(false);
      return;
    }
    console.log(token,"has")
    axios.get(`http://localhost:5000/budgetData?email=${localStorage.getItem('savedEmail')}&month=${selectedMonth}`, {
    headers: {
       'Authorization': `${localStorage.getItem('token')}`
    }
})
    .then(response => {
      const categoriesData = response.data.budgetData;
      let categories = [];
      let maxBudgets = [];
      let spentValues = [];

      categoriesData.forEach(category => {
        categories.push(category.name);
        maxBudgets.push(category.maxBudget);
        spentValues.push(category.spent || 0); // Replace null with 0
      });
      console.log(categories,maxBudgets,spentValues)
      setBudgetData({
        labels: categories,
        maxBudgets: maxBudgets,
        monthlyMoneySpent: spentValues,
      });
      console.log(budgetData,"data")
    })
    .catch(error => {
      if (error.response) {
        switch (error.response.status) {
          case 401: // Unauthorized
            console.error('Unauthorized access');
            setPageAccessible(false);
            break;
          case 404: // Not found
            console.error('Budget data not found for user:', userEmail);
            break;
          default:
            console.error('Unexpected error:', error.response.status);
        }
      } else {
        console.error('Network error:', error);
      }
      
    });
  }, [email, token, selectedMonth]);
  
 

  useEffect(() => {
    let barChart = null;
    let areaChart = null;
    let lineChart = null;

    const destroyChart = (chart) => {
      if (chart) chart.destroy();
    };

    const destroyCharts = () => {
      destroyChart(barChart);
      destroyChart(areaChart);
      destroyChart(lineChart);
    };

    const createBarChart = () => {
      const ctxBar = document.getElementById('barChart');
      barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: budgetData.labels,
          datasets: [
            {
              label: 'Monthly Money Spent',
              data: budgetData.monthlyMoneySpent,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Max Budget Allotted',
              data: budgetData.maxBudgets,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        },
      });
    };

    const createAreaChart = () => {
      const ctxArea = document.getElementById('areaChart');
       areaChart = new Chart(ctxArea, {
        type: 'line',
        data: {
          labels: budgetData.labels,
          datasets: [
            {
              label: 'Monthly Money Spent',
              data: budgetData.monthlyMoneySpent,
              borderColor: 'rgba(54, 162, 235, 1)', 
              backgroundColor: 'rgba(54, 162, 235, 0.4)', 
              fill: true,
            },
            {
              label: 'Max Budget Allotted',
              data: budgetData.maxBudgets,
              borderColor: 'rgba(255, 99, 132, 1)', 
              backgroundColor: 'rgba(255, 99, 132, 0.4)',
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    };
    
    const createLineChart = () => {
      const ctxLine = document.getElementById('lineChart');
      lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: budgetData.labels,
          datasets: [
            {
              label: 'Trend of Money Spent',
              data: budgetData.monthlyMoneySpent,
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: false,
            },
            {
              label: 'Trend of Max Budget',
              data: budgetData.maxBudgets,
              borderColor: 'rgba(255, 99, 132, 1)',
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    };

    destroyCharts();
    createBarChart();
    createAreaChart();
    createLineChart();

    return destroyCharts;
  }, [budgetData]);
  if (!pageAccessible) {
    return <h1>Page can't be accessed please log in</h1>;
  }
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };
  return (
    <div className="dashboard-container">
      <div className="chart-container">
      <h2>Welcome, {email}</h2>
      <select
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
        <h3>Bar Chart</h3>
        {/* This is an A11y Change */}
        <canvas id="barChart" width="400" height="200" aria-label="Bar Chart"></canvas>
      </div>
      <div>
        <h3>Area Chart</h3>
        {/* This is an A11y Change */}
        <canvas id="areaChart" width="400" height="200" aria-label="Area Chart"></canvas>
      </div>
      <div>
        <h3>Line Chart</h3>
        {/* This is an A11y Change */}
        <canvas id="lineChart" width="400" height="200" aria-label="Line Chart"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;

