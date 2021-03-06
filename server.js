
'use strict';

let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let links = require('./routes/links');
let tags = require('./routes/tags');

let port = process.env.PORT || 3000;
let database = process.env.MONGOLAB_URI || 'mongodb://localhost/bookmarks';

console.log('Connecting to mongodb: ', database);
mongoose.connect(database);

let app = express();
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/links', links);
app.use('/tags', tags);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});


process.on('exit', (code) => {
  mongoose.disconnect();
  console.log('About to exit with code:', code);
});

let listener = app.listen(port);

console.log('express in listening on port: ' + port);
