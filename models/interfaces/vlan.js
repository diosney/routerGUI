/*
 * Model for VLANs.
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
var VLAN = new Schema({
	parent_device:String,
	status       :{
		type:String,
		enum:['UP', 'DOWN', 'PARENT DOWN', 'NOT PRESENT']
	},
	tag          :{
		type   :Number,
		default:'1',
		min    :0,
		max    :4096
	},
	description  :String
});

/*
 * Methods definitions.
 *
 * Used to build the object dependant command line strings.
 */
VLAN.methods.cl_add = function cl_add() {
	return 'ip link add link ' + this.parent_device + ' name ' + this.parent_device + '.' + this.tag + ' type vlan id ' + this.tag + '&&' +
		'ip link set ' + this.parent_device + '.' + this.tag + ' ' + this.status.toLowerCase();
};

VLAN.methods.cl_set = function cl_set() {
	return 'ip link set ' + this.parent_device + '.' + this.tag + ' ' + this.status.toLowerCase();
};

VLAN.methods.cl_delete = function cl_delete() {
	return 'ip link delete dev ' + this.parent_device + '.' + this.tag;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('VLAN', VLAN);