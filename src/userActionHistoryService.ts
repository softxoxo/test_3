import express, { Application, Request, Response } from 'express';
import { Pool } from 'pg';

const app: Application = express();
app.use(express.json());

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "postgres",
	password: "exmp",
	port: 5432,
  });

// Endpoint for retrieving the history of user actions with filters and pagination
app.get('/user-actions', async (req: Request, res: Response) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const query = `
      SELECT * FROM user_actions
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [userId, limit, offset];
    const { rows } = await pool.query(query, values);

    res.json(rows);
  } catch (error) {
    console.error('Error retrieving user actions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Listen for events from the User Service
app.post('/user-events', async (req: Request, res: Response) => {
  try {
    const { userId, action, timestamp } = req.body;

    const query = 'INSERT INTO user_actions (user_id, action, timestamp) VALUES ($1, $2, $3)';
    const values = [userId, action, timestamp];
    await pool.query(query, values);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error storing user action:', error);
    res.sendStatus(500);
  }
});

// Start the server
app.listen(3001, () => {
  console.log('User Action History Service is running on port 3001');
});