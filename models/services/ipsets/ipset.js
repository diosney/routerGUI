/*
 * Model for IP Sets.
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
var IP_Set = new Schema({
	name       :{
		type:String
	},
	description:String,
	type       :{
		type:String,
		enum:['hash:net', 'hash:ip', 'list:set']
	}
});

/*
 * Methods definitions.
 *
 * Used to build the object dependant command line strings.
 */
IP_Set.methods.cl_create = function cl_create() {
	return 'ipset create "' + this.name + '" ' + this.type;
};

IP_Set.methods.cl_rename = function cl_rename(new_name) {
	return 'ipset rename "' + this.name + '" "' + new_name + '"';
};

/*
 * Statics definitions.
 *
 * Used to build the generic command line strings.
 */
IP_Set.statics.cl_destroy = function cl_destroy(ipset) {
	return 'ipset destroy "' + ipset.name + '"';
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('IP_Set', IP_Set);