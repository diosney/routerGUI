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
var Routing_Route = new Schema({
	type        :{
		type:String,
		enum:['unicast']
	},
	to          :String,
	to_net_mask :Number,
	table       :String,
	via         :String,
	src         :String,
	description :String
});

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Routing_Route', Routing_Route);