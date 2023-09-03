
const db = require('../config/dbconnection');

const sendMail = require('../helpers/send_mail.js');
const otpVerification = (req, res) => {
    try {
      const user_email = req.body.user_email;
      const otp = req.body.otp;
      const query = `SELECT * FROM user_credentials WHERE token = ? AND user_email = ?`;
    
      console.log('Debug:', user_email, otp); // Debug line
    
      db.query(query, [otp, user_email], (err, results) => {
     //   console.log('Database Results:', results); // Debug line
        if (err) {
         // console.error(err);
          return res.status(500).json({ message: 'Error verifying OTP' });
        }
    
        if (results.length === 1) {
               // OTP matched, update verified status or perform other actions
        db.query('UPDATE user_credentials SET user_active_status = true WHERE user_email = ?', [user_email]);
        return  res.status(200).json({ message: 'Email verified successfully' });
        } else {
          //console.log('Invalid OTP:', results); // Debug line
          return res.status(400).json({ message: 'Invalid OTP' });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error verifying OTP' });
    }
  };
  module.exports = {
    otpVerification
   
  };