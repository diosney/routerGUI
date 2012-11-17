// TODO: A 404 Not Found page.
// TODO: A 505 Not Found page.
// TODO: See how close database connection upon app exit: mongoose.connection.close();

/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose'),

// Load application files file.
	config = require('./config.json'),
	package = require('./package.json');

// Open DB connection to database.
mongoose.connect(config.database.host, config.database.name);

/*
 * There was an error in the connection.
 */
mongoose.connection.on('error', function (error) {
	console.log(error);
	// TODO: See what to do with this error. wether redirect user to standalone Error page or only show a message.
});

/*
 * Successfully connected to database.
 */
mongoose.connection.on('open', function (ref) {
	// TODO: Log connection to database.
});

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

/*
 * Routes configuration.
 */
/*
 * UI Routes.
 */
var routes_ui_dashboard = require('./routes/ui/dashboard/index.js'),
	routes_ui_system_settings = require('./routes/ui/system/settings.js'),
	routes_ui_system_tuning = require('./routes/ui/system/tuning.js'),
	routes_ui_system_install = require('./routes/ui/system/install.js'),
	routes_ui_interfaces_devices = require('./routes/ui/interfaces/devices.js'),
	routes_ui_interfaces_vlans = require('./routes/ui/interfaces/vlans.js'),
	routes_ui_routing_settings = require('./routes/ui/routing/settings.js'),
	routes_ui_routing_static = require('./routes/ui/routing/static.js'),
	routes_ui_services_ipsets = require('./routes/ui/services/ipsets.js');

/*
 * UI URLs.
 */
app.get('/', routes_ui_dashboard.index);
app.get('/system/settings', routes_ui_system_settings.index);
app.get('/system/tuning', routes_ui_system_tuning.index);
app.get('/system/install', routes_ui_system_install.index);
app.get('/interfaces/devices', routes_ui_interfaces_devices.index);
app.get('/interfaces/vlans', routes_ui_interfaces_vlans.index);
app.get('/routing/settings', routes_ui_routing_settings.index);
app.get('/routing/static', routes_ui_routing_static.index);
app.get('/services/ipsets', routes_ui_services_ipsets.index);

/*
 * API Routes.
 */
var routes_api_dashboard = require('./routes/api/dashboard/index.js'),
	routes_api_system_settings = require('./routes/api/system/settings/index.js'),
	routes_api_system_tuning = require('./routes/api/system/tuning/index.js'),
	routes_api_system_install = require('./routes/api/system/install/index.js'),
	routes_api_interfaces_devices = require('./routes/api/interfaces/devices/index.js'),
	routes_api_interfaces_addresses = require('./routes/api/interfaces/address/index.js'),
	routes_api_interfaces_vlans = require('./routes/api/interfaces/vlans/index.js'),
	routes_api_routing_settings = require('./routes/api/routing/settings/index.js'),
	routes_api_routing_static = require('./routes/api/routing/static/index.js'),
	routes_api_services_ipsets = require('./routes/api/services/ipsets/index.js');

/*
 * API URLs.
 */
// TODO: Add design to root API view.
app.get('/api', function (req, res) {
	res.send(package.name + ' API is running');
});

// Dashboard.
app.get('/api/dashboard', routes_api_dashboard.list);
app.post('/api/dashboard', routes_api_dashboard.apply);

/*
 * System.
 */
// System -> Settings.
app.post('/api/system/settings', routes_api_system_settings.apply);

// System -> Tuning.
app.get('/api/system/tuning', routes_api_system_tuning.list);
app.post('/api/system/tuning', routes_api_system_tuning.add);
app.delete('/api/system/tuning', routes_api_system_tuning.delete);
app.put('/api/system/tuning', routes_api_system_tuning.edit);

// System -> Install.
app.post('/api/system/install', routes_api_system_install.apply);

/*
 * Interfaces.
 */
// Interfaces -> Devices.
app.get('/api/interfaces/devices', routes_api_interfaces_devices.list);
app.post('/api/interfaces/devices', routes_api_interfaces_devices.add);
app.delete('/api/interfaces/devices', routes_api_interfaces_devices.delete);
app.put('/api/interfaces/devices', routes_api_interfaces_devices.edit);

// Interfaces -> Addresses.
app.get('/api/interfaces/addresses', routes_api_interfaces_addresses.list);
app.post('/api/interfaces/addresses', routes_api_interfaces_addresses.add);
app.delete('/api/interfaces/addresses', routes_api_interfaces_addresses.delete);
app.put('/api/interfaces/addresses', routes_api_interfaces_addresses.edit);

// Interfaces -> VLANs.
app.get('/api/interfaces/vlans', routes_api_interfaces_vlans.list);
app.post('/api/interfaces/vlans', routes_api_interfaces_vlans.add);
app.delete('/api/interfaces/vlans', routes_api_interfaces_vlans.delete);
app.put('/api/interfaces/vlans', routes_api_interfaces_vlans.edit);

/*
 * Routing.
 */
// Routing -> General Settings.
app.post('/api/routing/settings', routes_api_routing_settings.apply);

// Routing -> Static Routing.
app.get('/api/routing/static', routes_api_routing_static.list);
app.post('/api/routing/static', routes_api_routing_static.add);
app.delete('/api/routing/static', routes_api_routing_static.delete);
app.put('/api/routing/static', routes_api_routing_static.edit);

/*
 * Services.
 */
// Services -> IP Sets.
app.get('/api/services/ipsets', routes_api_services_ipsets.list);
app.post('/api/services/ipsets', routes_api_services_ipsets.add);
app.delete('/api/services/ipsets', routes_api_services_ipsets.delete);
app.put('/api/services/ipsets', routes_api_services_ipsets.edit);

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});