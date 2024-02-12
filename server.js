const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const fs = require('fs'); // Import the fs module

app.use(cors());

app.use('/', express.static("public"));

app.get('/hello', (req, res) => {
    res.json("Hello world!");
});

app.get('/budget', (req, res) => {
    // Read the JSON file and send its content as the response
    fs.readFile('budget_data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error reading JSON file' });
        }
        const budgetData = JSON.parse(data);
        res.json({ expenses: budgetData });
    });
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});