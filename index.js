const http = require('http')
const {hello, greetings} = require('./helloWorld')
const moment = require('moment')
const express = require('express')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const app = express()

// middleware
const log = (req, res, next) => {
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a') + " " + req.originalUrl + " " + req.ip);
    next();
};

app.use(morgan("tiny"));
app.use(errorhandler);

//routing
app.get('/', (req,res) => res.send('Hello World'))
app.get('/about', (req, res) => res.status(200).json({
    status: 'success',
    message: 'about page',
    data: []
}))

app.post('/contoh', (req,res) => {res.send('request dengan method POST')})
app.put('/contoh', (req,res) => {res.send('request dengan method PUT')})
app.delete('/contoh', (req,res) => {res.send('request dengan method DELETE')})
app.patch('/contoh', (req,res) => {res.send('request dengan method PATCH')})

app.all('/universal', (req, res) => res.send(`Request method ${req.method}`))
// routing dinamis
// 1. menggunakan params
app.get('/post/:id', (req, res) => res.send(`Artikel ke - ${req.params.id}`))
// 2. menggunakan query string
app.get('/post', (req, res) => {
    const {page, sort} = req.query;
    res.send(`Query yang didapatkan adalah, page: ${page}, sort: ${sort}`)
})

app.use((req, res, next) => {
    res.status(404).json ({
        status: "error",
        message: "resources tidak ditemukan",
    });
})
const hostname = "127.0.0.1"
const port = 3000
app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}`))
