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
var Routing_Table = new Schema({
	name       :String,
	id         :{
		type:Number,
		min :0,
		max :255
	},
	description:String
});

/*
 * Methods definitions.
 *
 * Used to build the generic command line strings.
 */
Routing_Table.methods.cl_add_table = function cl_add_table() {
	return this.id + '\t' + this.name;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Routing_Table', Routing_Table);