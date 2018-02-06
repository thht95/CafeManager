var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressLayouts = require('express-ejs-layouts');
var request = require('request');
var session = require('express-session');
var mySession;

//mongodb
Table = require('./models/table');
User = require('./models/user');

mongoose.connect('mongodb://localhost/CafeManager');
var db = mongoose.connection;

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//config
app.use(express.static("public"))
.use('/css', express.static('public/css'))
.use('/fonts', express.static('public/fonts'))
.use('/img', express.static('public/img'))
.use('/js', express.static('public/js'));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(expressLayouts);

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
  if (!req.session.isLoggedIn) {
    req.session.isLoggedIn = false;
  }
  mySession = req.session;

  next()
})

//router
app.get('/', function(req, res) {
	//res.render('<b> Hello world </h1>')
	res.render('index'); 
});

app.get('/signin', function(req, res) {
	res.render('signin');
});

app.post('/signin', function(req,res){
	console.log('post signin');
	username = req.body.username;
	pass = req.body.password;

	User.login(username, pass, function(err, user){
		if (user){
			req.session.currentUser = user;
			req.session.isLoggedIn = true;

			res.redirect('/allTables');			
		}
		else{
			res.render('signin');
			console.log("login failed");
		}
	})
});

app.get('/allTables', function(req,res) {
	console.log('access to /allTables');

	if (req.session.isLoggedIn){
		Table.getAll(function(err, tables){
			if (err){
				throw err;
			}

			res.render('allTables', {
				tables: tables
			});
		});
	}
	else
		res.render('requireLogin');	
});

//API
/* ------------------------TABLE-------------------------- */

app.get('/api/tables', function(req,res){
	Table.getAll(function(err, tables){
		if (err){
			throw err;
		}

		res.json(tables);
	});
});

app.get('/api/tables/:id', function(req,res){
	Table.getById(req.params.id, function(err, table){
		if (err){
			throw err;
		}

		res.json(table);
	});
});

app.post('/api/tables', function(req,res){
	var table = req.body;
	Table.add(table, function(err, table){
		if (err)
		{
			throw err;
		}
		res.json(table);
	});
});

app.put('/api/tables/:id', function(req,res){
	var id = req.params._id;
	var table = req.body;

	Table.update(id, table, {}, function(err, table){
		if (err)
		{
			throw err;
		}
		res.json(table);
	});
});


app.delete('/api/tables/:id', function(req,res){
	var id = req.params._id;

	Table.delete(id, function(err, table){
		if (err)
		{
			throw err;
		}
		res.json(table);
	});
});

/* ------------------------USER-------------------------- */

app.get('/api/users', function(req,res){
	User.getAll(function(err, users){
		if (err){
			throw err;
		}

		res.json(users);
	});
});

app.get('/api/users/:id', function(req,res){
	User.getById(req.params.id, function(err, table){
		if (err){
			throw err;
		}

		res.json(table);
	});
});

app.post('/api/users', function(req,res){
	var user = req.body;
	User.add(user, function(err, user){
		if (err)
		{
			throw err;
		}
		res.json(user);
	});
});

app.put('/api/users/:id', function(req,res){
	var id = req.params._id;
	var user = req.body;

	User.update(id, user, {}, function(err, user){
		if (err)
		{
			throw err;
		}
		res.json(user);
	});
}); 


app.delete('/api/users/:id', function(req,res){
	var id = req.params._id;

	User.delete(id, function(err, user){
		if (err)
		{
			throw err;
		}
		res.json(user);
	});
});

/* ------------------------USER-------------------------- */


var server = app.listen(1311, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});