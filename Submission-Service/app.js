const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

const app = express();
app.use(cors());

/* Import routes */
const routes = require('./routes/submission_routes');
app.use('/submissions-api', routes);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

module.exports = app;