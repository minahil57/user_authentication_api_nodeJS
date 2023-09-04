// Import necessary modules
const db = require('../config/db connection.js');
const otpGenerator = require('otp-generator');
const sendMail = require('../helpers/mail_sender.js');

// Function to handle OTP resending
const resend = (req, res) => {
    var user_email = req.body.user_email;
    var full_name = req.body.full_name;

    // Define the email subject for the OTP
    let mailSubject = 'Your Email Subject';

    // Generate OTP
    const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });

    // OTP EMAIL CONTENT
    let content = `<html>
    <head>
        <style>
            /* Your CSS styles here */
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Hello, ${full_name}</div>
            <div class="info">
                We're excited to have you as part of our community. Here's your verification code:
            </div>
            <div class="otp">${otp}</div>
            <div class="info">
                Please use this code to complete your registration. If you didn't request this code, you can safely ignore this email.
            </div>
            <div class="footer">
                Best regards,<br />
                
            </div>
        </div>
    </body>
    </html>`;

    // Send the email
    sendMail(user_email, mailSubject, content);

    // Update OTP in the database
    db.query('UPDATE user_credentials SET token=? WHERE user_email=?',//REPLACE WITH YOUR DBQUREY
     [otp, user_email], function (error, result, fields) {
        if (error) {
            return res.status(400).send({
                msg: error
            });
        } else {
            return res.status(200).send({
                msg: 'Email Sent Successfully'
            });
        }
    });
};

module.exports = {
    resend
};
