var util = require('util');

var mongoskin = require('mongoskin')
var ObjectId = mongoskin.ObjectID;


var gcm = require('node-gcm');
var message = new gcm.Message();


var apn = require('apn');



DSTCRUD = function(host, port) {
	this.db = mongoskin.db('mongodb://@'+host+':'+port+'/dst003', {safe:true})
	this.faculty_collection = this.db.collection('faculty');
	this.lecture_collection = this.db.collection('lecture');
	this.post_collection = this.db.collection('post');

	this.push_android_collection = this.db.collection('push_android_lecture');
	this.push_iOS_collection = this.db.collection('push_iOS_lecture');
	this.push_iOS_production_collection = this.db.collection('push_iOS_production_lecture');

	this.push_android_collection2 = this.db.collection('push_android_lecture2');
	this.push_iOS_collection2 = this.db.collection('push_iOS_lecture2');
	this.push_iOS_production_collection2 = this.db.collection('push_iOS_production_lecture2');

	this.scheduleLog_collection = this.db.collection('schedulelog');
	this.developer_push_collection = this.db.collection('developer_push');
}


// Read
DSTCRUD.prototype.readFaculty = function (callback) {
  	this.faculty_collection.find(
  		{}, 
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  			callback(e, results);
	})

}
DSTCRUD.prototype.readLecture = function (f_id, callback) {
  	this.lecture_collection.find(
  		{faculty_id:String(f_id)} , 
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  			callback(e, results);
	})
}
DSTCRUD.prototype.readPost = function (l_id, callback) {
  	this.post_collection.find(
  		{lecture_id:String(l_id)} , 
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  			callback(e, results);
	})
}

// Create
DSTCRUD.prototype.createFaculty = function (param, callback) {
	this.faculty_collection.insert(param, {}, function(e, results){
	    if (e) {callback(false); return;}
	    callback(true);
  	})
}
DSTCRUD.prototype.createLecture = function (param, callback) {
	var _this = this;
	this.lecture_collection.insert(param, {}, function(e, results){
	    if (e) {callback(false); return;}
	    var faculty_id = false;
	    if (typeof(param)==typeof([]) && param.length>0) faculty_id = param[0].faculty_id
	    else if (typeof(param)==typeof({})) faculty_id = param.faculty_id
	    if (faculty_id==false) {callback(true);return;}
	    _this.lecture_collection.count({faculty_id:faculty_id}, function(e, count) {
			if (e) {callback(false); return;}

			_this.faculty_collection.updateById(faculty_id, {$set:{lecturecount:count}}, function(e, count) {
				if (e) {callback(false); return;}
				callback(true);
			})
		})
  	})
}
DSTCRUD.prototype.createPost = function (param, callback) {
	var _this = this;
	this.post_collection.insert(param, {}, function(e, results){
							
	    if (e) {callback(false, []); return;}
	    var lecture_id = false;
	    if (typeof(param)==typeof([]) && param.length>0) lecture_id = param[0].lecture_id
	    else if (typeof(param)==typeof({})) lecture_id = param.lecture_id
	    if (lecture_id==false) {callback(true, results);return;}
	    _this.post_collection.count({lecture_id:lecture_id}, function(e, count) {
			if (e) {callback(false, resultss); return;}
			var newupdatedate = new Date();
			_this.lecture_collection.updateById(lecture_id, {$set:{postcount:count, updatedate:newupdatedate}}, function(e, count) {
				if (e) {callback(false, results); return;}
				callback(true, results);


				/*새 글마다 푸시 날리기*/
				var param;
				for (var i=0; i<results.length; i++) {
					param = {
						lecture_id:results[i].lecture_id,
						post_id:results[i]._id
					}
					// util.log("push param:"+JSON.stringify(param));
					// util.log(_this);
					// util.log(_this.callPush);
					_this.callPush(param, function(){});
				}	
			})
		})
  	})
}

