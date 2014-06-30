var express = require('express'),
	path = require('path'),
	favicon = require('static-favicon'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	util = require('util'),
	request = require('request');

var app = express();

/**
 * 注册中间件
 */
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(__dirname));


/**
 * 代理API服务处理
 */
app.use('/proxy/*', function(req, res) {

	// 服务地址
	var url = util.format("http://%s:%s/%s", req.headers["x-host"], req.headers["x-port"], req.params[0]);

	// 请求参数
	var options = {
		method: req.method,
		headers: {
			"Content-Type": req.headers['content-type'],
			"X-Token": req.headers['x-token'] || '',
			'X-ConsumerKey': req.headers['x-consumerkey'],
			'X-Sign': req.headers['x-sign']
		},
		body: JSON.stringify(req.body)
	};

	// 请求远程服务器
	request(url, options, function(err, response, body) {
		if (err) {
			console.error(err);
			res.end(body);
		} else {
			res.end(body);
		}
	});

});

/**
 * 保存配置文件
 */
app.post('/conf/save', function(req, res) {

	var token = req.param.token;
	var data = req.param.data;

	// ------------------------------- 
	//  校验Token
	// ------------------------------- 
	if (!token || token !== '2014..') {
		res.json({
			status: -1,
			message: 'token不正确'
		});
		return;
	}

	var path = util.format("%s/conf/config.json", __dirname);

	// ------------------------------- 
	//  保存配置文件
	// ------------------------------- 
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

/**
 * 监听启动Server
 */
app.listen(process.env.PORT || 3000);