/*
 * Model for Hash:IP type.
 */
/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var Hash_IP = new Schema({
	ipset      :String,
	address    :String,
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
Hash_IP.methods.cl_add = function cl_add() {
	return 'ipset add ' + this.ipset + ' ' + this.address;
};

/*
 * Statics definitions.
 *
 * Used to build the generic command line strings.
 */
Hash_IP.statics.cl_del = function cl_del(hash_ip) {
	return 'ipset del ' + hash_ip.ipset + ' ' + hash_ip.address;
};

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Hash_IP', Hash_IP);