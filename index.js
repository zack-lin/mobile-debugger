var http = require('http');
var fs = require('fs');
var sio = require('socket.io');
var Chain = require('chainjs');
var colors = require('colors');
colors.setTheme({
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});
var level = ['debug', 'info', 'warn', 'error'];

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
          fs.readFile(__dirname + '/lib/log.min.js', function (err, data) {
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
    console.log(colors.help('[Debugger] listening on ' + app.get('port')));

    io.sockets.on('connection', function (socket) {
      console.log(colors.help('[Debugger] connection has built.'));
      socket.on('LOG MESSAGE', function (data) {
        data = JSON.parse(data);
        var infos = data['args'];
        if (data['level'] === 4) {
          infos.forEach(function (i) {
            console.log('[Debugger]', colors[level[4]](i));
          });
        } else {
          infos.forEach(function (i) {
            console.log('[Debugger]', colors[level[data['level']]](i));
          });
        }
      });
    });
  }
};


module.exports = Log;