http = require('http');
request = require('request');
fs = require('fs');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./desk6/");

server = http.createServer( function(req, res) {
	if (req.method == 'POST') {
		var body = '';
		req
		.setEncoding('utf-8')
		.on('data', function (data) {
			body += data;
		})
		.on('end', function () {
			try{
				var requestParam = JSON.parse(body);
				requestParam.time=true;
				console.log("Parameters: " , requestParam);
				request(requestParam,function(error, response, body) {
					console.log("Parameters: " , requestParam);
					res.writeHead(200, {
						'Content-Type' : 'Application/json'
					});
					res.end(JSON.stringify(response));
				});
			}catch(e){
				res.writeHead(500, {
					'Content-Type': 'text/html'
				});
				res.end(JSON.stringify({
					'error':e.message
				}));
			}
		});
	}else{
		if(req.url.substr(0,4)=='/api'){
			if(req.url.lastIndexOf('/api/user/status')==0){
				res.end(JSON.stringify({
					'status':true
				}));
			}else if(req.url.lastIndexOf('/api/user/initEnv')==0){
				res.end(JSON.stringify({
					'user':{
						login:'me'
					}
				}));
			}else if(true){
				console.log(req.url);
				res.end(JSON.stringify({
					'status':true,
					'success':true
				}));
			}
		}else{
			var done = finalhandler(req, res);
			serve(req, res, done);
		}
	}
});

port = 3000;
host = '0.0.0.0';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);