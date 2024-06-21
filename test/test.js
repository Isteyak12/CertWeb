// Import the required libraries
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

(async () => {
    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Add a new page to the document
        const page = pdfDoc.addPage([400, 300]);

        // Draw a rectangle on the page
        page.drawRectangle({
            x: 50,
            y: 150,
            width: 300,
            height: 100,
            borderColor: rgb(0, 0, 0),
            borderWidth: 2,
            color: rgb(0.9, 0.9, 0.9),
        });

        // Add text to the page
        page.drawText('Hello, PDF!', {
            x: 100,
            y: 200,
            size: 20,
            color: rgb(0, 0, 0),
        });

        // Serialize the PDF document to bytes
        const pdfBytes = await pdfDoc.save();

        // Save the PDF to a file named "output.pdf" in the same directory
        fs.writeFileSync('output.pdf', pdfBytes);

        console.log('PDF file created and saved as "output.pdf"');
    } catch (error) {
        console.error('Error creating PDF:', error.message);
    }
})();
