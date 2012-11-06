// TODO: A 404 Not Found page.
// TODO: A 505 Not Found page.
// TODO: Remove 'jQuery' from the names of the used jQuery plugins. That not make sense at all :|
// TODO: Rename all grid columns to grid_column_<name>
// TODO: https://github.com/jeremyfa/node-exec-sync/issues/3#issuecomment-7570123
/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'),
	path = require('path'),

// Load configuration file.
	config = require('./config.json'),
	package = require('./package.json');

/*
 * Routes configuration.
 */
/*
 * Routes configuration. UI
 */
var routes_ui_dashboard = require('./routes/ui/dashboard/index.js');

/*
 * Routes configuration. API
 */
var routes_api_dashboard = require('./routes/api/dashboard/index.js');

var app = express();

app.configure(function () {
	app.set('port', config.website.port || process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
	app.use(express.errorHandler());
});

app.get('/', routes_ui_dashboard.index);

// TODO: Add design to root API view.
app.get('/api', function (req, res) {
	res.send(package.name + ' API is running');
});

app.get('/api/dashboard', routes_api_dashboard.list);

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});