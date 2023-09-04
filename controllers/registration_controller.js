// Import necessary modules
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../config/db connection.js');
const otpGenerator = require('otp-generator');
const sendMail = require('../helpers/mail_sender.js');

// Function to handle user registration
const register = async (req, res) => {
    var user_email = req.body.user_email;
    var user_password = req.body.user_password;
    var full_name = req.body.full_name;

    // Password Hashing
    const saltRounds = 10; // Number of salt rounds for bcrypt hashing

    // Hash the password
    bcrypt.hash(user_password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send({
                msg: 'Error hashing password',
                err,
            });
        }

        // Validation of Email, Name, Password
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check whether the given email already exists
        db.query(
            `SELECT * FROM user_credentials WHERE LOWER(user_email) = LOWER(${db.escape(
                user_email
            )});`, // REPLACE IT WITH YOUR DB QUERY

            (err, result) => {
                if (result && result.length) {
                    const user = result[0];

                    if (user.token) {
                        // Account verification is pending
                        return res.status(409).send({
                            msg: 'This Email Address is already Registered and account verification is pending.',
                        });
                    } else {
                        // Account is registered but not pending for verification
                        return res.status(410).send({
                            msg: 'This Email Address is already Registered.',
                        });
                    }
                } else {
                    db.query(
                        `INSERT INTO user_credentials 
                        (user_email, user_password, user_login_count, user_active_status,token) 
                        VALUES 
                        (?, ?, NULL, NULL,NULL);`,
                        [user_email, hashedPassword], // REPLACE IT WITH YOUR DB QUERY
                        (err, result) => {
                            if (err) {
                                return res.status(400).send({
                                    msg: 'Data Not saved in Database User Credentials',
                                    err,
                                });
                            }
                            // Insertion of data
                            var user_id = result.insertId;
                            db.query(
                                `INSERT INTO customer_details (full_name, user_id,created_at) 
                                VALUES (?,?, NOW())`,//REPLACE WITH YOUR DBQUREY
                                [full_name, user_id],
                                (err, result) => {
                                    if (err) {
                                        return res.status(500).send({
                                            msg: 'Error inserting data into customer_details',
                                            err,
                                        });
                                    }
                                    // Successfully Inserted
                                    else {
                                        // OTP Sender
                                        let mailSubject = 'Your Wajba Account Verification Code';
                                        const otp = otpGenerator.generate(6, {
                                            digits: true,
                                            alphabets: false,
                                            upperCaseAlphabets: false,
                                            lowerCaseAlphabets: false,
                                            specialChars: false,
                                        });

                                        // OTP EMAIL CONTENT
                                        let content = `<html>
                                            <head>
                                              <style>
                                                body {
                                                  font-family: Arial, sans-serif;
                                                  background-color: white;
                                                }
                                                .container {
                                                  max-width: 600px;
                                                  margin: 0 auto;
                                                  padding: 20px;
                                                  border: 1px solid #ddd;
                                                }
                                                .header {
                                                  color: #ff8c00; /* Orange accent color */
                                                  font-size: 24px;
                                                  margin-bottom: 10px;
                                                }
                                                .info {
                                                  font-size: 18px;
                                                  margin-bottom: 15px;
                                                }
                                                .otp {
                                                  font-weight: bold;
                                                  font-size: 28px;
                                                  color: #ff8c00; /* Orange accent color */
                                                }
                                                .footer {
                                                  font-size: 14px;
                                                  margin-top: 20px;
                                                  color: #fff; /* White text color */
                                                  background-color: #ff8c00; /* Orange accent color */
                                                  padding: 10px;
                                                }
                                                .logo {
                                                  display: block;
                                                  margin: 0 auto;
                                                  text-align: center;
                                                }
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
                                                  Your Wajba Team
                                                </div>
                                              </div>
                                            </body>
                                          </html>`;

                                        // Send the OTP email
                                        sendMail(user_email, mailSubject, content);

                                        // Save OTP in the database
                                        db.query('UPDATE user_credentials set token=? where user_email=?', // REPLACE IT WITH YOUR DB QUERY
                                            [otp, user_email], function (error, result, fields) {
                                                if (error) {
                                                    return res.status(400).send({
                                                        msg: 'The User Has Been Registered'
                                            });
                                        }
                                    });
                                }
                            }
                        );
                    }
                );
            }
        }
        
    );
  }
  );
};
module.exports = {
  register
}