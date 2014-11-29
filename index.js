var http = require('http');
var fs = require('fs');
var sio = require('socket.io');
var Chain = require('chainjs');
require('colors');
var colorTheme = ['grey', 'green', 'yellow', 'red', 'blue', 'rainbow', 'cyan'];

function Log(app, mode) {
  this.app = app;
  this.mode = (mode || 'DEVELOPMENT').toUpperCase();
  this.env = (process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase();
}

Log.prototype.start = function () {
  var app = this.app;

  if (this.env === this.mode) {
    app.get('/mobile-debugger/log.js', function (req, res) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');

      Chain(function(chain){
        fs.readFile(__dirname + '/lib/socket.1.2.1.js', function (err, data) {
          if (err){
            console.log(err);
          } else {
            res.write(data);
            chain.next();
          }
        });
      }).final(function(){
          fs.readFile(__dirname + '/lib/log.js', function (err, data) {
            if (err){
              console.log(err);
            } else {
              res.end(data);
            }
          });
        }).start();
    });

    var serv = http.createServer(app),
      io = sio.listen(serv);

    serv.listen(app.get('port'));
    console.log(('[Debugger] listening on ' + app.get('port'))['cyan']);

    io.sockets.on('connection', function (socket) {
      console.log('[Debugger] connection has built.'['cyan']);
      socket.on('LOG MESSAGE', function (data) {
        data = JSON.parse(data);
        var infos = data['args'];
        if (data['level'] === 4) {
          infos.forEach(function (i) {
            console.log('[Debugger]', i[colorTheme[4]]);
          });
        } else {
          infos.forEach(function (i) {
            console.log('[Debugger]', i[colorTheme[data['level']]]);
          });
        }
      });
    });
  }
};


module.exports = Log;