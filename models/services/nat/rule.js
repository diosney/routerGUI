/*
 * Model for NAT Rules.
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
var NAT_Rule = new Schema({
	chain_name         :String,
	order              :Number,
	protocol           :{
		type:String,
		enum:['all', 'tcp', 'udp'] // The protocols: SCTP or DCCP also can specify ports.
	},
	destination_ports  :String, // port[,port|,port:port]
	source             :String,
	source_netmask     :Number,
	destination        :String,
	destination_netmask:Number,
	to_nat             :String, // ipaddr[-ipaddr]][:port[-port]
	description        :String
});

/*
 * Statics definitions.
 *
 * Used to build the object dependant command line strings.
 */
NAT_Rule.statics.cl_add = function cl_add(nat_rule) {
	var str_to_exec = 'iptables --table nat ';

	var chain_type = nat_rule.chain_name.split('-')[0];

	str_to_exec += '--insert ' + nat_rule.chain_name + ' ' + nat_rule.order + ' ';

	if (nat_rule.protocol != 'all') {
		str_to_exec += '--protocol ' + nat_rule.protocol + ' ';
	}

	if (nat_rule.destination_ports) {
		str_to_exec += '--match multiport --destination-ports "' + nat_rule.destination_ports + '" ';
	}

	if (nat_rule.source) {
		str_to_exec += '--source ' + nat_rule.source + ((nat_rule.source_netmask) ? '/' + nat_rule.source_netmask : '') + ' ';
	}

	if (nat_rule.destination) {
		str_to_exec += '--destination ' + nat_rule.destination + ((nat_rule.destination_netmask) ? '/' + nat_rule.destination_netmask : '') + ' ';
	}

	if (chain_type == 'snat') {
		str_to_exec += '--jump SNAT --to-source ' + nat_rule.to_nat + ' ';
	}
	else if (chain_type == 'dnat') {
		str_to_exec += '--jump DNAT --to-destination ' + nat_rule.to_nat + ' ';
	}

	if (nat_rule.description) {
		str_to_exec += '--match comment --comment "' + nat_rule.description + '"';
	}

	return str_to_exec;
};

NAT_Rule.statics.cl_replace = function cl_replace(nat_rule) {
	var str_to_exec = 'iptables --table nat ';

	var chain_type = nat_rule.chain_name.split('-')[0];

	str_to_exec += '--replace ' + nat_rule.chain_name + ' ' + nat_rule.order + ' ';

	if (nat_rule.protocol != 'all') {
		str_to_exec += '--protocol ' + nat_rule.protocol + ' ';
	}

	if (nat_rule.destination_ports) {
		str_to_exec += '--match multiport --destination-ports "' + nat_rule.destination_ports + '" ';
	}

	if (nat_rule.source) {
		str_to_exec += '--source ' + nat_rule.source + ((nat_rule.source_netmask) ? '/' + nat_rule.source_netmask : '') + ' ';
	}

	if (nat_rule.destination) {
		str_to_exec += '--destination ' + nat_rule.destination + ((nat_rule.destination_netmask) ? '/' + nat_rule.destination_netmask : '') + ' ';
	}

	if (chain_type == 'snat') {
		str_to_exec += '--jump SNAT --to-source ' + nat_rule.to_nat + ' ';
	}
	else if (chain_type == 'dnat') {
		str_to_exec += '--jump DNAT --to-destination ' + nat_rule.to_nat + ' ';
	}

	if (nat_rule.description) {
		str_to_exec += '--match comment --comment "' + nat_rule.description + '"';
	}

	return str_to_exec;
};

NAT_Rule.statics.cl_del = function cl_del(nat_rule) {
	return 'iptables --table nat --delete ' + nat_rule.chain_name + ' ' + nat_rule.order;
}

// Export it to make it usable to the Routes.
module.exports = mongoose.model('NAT_Rule', NAT_Rule);