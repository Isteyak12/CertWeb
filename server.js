const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;
require('dotenv').config();

const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve client.html
app.get('/client.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'client.html'));
});

// Endpoint to execute the sendEmail.js script
app.get('/execute-email', (req, res) => {
    exec('node Nodemailer/sendEmail.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing sendEmail.js: ${error.message}`);
            res.status(500).send(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.status(500).send(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.send(`stdout: ${stdout}`);
    });
});

// Serve sign.html
app.get('/auth/sign.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'auth/sign.html'));
});

// Serve admin.html
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Create a transporter for nodemailer
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

// Sign in route
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    // Check credentials
    if (email === process.env.EMAIL_USER && password === process.env.EMAIL_PASS) {
        // Create mail options
        const mailOptions = {
            from: "isteyakislam12@gmail.com",
            to: "isteyakislam12@gmail.com",
            subject: "Sign In Notification",
            text: `User ${email} has successfully signed in.`,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email: ", error);
                return res.status(500).json({ success: false, message: "Error sending email" });
            } else {
                console.log("Email sent: ", info.response);
                return res.status(200).json({ success: true, message: "Sign in successful, email sent" });
            }
        });
    } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// Endpoint to handle the admin button click
app.get('/execute-app', (req, res) => {
    res.redirect('/auth/sign.html');
});

// Endpoint to save the PDF
app.post('/save-pdf', upload.single('pdf'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `${req.file.originalname}`);

    fs.rename(tempPath, targetPath, err => {
        if (err) {
            console.error("Error saving PDF:", err);
            return res.status(500).send("Error saving PDF");
        }
        res.send("PDF saved successfully");
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
