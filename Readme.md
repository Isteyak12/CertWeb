https://medium.com/@y.mehnati_49486/how-to-send-an-email-from-your-gmail-account-with-nodemailer-837bf09a7628

https://myaccount.google.com/security

In a browser environment, JavaScript is sandboxed for security reasons, which means it cannot directly execute files on the local file system. However, in a Node.js environment, you can use modules like `child_process` to execute another file. If you want to execute another file like `mycode.js` from within a Node.js script, you can use the `child_process` module to do this.

Here is an example of how you can set this up:

### Step 1: Create the `mycode.js` file

Make sure your `mycode.js` contains the logic you want to execute:

```javascript
// mycode.js
console.log("mycode.js executed");
```

### Step 2: Create the main JavaScript file

In your main JavaScript file, you can set up a function that uses `child_process` to execute `mycode.js`:

```javascript
const { exec } = require('child_process');

function emailPDF() {
  exec('node mycode.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing mycode.js: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

// Example of how you can call the function
emailPDF();
```

### Step 3: Integrate with an Express server

To integrate this with an Express server and an HTML front end, you can do the following:

#### server.js (Node.js server)

```javascript
const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.get('/execute-mycode', (req, res) => {
  exec('node mycode.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing mycode.js: ${error.message}`);
      res.status(500).send(`Error executing mycode.js: ${error.message}`);
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

### Step 4: Modify the HTML

Add a button to your HTML and define the function to handle the button click event:

#### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Execute mycode.js</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
    }

    .button {
      padding: 10px 20px;
      background-color: #4caf50;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 16px;
    }

    .button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <button id="execute-btn" class="button">Execute mycode.js</button>

  <script>
    async function emailPDF() {
      try {
        const response = await fetch("/execute-mycode");
        const data = await response.text();
        alert(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    document.getElementById("execute-btn").addEventListener("click", emailPDF);
  </script>
</body>
</html>
```

### Running the Server

Ensure you have Node.js installed, then run the server with the following command:

```sh
node server.js
```

With this setup, when you click the "Execute mycode.js" button, it will call the `emailPDF` function, which sends a request to the server to execute the `mycode.js` script and display the result.


//the workflow of the project
where is the sign.html that i wanted to see when the admin button is clicked, i wanted it to work like this: server.js will be run of course, the index.html is locally hosted where if the admin button is clicked the app.json will be executed to execute the sign.html will be run and if info is entered correctly it will be redirected to ../admin.html



Certainly! Understanding the sequence of how the code in both `sign.html` and `app.js` works together can be very insightful. Here's a step-by-step breakdown of what happens from the moment you load the sign-in page to the redirection to the admin page after successful authentication.

### Sequence of Operations

1. **Load Sign-In Page:**

   - The user navigates to `http://localhost:3000`.
   - The Express server serves the `sign.html` file.

   ```javascript
   // Serve the sign.html file
   app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "sign.html"));
   });
   ```

2. **Render `sign.html`:**

   - The browser renders the `sign.html` page.
   - The form with `id="signinForm"` is displayed, and the JavaScript code within the page is executed.

   ```html
   <script>
       document.getElementById('signinForm').addEventListener('submit', function(event) {
           event.preventDefault();

           const email = document.getElementById('email').value;
           const password = document.getElementById('password').value;

           fetch('/signin', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({ email, password })
           })
           .then(response => response.json())
           .then(data => {
               if (data.success) {
                   window.location.href = '/admin.html';
               } else {
                   alert('Sign in failed: ' + data.message);
               }
           })
           .catch(error => {
               console.error('Error:', error);
           });
       });
   </script>
   ```

3. **User Submits Form:**

   - The user enters their email and password and clicks the "Sign In" button.
   - The `submit` event handler is triggered, preventing the default form submission behavior with `event.preventDefault()`.
   - The email and password values are captured from the input fields.

4. **Send Sign-In Request:**

   - A `fetch` request is made to the `/signin` endpoint on the server.
   - The request includes the email and password in the request body, formatted as JSON.

   ```javascript
   fetch('/signin', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({ email, password })
   })
   ```

5. **Server Receives Request:**

   - The Express server has a route set up to handle POST requests to `/signin`.
   - The server parses the JSON request body to extract the email and password.

   ```javascript
   app.post("/signin", (req, res) => {
     const { email, password } = req.body;
   ```

6. **Authentication Logic:**

   - The server checks if the provided email and password match the predefined credentials.

   ```javascript
   if (email === "testqqq808@gmail.com" && password === "artz wqxy yqdt slcu") {
   ```

7. **Send Email Notification:**

   - If the credentials are correct, the server sets up the email options and sends an email using Nodemailer.
   - The server responds with a JSON object indicating success.

   ```javascript
   const mailOptions = {
     from: "testqqq808@gmail.com",
     to: "isteyakislam12@gmail.com",
     subject: "Sign In Notification",
     text: `User ${email} has successfully signed in.`,
   };

   transporter.sendMail(mailOptions, (error, info) => {
     if (error) {
       console.error("Error sending email: ", error);
       return res.status(500).json({ success: false, message: "Error sending email" });
     } else {
       console.log("Email sent: ", info.response);
       return res.status(200).json({ success: true, message: "Sign in successful, email sent" });
     }
   });
   ```

8. **Handle Server Response:**

   - The client-side JavaScript handles the server's response.
   - If the sign-in is successful (`data.success` is true), the user is redirected to `admin.html`.
   - If the sign-in fails, an alert is shown with the failure message.

   ```javascript
   .then(response => response.json())
   .then(data => {
       if (data.success) {
           window.location.href = '/admin.html';
       } else {
           alert('Sign in failed: ' + data.message);
       }
   })
   .catch(error => {
       console.error('Error:', error);
   });
   ```

9. **Redirect to Admin Page:**

   - Upon successful authentication, the client-side code redirects the user to `admin.html`.
   - The server serves the `admin.html` file when the `/admin.html` route is accessed.

   ```javascript
   // Serve the admin.html file from the root directory
   app.get("/admin.html", (req, res) => {
     res.sendFile(path.join(__dirname, "../admin.html"));
   });
   ```

### Summary

- **Step 1:** The user navigates to the sign-in page.
- **Step 2:** The user fills in their credentials and submits the form.
- **Step 3:** The client-side JavaScript captures the form submission and sends the credentials to the server.
- **Step 4:** The server checks the credentials and sends an email notification if they are correct.
- **Step 5:** The client-side JavaScript handles the server's response and redirects the user to the admin page upon successful sign-in.

This sequence ensures that the sign-in process is handled securely and smoothly, with the server responsible for authentication and email notification, and the client-side code managing the form submission and response handling.


The error you are encountering, `EADDRINUSE: address already in use`, occurs because you are trying to start multiple servers on the same port (3000). The `auth/app.js` script itself starts an Express server on port 3000, which conflicts with the main server running on the same port.

To resolve this, we need to ensure that only one server is running at a time, and we need to execute the code in `auth/app.js` without starting a new server.

Here's how you can modify the setup:

### `auth/app.js` (Modified)

Instead of starting a new server, we will export the sign-in functionality as a function. This allows us to execute it from the main server without starting another server.

```javascript
const nodemailer = require("nodemailer");
const path = require("path");
const express = require("express");

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "testqqq808@gmail.com",
    pass: "artz wqxy yqdt slcu",
  },
});

// Function to handle sign-in
const handleSignIn = (req, res) => {
  const { email, password } = req.body;

  // Check credentials
  if (email === "testqqq808@gmail.com" && password === "artz wqxy yqdt slcu") {
    // Create mail options
    const mailOptions = {
      from: "testqqq808@gmail.com",
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
};

module.exports = handleSignIn;
```

### `server.js` (Modified)

Now we will import the sign-in handler function from `auth/app.js` and use it in the main server.

```javascript
const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const handleSignIn = require('./auth/app');
const app = express();
const port = 3000;

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

// Endpoint to execute the sign-in logic
app.post('/execute-app', (req, res) => {
    handleSignIn(req, res);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

### `index.html` (Unchanged)

This file remains the same, as it correctly handles the button click to call the `/execute-app` endpoint.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>📧Certifying!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
            background-color: lightblue;
        }

        button {
            width: 150px;
            height: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            background-color: crimson;
            color: black;
            font: Arial;
            font-weight: bold;
            border: none;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
            box-sizing: border-box;
            border: 10px solid;
            border-color: black;
        }

        button:hover {
            background-color: #45a049;
        }

        header {
            font-family: "times-new", bold;
            font-size: 30px;
            color: black;
            border-right: 0.15em solid orange;
            animation: blink-caret 0.75s step-end infinite;
        }

        @keyframes blink-caret {
            from,
            to {
                border-color: transparent;
            }
            50% {
                border-color: orange;
            }
        }
    </style>
</head>
<body>
    <header>Welcome to the SITE</header>
    <button class="button" onclick="executeApp()">ADMIN</button>
    <button class="button" onclick="redirectToclient()">USER</button>

    <script>
        function executeApp() {
            fetch('/execute-app', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '/auth/sign.html';
                    } else {
                        alert('Execution failed: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        function redirectToclient() {
            window.location.href = 'client.html';
        }
    </script>
</body>
</html>
```

### Running the Application

1. **Install Dependencies**:
   Ensure you have Node.js installed. Initialize a new Node.js project and install the required packages by running:
   ```sh
   npm init -y
   npm install express nodemailer
   ```

2. **Run the Main Server**:
   Start your main Express server by running:
   ```sh
   node server.js
   ```

3. **Access the Index Page**:
   Open your web browser and navigate to `http://localhost:3000` to see the index page. Click the "ADMIN" button to trigger the execution of `auth/app.js` and then redirect to `auth/sign.html`. Upon entering valid credentials, it will redirect to `admin.html`.

By making these changes, clicking the "ADMIN" button will trigger the execution of the sign-in logic defined in `auth/app.js` without starting another server, thus avoiding port conflicts.


temp email, random key generator 