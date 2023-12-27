// Import Package
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Using Axios for HTTP requests

// Set Package
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Server Start Notification
app.listen(process.env.PORT || 3000, () => console.log("Server Started on port 3000..."));

// Get Index Page Request
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

// POST route from contact form
app.post('/contact', async (req, res) => {
    try {
        // Validate form using Google Cloud Function
        const validationResult = await validateFormCloudFunction(req.body);
        
        if (!validationResult.valid) {
            return res.send(`<h1 style="color: red">${validationResult.message}</h1>`);
        }

        // Continue with other processing if validation passes

        // You can handle the form data or other actions here

        res.send('<h1 style="color: green">Thank You, Message has been Sent.</h1>');
    } catch (error) {
        console.error(error);
        res.status(500).send('<h1 style="color: red">Internal Server Error.</h1>');
    }
});

// Function to validate form using Google Cloud Function
async function validateFormCloudFunction(formData) {
    try {
        const cloudFunctionUrl = 'https://us-central1-natural-point-395510.cloudfunctions.net/validateForm'; // Replace with your Cloud Function URL

        // Make a POST request to your Cloud Function for form validation
        const response = await axios.post(cloudFunctionUrl, formData);

        return response.data;
    } catch (error) {
        console.error('Error validating form:', error.message);
        return { valid: false, message: 'Form validation failed.' };
    }
}
