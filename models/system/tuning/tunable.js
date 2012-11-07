/*
 * Model for System Tunables.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,

	config = require('../../../config.json');

/*
 * Schema definition.
 */
var Tunable = new Schema({
	description:String,
	path       :String,
	group      :{
		type:String,
		enum:['net', 'kernel']
	},
	value      :String
});

/*
 * Methods definitions.
 *
 * Used to build the object dependant command line strings.
 */
Tunable.methods.cl_apply = function cl_apply() {
	return 'sysctl -w ' + this.group + '.' + this.path + '=' + this.value;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Tunable', Tunable);