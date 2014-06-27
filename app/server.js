var express = require('express');
var app = express();
var fs=require('fs');

var request = require('request');
var bodyParser= require('body-parser');

var methodOverride = require('method-override');
app.use(methodOverride());
app.use(bodyParser());

app.use('/proxy', function(req, res) {

	// 服务地址
	var url = "http://" + req.headers["x-host"] + ":" + req.headers["x-port"] + req.url;

	console.log(url);
	console.log(req.headers);

	req.pipe(request(url)).pipe(res);
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

	var path =__dirname+'/conf/config.json';

	console.log(data);

	fs.writeFile(path, data, function(err) {
		if (err) {
			res.json({
				status: -2,
				message: '报错文件出错！'
			});
		}else{
			res.json({
				status: 200,
				message: '保存成功'
			});
		}
	});
});


app.use(express.static(__dirname));

app.listen(3000);