var mongoose = require('mongoose');

var tableSchema = mongoose.Schema({
	name: {
		type: String
	},
	size: {
		type: Number
	},
	status: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

var Table = module.exports = mongoose.model('Table', tableSchema);

//get all Table

module.exports.getAll = function(callback, limit){
	Table.find(callback).limit(limit);
};

module.exports.getById = function(id, callback){
	Table.findById(id, callback);
};

module.exports.add = function(table, callback){
	Table.create(table, callback);
};

module.exports.update = function(id, table, options, callback){
	var query = {_id: id};
	var update = {
		name: table.name	
	}

	Table.findOneAndUpdate(query, update, options, callback);
};

module.exports.delete = function(id, callback) {
	var query = {_id: id}; 
	Table.remove(query, callback);
};