// Update
DSTCRUD.prototype.updateFaculty = function (param, callback) {
	if (!param.name) callback(false);
	var _name = param.name;
	delete param.name;
	delete param._id;
	// delete param.lecturecount;
	// util.log("param:"+JSON.stringify(param))
	this.faculty_collection.update({name:_name}, {$set:param}, function(e, result) {
		// util.log("    e:"+JSON.stringify(e)+", result:"+JSON.stringify(result))
		if (e) callback(false);
		else callback(true);
	})
}
DSTCRUD.prototype.updateLecture = function (param, callback) {
	if (!param.title) callback(false);
	var _title = param.title;
	// delete param.title;
	delete param._id
	if (!param.url && param.postsparseurl) param.url = param.postsparseurl;
	// delete param.postcount;
	this.lecture_collection.update({title:_title}, {$set:param}, function(e, result) {
		// util.log("    e:"+JSON.stringify(e)+", result:"+JSON.stringify(result))
		if (e) callback(false);
		else callback(true);
	})
}
DSTCRUD.prototype.updatePost = function (param, callback) {
	if (!param.title) callback(false);
	var _title = param.title;
	// delete param.title;
	delete param._id
	this.post_collection.update({title:param.title}, {$set:param}, function(e, result) {
		// util.log("    e:"+JSON.stringify(e)+", result:"+JSON.stringify(result))
		if (e) callback(false);
		else callback(true);
	})
}
DSTCRUD.prototype.updateAllFaculty = function (param, callback) {
	this.faculty_collection.update({}, {$set:param}, {multi: true}, function(e, result) {
		// util.log("    e:"+JSON.stringify(e)+", result:"+JSON.stringify(result))
		if (e) callback(false);
		else callback(true);
	})
}
DSTCRUD.prototype.updateAllLecture = function (param, callback) {
	this.lecture_collection.update({faculty_id:param.faculty_id}, {$set:param}, {multi: true}, function(e, result) {
		// util.log("    e:"+JSON.stringify(e)+", result:"+JSON.stringify(result))
		if (e) callback(false);
		else callback(true);
	})
}
DSTCRUD.prototype.updateAllPost = function (param, callback) {
	this.post_collection.update({lecture_id:param.lecture_id}, {$set:param}, {multi: true}, function(e, result) {
		// util.log("    e:"+JSON.stringify(e)+", result:"+JSON.stringify(result))
		if (e) callback(false);
		else callback(true);
	})
}





DSTCRUD.prototype.callPush = function (param, callback) {
	util.log("callPush param:"+JSON.stringify(param));
	var _this = this;
	// util.log(_this.lecture_collection);
	_this.lecture_collection.findOne({_id:ObjectId(param.lecture_id)}, function(e, result) {
		// util.log("lec result:"+JSON.stringify(result))
  		param.lecture_title = result.title;
  		param.url = result.url;

	  	_this.post_collection.findOne({_id:ObjectId(param.post_id)}, function(e, result) {
	  		param.post_title = result.title;
	  		// util.log("pos result:"+JSON.stringify(result))

	  		var findquery = {lecture_ids:param.lecture_id};
			var updatequery;
			updatequery = {$addToSet:{'push_titles': param.lecture_title+" : "+param.post_title}}
			_this.push_android_collection.update(findquery, updatequery, {multi: true}, function(e, count, upsert) { })
			_this.push_iOS_collection.update(findquery, updatequery, {multi: true}, function(e, count, upsert) { })
			_this.push_iOS_production_collection.update(findquery, updatequery, {multi:true}, function(e, count, upsert) { })

			_this.push_android_collection2.update(findquery, updatequery, {multi: true}, function(e, count, upsert) { })
			_this.push_iOS_collection2.update(findquery, updatequery, {multi: true}, function(e, count, upsert) { })
			_this.push_iOS_production_collection2.update(findquery, updatequery, {multi:true}, function(e, count, upsert) { })



	  		// util.log("call push : "+JSON.stringify(param));
	  		_this.callAndroidPush2(param, function () {
	  			_this.callAndroidPush(param, callback);
	  		});
	  		


	  	})

  	})
  		

}

