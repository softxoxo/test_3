const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
app.use(express.json());

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "postgres",
	password: "exmp",
	port: 5432,
  });

  const sendUserActionEvent = async (userId, action) => {
	try {
	  const timestamp = new Date().toISOString();
	  await axios.post('http://localhost:3001/user-events', {
		userId,
		action,
		timestamp,
	  });
	} catch (error) {
	  console.error('Error sending user action event:', error);
	}
  };
  
  // Endpoint for creating a user
  app.post('/users', async (req, res) => {
	try {
	  const { name, email } = req.body;
	  const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
	  const values = [name, email];
	  const { rows } = await pool.query(query, values);
	  const createdUser = rows[0];
  
	  // Send event to User Action History Service
	  await sendUserActionEvent(createdUser.id, 'create');
  
	  res.status(201).json(createdUser);
	} catch (error) {
	  console.error('Error creating user:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });
  
  // Endpoint for updating a user
  app.put('/users/:id', async (req, res) => {
	try {
	  const userId = req.params.id;
	  const { name, email } = req.body;
	  const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
	  const values = [name, email, userId];
	  const { rows } = await pool.query(query, values);
	  const updatedUser = rows[0];
  
	  // Send event to User Action History Service
	  await sendUserActionEvent(updatedUser.id, 'update');
  
	  res.json(updatedUser);
	} catch (error) {
	  console.error('Error updating user:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });

// Endpoint for retrieving a list of users
app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('User Service is running on port 3000');
});