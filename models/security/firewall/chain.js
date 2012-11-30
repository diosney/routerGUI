/*
 * Model for Firewall Chains.
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
var Firewall_Chain = new Schema({
	name         :{
		type:String
	},
	in_interface :String,
	out_interface:String,
	description  :String
});

/*
 * Methods definitions.
 *
 * Used to build the object dependant command line strings.
 */
Firewall_Chain.methods.cl_create = function cl_create() {
	var str_to_exec = 'iptables --table filter --new-chain ' + this.name;

	if (this.name == 'local') {
		str_to_exec += '&& iptables --table filter --append OUTPUT --jump ' + this.name;
		str_to_exec += '&& iptables --table filter --append INPUT --jump ' + this.name;
	}
	else if (this.name == 'ifall') {
		str_to_exec += '&& iptables --table filter --append OUTPUT --jump ' + this.name;
		str_to_exec += '&& iptables --table filter --append INPUT --jump ' + this.name;
		str_to_exec += '&& iptables --table filter --append FORWARD --jump ' + this.name;
	}
	else {
		str_to_exec += '&& iptables --table filter --append FORWARD ' + ((this.in_interface) ? '--in-interface ' + this.in_interface + ' ' : '') + ((this.out_interface) ? '--out-interface ' + this.out_interface + ' ' : '') + '--jump ' + this.name;
	}

	return str_to_exec;
};

/*
 * Statics definitions.
 *
 * Used to build the generic command line strings.
 */
Firewall_Chain.statics.cl_set_default_policy = function cl_set_default_policy() { // TODO: Change ACCEPT for DROP when default rules for db connection, and so on are set for not hanging out ourselves.
	var str_to_exec = 'iptables --table filter --policy INPUT ACCEPT &&' +
		'iptables --table filter --policy OUTPUT ACCEPT &&' +
		'iptables --table filter --policy FORWARD DROP';

	return str_to_exec;
};

Firewall_Chain.statics.cl_create = function cl_create(firewall_chain) {
	var str_to_exec = 'iptables --table filter --new-chain ' + firewall_chain.name;

	if (this.name == 'local') {
		str_to_exec += '&& iptables --table filter --append OUTPUT --jump ' + firewall_chain.name;
		str_to_exec += '&& iptables --table filter --append INPUT --jump ' + firewall_chain.name;
	}
	else if (this.name == 'ifall') {
		str_to_exec += '&& iptables --table filter --append OUTPUT --jump ' + firewall_chain.name;
		str_to_exec += '&& iptables --table filter --append INPUT --jump ' + firewall_chain.name;
		str_to_exec += '&& iptables --table filter --append FORWARD --jump ' + firewall_chain.name;
	}
	else {
		str_to_exec += '&& iptables --table filter --append FORWARD ' + ((firewall_chain.in_interface) ? '--in-interface ' + firewall_chain.in_interface + ' ' : '') + ((firewall_chain.out_interface) ? '--out-interface ' + firewall_chain.out_interface + ' ' : '') + '--jump ' + firewall_chain.name;
	}

	return str_to_exec;
};

Firewall_Chain.statics.cl_del = function cl_del(firewall_chain) {
	var str_to_exec = 'iptables --table filter --flush  ' + firewall_chain.name;

	if (this.name == 'local') {
		str_to_exec += '&& iptables --table filter --delete INPUT --in-interface all --out-interface all --jump ' + firewall_chain.name;
		str_to_exec += '&& iptables --table filter --delete OUTPUT --in-interface all --out-interface all --jump ' + firewall_chain.name;
		str_to_exec += '&& iptables --table filter --delete-chain ' + firewall_chain.name;
	}
	else if (this.name == 'ifall') {
		str_to_exec += '&& iptables --table filter --delete INPUT --in-interface all --out-interface all --jump ' + firewall_chain.name;
		str_to_exec += '&& iptables --table filter --delete OUTPUT --in-interface all --out-interface all --jump ' + firewall_chain.name;
		str_to_exec += '&& iptables --table filter --delete FORWARD --in-interface all --out-interface all --jump ' + firewall_chain.name;
		str_to_exec += '&& iptables --table filter --delete-chain ' + firewall_chain.name;
	}
	else {
		str_to_exec += '&& iptables --table filter --delete FORWARD --in-interface ' + firewall_chain.in_interface + ' --out-interface ' + firewall_chain.out_interface + ' --jump ' + firewall_chain.name;
		str_to_exec += '&& iptables --table filter --delete-chain ' + firewall_chain.name;
	}

	return str_to_exec;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Firewall_Chain', Firewall_Chain);