DSTCRUD.prototype.callAndroidPush = function (param, callback) {
	util.log("=========================================");
	util.log("=========================================");
	util.log("==============CALL PUSH==================");
	
	var _this = this;
	var lecture_id = param.lecture_id;
	this.push_android_collection.find(
  		{lecture_ids:param.lecture_id} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
		util.log("android push - results.length : "+results.length);
  			// [{"_id":"AAAAAAAAAAAAAAAAA4","lecture_ids":["555f5f81c42c7dbb51c7c043"]}]


  		


	  	var message = new gcm.Message({
		    collapseKey: 'demo',
		    delayWhileIdle: true,
		    timeToLive: 3,
		    data: {
		        // key1: '안녕하세요.',
		        // key2: '김동민씨',
		        lecture_id:lecture_id,
		        title:param.lecture_title,
		        desc:param.post_title,
		        url:param.url
		    }
		});

		var server_access_key = 'AIzaSyCdEO6dvF63ujrKa4_qcyRf1YSq1RL0Z3c';//'AIzaSyDd99lQlGjK75wCXHEgMoIONw75Ur_Q8BM';
		var sender = new gcm.Sender(server_access_key);
		var registrationIds = [];

		// var registration_id = push_id;//'APA91bFoVlIovSSwaTWVrBNq72ZIoOZk-wq-lWpVhzef3nhRVpB2kwBNfznKsm3XgLHRcs7z22iqVlDe5kd7EPBzIDJMh90OAEZfpxAAQDK8geazFfngpu5Z2Gq_QuA86s6_YYglLF6f36bTv6uLlJ_x0Fey0OAE5Q';
		// At least one required
		// for (var i=0; i<count; i++) {
		// 	registrationIds.push(registration_id);
		// }
		// util.log("Will Push User : "+JSON.stringify(results))
		util.log("android push 1")
		if (results.length>0) {
			util.log("android push 2")
			for (var i=0; i<results.length; i++) {
				registrationIds.push(results[i]._id);
				util.log("  "+i+" - android pushid push : "+results[i]._id);
				if (i%50==49 || i==results.length-1) {
					util.log("-------------android push---------------");
					util.log("android push length:"+registrationIds.length+", registrationIds:"+JSON.stringify(registrationIds));
					sender.send(message, registrationIds, function (err, result) {
						util.log("android push 3")
					    util.log(result);
					    if (result.results) {
					    	var registrationIds = []
					    	var sender = new gcm.Sender(server_access_key);
					    	for (var i=0; i<result.results.length; i++) {
					    		if (result.results[i].registration_id) {
					    			registrationIds.push(result.results[i].registration_id);
					    		}
					    	}
					    	if (registrationIds.length>0) {
					    		sender.send(message, registrationIds, function (err, result) {
					    			util.log("android push 5")
					    			util.log(result);
					    			callback(0, JSON.stringify(result))
					    		})
					    	} else {
					    		callback(0, JSON.stringify(result))
					    	}
					    } else {
					    	callback(0, JSON.stringify(result))
					    }
					});	
					registrationIds = [];
				}
				
			}
		}
		
		util.log("android push end ::::")


		_this.calliOSProductionPush(param, callback);
				
	})
	
}

