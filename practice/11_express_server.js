import express from 'express';
const app = express();

// Define a route for GET /
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
