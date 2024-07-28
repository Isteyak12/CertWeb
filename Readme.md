# Web-Based PDF and Email Automation System for Veygo Insurance

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-43B02A?style=for-the-badge&logo=javascript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)

![Veygo](veygo.webp)

## Project Overview

**Web-Based PDF and Email Automation System for Veygo Insurance | Freelance Project April 2024**

- Integrated a Gmail-based login ecosystem, providing a restricted admin page for enhanced access control and management.
- Designed a PDF generator that dynamically creates documents based on web form input values, ensuring accuracy and consistency.

## Running the Project

To run the project locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/veygo-insurance-automation.git
    cd veygo-insurance-automation
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following environment variables:
    ```env
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-email-password
    PORT=3001
    ```

4. **Run the server**:
    ```sh
    node server.js
    ```

5. **Open the application**:
    Open your browser and navigate to `http://localhost:3001`


## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **Multer**: Middleware for handling `multipart/form-data`.
- **Nodemailer**: Module for sending emails.
- **jsPDF**: Library to generate PDF documents in JavaScript.
- **HTML/CSS/JavaScript**: Frontend technologies.

## Features

- Secure login with Gmail-based authentication.
- Dynamic PDF generation based on user input.
- Automated email sending with PDF attachments.
- Restricted admin access for enhanced security.



