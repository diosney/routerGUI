/*
 * Model for System Tunables.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,

	config = require('../../config.json');

/*
 * Schema definition.
 */
var Routing_Rule = new Schema({
	type         :{
		type   :String,
		enum   :['unicast'],
		default:'unicast'
	},
	from         :String,
	from_net_mask:Number,
	to           :String,
	to_net_mask  :Number,
	iif          :String,
	priority     :{
		type:Number,
		min :0,
		max :32767
	},
	table        :String,
	description  :String
});

/*
 * Statics definitions.
 *
 * Used to build the generic command line strings.
 */
Routing_Rule.statics.cl_delete = function cl_delete(routing_rule) {
	var str_to_exec = 'ip rule delete type ' + ((routing_rule.type)?routing_rule.type:'unicast');

	if (routing_rule.from) {
		str_to_exec += ' from ' + routing_rule.from + '/' + routing_rule.from_net_mask;
	}
	else {
		str_to_exec += ' from all';
	}

	if (routing_rule.to) {
		str_to_exec += ' to ' + routing_rule.to + '/' + routing_rule.to_net_mask;
	}
	if (routing_rule.iif) {
		str_to_exec += ' iif ' + routing_rule.iif;
	}

	if (routing_rule.priority) {
		str_to_exec += ' priority ' + routing_rule.priority;
	}

	if (routing_rule.table) {
		str_to_exec += ' table ' + routing_rule.table;
	}

	return str_to_exec;
};

/*
 * Methods definitions.
 *
 * Used to build the object dependant command line strings.
 */
Routing_Rule.methods.cl_add = function cl_add() {
	var str_to_exec = 'ip rule add type ' + ((this.type)?this.type:'unicast');

	if (this.from) {
		str_to_exec += ' from ' + this.from + '/' + this.from_net_mask;
	}
	else {
		str_to_exec += ' from all';
	}

	if (this.to) {
		str_to_exec += ' to ' + this.to + '/' + this.to_net_mask;
	}
	if (this.iif) {
		str_to_exec += ' iif ' + this.iif;
	}

	if (this.priority) {
		str_to_exec += ' priority ' + this.priority;
	}

	if (this.table) {
		str_to_exec += ' table ' + this.table;
	}

	return str_to_exec;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Routing_Rule', Routing_Rule);