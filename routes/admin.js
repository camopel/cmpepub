var express = require('express');
var router = express.Router();
module.exports =  function(db){
	router.get('/user', function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.query.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			db.collection('users').find({'sjsuid':{$ne:'admin'}}).toArray(function(err,items){
				if(err!=null) res.send({"success":"false","msg":err});
				else res.send({"success":"true","data":items});
			});
		}
	});	
	
	
	router.get('/journal', function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.query.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			db.collection('journal').find().toArray(function(err,items){
				if(err!=null) res.send({"success":"false","msg":err});
				else res.send({"success":"true","data":items});
			});	
		}
	});
	
	router.get('/conference', function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.query.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			db.collection('conference').find().toArray(function(err,items){
				if(err!=null) res.send({"success":"false","msg":err});
				else res.send({"success":"true","data":items});
			});			
		}
	});
	
	router.get('/thesis', function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.query.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			db.collection('thesis').find().toArray(function(err,items){
				if(err!=null) res.send({"success":"false","msg":err});
				else res.send({"success":"true","data":items});
			});	
		}
	});
	
	return router;
}