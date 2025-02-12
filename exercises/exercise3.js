const http = require('http')
const {hello, greetings} = require('./helloWorld')
const moment = require('moment')
const users = require('./users')
const express = require('express')
const app = express()

app.get('/', (req,res) => res.send('This is the home page'))

app.get('/about', (req, res) => res.status(200).json({
    status: 'success',
    message: 'about page exercise 3',
    description: 'exercise #03',
    date: moment().format('MMMM Do YYYY, h:mm:ss a'),
    data: []
}))

app.get('/users', (req, res) => res.status(200).json({users}))
app.get('', (req,res) => res.status(200).res.send('Not Founds'))

const hostname = "127.0.0.1"
const port = 3000
app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}`))