DSTCRUD.prototype.calliOSProductionPush = function (param, callback) {
	var options = { 
		gateway : "gateway.push.apple.com",//"gateway.sandbox.push.apple.com", 
		cert: './keys3/cert_production.pem',
		key: './keys3/key_production.pem',
		production: true
	};

	var apnConnection = new apn.Connection(options);


	var note = new apn.Notification();
	note.badge = 1;
	note.sound = 'default'

	// title:param.lecture_title,
 //    desc:param.post_title
	note.alert = param.lecture_title+" : "+param.post_title;//'saltfactory 푸시 테스트';
	note.payload = {
		lecture_id:param.lecture_id,
		title:param.lecture_title,
		desc:param.post_title,
		url:param.url
	};

	// util.log("param.lecture_id:"+param.lecture_id);
	util.log("push ios production 1");
	var _this = this;
	var lecture_id = param.lecture_id;
	this.push_iOS_production_collection.find(
  		{lecture_ids:param.lecture_id} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  		util.log("push ios production 2 results.length : "+results.length);

  		// util.log(JSON.stringify({alert:note.alert})+" - push ids:"+JSON.stringify(results));
  		for (var i=0; i<results.length; i++) {
  			try {
	  			util.log(i+" - push ios production 3 :" + results[i]._id);
		  		var token = results[i]._id;//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
				var myDevice = new apn.Device(token);
				apnConnection.pushNotification(note, myDevice);
  			} catch (e) {

  			}
  			
  		}
  		util.log("push ios production end ::::: ");
		
		_this.calliOSPush(param, callback);
  	});

}
DSTCRUD.prototype.calliOSPush = function (param, callback) {

	var options = { 
		gateway : "gateway.sandbox.push.apple.com", 
		cert: './keys3/cert.pem',
		key: './keys3/key.pem'
	};

	var apnConnection = new apn.Connection(options);


	var note = new apn.Notification();
	note.badge = 1;

	// title:param.lecture_title,
 //    desc:param.post_title
	note.alert = param.lecture_title+" : "+param.post_title;//'saltfactory 푸시 테스트';
	note.payload = {
		lecture_id:param.lecture_id,
		title:param.lecture_title,
		desc:param.post_title,
		url:param.url
	};

	// util.log("param.lecture_id:"+param.lecture_id);
	util.log("push ios 1");
	var _this = this;
	var lecture_id = param.lecture_id;
	this.push_iOS_collection.find(
  		{lecture_ids:param.lecture_id} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  		util.log("push ios 2");

  		// util.log(note.alert+" - push ids:"+JSON.stringify(results));
  		for (var i=0; i<results.length; i++) {
  			try {
	  			util.log(i+" - push ios 3 :" + JSON.stringify(results[i]._id));
		  		var token = results[i]._id;//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
				var myDevice = new apn.Device(token);
				apnConnection.pushNotification(note, myDevice);
			} catch (e) {

  			}
  		}
  		util.log("push ios end ::::: ");
		if (callback) callback();
  	});
}
DSTCRUD.prototype.callAndroidPush2 = function (param, callback) {
	util.log("=========================================");
	util.log("=========================================");
	util.log("==============CALL PUSH2=================");
	var _this = this;
	var lecture_id = param.lecture_id;
	this.push_android_collection2.find(
  		{lecture_ids:param.lecture_id} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
		util.log("android push - results.length:"+JSON.stringify(results.length));
  			// [{"_id":"AAAAAAAAAAAAAAAAA4","lecture_ids":["555f5f81c42c7dbb51c7c043"]}]


  		


	  	var message = new gcm.Message({
		    collapseKey: 'demo',
		    delayWhileIdle: true,
		    timeToLive: 3,
		    data: {
		        // key1: '안녕하세요.',
		        // key2: '김동민씨',
		        lecture_id:lecture_id,
		        title:param.lecture_title,
		        desc:param.post_title,
		        url:param.url
		    }
		});

		var server_access_key = 'AIzaSyCdEO6dvF63ujrKa4_qcyRf1YSq1RL0Z3c';//'AIzaSyDd99lQlGjK75wCXHEgMoIONw75Ur_Q8BM';
		var sender = new gcm.Sender(server_access_key);
		var registrationIds = [];

		// var registration_id = push_id;//'APA91bFoVlIovSSwaTWVrBNq72ZIoOZk-wq-lWpVhzef3nhRVpB2kwBNfznKsm3XgLHRcs7z22iqVlDe5kd7EPBzIDJMh90OAEZfpxAAQDK8geazFfngpu5Z2Gq_QuA86s6_YYglLF6f36bTv6uLlJ_x0Fey0OAE5Q';
		// At least one required
		// for (var i=0; i<count; i++) {
		// 	registrationIds.push(registration_id);
		// }
		// util.log("Will Push User : "+JSON.stringify(results))
		util.log("android push 1")
		if (results.length>0) {
			util.log("android push 2")
			for (var i=0; i<results.length; i++) {
				registrationIds.push(results[i].pushid);
				util.log(i+"android push 3 :"+results[i].pushid);
				if (i%50==49 || i==results.length-1) {
					util.log("-------------android push---------------");
					sender.send(message, registrationIds, function (err, result) {
						util.log("android push 4")
					    util.log(result);
					    if (result.results) {
					    	var registrationIds = []
					    	var sender = new gcm.Sender(server_access_key);
					    	for (var i=0; i<result.results.length; i++) {
					    		if (result.results[i].registration_id) {
					    			registrationIds.push(result.results[i].registration_id);
					    		}
					    	}
					    	if (registrationIds.length>0) {
					    		sender.send(message, registrationIds, function (err, result) {
					    			util.log("android push 5")
					    			util.log(result);
					    			callback(0, JSON.stringify(result))
					    		})
					    	} else {
					    		callback(0, JSON.stringify(result))
					    	}
					    } else {
					    	callback(0, JSON.stringify(result))
					    }
					});	
					registrationIds = [];
				}
				
			}
		}
		
		util.log("android push end ::::")


		_this.calliOSProductionPush2(param, callback);
				
	})
	
}

