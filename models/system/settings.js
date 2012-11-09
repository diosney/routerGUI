/*
 * Model for System Settings.
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
var Settings = new Schema({
	name :String,
	value:String
});

// Export it to make it usable to the Routes.
module.exports = mongoose.model('Settings', Settings);