const express = require('express');
const app = express();
const mongoose = require('mongoose');

const DB_URL = "mongodb://0.0.0.0:27017/blockmango";

//Database connection configuration
mongoose.connect(DB_URL);
const conn = mongoose.connection;
conn.once('open', () => {
    console.log('successfully connected to database');
})
conn.on('error', (err) => {
    console.log(`failed to connect to database ${err.message}`);
})