DSTCRUD.prototype.calliOSProductionPush2 = function (param, callback) {
	var options = { 
		gateway : "gateway.push.apple.com",//"gateway.sandbox.push.apple.com", 
		cert: './keys3/cert_production.pem',
		key: './keys3/key_production.pem',
		production: true
	};

	var apnConnection = new apn.Connection(options);


	var note = new apn.Notification();
	note.badge = 1;
	note.sound = 'default'

	// title:param.lecture_title,
 //    desc:param.post_title
	note.alert = param.lecture_title+" : "+param.post_title;//'saltfactory 푸시 테스트';
	note.payload = {
		lecture_id:param.lecture_id,
		title:param.lecture_title,
		desc:param.post_title,
		url:param.url
	};

	// util.log("param.lecture_id:"+param.lecture_id);
	util.log("push ios production 1");
	var _this = this;
	var lecture_id = param.lecture_id;
	this.push_iOS_production_collection2.find(
  		{lecture_ids:param.lecture_id} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  		util.log("push ios production 2 : "+results.length);

  		// util.log(JSON.stringify({alert:note.alert})+" - push ids:"+JSON.stringify(results));
  		for (var i=0; i<results.length; i++) {
  			try {
	  			util.log(i+" - push ios production 3 :"+results[i]._id);
		  		var token = results[i].pushid;//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
				var myDevice = new apn.Device(token);
				apnConnection.pushNotification(note, myDevice);
  			} catch (e) {

  			}
  			
  		}
  		util.log("push ios production end ::::: ");
		
		_this.calliOSPush2(param, callback);
  	});

}
DSTCRUD.prototype.calliOSPush2 = function (param, callback) {

	var options = { 
		gateway : "gateway.sandbox.push.apple.com", 
		cert: './keys3/cert.pem',
		key: './keys3/key.pem'
	};

	var apnConnection = new apn.Connection(options);


	var note = new apn.Notification();
	note.badge = 1;

	// title:param.lecture_title,
 //    desc:param.post_title
	note.alert = param.lecture_title+" : "+param.post_title;//'saltfactory 푸시 테스트';
	note.payload = {
		lecture_id:param.lecture_id,
		title:param.lecture_title,
		desc:param.post_title,
		url:param.url
	};

	// util.log("param.lecture_id:"+param.lecture_id);
	util.log("push ios 1");
	var _this = this;
	var lecture_id = param.lecture_id;
	this.push_iOS_collection2.find(
  		{lecture_ids:param.lecture_id} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  		util.log("push ios 2 results.length : " + results.length);

  		// util.log(note.alert+" - push ids:"+JSON.stringify(results));
  		for (var i=0; i<results.length; i++) {
  			try {
	  			util.log(i+" - push ios 3 : " + JSON.stringify(results[i]._id));
		  		var token = results[i].pushid;//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
				var myDevice = new apn.Device(token);
				apnConnection.pushNotification(note, myDevice);
			} catch (e) {

  			}
  		}
  		util.log("push ios end ::::: ");
		if (callback) callback();
  	});
}



