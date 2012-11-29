/*
 * Model for NAT Chains.
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
var NAT_Chain = new Schema({
	type       :{
		type:String,
		enum:['source', 'destination']
	},
	name       :{
		type:String
	},
	interface  :String,
	description:String
});

/*
 * Methods definitions.
 *
 * Used to build the object dependant command line strings.
 */
NAT_Chain.methods.cl_create = function cl_create() {
	var str_to_exec = '';

	if (this.type == 'source') {
		str_to_exec = 'iptables --table nat --new-chain ' + this.name;
		str_to_exec += '&& iptables --table nat --append POSTROUTING ' + ((this.interface) ? '--out-interface ' + this.interface + ' ' : '') + '--jump ' + this.name;
	}
	else if (this.type == 'destination') {
		str_to_exec = 'iptables --table nat --new-chain ' + this.name;
		str_to_exec += '&& iptables --table nat --append PREROUTING ' + ((this.interface) ? '--in-interface ' + this.interface + ' ' : '') + '--jump ' + this.name;

		if (this.name == 'local' || this.name == 'ifall') {
			str_to_exec += '&& iptables --table nat --append OUTPUT --jump ' + this.name;
		}
	}

	return str_to_exec;
};

/*
 * Statics definitions.
 *
 * Used to build the generic command line strings.
 */
NAT_Chain.statics.cl_set_default_policy = function cl_set_default_policy() {
	var str_to_exec = 'iptables --table nat --policy PREROUTING ACCEPT &&' +
		'iptables --table nat --policy POSTROUTING ACCEPT &&' +
		'iptables --table nat --policy OUTPUT ACCEPT';

	return str_to_exec;
};

NAT_Chain.statics.cl_create = function cl_create(nat_chain) {
	var str_to_exec = '';

	if (nat_chain.type == 'source') {
		str_to_exec = 'iptables --table nat --new-chain ' + nat_chain.name;
		str_to_exec += '&& iptables --table nat --append POSTROUTING ' + ((nat_chain.interface) ? '--out-interface ' + nat_chain.interface + ' ' : '') + '--jump ' + nat_chain.name;
	}
	else if (nat_chain.type == 'destination') {
		str_to_exec = 'iptables --table nat --new-chain ' + nat_chain.name;
		str_to_exec += '&& iptables --table nat --append PREROUTING ' + ((nat_chain.interface) ? '--in-interface ' + nat_chain.interface + ' ' : '') + '--jump ' + nat_chain.name;

		if (nat_chain.name == 'local' || nat_chain.name == 'ifall') {
			str_to_exec += '&& iptables --table nat --append OUTPUT --jump ' + nat_chain.name;
		}
	}

	return str_to_exec;
};

NAT_Chain.statics.cl_del = function cl_del(nat_chain) {
	var str_to_exec = '';

	if (nat_chain.type == 'source') {
		str_to_exec = 'iptables --table nat --flush  ' + nat_chain.name;
		str_to_exec += '&& iptables --table nat --delete POSTROUTING ' + ((nat_chain.interface) ? '--out-interface ' + nat_chain.interface + ' ' : '') + '--jump ' + nat_chain.name;
		str_to_exec += '&& iptables --table nat --delete-chain ' + nat_chain.name;
	}
	else if (nat_chain.type == 'destination') {
		str_to_exec = 'iptables --table nat --flush ' + nat_chain.name;
		str_to_exec += '&& iptables --table nat --delete PREROUTING ' + ((nat_chain.interface) ? '--in-interface ' + nat_chain.interface + ' ' : '') + '--jump ' + nat_chain.name;
		str_to_exec += '&& iptables --table nat --delete-chain ' + nat_chain.name;
	}

	return str_to_exec;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('NAT_Chain', NAT_Chain);