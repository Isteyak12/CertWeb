const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000; // Example port number

app.use(express.json()); // Parse JSON bodies

// Serve static files from the current directory
app.use(express.static(__dirname));

// Endpoint to handle POST request to save data
app.post('/save-data', (req, res) => {
    const data = req.body; // JSON data sent from client

    // Construct file path to save JSON data (create 'db' directory if not exists)
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

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
