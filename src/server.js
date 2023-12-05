const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const compression = require('compression');

const port = process.env.PORT || 5000;
const app = express();
const cors = require('cors');
app.use(cors());
app.use(compression());
app.use(express.json());

const JWT_SECRET = 'Panchami'; 

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'sql5.freemysqlhosting.net',
    user: 'sql5665983',
    password: '2NNRIaQp3w',
    database: 'sql5665983'
});

app.post('/signup', (req, res) => {
  const { fname, lname, email, password } = req.body;
  pool.getConnection((err, connection) => {
      if (err) {
          res.status(500).json({ error: 'Database connection error' });
          return;
      }

      const query = 'INSERT INTO user (fname, lname, email, password) VALUES (?, ?, ?, ?)';
      connection.query(query, [fname, lname, email, password], (error, results) => {
          connection.release(); 
          if (error) {
              res.status(500).json({ error: 'Database query error' });
              return;
          }

          const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: 60 });
          res.status(200).json({ message: 'User registered successfully', userId: results.insertId, token: token });
      });
  });
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM user WHERE email = ? AND password = ?';

  pool.getConnection((err, connection) => {
      if (err) {
          res.status(500).json({ error: 'Database connection error' });
          return;
      }

      connection.query(query, [email, password], (error, results) => {
          connection.release(); 
          if (error) {
              res.status(500).json({ error: 'Database query error' });
              return;
          }

          if (results.length === 0) {
              res.status(401).json({ error: 'Invalid credentials' });
              return;
          }

          const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: 60 });
          res.status(200).json({ message: 'User authenticated successfully', user: results[0], token: token });
      });
  });
});
function verifyToken(req, res, next) {
  console.log(req?.body)
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'Token not provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(err)
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
}

app.post('/Category', verifyToken, (req, res) => {
   const { email, categoryName, maxBudget } = req.body; 
   console.log("#######EMAIL", email)  
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ error: 'Database connection error' });
            return;
        }

        const query = 'INSERT INTO Categories (email, name, maxBudget) VALUES (?, ?, ?)';
        connection.query(query, [email, categoryName, maxBudget], (error, results) => {
            connection.release(); 
            if (error) {
              console.log("ERROR", error)
                res.status(500).json({ error: 'Database query error' });
                return;
            }
            console.log('RESULTS', results);
            res.status(200).json({ message: 'Category added successfully', categoryId: results.insertId });
        });
    });
});
app.get('/Category',verifyToken ,(req, res) => {
  const userEmail = req.query.email;

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: 'Database connection error' });
      return;
    }

    const query = 'SELECT * FROM Categories WHERE email = ?';
    connection.query(query, [userEmail], (error, results) => {
      connection.release(); 
      if (error) {
        res.status(500).json({ error: 'Database query error' });
        return;
      }
      console.log(results);
      res.status(200).json({ categories: results });
    });
  });
});

app.post('/spent', verifyToken, (req, res) => {
  const { email, name, spent, month } = req.body;
    
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: 'Database connection error' });
      return;
    }

    const selectQuery = 'SELECT * FROM Expense WHERE email = ? AND name = ? AND month = ?';
    connection.query(selectQuery, [email, name, month], (selectError, selectResults) => {
      if (selectError) {
        res.status(500).json({ error: 'Database query error' });
        return;
      }

      if (selectResults && selectResults.length > 0) {
        let currentSpent = 0;
        if (selectResults && selectResults.length > 0) {
          currentSpent = selectResults[0].spent;
        }
        const updatedSpent = Number(currentSpent) + Number(spent);
        
        const updateQuery = 'UPDATE Expense SET spent = ? WHERE email = ? AND name = ? AND month = ?';
        connection.query(updateQuery, [updatedSpent, email, name, month], (updateError, updateResults) => {
          connection.release(); 
          if (updateError) {
            res.status(500).json({ error: 'Database query error' });
            return;
          }
          console.log(updateResults);
          res.status(200).json({ message: 'Expense updated successfully', expenseId: updateResults.insertId });
        });
      } else {
        const insertQuery = 'INSERT INTO Expense (email, name, spent, month) VALUES (?, ?, ?, ?)';
        connection.query(insertQuery, [email, name, spent, month], (insertError, insertResults) => {
          connection.release(); 
          if (insertError) {
            res.status(500).json({ error: 'Database query error' });
            return;
          }
          console.log(insertResults);
          res.status(200).json({ message: 'Expense added successfully', expenseId: insertResults.insertId });
        });
      }
    });
  });
});

app.get('/budgetData', verifyToken, (req, res) => {
  const userEmail = req.query.email;
  const selectedMonth = req.query.month;
  const selectedCategory = req.query.category; // Assuming category is passed from frontend

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: 'Database connection error' });
      return;
    }

    let query = `
      SELECT Categories.name, Categories.maxBudget, COALESCE(SUM(Expense.spent), 0) AS spent 
      FROM Categories 
      LEFT JOIN Expense 
      ON Categories.email = Expense.email AND Categories.name = Expense.name `;
    
    const queryParams = [];

    if (selectedMonth) {
      query += ' AND (Expense.month = ? OR Expense.month IS NULL)';
      queryParams.push(selectedMonth);
    }

    query += ' WHERE Categories.email = ?';
    queryParams.push(userEmail);
    
    if (selectedCategory) {
      query += ' AND Categories.name = ?';
      queryParams.push(selectedCategory);
    }

    query += ' GROUP BY Categories.name, Categories.maxBudget';

    connection.query(query, queryParams, (error, results) => {
      connection.release(); 
      if (error) {
        res.status(500).json({ error: 'Database query error', message: error.message });
        return;
      }

      res.status(200).json({ budgetData: results });
    });
  });
});

// Assuming the necessary imports and setup have been done

app.post('/extend-session',verifyToken,(req, res) => {
  // Assuming the user's email is available as a query parameter named 'email'
  const userEmail = req.query.email;

  // Generate a new token with extended expiration using the userEmail
  const newToken = jwt.sign({ email: userEmail }, JWT_SECRET, { expiresIn: 60 }); // Extend to your desired duration

  res.status(200).json({ token: newToken }); // Send the new token back to the client
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
