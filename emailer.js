const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');

// Define the HTML content for the PDF
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>My PDF</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample PDF generated using pdf-creator-node.</p>
</body>
</html>
`;

// Create a PDF using pdf-creator-node
const options = {
    format: 'A4',
    orientation: 'portrait',
    border: '10mm',
    header: {
        height: '10mm',
        contents: '<div style="text-align: center;">My PDF Header</div>'
    },
    footer: {
        height: '10mm',
        contents: '<div style="text-align: center;">Page {{page}} of {{pages}}</div>'
    }
};

const document = {
    html: htmlContent,
    path: 'Bella_certificate.pdf', // Save the PDF within the same directory
    type: 'file'
};

const pdfCreator = pdf.create(document, options);
pdfCreator.generate();

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'isteyakislam12@gmail.com', // Replace with your Gmail address
        // No password needed here
    }
});

// Read the PDF file from local directory
const pdfFilePath = path.join(__dirname, 'my-pdf.pdf');
const pdfAttachment = fs.readFileSync(pdfFilePath);

// Attach the PDF file to the email
const mailOptions = {
    from: 'isteyakislam12@gmail.com',
    to: 'isteyakislam12@gmail.com',
    subject: 'Sending PDF attachment',
    text: 'Please find attached PDF file.',
    attachments: [
        {
            filename: 'Bella_certificate.pdf',
            content: pdfAttachment
        }
    ]
};

// Send email with attachment
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
