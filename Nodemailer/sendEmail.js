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
const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Veygo Purchase Confirmation</title>
    <style>
        /* Basic styles, we'll refine later */
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .buttons {
            text-align: center;
            margin-bottom: 20px;
        }

        .button {
            background-color: #007bff; /* Adjust color based on image */
            color: #fff;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            border-radius: 5px;
            margin: 0 10px;
        }

        .policy-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .policy-details-column {
            flex: 1;
        }

        .incident-info {
            margin-top: 20px;
        }

        .payment-disputes {
            margin-top: 20px;
        }

        .contact-info {
            margin-top: 20px;
        }

        h1, h2 {
            text-align: center;
        }

        p {
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="veygo_logo.png" alt="Veygo Logo">
            <h1>Thanks <%= name %>!</h1>
            <p>You have successfully purchased temporary car insurance through Veygo.</p>
        </div>
        <a href="#" class="button">Thank you for taking out Temporary Car Insurance through Veygo.</a>
        <p>There are some important details and useful facts in this email that will keep you informed about your policy.</p>
        <div class="header">
            <p>Please find Your Agreement With Able Insurance Services Limited, Certificate of Motor Insurance and Insurance Product Information Document attached. All other documentation is available via our website.</p>
        </div>
        <div class="buttons">
            <a href="#" class="button">VIEW POLICY BOOKS</a>
            <a href="#" class="button">Check your documents</a>
        </div>
        <p>You should have printed or downloaded the following documents as part of the purchase process:</p>
        <ul>
            <li>Motor Proposal Confirmation</li>
            <li>Motor Policy Schedule</li>
        </ul>
        <p>You must notify us immediately of any incorrect details on your documents. Failure to do so could lead to your policy being declared void and/or any claim being declined.</p>
        <p>If you do not retain copies of these documents, you can view them by logging into your account.</p>

        <div class="policy-details">
            <div class="policy-details-column">
                <p><strong>Policyholder</strong><br><%= policyholder_name %><br><%= address %></p>
                <p><strong>Vehicle details</strong><br><%= vehicle_registration %> (<%= vehicle_model %>)</p>
            </div>
            <div class="policy-details-column">
                <p><strong>Cover from:</strong> <%= cover_start %></p>
                <p><strong>Cover to:</strong> <%= cover_end %></p>
                <p><strong>Premium paid:</strong> £<%= premium %></p>
                <p>Price includes Insurance Premium Tax at 12%</p>
            </div>
        </div>
        <div class="incident-info">
            <h3>Contacting us about incidents</h3>
            <p>It is important that you let us know of any incidents or damage to the insured vehicle during the policy period, even if you do not intend to claim.</p>
            <p>You can report a claim by calling: 0333 0165 112</p>
            <p>We take all incidents into account when calculating your premium or deciding whether we are able to offer cover. You must therefore tell us about any accidents, losses, thefts, incidents or claims in the last three years, even if it wasn't your fault. This includes incidents that happened while you were driving another vehicle.</p>
        </div>
    </div>
    <div class="container">
        <div class="payment-disputes">
            <h3>Disputes</h3>
            <p>If you think you've been charged incorrectly, please contact us on 0333 0165 112.</p>
        </div>

        <div class="contact-info">
            <h3>Contact us</h3>
            <p>If you have any questions about your payment, please contact us on 0333 0165 112.</p>
        </div>
    </div>
    <div class="container">
        <h1>Thanks <%= name %>!</h1>
        <h2>Thank you for taking out Temporary Car Insurance through Veygo.</h2>

        <p>There are some important details and useful facts in this email that will keep you informed about your policy.</p>

        <h2>Your policy details</h2>
        <p><strong>Policyholder:</strong> <%= policyholder_name %></p>
        <p><strong>Vehicle:</strong> <%= vehicle_registration %> (<%= vehicle_model %>)</p>
        <p><strong>Cover from:</strong> <%= cover_start %></p>
        <p><strong>Cover to:</strong> <%= cover_end %></p>
        <p><strong>Premium paid:</strong> £<%= premium %></p>

        <a href="#" class="button">View Policy Booklet</a>
        <a href="#" class="button">Check Your Documents</a>

        <h2>Important information about paying for your policy</h2>
        <p>...</p> 
        <h2>Contacting us about incidents</h2>
        <p>...</p> 
    </div>
</body>
</html>
`;

if (pdfFile) {
  // Create mail options with the PDF attachment
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "mehakdeepk65@gmail.com", // Use the email read from data.json
    subject: "Hello from Nodemailer",
    text: emailBody,
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
