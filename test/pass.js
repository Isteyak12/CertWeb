const nodemailer = require("nodemailer");

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "testqqq808@gmail.com",
    pass: "artz wqxy yqdt slcu",
  },
});

// Define the current directory and find a PDF file
