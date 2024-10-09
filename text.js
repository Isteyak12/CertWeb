const express = require("express");
const path = require("path");
const session = require("express-session");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve sign.html
app.get("/auth/sign.html", (req, res) => {
  res.sendFile(path.join(__dirname, "auth/sign.html"));
});

// Sign-in route
app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.EMAIL_USER && password === process.env.EMAIL_PASS) {
    req.session.isAuthenticated = true;
    req.session.fromSignin = true;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Sign In Notification",
      text: `User ${email} has successfully signed in.`,
    };

    nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }).sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ success: false, message: "Error sending email" });
      } else {
        return res.status(200).json({ success: true, message: "Sign in successful, email sent" });
      }
    });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Middleware to check authentication and handle redirects
function checkAuthentication(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/auth/sign.html");
  }
}

function checkRedirectFromSignin(req, res, next) {
  if (req.session.fromSignin) {
    req.session.fromSignin = false;
    req.session.refreshCheck = true;
    next();
  } else {
    res.redirect("/auth/sign.html");
  }
}

function handlePageRefresh(req, res, next) {
  if (req.session.refreshCheck) {
    req.session.refreshCheck = false;
    next();
  } else {
    res.redirect("/auth/sign.html");
  }
}

// Serve admin.html with authentication checks
app.get("/admin.html", checkAuthentication, checkRedirectFromSignin, handlePageRefresh, (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
