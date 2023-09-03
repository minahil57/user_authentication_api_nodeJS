// Import the necessary function from 'express-validator'
const { check } = require('express-validator');

// Validation rules for user sign-up
exports.signUPValidation = [
    // Check if 'full_name' field is not empty
    check('full_name', 'Name is required').not().isEmpty(),

    // Check if 'user_email' field is a valid email address
    // Also, normalize Gmail addresses (remove dots)
    check('user_email', 'Please Enter A Valid Email').isEmail().normalizeEmail({ gmail_remove_dots: true }),

    // Check if 'user_password' field has a minimum length of 6 characters
    check('user_password', 'Password is required').isLength({ min: 6 }),
];

// Validation rules for user login
exports.loginValidation = [
    // Check if 'user_email' field is a valid email address
    // Also, normalize Gmail addresses (remove dots)
    check('user_email', 'Please Enter A Valid Email').isEmail().normalizeEmail({ gmail_remove_dots: true }),

    // Check if 'user_password' field has a minimum length of 6 characters
    check('user_password', 'Password is required').isLength({ min: 6 }),
];
