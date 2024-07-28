require('dotenv').config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Define the path to data.json
const dataPath = path.join(process.cwd(), 'data.json'); // Ensure the path is correct
let email;

try {
  // Read and parse data.json
  const data = fs.readFileSync(dataPath, 'utf8');
  const jsonData = JSON.parse(data);
  email = jsonData.email;
  console.log(`Email to be used: ${email}`);
} catch (err) {
  console.error("Error reading or parsing data.json: ", err);
  process.exit(1); // Exit the process with an error code
}

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Define the current directory and find a PDF file
const currentDir = process.cwd();
const pdfFile = fs.readdirSync(currentDir).find(file => path.extname(file).toLowerCase() === ".pdf");

if (pdfFile) {
  // Create mail options with the PDF attachment
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // Use the email read from data.json
    subject: "Document",
    text: "Here is the attached document.",
    attachments: [
      {
        filename: pdfFile,
        path: path.join(currentDir, pdfFile),
      },
    ],
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
} else {
  console.log("No PDF file found in the current directory.");
}
