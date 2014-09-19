var express = require("express"),
	request = require("request"),
	util = require('util'),
	app = express(),
	port = 2000;

request = request.defaults({jar: true});
app.configure(function(){

	//app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }));
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(express.compress());
	app.use(express["static"]("public"));
});


app.configure("development", function() {
	app.use(express.errorHandler({
		dumpException: true,
		showStack: true
	}));
});

app.listen(port);
console.log("App listening on port: " + port);
