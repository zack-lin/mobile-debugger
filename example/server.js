var express = require('express');
var Debugger = require('../');
var app = module.exports = express();
var debug = new Debugger(app, 'development');

app.engine('.html', require('ejs').__express);
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.render('index');
});

debug.start();