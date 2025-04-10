var express = require('express');
var path = require('path');
require('./config/database');
var cors = require('cors')

var usersRouter = require('./app/routes/users')
var notesRouter = require('./app/routes/notes')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use('/notes', notesRouter);
app.use('/users', usersRouter);



module.exports = app;
