const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer
 * @param {Object} options - The email options
 * @param {string} options.email - The recipient's email address
 * @param {string} options.subject - The email subject
 * @param {string} options.message - The email body text
 * @returns {Promise<void>} Resolves when the email is sent
 */
const sendEmail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define email options
  const mailOptions = {
    from: 'Krsto Zaric natours@test.io',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
