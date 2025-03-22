var express = require('express');
var path = require('path');
require('./config/database');

var usersRouter = require('./app/routes/users');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);

module.exports = app;
