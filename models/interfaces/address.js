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
var Address = new Schema({
	parent_device:String,
	scope        :{
		type:String,
		enum:['global', 'site', 'link', 'host']
	},
	address      :String,
	net_mask     :Number,
	family       :{
		type   :String,
		enum   :['inet', 'inet6'],
		default:'inet'
	},
	description  :String
});

/*
 * Statics definitions.
 *
 * Used to build the generic command line strings.
 */
Address.statics.cl_address_show = function cl_address_show(device) {
	return 'ip address show ' + device;
};

/*
 * Methods definitions.
 *
 * Used to build the object dependant command line strings.
 */
Address.methods.cl_address_add = function cl_address_add() {
	return 'ip address add dev ' + this.parent_device + ' local ' + this.address + '/' + this.net_mask + ' broadcast +';
};

Address.methods.cl_address_delete = function cl_address_delete() {
	return 'ip address delete dev ' + this.parent_device + ' local ' + this.address + '/' + this.net_mask + ' broadcast +';
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Address', Address);