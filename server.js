const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON bodies and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use sessions to keep track of logged-in users
app.use(session({
    secret: 'your-secret-key', // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to store the referrer in the session
app.use((req, res, next) => {
    if (req.headers.referer) {
        req.session.referrer = req.headers.referer;
    }
    next();
});

// Serve static files from the current directory except for protected routes
app.use((req, res, next) => {
    if (req.path === '/admin.html') {
        next();
    } else {
        express.static(__dirname)(req, res, next);
    }
});

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

// Middleware to check if the user is authenticated
function checkAuthentication(req, res, next) {
    console.log('checkAuthentication - isAuthenticated:', req.session.isAuthenticated);
    if (req.session && req.session.isAuthenticated) {
        next();
    } else {
        console.log('User is not authenticated, redirecting to /auth/sign.html');
        res.redirect('/auth/sign.html');
    }
}

// Middleware to check if the user was redirected from the sign-in page
function checkRedirectFromSignin(req, res, next) {
    console.log('checkRedirectFromSignin - fromSignin:', req.session.fromSignin);
    if (req.session && req.session.fromSignin) {
        req.session.fromSignin = false; // Reset the flag
        req.session.refreshCheck = true; // Set the refresh check flag
        next();
    } else {
        console.log('User did not come from signin, redirecting to /auth/sign.html');
        res.redirect('/auth/sign.html');
    }
}

// Middleware to handle page refresh and redirect to sign-in page
function handlePageRefresh(req, res, next) {
    if (req.session && req.session.refreshCheck) {
        req.session.refreshCheck = false; // Reset the refresh check flag
        next();
    } else {
        console.log('Page refreshed, redirecting to /auth/sign.html');
        res.redirect('/auth/sign.html');
    }
}

// Serve admin.html with authentication and redirect check
app.get('/admin.html', checkAuthentication, checkRedirectFromSignin, handlePageRefresh, (req, res) => {
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
        // Authenticate the user and start a session
        req.session.isAuthenticated = true;
        req.session.fromSignin = true; // Set the flag indicating the user came from sign-in

        // Create mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
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

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('<script>sessionStorage.removeItem("isAuthenticated"); window.location.href = "/auth/sign.html";</script>');
});

// Endpoint to handle the admin button click
app.get('/execute-app', (req, res) => {
    console.log('Setting fromSignin to true and redirecting to /auth/sign.html');
    req.session.fromSignin = true; // Set the flag for redirect
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

// Endpoint to check authentication status
app.get('/check-authentication', (req, res) => {
    if (req.session && req.session.isAuthenticated) {
        res.status(200).send("Authenticated");
    } else {
        res.status(401).send("Not authenticated");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
