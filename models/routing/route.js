/*
 * Model for Routing Routes.
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
	type       :{
		type:String,
		enum:['unicast']
	},
	to         :String,
	to_net_mask:Number,
	table      :String,
	via        :String,
	description:String
});

/*
 * Statics definitions.
 *
 * Used to build the generic command line strings.
 */
Routing_Route.statics.cl_delete = function cl_delete(routing_route) {
	return 'ip route delete to ' + routing_route.type + ' ' + routing_route.to + '/' + routing_route.to_net_mask + ' table ' + routing_route.table + ' via ' + routing_route.via;
};

Routing_Route.statics.cl_change = function cl_change(routing_route) {
	return 'ip route change to ' + routing_route.type + ' ' + routing_route.to + '/' + routing_route.to_net_mask + ' table ' + routing_route.table + ' via ' + routing_route.via;
};

/*
 * Methods definitions.
 *
 * Used to build the generic command line strings.
 */
Routing_Route.methods.cl_add = function cl_add() {
	return 'ip route add to ' + this.type + ' ' + this.to + '/' + this.to_net_mask + ' table ' + this.table + ' via ' + this.via;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Routing_Route', Routing_Route);