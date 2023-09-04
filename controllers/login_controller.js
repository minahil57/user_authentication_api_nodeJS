// Import necessary modules
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../config/db connection.js');

// Function to handle user login
const login = (req, res) => {

    const user_email = req.body.user_email;
    const user_password = req.body.user_password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user with the provided email exists in the database
    db.query(
        `SELECT * FROM user_credentials WHERE user_email = ${db.escape(user_email)};`,
        (err, result) => {
            if (err) {
                return res.status(500).send({
                    msg: 'Error checking user credentials',
                    err,
                });
            }

            if (result && result.length) {
                const userRecord = result[0];

                if (userRecord.user_active_status === 1) {
                    // Use Promise.all to execute both queries sequentially
                    Promise.all([
                        bcrypt.compare(user_password, userRecord.user_password), // Compare the hashed password
                        new Promise((resolve, reject) => {
                            var Count = userRecord.user_login_count;
                            Count++;
                            // Update the login count
                            db.query(`UPDATE user_credentials SET user_login_count = ${Count} WHERE user_email = ${db.escape(user_email)};`, (updateErr, updateResult) => {
                                if (updateErr) {
                                    reject(updateErr);
                                } else {
                                    resolve();
                                }
                            });
                        }),
                        new Promise((resolve, reject) => {
                            // Update the last login timestamp
                            db.query(`UPDATE customer_details SET last_login = NOW() WHERE user_id = ${userRecord.user_id};`, (lastLoginErr, lastLoginResult) => {
                                if (lastLoginErr) {
                                    reject(lastLoginErr);
                                } else {
                                    resolve();
                                }
                            });
                        })
                    ])
                    .then(([bResult]) => {
                        if (bResult) {
                            return res.status(200).send({
                                msg: 'Logged in',
                            });
                        } else {
                            return res.status(401).send({
                                msg: 'Email or Password is incorrect',
                            });
                        }
                    })
                    .catch((error) => {
                        return res.status(500).send({
                            msg: 'An error occurred',
                            error,
                        });
                    });
                } else {
                    return res.status(403).send({
                        msg: 'Account verification is pending for this Email Address',
                    });
                }
            } else {
                return res.status(401).send({
                    msg: 'Email is incorrect',
                });
            }
        }
    );
};

module.exports = {
    login,
};
