var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var fupload = require('express-fileupload');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fupload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'pub',
	name:'sessionid',
    resave: true,
    saveUninitialized: true
}));

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
app.locals={
	port:'8080',
	dburl:'mongodb://pub:pub@130.65.159.30:27017/pub',
	uploadDir:path.join(__dirname, 'upload/')
};

MongoClient.connect(app.locals.dburl, function(err, db){
	assert.equal(null, err);
	console.log("Connected successfully to database server");	
	var _index = require('./routes/index');
	app.use('/', _index);
	var _login = require('./routes/login');
	app.use('/login', _login(db));
	var _user = require('./routes/user');
	app.use('/user', _user(db));
	var _admin = require('./routes/admin');
	app.use('/admin', _admin(db));
});

var http = require('http');
var server = http.createServer(app);
server.listen(app.locals.port,function () {
	console.log('app listening on port %s!',app.locals.port);
});
