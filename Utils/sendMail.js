const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');
dotEnv.config({ path: './../config.env' });
const sendmail = async options => {
  try {
    console.log(process.env.GMAIL_USERNAME);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: options.email,
      from: process.env.GMAIL_USERNAME,
      subject: options.subject,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendmail;
