var express = require('express');
var router = express.Router();
module.exports =  function(db){
	router.get('/show', function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.query.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{					
			db.collection('users').findOne({'sjsuid':req.query.sjsuid},{'lastname':1,'firstname':1,'rank':1,'year':1},function(err,data){
				if(err!=null) res.send({"success":"false","msg":"can not find data"});
				else{
					res.send({"success":"true","data":{
						"lastname":data.lastname,
						"firstname":data.firstname,
						"rank":data.rank,
						"year":data.year
					}});
				}		
			});			
		}
	});
	
	router.post('/update', function(req, res, next) {		
		if(!req.session || !req.session.login || req.session.sjsuid!=req.body.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			db.collection('users').updateOne({'sjsuid':req.body.sjsuid}, {$set:{
				"rank":req.body.rank,
				"year":req.body.year,
				"updatetime":new Date()
			}},{},function(err, r){
				if(err!=null) res.send({"success":"false","msg":"can not update user"});
				else res.send({"success":"true"});
			});	
		}
	});
	
	router.post('/addJournal', function(req, res, next) {		
		if(!req.session || !req.session.login || req.session.sjsuid!=req.body.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			var item = {
				sjsuid:req.body.sjsuid,
				title:req.body.title.trim(),
				authors:req.body.authors.trim(),
				affiliation:req.body.affiliation.trim(),
				coauthors:req.body.coauthors.trim(),
				correspondingAuthor:req.body.correspondingAuthor.trim(),
				journalTitle:req.body.journalTitle.trim(),
				journalURL:req.body.journalURL.trim(),
				pubMonthYear:req.body.pubMonthYear.trim(),
				issueNumber:req.body.issueNumber.trim(),
				pagesNumber:req.body.pagesNumber.trim(),
				impactFactor:req.body.impactFactor.trim(),
				pubOnline:req.body.pubOnline.trim(),
				monthYearOnline:req.body.monthYearOnline.trim(),
				urlOnline:req.body.urlOnline.trim(),
				pdfID:"",
				pdfName:"",
				updatetime:new Date()
			};
			var ObjectID = require('mongodb').ObjectID;
			var itemID = req.body.id.length>0 ? new ObjectID(req.body.id) : new ObjectID();			
			var pdfID = new ObjectID();
			var file = req.files["pdf"];
			if(file.name && file.name.length>0){
				file.mv(req.app.locals.uploadDir+pdfID+".pdf", function(err){
					if(err!=null){						
						res.send({"success":"false", "msg":"fail to upload file"});
						return;
					} else {
						item["pdfID"]=pdfID;
						item["pdfName"]=file.name;
						db.collection('journal').updateOne({"_id":itemID},{$set:item},{upsert:true},function(err, result){
							if(err!=null) res.send({"success":"false","msg":"fail to update database"});
							else res.send({"success":"true"});
						});
					}
				});
			} else {
				db.collection('journal').updateOne({"_id":itemID}, {$set:item},{upsert:true},function(err, result){
					if(err!=null) res.send({"success":"false","msg":"fail to update journal"});
					else res.send({"success":"true"});
				});
			}
		}
	});
	
	router.post('/addConference', function(req, res, next) {		
		if(!req.session || !req.session.login || req.session.sjsuid!=req.body.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			var item = {
				sjsuid:req.body.sjsuid,
				title:req.body.title.trim(),
				authors:req.body.authors.trim(),
				affiliation:req.body.affiliation.trim(),
				coauthors:req.body.coauthors.trim(),
				conferenceTitle:req.body.conferenceTitle.trim(),
				location:req.body.location.trim(),
				heldDate:req.body.heldDate.trim(),
				conferenceDomain:req.body.conferenceDomain.trim(),
				sponsor:req.body.sponsor.trim(),
				reviewed:req.body.reviewed.trim(),
				pubRange:req.body.pubRange.trim(),
				urlOnline:req.body.urlOnline.trim(),				
				pdfID:"",
				pdfName:"",
				updatetime:new Date()
			};
			var ObjectID = require('mongodb').ObjectID;
			var itemID = req.body.id.length>0 ? new ObjectID(req.body.id) : new ObjectID();			
			var pdfID = new ObjectID();
			var file = req.files["pdf"];
			if(file.name && file.name.length>0){
				file.mv(req.app.locals.uploadDir+pdfID+".pdf", function(err){
					if(err!=null){						
						res.send({"success":"false", "msg":"fail to upload file"});
						return;
					} else {
						item["pdfID"]=pdfID;
						item["pdfName"]=file.name;
						db.collection('conference').updateOne({"_id":itemID},{$set:item},{upsert:true},function(err, result){
							if(err!=null) res.send({"success":"false","msg":"fail to update database"});
							else res.send({"success":"true"});
						});
					}
				});
			} else {
				db.collection('conference').updateOne({"_id":itemID}, {$set:item},{upsert:true},function(err, result){
					if(err!=null) res.send({"success":"false","msg":err});
					else res.send({"success":"true"});
				});
			}
		}
	});
	
	router.post('/addThesis', function(req, res, next) {		
		if(!req.session || !req.session.login || req.session.sjsuid!=req.body.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			var item = {
				sjsuid:req.body.sjsuid,
				title:req.body.title.trim(),
				student:req.body.student.trim(),
				department:req.body.department.trim(),
				completeDate:req.body.completeDate.trim(),
				journalPaperPub:req.body.journalPaperPub.trim(),
				journalPubList:req.body.journalPubList.trim(),
				confPaperPub:req.body.confPaperPub.trim(),
				confPubList:req.body.confPubList.trim(),
				updatetime:new Date()
			};
			var ObjectID = require('mongodb').ObjectID;
			var itemID = req.body.id.length>0 ? new ObjectID(req.body.id) : new ObjectID();
			db.collection('thesis').updateOne({"_id":itemID}, {$set:item},{upsert:true},function(err, result){
				if(err!=null) res.send({"success":"false","msg":"fail to update database"});
				else res.send({"success":"true"});
			});
		}
	});
	
	router.get('/submition', function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.query.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			var journal = [];
			var conference = [];
			var thesis = [];
			db.collection('journal').find({'sjsuid':req.query.sjsuid}).toArray(function(err,items){
				if(err!=null) res.send({"success":"false","msg":"fail to find data"});
				else{
					for(var i=0;i<items.length;i++){
						var data = items[i];
						journal.push({
							id:data._id,
							title:data.title,
							authors:data.authors,
							journalTitle:data.journalTitle,
							pubMonthYear:data.pubMonthYear,
							impactFactor:data.impactFactor,
							pubOnline:data.pubOnline,
							pdfID:data.pdfID
						});
					}
					
					db.collection('conference').find({'sjsuid':req.query.sjsuid}).toArray(function(err,items){
						if(err!=null) res.send({"success":"false","msg":"fail to find data"});
						else{
							for(var i=0;i<items.length;i++){
								var data = items[i];
								conference.push({
									id:data._id,
									title:data.title,
									authors:data.authors,
									conferenceTitle:data.conferenceTitle,
									reviewed:data.reviewed,
									sponsor:data.sponsor,									
									pdfID:data.pdfID
								});
							}
							
							db.collection('thesis').find({'sjsuid':req.query.sjsuid}).toArray(function(err,items){
								if(err!=null) res.send({"success":"false","msg":"fail to find data"});
								else{
									for(var i=0;i<items.length;i++){
										var data = items[i];
										thesis.push({
											id:data._id,
											title:data.title,
											student:data.student,
											department:data.department,
											completeDate:data.completeDate,
											journalPubList:data.journalPubList,
											confPubList:data.confPubList
										});
									}
									res.send({"success":"true","data":{
										"journal":journal,
										"conference":conference,
										"thesis":thesis
									}});
								}		
							});
						}		
					});
				}		
			});
		}
	});
	
	router.post('/download', function(req, res, next) {
		var path = req.app.locals.uploadDir+req.body.pdfID+".pdf";
		res.download(path);
	});
		
	router.delete('/journal',function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.body.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			var ObjectID = require('mongodb').ObjectID;
			db.collection('journal').removeOne({"_id":new ObjectID(req.body.id)},{w:1},function(err, r){
				if(err!=null) res.send({"success":"false","msg":"fail to delete"});
				else res.send({"success":"true"});
			});
		}
	});
	
	router.delete('/conference',function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.body.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			var ObjectID = require('mongodb').ObjectID;
			db.collection('conference').removeOne({"_id":new ObjectID(req.body.id)},{w:1},function(err, r){
				if(err!=null) res.send({"success":"false","msg":"fail to delete"});
				else res.send({"success":"true"});
			});
		}
	});
	
	router.delete('/thesis',function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.body.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			var ObjectID = require('mongodb').ObjectID;
			db.collection('thesis').removeOne({"_id":new ObjectID(req.body.id)},{w:1},function(err, r){
				if(err!=null) res.send({"success":"false","msg":"fail to delete"});
				else res.send({"success":"true"});
			});
		}
	});
	
	router.get('/journal', function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.query.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			var ObjectID = require('mongodb').ObjectID;
			db.collection('journal').findOne({'_id':new ObjectID(req.query.id)},{},function(err,data){
				if(err!=null) res.send({"success":"false","msg":"fail to find data"});
				else res.send({"success":"true","data":data});	
			});			
		}
	});
	
	router.get('/conference', function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.query.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			var ObjectID = require('mongodb').ObjectID;
			db.collection('conference').findOne({'_id':new ObjectID(req.query.id)},{},function(err,data){
				if(err!=null) res.send({"success":"false","msg":"fail to find data"});
				else res.send({"success":"true","data":data});	
			});			
		}
	});
	
	router.get('/thesis', function(req, res, next) {
		if(!req.session || !req.session.login || req.session.sjsuid!=req.query.sjsuid){
			res.send({"redirect":"/view/login.html"});
		}else{
			var ObjectID = require('mongodb').ObjectID;
			db.collection('thesis').findOne({'_id':new ObjectID(req.query.id)},{},function(err,data){
				if(err!=null) res.send({"success":"false","msg":"fail to find data"});
				else res.send({"success":"true","data":data});	
			});			
		}
	});
	return router;
}