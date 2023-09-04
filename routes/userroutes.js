// Import the Express framework
const express = require('express');
// Create a router object
const router = express.Router();

// Import validation functions and controllers
const { signUPValidation, loginValidation } = require('../helpers/validation');
const registerController = require('../controllers/registration_controller');
const loginController = require('../controllers/login_controller');
const verificationController = require('../controllers/otp_verfication');
const resendotpController = require('../controllers/resend_otp');

// Define routes and associate them with validation and controller functions

// Route for user registration
router.post('/register', signUPValidation, registerController.register);

// Route for user email verification
router.post('/verification', verificationController.otpVerification);

// Route for user login
router.post('/login', loginValidation, loginController.login);

// Route for resending OTP (One-Time Password)
router.post('/resendotp', resendotpController.resend);

// Export the router for use in the main application
module.exports = router;
