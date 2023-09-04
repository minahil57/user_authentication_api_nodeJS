// Load environment variables from a .env file
require("dotenv").config();

// Import the database connection configuration
require('./config/db connection.js');

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const userRouter = require('./routes/userroute.js'); // Import the user router

// Create an Express application
const app = express();

// Middleware to parse JSON in request bodies
app.use(express.json());

// Middleware to parse URL-encoded data in request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the userRouter for routes starting with /api
app.use('/api', userRouter);

// Error Handling Middleware
app.use((err, _req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

// Start the server and listen on port 3000
app.listen(3000, () => console.log('Server is running on port 3000'));
