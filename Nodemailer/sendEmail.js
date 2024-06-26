const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "isteyakislam12@gmail.com",
    pass: "hsnx wlvv yirw qhay",
  },
});

// Define the current directory and find a PDF file
const currentDir = process.cwd();
const pdfFile = fs.readdirSync(currentDir).find(file => path.extname(file).toLowerCase() === ".pdf");

if (pdfFile) {
  // Create mail options with the PDF attachment
  const mailOptions = {
    from: "isteyakislam12@gmail.com",
    to: "isteyakislam12@gmail.com",
    subject: "Hello from Nodemailer",
    text: "This is a test email sent using Nodemailer.",
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
