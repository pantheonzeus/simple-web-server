// Require Modules
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

//Array of Mime Types
var mimeTypes = {
	"html" : "text/html",
	"jpeg" : "immage/jpeg",
	"lpg" : "image/jpg",
	"png" : "image/png",
	"js" : "text/javascript",
	"css" : "text/css"
};

//Create Server
http.createServer(function(req,res){
	var uri = url.parse(req.url).pathname;
	var filename = path.join(process.cwd(), unescape(uri));
	console.log('Loading ' + uri);
	var stats;

	try{
		stats = fs.lstatSync(filename);
	} catch(e){
		res.writeHead(404, {'Content-type': 'text/plain'});
		res.write('404 Not Found');
		res.end();
		return;
	}

	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(filename).split('.').reverse()[0]];
		res.writeHead(200, {'Content-type': mimeType});

		var fielStream = fs.createReadStream(filename);
		fielStream.pipe(res);
	} else if(stats.isDirectory()){
		res.writeHead(302, {'Location': 'index.html'});
		res.end;
	} else {
		res.writeHead(500, {'Content-type' : 'text/plain'});
		res.write('Internal Error\n');
		res.end;
	}
}).listen(3000);