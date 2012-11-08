// TODO: A 404 Not Found page.
// TODO: A 505 Not Found page.
// TODO: https://github.com/jeremyfa/node-exec-sync/issues/3#issuecomment-7570123

// NEXT:
// TODO: 1st= Device listarla de la BD.
// TODO: 2nd= Tunables hacerlos linve como mismo Device.
// TODO: 3rd= Cuando install system poner en la BD inicialmente los devices y address que se encuentren en el sistema.

/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'),
	path = require('path'),

// Load configuration file.
	config = require('./config.json'),
	package = require('./package.json'),
	mongoose = require('mongoose');

// Open DB connection to database.
mongoose.connect(config.database.host, config.database.name);

/*
 * There was an error in the connection.
 */
mongoose.connection.on('error', function (error) {
	console.log(error);
});

/*
 * Ensures that code is executed only if there was no error.
 */
mongoose.connection.on('open', function (ref) {

});
/*
 * Routes configuration.
 */
/*
 * Routes configuration. UI
 */
var routes_ui_dashboard = require('./routes/ui/dashboard/index.js'),
	routes_ui_system_settings = require('./routes/ui/system/settings.js'),
	routes_ui_system_tuning = require('./routes/ui/system/tuning.js'),
	routes_ui_system_install = require('./routes/ui/system/install.js'),
	routes_ui_interfaces_devices = require('./routes/ui/interfaces/devices.js');

/*
 * Routes configuration. API
 */
var routes_api_dashboard = require('./routes/api/dashboard/index.js'),
	routes_api_system_settings = require('./routes/api/system/settings/index.js'),
	routes_api_system_tuning = require('./routes/api/system/tuning/index.js'),
	routes_api_system_install = require('./routes/api/system/install/index.js'),
	routes_api_interfaces_devices = require('./routes/api/interfaces/devices/index.js');

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
app.get('/system/settings', routes_ui_system_settings.index);
app.get('/system/tuning', routes_ui_system_tuning.index);
app.get('/system/install', routes_ui_system_install.index);
app.get('/interfaces/devices', routes_ui_interfaces_devices.index);

// TODO: Add design to root API view.
app.get('/api', function (req, res) {
	res.send(package.name + ' API is running');
});

// Dashboard.
app.get('/api/dashboard', routes_api_dashboard.list);

// System.
// System -> Settings.
app.post('/api/system/settings', routes_api_system_settings.apply);

// System -> Tuning.
app.get('/api/system/tuning', routes_api_system_tuning.list);
app.post('/api/system/tuning', routes_api_system_tuning.add);
app.delete('/api/system/tuning', routes_api_system_tuning.delete);
app.put('/api/system/tuning', routes_api_system_tuning.edit);
app.post('/api/system/tuning/apply', routes_api_system_tuning.apply);

// Interfaces -> Devices.
app.get('/api/interfaces/devices', routes_api_interfaces_devices.list);
app.post('/api/interfaces/devices', routes_api_interfaces_devices.add);
app.delete('/api/interfaces/devices', routes_api_interfaces_devices.delete);
app.put('/api/interfaces/devices', routes_api_interfaces_devices.edit);
app.put('/api/interfaces/devices', routes_api_interfaces_devices.edit);

// System -> Install.
app.post('/api/system/install', routes_api_system_install.apply);

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});

// Close DB connection.
// TODO: See how close database connection upong app exit: mongoose.connection.close();