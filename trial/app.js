const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const dataFilePath = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

// Endpoint to update email in data.json
app.post('/update-email', (req, res) => {
  const newEmail = req.body.email;

  // Read the JSON file
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Parse the JSON content
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Update the email
    jsonData.email = newEmail;

    // Write the updated JSON back to the file
    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing data.json:', err);
        return res.status(500).send('Internal Server Error');
      }

      res.send('Email updated successfully');
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
