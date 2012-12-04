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
		enum:['UP', 'DOWN', 'NOT PRESENT']
	},
	identifier :String,
	MAC        :{
		type :String,
		match:/^([0-9a-f]{2}([:-]|$)){6}$/i
	},
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
	if (this.identifier == 'lo' || this.identifier.search('vboxnet') != -1) {
		var str_to_exec = 'ip link set ' + this.identifier + ' ' + this.status.toLowerCase();
	}
	else {
		var str_to_exec = 'ip link set ' + this.identifier + ' mtu ' + this.MTU;

		// Correction for devices that doesn't have MAC (ppp).
		if (this.MAC) {
			str_to_exec += '&& ip link set ' + this.identifier + ' address ' + this.MAC;
		}

		str_to_exec += '&& ip link set ' + this.identifier + ' ' + this.status.toLowerCase();
	}

	return str_to_exec;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Device', Device);