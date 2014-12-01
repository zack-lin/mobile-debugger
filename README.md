![mobile-debugger](https://badge.fury.io/js/mobile-debugger.svg)

Mobile debugger
========
	
	移动前端通用调试工具

Installation
========

    $ npm install mobile-debugger

Quick Start
========

前端页面注入脚本

  	<script src="http://your-io-server/mobile-debugger/log.js"></script>	

Nodejs 服务端

	var Debugger = require('mobile-debugger');
    var debug = new Debugger(app, 'development');

  	debug.start();

  打点方法
    
  - log#log  	
  - log#dir
  - log#info
  - log#error

自动监听页面报错，同步到 node cli

License
=======

(The MIT License)

Copyright (c) 2014 Zack Lin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.