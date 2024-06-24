const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const port = 3000;

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

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
