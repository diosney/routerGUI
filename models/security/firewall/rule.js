/*
 * Model for Firewall Rules.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

/*
 * Schema definition.
 */
var Firewall_Rule = new Schema({
	chain_name         :String,
	target             :{
		type:String,
		enum:['ACCEPT', 'DROP', 'REJECT', 'RETURN']
	},
	order              :Number,
	protocol           :{
		type:String,
		enum:['all', 'tcp', 'udp']
	},
	destination_ports  :String,
	source             :String,
	source_netmask     :Number,
	destination        :String,
	destination_netmask:Number,
	state              :String,
	description        :String
});

/*
 * Statics definitions.
 *
 * Used to build the object dependant command line strings.
 */
Firewall_Rule.statics.cl_add = function cl_add(firewall_rule) {
	var str_to_exec = 'iptables --table filter ';

	str_to_exec += '--insert ' + firewall_rule.chain_name + ' ' + firewall_rule.order + ' ';

	if (firewall_rule.protocol != 'all') {
		str_to_exec += '--protocol ' + firewall_rule.protocol + ' ';
	}

	if (firewall_rule.destination_ports) {
		str_to_exec += '--match multiport --destination-ports ' + firewall_rule.destination_ports + ' ';
	}

	if (firewall_rule.source) {
		str_to_exec += '--source ' + firewall_rule.source + ((firewall_rule.source_netmask) ? '/' + firewall_rule.source_netmask : '') + ' ';
	}

	if (firewall_rule.destination) {
		str_to_exec += '--destination ' + firewall_rule.destination + ((firewall_rule.destination_netmask) ? '/' + firewall_rule.destination_netmask : '') + ' ';
	}

	if (firewall_rule.state) {
		str_to_exec += '--match state --state ' + firewall_rule.state + ' ';
	}

	str_to_exec += '--jump  ' + firewall_rule.target + ' ';

	if (firewall_rule.description) {
		str_to_exec += '--match comment --comment "' + firewall_rule.description + '"';
	}

	return str_to_exec;
};

Firewall_Rule.statics.cl_replace = function cl_replace(firewall_rule) {
	var str_to_exec = 'iptables --table filter ';

	str_to_exec += '--replace ' + firewall_rule.chain_name + ' ' + firewall_rule.order + ' ';

	if (firewall_rule.protocol != 'all') {
		str_to_exec += '--protocol ' + firewall_rule.protocol + ' ';
	}

	if (firewall_rule.destination_ports) {
		str_to_exec += '--match multiport --destination-ports ' + firewall_rule.destination_ports + ' ';
	}

	if (firewall_rule.source) {
		str_to_exec += '--source ' + firewall_rule.source + ((firewall_rule.source_netmask) ? '/' + firewall_rule.source_netmask : '') + ' ';
	}

	if (firewall_rule.destination) {
		str_to_exec += '--destination ' + firewall_rule.destination + ((firewall_rule.destination_netmask) ? '/' + firewall_rule.destination_netmask : '') + ' ';
	}

	if (firewall_rule.state) {
		str_to_exec += '--match state --state ' + firewall_rule.state + ' ';
	}

	if (firewall_rule.description) {
		str_to_exec += '--match comment --comment "' + firewall_rule.description + '" ';
	}

	str_to_exec += '--jump ' + firewall_rule.target + ' ';

	return str_to_exec;
};

Firewall_Rule.statics.cl_del = function cl_del(firewall_rule) {
	return 'iptables --table filter --delete ' + firewall_rule.chain_name + ' ' + firewall_rule.order;
}

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Firewall_Rule', Firewall_Rule);