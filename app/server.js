var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');

var request = require('request');

var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use('/proxy/*', function(req, res) {

	// 服务地址
	var url = "http://" + req.headers["x-host"] + ":" + req.headers["x-port"] + "/" + req.params[0];

	var options = {
		method: req.method,
		headers: {
			"Content-Type": req.headers['content-type'] || 'applicaiton/json',
			"X-Token": req.headers['x-token'] || '',
			'X-ConsumerKey': req.headers['x-consumerkey'] || '',
			'X-Sign': req.headers['x-sign'] || ''
		}
	};

	if (req.Method !== 'GET' || req.Method !== 'GET') {
		options['body'] = JSON.stringify(req.body)
	}

	console.log(options);

	request(url, options, function(error, response, body) {
		if (error) {
			res.end(body);
		} else {
			res.end(body);
		}
	});

});

// 保存配置文件
app.post('/conf/save', function(req, res) {
	// body...
	var token = req.param('token');
	var data = req.param('data');

	if (!token || token !== 'liangyali@123') {
		res.json({
			status: -1,
			message: 'token不正确'
		});
		return;
	}

	var path = __dirname + '/conf/config.json';

	console.log(data);

	fs.writeFile(path, data, function(err) {
		if (err) {
			res.json({
				status: -2,
				message: '报错文件出错！'
			});
		} else {
			res.json({
				status: 200,
				message: '保存成功'
			});
		}
	});
});

/*
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: {}
	});
});
*/


app.use(express.static(__dirname));

/*
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
*/

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});



app.listen(3000);