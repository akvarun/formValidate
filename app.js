const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.listen(process.env.PORT || 3000, () => console.log("Server Started on port 3000..."));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.post('/contact', async (req, res) => {
    try {
        const formData = req.body;

        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: '34.123.212.180',
            user: 'root',
            password: '',
            database: 'formdata'
        });

        // Insert form data into the ContactForm table
        await connection.execute(
            'INSERT INTO ContactForm (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [formData.name, formData.email, formData.subject, formData.message]
        );

        // Close the database connection
        await connection.end();

        res.send('<h1 style="color: green">Thank You, Message has been Sent.</h1>');
    } catch (error) {
        console.error('Error inserting data into the database:', error.message);
        res.status(500).send('<h1 style="color: red">Internal Server Error.</h1>');
    }
});
