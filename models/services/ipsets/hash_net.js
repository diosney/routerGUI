/*
 * Model for Hash:Net type.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var Hash_Net = new Schema({
	ipset      :String,
	address    :String,
	net_mask   :Number,
	family     :{
		type   :String,
		enum   :['inet', 'inet6'],
		default:'inet'
	},
	description:String
});

/*
 * Methods definitions.
 *
 * Used to build the object dependant command line strings.
 */
Hash_Net.methods.cl_add = function cl_add() {
	return 'ipset add "' + this.ipset + '" ' + this.address + '/' + this.net_mask;
};

/*
 * Statics definitions.
 *
 * Used to build the generic command line strings.
 */
Hash_Net.statics.cl_del = function cl_del(hash_net) {
	return 'ipset del "' + hash_net.ipset + '" ' + hash_net.address + '/' + hash_net.net_mask;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Hash_Net', Hash_Net);