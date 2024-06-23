import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from fpdf import FPDF

# Define the HTML content for the PDF
html_content = """
<!DOCTYPE html>
<html>
<head>
    <title>My PDF</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample PDF generated using fpdf.</p>
</body>
</html>
"""

# Create a PDF using fpdf
class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'My PDF Header', 0, 1, 'C')

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, 'Page ' + str(self.page_no()), 0, 0, 'C')

pdf = PDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.multi_cell(0, 10, txt=html_content, align='L')

pdf_file_path = 'Bella_certificate.pdf'
pdf.output(pdf_file_path)

# Create an SMTP connection to MailHog
smtp_server = 'localhost'
smtp_port = 1025
sender_email = 'test@example.com'
receiver_email = 'isteyakislam12@gmail.com'

try:
    server = smtplib.SMTP(smtp_server, smtp_port)
    
    # Create the email
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = 'Sending PDF attachment'
    msg.attach(MIMEText('Please find attached PDF file.'))

    # Attach the PDF file
    with open(pdf_file_path, 'rb') as pdf_file:
        pdf_attachment = MIMEApplication(pdf_file.read(), Name='Bella_certificate.pdf')
        pdf_attachment.add_header('Content-Disposition', f'attachment; filename=Bella_certificate.pdf')
        msg.attach(pdf_attachment)

    # Send the email
    server.sendmail(sender_email, receiver_email, msg.as_string())
    print('Email sent successfully!')

except Exception as e:
    print(f'Error sending email: {e}')

finally:
    server.quit()
