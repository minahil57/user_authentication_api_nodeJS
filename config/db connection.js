// Destructure environment variables for database configuration
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

// Import the MySQL library
var mysql = require('mysql');

// Create a connection object with the database configuration
var conn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME
});

// Attempt to connect to the database
conn.connect(function (err) {
    if (err) {
        // If there's an error, log that the connection failed
        console.error(DB_NAME + ' Database Connection Failed!');
    } else {
        // If there's no error, log that the connection was successful
        console.log(DB_NAME + ' Database Connected Successfully!');
    }
});

// Export the connection object for use in other parts of the application
module.exports = conn;
