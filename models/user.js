var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true 
	},
	password: {
		type: Number,
		required: true
	},
	name: {
		type: String
	},
	type: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

var User = module.exports = mongoose.model('User', userSchema);

//get all User

module.exports.getAll = function(callback, limit){
	User.find(callback).limit(limit);
};

module.exports.getById = function(id, callback){
	User.findById(id, callback);
};

module.exports.add = function(user, callback){
	User.create(user, callback);
};

module.exports.update = function(id, user, options, callback){
	var query = {_id: id};
	var update = {
		name: user.name,
		password: user.password	
	}

	User.findOneAndUpdate(query, update, options, callback);
};

module.exports.login = function(username, password, callback){
	var query = { username: username, password : password };
	User.findOne(query, callback);
}



