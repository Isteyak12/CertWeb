const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    // Data to be injected into the template
    const data = {
        name: 'Abdullah',
        policyholder_name: 'Mr Abdullah Humam',
        address: 'Mezenner',
        vehicle_registration: 'OE69KFZ',
        vehicle_model: 'BMW 330E SENPRO AUTO',
        cover_start: 'July 6th, 2024, 17:30pm',
        cover_end: 'July 7th, 2024, 17:30pm',
        premium: '113.42'
    };

    // Path to the template file
    const templatePath = path.join(__dirname, 'template.ejs');

    // Read the template file
    fs.readFile(templatePath, 'utf-8', (err, template) => {
        if (err) {
            res.status(500).send('Error reading template file');
            return;
        }

        // Render the template with data
        const html = ejs.render(template, data);

        // Send the rendered HTML
        res.send(html);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
