const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const app = express();
const upload = multer({ dest: 'uploads/' });
const port = 3000;

app.use(express.json()); // Parse JSON bodies

// Serve static files from the current directory
app.use(express.static(__dirname));

// Endpoint to handle POST request to save data
app.post('/save-data', (req, res) => {
    const data = req.body; // JSON data sent from client

    // Construct file path to save JSON data
    const filePath = path.join(__dirname, 'data.json');

    // Write JSON data to file
    fs.writeFile(filePath, JSON.stringify(data, null, 4), (err) => {
        if (err) {
            console.error('Error saving data:', err);
            res.status(500).send('Error saving data');
        } else {
            console.log('Data saved successfully:', data);
            res.send('Data saved successfully');
        }
    });
});

// Endpoint to handle POST request to send PDF
app.post('/send-pdf', upload.single('pdf'), (req, res) => {
    console.log('Received request to send PDF');
    const pdfPath = req.file.path;
    const email = 'isteyakislam12@gmail.com'; // Fixed email

    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'localhost', // Local SMTP server
        port: 25,          // Default port for smtp4dev
        secure: false,     // Use TLS
        auth: null         // No authentication
    });

    // Read the PDF file as a buffer
    fs.readFile(pdfPath, (err, data) => {
        if (err) {
            console.error('Error reading PDF file:', err);
            return res.status(500).json({ error: 'Error reading PDF file' });
        }

        // Setup email data
        const mailOptions = {
            from: 'isteyakislam12@gmail.com', // Replace with your email
            to: 'isteyakislam12@gmail.com',
            subject: 'Your Certificate',
            text: 'Please find attached your certificate.',
            attachments: [
                {
                    filename: req.file.originalname,
                    content: data,
                    contentType: 'application/pdf'
                }
            ]
        };

        // Send email with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: error.toString() });
            }
            console.log('Email sent: ' + info.response);

            // Delete the file after sending email
            fs.unlink(pdfPath, (err) => {
                if (err) {
                    console.error('Failed to delete the file:', err);
                } else {
                    console.log('PDF file deleted after sending email');
                }
            });
            res.json({ message: 'PDF sent successfully' });
        });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
