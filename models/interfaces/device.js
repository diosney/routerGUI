/*
 * Model for Devices.
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
var Device = new Schema({
	status     :{
		type:String,
		enum:['UP', 'DOWN']
	},
	identifier :String,
	MAC        :String,
	MTU        :Number,
	description:String
});

/*
 * Statics definitions.
 *
 * Used to build the generic command line strings.
 */
Device.statics.cl_link_show = function cl_link_show() {
	return 'ip link show';
};

/*
 * Methods definitions.
 *
 * Used to build the object dependant command line strings.
 */
Device.methods.cl_link_set = function cl_link_set() {
	return 'ip link set ' + this.identifier + ' mtu ' + this.MTU + '&&' +
		'ip link set ' + this.identifier + ' address ' + this.MAC + '&&' +
		'ip link set ' + this.identifier + ' ' + this.status.toLowerCase();
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Device', Device);