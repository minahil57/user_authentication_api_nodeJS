const nodemailer = require('nodemailer');
require('dotenv').config();
const { SMTP_MAIL, SMTP_PASSWORD } = process.env;

// Function to send an email
const sendMail = async (user_email, mailSubject, content) => {
    try {
        // Create a nodemailer transporter
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: SMTP_MAIL,
                pass: SMTP_PASSWORD
            }
        });

        // Define email options
        const mailOptions = {
            from: SMTP_MAIL,
            to: user_email,
            subject: mailSubject,
            html: content
        };

        // Send the email
        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                // Handle error if sending fails
                console.error('Error sending email:', error.message);
                // You should throw the error or handle it appropriately here.
            } else {
                // Email sent successfully
                console.log('Mail sent successfully!', info.response);
                // You might want to return a success message here.
            }
        });
    } catch (error) {
        // Handle any exceptions that occur
        console.error('An error occurred:', error.message);
        // You should throw the error or handle it appropriately here.
    }
};

// Export the sendMail function
module.exports = sendMail;