DSTCRUD.prototype.scheduleLog = function (param, callback) {
	this.scheduleLog_collection.insert(param, {}, function(e, results){})
}
DSTCRUD.prototype.calliOSDeveloperPush = function (param, callback) {
	var options = { 
		gateway : "gateway.sandbox.push.apple.com", //"gateway.push.apple.com",//
		cert: './keys_developer/cert.pem',
		key: './keys_developer/key.pem',
		// production: true
	};

	var apnConnection = new apn.Connection(options);



	var note = new apn.Notification();






	var _this = this;
	this.developer_push_collection.find(
  		{} , 
  		{/*_id:1, name:1, order:1, status:1, imgurl:1, lecturecount:1*/} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
		if (e) {return;}

		if (results && typeof(results)==typeof([]) && results.length>0) {
			
			note.badge = results[0].badge;

			note.alert = param.title+" :::: "+param.nowtime;
			note.payload = {'message': '안녕하세요'};


			var token = results[0]._id;//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
			var myDevice = new apn.Device(token);
			apnConnection.pushNotification(note, myDevice);


			var findquery = {_id:param.pushid};
			var updatequery = {$set:{badge:results[0].badge+1}};
			_this.developer_push_collection.update(findquery, updatequery, {upsert:true}, function(e, count, upsert) {})	
		}
		
		
	})



	
}













// ======================================================================= //
// ======================================================================= //
// ======================================================================= //
// ============ 서버단에서 돌아가는 자동 파싱에서는 데이터를 삭제할 수 없음 ============== //
// ======================================================================= //
// ======================================================================= //
// ======================================================================= //

