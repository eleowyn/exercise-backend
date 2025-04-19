const http = require('http');
const moment = require('moment');
const express = require('express');
const morgan = require('morgan');
const errorhandler = require('errorhandler');

const app = express();
const {user} = require('./users');
const log = (req, res, next) => {
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a') + " " + req.originalUrl + " " + req.ip);
    next();
};

app.use(morgan("tiny"));
app.use(log);
app.use(errorhandler());

app.get('/users', (req, res) => {
    res.status(200).json({ user });
});

app.get('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const users = user.find(user => user.name.toLowerCase() === name);
    
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json({
            status: "error",
            message: "Data user tidak ditemukan",
        });
    }
});

app.use((req, res, next) => {
    res.status(404).json({
        status: "error",
        message: "resources tidak ditemukan",
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({
        status: "error",
        message: "terjadi kesalahan pada server",
    });
});

const hostname = "127.0.0.1";
const port = 3000;

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});