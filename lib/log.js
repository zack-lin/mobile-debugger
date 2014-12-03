(function (global) {
  var toString = Object.prototype.toString;

  function extSpoof(){
    Object.prototype.spoof = function () {
      if (this instanceof String) {
        return this;
      }else if(this instanceof Number || this instanceof Function){
        return this.toString();
      }
      var str = (this instanceof Array)
        ? '['
        : (this instanceof Object)
        ? '{'
        : '(';
      for (var i in this) {
        if (this[i] != Object.prototype.spoof) {
          if (this instanceof Array == false) {
            str += (i.match(/\W/))
              ? '"' + i.replace('"', '\\"') + '":'
              : i + ':';
          }
          if (typeof this[i] == 'string') {
            str += this[i].replace('"', '\\"');
          } else if (this[i] instanceof Function) {
            str += this[i].toString();
          } else if (this[i] instanceof Date) {
            str += this[i].toGMTString();
          } else if (this[i] instanceof Array || this[i] instanceof Object) {
            str += this[i].spoof();
          } else {
            str += this[i];
          }
          str += ', ';
        }
      }
      str = /* fix */(str.length > 2 ? str.substring(0, str.length - 2) : str)/* -ed */ + (
        (this instanceof Array)
          ? ']'
          : (this instanceof Object)
          ? '}'
          : ')'
        );
      return str;
    };
  }

  function removeSpoof(){
    delete Object.prototype.spoof;
  }

  function convertArgs() {
    var args = toArray(arguments);
    extSpoof();
    args.forEach(function (i, k) {
      args[k] = i.spoof();
    });
    removeSpoof();
    return args;
  }

  var keys = Object.keys;
  function convertDirArgs(){
    var args = toArray(arguments);
    extSpoof();
    args.forEach(function (i, k) {
      if(toString.call(i) === '[object Object]') {
        keys(i).forEach(function(o){
          args[k] = o + ' ' + toString.call(i[o]);
        });
      } else {
        args[k] = i.spoof();
      }
    });
    removeSpoof();
    return args;
  }

  var Log = function () {
    },
    socket,
    nativeConsole = global.nativeConsole || (global.nativeConsole = global.console);

  function toArray(obj) {
    return Array.prototype.slice.call(obj);
  }

  ['log', 'info', 'warn', 'error', 'dir'].forEach(function (i, k) {
    Log.prototype[i] = function () {
      nativeConsole[i].apply(nativeConsole, arguments);
      if (i !== 'dir') {
        arguments = convertArgs.apply(convertArgs, arguments);
      } else {
        arguments = convertDirArgs.apply(convertDirArgs, arguments);

      }
      arguments.unshift(k);
      this.send.apply(this, arguments);
    };
  });

  Log.prototype.send = function () {
    var level = arguments[0],
      args = toArray(arguments).slice(1),
      data = {level: level, args: args},
      message = JSON.stringify(data);
    socket.emit('LOG MESSAGE', message);
  };

  socket = io.connect('http://'+location.host);
  global.log = new Log();
  global.addEventListener('error', function (event) {
    log.warn('window error: ');
    log.error(event.message);
    log.error(event.filename + ' :' + event.lineno);
  }, false);
})(window);