/*
// Delete
DSTCRUD.prototype.deleteFaculty = function (param, callback) {
	var id = param._id;

	var _this = this
	_this.faculty_collection.findOne({_id:id}, function(e, result) {
		if (e) {callback(false); return;}
		faculty = result;

		_this.deleteFacultyFile(faculty, function() {

			_this.lecture_collection.find({faculty_id:id}, {}).toArray(function(e, results){
				if (e) {callback(false); return;}

				_this.faculty_collection.removeById(id, function(e){
					if (e) {callback(false); return;}

					_this.deleteLectureRecursion(results, function(success) {
						if (!success) {callback(false); return;}
						callback(true)
					})
				})			
			})	
		})
	})

	// _this.faculty_collection.removeById(param._id, function(e){
	// 	if (e) callback(false);
	// 	else callback(true);
	// })
}
DSTCRUD.prototype.deleteLecture = function (param, callback) {
	var id = param._id;

	var _this = this
	if (typeof(id)==typeof({})) id = id.toString()

	_this.lecture_collection.findOne({_id:id}, function(e, result) {
		if (e) {callback(false); return;}
		lecture = result;

		_this.deleteLectureFile(lecture, function() {

			// find all post results in lecture
			_this.post_collection.find({lecture_id:id}, {}).toArray(function(e, results){
				if (e) {callback(false); return;}

				// remove lecture at id
				_this.lecture_collection.removeById(id, function(e){
					if (e) {callback(false); return;}

					// call remove post recursion with post results
					_this.deletePostRecursion(results, function(success) {
						if (!success) callback(false)
						callback(true)
					})
				})		
			})
		})
	})	

	// _this.lecture_collection.removeById(param._id, function(e){
	// 	if (e) callback(false);
	// 	else callback(true);
	// })
}
DSTCRUD.prototype.deletePost = function (param, callback) {
	var id = param._id;
	_this.post_collection.removeById(id, function(e){
		if (e) {callback(false); return;}
		callback(true);
	})
}


DSTCRUD.prototype.deleteLectureRecursion = function(ids, callback) {
	// util.log('__DST.deleteLectureRecursion:'+JSON.stringify(ids))
	var _this = this

	if (!ids || ids.length==0) {
		callback(true)
		return
	} else {
		var id = ids[0]._id
		this.deleteLecture(id, function(success) {
			if (!success) {callback(false); return;}
			ids.splice(0,1)
			_this.deleteLectureRecursion(ids, callback)
		})
	}
}
DSTCRUD.prototype.deletePostRecursion = function(ids, callback) {
	var _this = this

	if (!ids || ids.length==0) {
		callback(true)
		return
	} else {
		var idarray = []
		for (var i=0; i<ids.length; i++) {
			if (typeof(ids[i]._id)==typeof('')) {
				if (ids[i]._id.length==24) idarray.push(ObjectId(ids[i]._id))
			} else if (typeof(ids[i]._id)==typeof({})) {
				idarray.push(ids[i]._id)
			}
			
			// idarray.push(ids[i]._id)
		}
		this.post_collection.remove({'_id': {$in:idarray}}, function(e) {
			if (e) {callback(false); return;}
			else {
				callback(true)	
				return
			}
		})		
	}

}


// 파일 지우기
DSTCRUD.prototype.deleteFacultyFile = function (faculty, callback) {
	// faculty.lecturesparsefilepath 파일 삭제
	var lecturesparsefilepath = faculty.lecturesparsefilepath;
	var postsparsefilepath = faculty.postsparsefilepath;
	if (lecturesparsefilepath 
		&& typeof(lecturesparsefilepath)==typeof("") 
		&& lecturesparsefilepath.length>4) {
		if (lecturesparsefilepath.substring(lecturesparsefilepath.length-3. lecturesparsefilepath.length)!=".js")
			lecturesparsefilepath += '.js';
		fs.unlink(lecturesparsefilepath, function (err) {
		  	

		  	// faculty.postsparsefilepath 파일 삭제
			if (postsparsefilepath 
				&& typeof(postsparsefilepath)==typeof("") 
				&& postsparsefilepath.length>4) {
				if (postsparsefilepath.substring(postsparsefilepath.length-3. postsparsefilepath.length)!=".js")
					postsparsefilepath += '.js';
				fs.unlink(postsparsefilepath, function (err) {

					callback();
				});
			}
		});
	}
}

DSTCRUD.prototype.deleteLectureFile = function (lecture, callback) {
	// faculty.lecturesparsefilepath 파일 삭제
	// var lecturesparsefilepath = lecture.lecturesparsefilepath;
	var postsparsefilepath = lecture.postsparsefilepath;
	// if (lecturesparsefilepath 
	// 	&& typeof(lecturesparsefilepath)==typeof("") 
	// 	&& lecturesparsefilepath.length>4) {
	// 	if (lecturesparsefilepath.substring(lecturesparsefilepath.length-3. lecturesparsefilepath.length)!=".js")
	// 		lecturesparsefilepath += '.js';
	// 	fs.unlink(lecturesparsefilepath, function (err) {
		  	

		  	// faculty.postsparsefilepath 파일 삭제
			if (postsparsefilepath 
				&& typeof(postsparsefilepath)==typeof("") 
				&& postsparsefilepath.length>4) {
				if (postsparsefilepath.substring(postsparsefilepath.length-3. postsparsefilepath.length)!=".js")
					postsparsefilepath += '.js';
				fs.unlink(postsparsefilepath, function (err) {

					callback();
				});
			}
	// 	});
	// }
}




*/





// exports.DST = DST;
exports.DSTCRUD = DSTCRUD;