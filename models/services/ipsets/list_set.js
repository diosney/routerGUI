/*
 * Model for List:Set type.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var List_Set = new Schema({
	ipset      :String,
	name       :String,
	description:String
});

/*
 * Methods definitions.
 *
 * Used to build the object dependant command line strings.
 */
List_Set.methods.cl_add = function cl_add() {
	return 'ipset add "' + this.ipset + '" ' + this.name;
};

/*
 * Statics definitions.
 *
 * Used to build the generic command line strings.
 */
List_Set.statics.cl_del = function cl_del(list_set) {
	return 'ipset del "' + list_set.ipset + '" ' + list_set.name;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('List_Set', List_Set);