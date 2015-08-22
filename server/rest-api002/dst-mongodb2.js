var mongoskin = require('mongoskin')
var ObjectId = mongoskin.ObjectID;
var fs = require('fs');


var gcm = require('node-gcm');
var message = new gcm.Message();

var apn = require('apn');



var success_error_message = 'success'

var dberrobj = {
	errcode:500,
	errmsg:"DB Error"
}


DST = function(host, port) {
	this.db = mongoskin.db('mongodb://@'+host+':'+port+'/dst003', {safe:true})
	this.faculty_collection = this.db.collection('faculty');
	this.lecture_collection = this.db.collection('lecture');
	this.post_collection = this.db.collection('post');

	this.notice_collection = this.db.collection('notice');

	this.push_android_collection = this.db.collection('push_android_lecture');
	this.push_iOS_collection = this.db.collection('push_iOS_lecture');
	this.push_iOS_production_collection = this.db.collection('push_iOS_production_lecture');

	this.push_android_collection2 = this.db.collection('push_android_lecture2');
	this.push_iOS_collection2 = this.db.collection('push_iOS_lecture2');
	this.push_iOS_production_collection2 = this.db.collection('push_iOS_production_lecture2');

	this.developer_push_collection = this.db.collection('developer_push');
}





// ================================================
// ================= 파라미터 관리 ===================
// ================================================

// 필수 파라미터 에러
DST.prototype.checkRequiredParamHandler = function(targetparam, requireparam, callback) {
	var _this = this

	if (typeof targetparam != 'object') {
		callback(601,"parameter is not object")
		return 601
	}

	var isError = {};
	for (var key in requireparam) {
		// console.log(typeof targetparam[key] + ", " + typeof requireparam[key])
		// console.log(targetparam[key] + ", " + requireparam[key])
		if (typeof targetparam[key] != typeof requireparam[key]) {
			isError[key] = typeof(targetparam[key]);
		}
	}
	if (Object.keys(isError).length>0) {
		callback(601,"required parameter is missing : "+JSON.stringify(isError))
		return 601
	}

	return 0
}

//
DST.prototype.callbackerror = function(e, callback) {
	callback(998, e)
}

// fieldarray에 들어있는 필드만 골라내기
DST.prototype.paramCheck = function(param, fieldarray) {

	var newparam = {}
	if (!fieldarray) return newparam;
	for (var i=0; i<fieldarray.length; i++) {
		// console.log("fieldarray[i]:"+fieldarray[i])
		if (param[fieldarray[i]]) newparam[fieldarray[i]] = param[fieldarray[i]]
	}
	return newparam;
}




// // 로그인
// DST.prototype.login = function(param, callback) {
// 	callback(0,success_error_message,{
// 		token:""
// 	})
// }


// ================================================
// ================================================
// =============== DB 접근 함수 관리 =================
// ================================================
// ================================================

DST.prototype.addfaculty = function(param, callback) {
	var _this = this

	if (this.checkRequiredParamHandler(param, {
			name:""
		}, callback)!=0) { return }
	param = this.paramCheck(param, ['name', 'order', 'status', 'imgurl', 'url'])


	var insertobj = {name:param.name}
	if (param.order) {(insertobj.order = parseInt(param.order))} 
	else {(insertobj.order=-1)}
	if (param.status&&(param.status=='e'||param.status=='w'||param.status=='d')) {
		(insertobj.status = param.status)} 
	else {(insertobj.status='d')}
	if (param.imgurl) {(insertobj.imgurl = param.imgurl)} 
	else {(insertobj.imgurl='')}

	insertobj.lecturecount = 0
	insertobj.filepath = ""
	// insertobj.lecture_ids = []
	insertobj.createdate = new Date();
	insertobj.updatedate = new Date();


	this.faculty_collection.insert(insertobj, {}, function(e, results){
	    if (e) {callback(500, e); return;}
	    callback(0, success_error_message, ((results.length==1)?results[0]:results))
  	})
}



DST.prototype.facultylist = function(param, callback) {
	var _this = this

	var findparam = {}
	if (param.status) {
		if (param.status!='e' && param.status!='w' && param.status!='d') {
			callback(601,'"status" parameter is only allow "e", "w", "d"')
			return
		}
		findparam.status = param.status
	}



  	this.faculty_collection.find(
  		findparam , 
  		{/*_id:1, name:1, order:1, status:1, imgurl:1, lecturecount:1*/} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
		if (e) {callback(500, e); return;}

		callback(0,success_error_message,{
			list:results
		})
	})
}


DST.prototype.updatedeletefacultys = function(param, callback) {
	var _this = this
	// console.log("__updatedeletefacultys:"+JSON.stringify(param))

	if (this.checkRequiredParamHandler(param, {
			// facultys:[],
			// order_ids:[]
			// delete_ids:[]
		}, callback)!=0) { return }
	if (param.facultys) {
		for (var i=0; i<param.facultys.length; i++) {
			if (this.checkRequiredParamHandler(param.facultys[i], {
					_id:""
				}, callback)!=0) { return }
			param.facultys[i] = this.paramCheck(param.facultys[i], ['_id', 'name', 'status', 'imgurl'])
		}
	}
	
	if (param.order_ids) {
		for (var i=0; i<param.order_ids.length; i++) {
			if (this.checkRequiredParamHandler(param.order_ids[i], {
					_id:""
				}, callback)!=0) { return }
		}
	}
	if (param.delete_ids) {
		for (var i=0; i<param.delete_ids.length; i++) {
			if (this.checkRequiredParamHandler(param.delete_ids[i], {
					_id:""
				}, callback)!=0) { return }
		}
	}
		




	
	


	var order_ids = param.order_ids;
	var order_count = (typeof(order_ids)==typeof([]))?order_ids.length:0

	var delete_ids = param.delete_ids;

	// console.log("___________________________")
	// update 교수
	this.updateFaculty(param.facultys,function(success){
		// console.log('::end update faculty:'+success)
		if (!success) {callback(500, 'DB Error : fail update faculty');return;} 	
		// 모든 order -1로 세팅
		_this.faculty_collection.update({}, {'$set':{order:-1}}, function(e, result){
			// console.log('::end reset faculty order:'+result)
			if (e) { callback(500, 'DB Error : fail init faculty order '); return; } 	
			// 교수 order 업데이트
			_this.updateFacultyOrder(order_ids, order_count, function(success) {
				// console.log('::end update faculty order:'+success)
				if (!success) {callback(500, 'DB Error : fail update faculty order '); return;} 	
				// delete 
				_this.deleteFacultyRecursion(delete_ids, function(success) {
					// console.log('::end delete faculty:'+success)
					if (!success) {callback(500, 'DB Error : fail delete faculty');return;} 
					callback(0, success_error_message)
				})
			})	
		})
	})





	// if (param.status) {
	// 	if (param.status!='e' && param.status!='w' && param.status!='d') {
	// 		callback(601,'"status" parameter is only allow "e", "w", "d"')
	// 		return
	// 	}
	// 	updateparam.status = param.status
	// }
}
DST.prototype.updateFaculty = function(facultys, callback) {
	// console.log('__DST.updateFaculty:'+JSON.stringify(facultys))
	var _this = this
	
	if (!facultys || facultys.length==0) {
		callback(true)
		return
	} else {

		var id = facultys[0]._id
		var willupdate = facultys[0]
		delete willupdate._id
		delete willupdate.lecturecount
		// console.log('update id : '+id+'    '+JSON.stringify(willupdate))
		this.faculty_collection.updateById(id, {$set:willupdate}, function(e, result) {
			// console.log("    e:"+JSON.stringify(e)+", result:"+JSON.stringify(result))
			if (result!==1) {callback(false); return;}
			else {
				facultys.splice(0,1)
				_this.updateFaculty(facultys, callback)
			}

		})
	}

}
DST.prototype.updateFacultyOrder = function(ids, _order, callback) {
	// console.log('__DST.updateFacultyOrder')
	var _this = this
	
	if (!ids || ids.length==0) {
		callback(true)
		return
	} else {
		var id = ids[0]._id
		// console.log('update order .. id : '+id)
		this.faculty_collection.updateById(id, {$set:{order:_order}}, function(e, result) {
			if (result!==1) {callback(false); return;}
			else {
				ids.splice(0,1)
				_this.updateFacultyOrder(ids, --_order, callback)
			}

		})
	}
}
DST.prototype.deleteFacultyRecursion = function(ids, callback) {
	// console.log('__DST.deleteFacultyRecursion:'+JSON.stringify(ids))

	var _this = this
	if (!ids || ids.length==0) {
		callback(true)
		return
	} else {
		var id = ids[0]._id
		this.deleteFaculty(id, function(success) {
			if (!success) callback(false)
			else {
				ids.splice(0,1)
				_this.deleteFacultyRecursion(ids, callback)
			}
		})
	}
}
DST.prototype.deleteFaculty = function(id, callback) {
	var _this = this
	if (typeof(id)==typeof("")) id = ObjectId(id);
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

}
DST.prototype.deleteFacultyFile = function (faculty, callback) {
	// faculty.lecturesparsefilepath 파일 삭제
	var lecturesparsefilepath = faculty.lecturesparsefilepath;
	var postsparsefilepath = faculty.postsparsefilepath;
	
	if (lecturesparsefilepath 
		&& typeof(lecturesparsefilepath)==typeof("") 
		&& lecturesparsefilepath.length>4) {
		// var subpath = lecturesparsefilepath.substring(lecturesparsefilepath.length-3. lecturesparsefilepath.length);
		// if (subpath!=".js") lecturesparsefilepath += '.js';
		fs.unlink(lecturesparsefilepath, function (err) {
		  	

		  	// faculty.postsparsefilepath 파일 삭제
			if (postsparsefilepath 
				&& typeof(postsparsefilepath)==typeof("") 
				&& postsparsefilepath.length>4) {
				// var subpath = postsparsefilepath.substring(postsparsefilepath.length-3. postsparsefilepath.length);
				// if (subpath!=".js") postsparsefilepath += '.js';
				fs.unlink(postsparsefilepath, function (err) {

					callback();
				});
			} {callback();}
		});
	} else {callback();}
}





DST.prototype.addlecture = function(param, callback) {
	var _this = this

	if (this.checkRequiredParamHandler(param, {
			faculty_id:"",
			title:""
		}, callback)!=0) { return }
	param = this.paramCheck(param, ['faculty_id', 'title', 'order', 'status', 'url'])

	// console.log("param:"+JSON.stringify(param))
	var insertobj = {
		title:param.title,
		faculty_id:param.faculty_id
	}
	if (param.order) {(insertobj.order = parseInt(param.order))} 
	else {(insertobj.order=-1)}
	if (param.status&&(param.status=='e'||param.status=='w'||param.status=='d')) {
		(insertobj.status = param.status)} 
	else {(insertobj.status='d')}
	
	insertobj.postcount = 0
	insertobj.filepath = ""
	// insertobj.post_ids = []
	insertobj.createdate = new Date();
	insertobj.updatedate = new Date();


	var _this = this

	this.lecture_collection.insert(insertobj, {}, function(e, results){
	    if (results.length!=1 || e) {callback(500, e); return;}
	    _this.lecture_collection.count({faculty_id:param.faculty_id}, function(e, count) {
			if (e) {callback(500, e); return;}

			_this.faculty_collection.updateById(param.faculty_id, {$set:{lecturecount:count}}, function(e, count) {
				if (e) {callback(500, e); return;}
				callback(0,success_error_message,results[0])
			})
		})
	})
}


DST.prototype.lecturelist = function(param, callback) {
	// console.log('lecturelist')
	var _this = this
	// if (this.checkRequiredParamHandler(param, {
	// 		faculty_id:""
	// 	}, callback)!=0) { return }

	var findparam = {}
	if (param.faculty_id) findparam.faculty_id = param.faculty_id
	var facultyfindparam = {_id:"000000000000"};
	if (param.faculty_id) facultyfindparam._id = ObjectId(param.faculty_id)

	if (param.status) {
		param.status = param.status.toLowerCase()
		if (param.status!='e' && param.status!='w' && param.status!='d') {
			callback(601,'"status" parameter is only allow "e", "w", "d"')
			return
		}
		findparam.status = param.status
	}


	_this.faculty_collection.findOne(facultyfindparam, function(e, result) {
		if (e) {result = {}}
		if (result==null) {result = {}}

		// console.log("findparam:"+JSON.stringify(findparam))
	  	_this.lecture_collection.find(
	  		findparam , 
	  		{/*_id:1, title:1, order:1, status:1, postcount:1*/} ,
	  		{sort: [['_id',-1]]}).toArray(function(e, results){
			if (e) {callback(500, e); return;}

			// for (var i=0; i<results.length; i++) {
			// 	results[i].postcount = results[i].post_ids.length;
			// 	delete results[i].post_ids;
			// }

			// console.log("results:"+JSON.stringify(results))
			result.list = results;
			callback(0,success_error_message, result)
		})
	})
		

	
}


DST.prototype.updatedeletelectures = function(param, callback) {
	var _this = this
	// console.log("__updatedeletelectures:"+JSON.stringify(param))

	if (this.checkRequiredParamHandler(param, {
			faculty_id:""
			// lectures:[],
			// order_ids:[]
			// delete_ids:[]
		}, callback)!=0) { return }
	if (param.lectures) {
		for (var i=0; i<param.lectures.length; i++) {
			if (this.checkRequiredParamHandler(param.lectures[i], {
					_id:""
				}, callback)!=0) { return }
			param.lectures[i] = this.paramCheck(param.lectures[i], ['_id', 'title', 'status'])
		}
	}
	
	if (param.order_ids) {
		for (var i=0; i<param.order_ids.length; i++) {
			if (this.checkRequiredParamHandler(param.order_ids[i], {
					_id:""
				}, callback)!=0) { return }
		}
	}
	if (param.delete_ids) {
		for (var i=0; i<param.delete_ids.length; i++) {
			if (this.checkRequiredParamHandler(param.delete_ids[i], {
					_id:""
				}, callback)!=0) { return }
		}
	}
		




	
	


	var order_ids = param.order_ids;
	var order_count = (typeof(order_ids)==typeof([]))?order_ids.length:0

	var delete_ids = param.delete_ids;

	// console.log("___________________________")
	// update 강의
	this.updateLecture(param.lectures,function(success){
		// console.log('::end update lecture:'+success)
		if (!success) {callback(500, 'DB Error : fail update lecture'); return;} 
		// 모든 order -1로 세팅
		_this.lecture_collection.update({}, {'$set':{order:-1}}, function(e, result){
			console.log('::end reset lecture order:'+result)
			if (e) {callback(500, 'DB Error : fail init lecture order '); return;} 	
			// 강의 order 업데이트
			_this.updateLectureOrder(order_ids, order_count, function(success) {
				console.log('::end update lecture order:'+success)
				if (!success) {callback(500, 'DB Error : fail update lecture order ');return;} 	
				// delete 
				_this.deleteLectureRecursion(delete_ids, function(success) {
					console.log('::end delete lecture:'+success)
					if (!success) {callback(500, 'DB Error : fail delete lecture');return;} 	
					_this.updateLectureCount(param.faculty_id, function(success) {
						console.log('::end update lecture count:'+success)
						if (!success) {callback(500, 'DB Error : fail update lecture count at faculty'); return;} 
						callback(0, success_error_message)
					})
				})
			})	
		})
	})


	// if (param.status) {
	// 	if (param.status!='e' && param.status!='w' && param.status!='d') {
	// 		callback(601,'"status" parameter is only allow "e", "w", "d"')
	// 		return
	// 	}
	// 	updateparam.status = param.status
	// }
}
DST.prototype.updateLecture = function(lectures, callback) {
	// console.log('__DST.updateLecture')
	var _this = this
	
	if (!lectures || lectures.length==0) {
		callback(true)
		return
	} else {
		var id = lectures[0]._id
		var willupdate = lectures[0]
		delete willupdate._id
		delete willupdate.postcount
		// console.log('update id : '+id+'    '+JSON.stringify(willupdate))
		this.lecture_collection.updateById(id, {$set:willupdate}, function(e, result) {
			// console.log("    e:"+JSON.stringify(e)+", result:"+JSON.stringify(result))
			if (result!==1) {callback(false); return;}
			else {
				lectures.splice(0,1)
				_this.updateLecture(lectures, callback)
			}

		})
	}
}
DST.prototype.updateLectureOrder = function(ids, _order, callback) {
	// console.log('__DST.updateLectureOrder')
	var _this = this
	
	if (!ids || ids.length==0) {
		callback(true)
		return
	} else {
		var id = ids[0]._id
		// console.log('update order .. id : '+id)
		this.lecture_collection.updateById(id, {$set:{order:_order}}, function(e, result) {
			// console.log("    e:"+JSON.stringify(e)+", result:"+JSON.stringify(result))
			if (result!==1) {callback(false); return;}
			else {
				ids.splice(0,1)
				_this.updateLectureOrder(ids, --_order, callback)
			}

		})
	}
}
DST.prototype.deleteLectureRecursion = function(ids, callback) {
	// console.log('__DST.deleteLectureRecursion:'+JSON.stringify(ids))
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

DST.prototype.deleteLecture = function(id, callback) {
	var _this = this
	// if (typeof(id)==typeof({})) id = id.toString()
	if (typeof(id)==typeof("")) id = ObjectId(id);

	_this.lecture_collection.findOne({_id:id}, function(e, result) {
		if (e) {callback(false); return;}
		lecture = result;
		// console.log(":::::::1")
		_this.deleteLectureFile(lecture, function() {
			// console.log(":::::::2")
			// find all post results in lecture
			_this.post_collection.find({lecture_id:id}, {}).toArray(function(e, results){
				if (e) {callback(false); return;}
				// console.log(":::::::3")
				// remove lecture at id
				_this.lecture_collection.removeById(id, function(e){
					if (e) {callback(false); return;}
					// console.log(":::::::4")
					// call remove post recursion with post results
					_this.deletePostRecursion(results, function(success) {
						if (!success) callback(false)
							// console.log(":::::::5")
						callback(true)
					})
				})		
			})
		})
	})	
}


DST.prototype.deleteLectureFile = function (lecture, callback) {
	// faculty.lecturesparsefilepath 파일 삭제
	// var lecturesparsefilepath = lecture.lecturesparsefilepath;
	console.log("lecture:"+JSON.stringify(lecture))
	var postsparsefilepath = lecture.postsparsefilepath;
	// console.log("       :::::1")
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
				// console.log("       :::::2")
				// var subpath = postsparsefilepath.substring(postsparsefilepath.length-3. postsparsefilepath.length);
				// if (subpath!=".js") postsparsefilepath += '.js';
				fs.unlink(postsparsefilepath, function (err) {
					// console.log("       :::::3")
					callback();
				});
			} else {callback();}
	// 	});
	// }
}


DST.prototype.updateLectureCount = function(_id, callback) {
	var _this = this
	this.lecture_collection.count({faculty_id:_id}, function(e, count) {
		if (e) {callback(false); return;}
		_this.faculty_collection.updateById(_id, {$set:{lecturecount:count}}, function(e, count) {
			if (e) {callback(false); return;}
			callback(true)
		})
	})
}





// 완료
DST.prototype.addpost = function(param, callback) {
	var _this = this

	if (this.checkRequiredParamHandler(param, {
			lecture_id:"",
			title:""
		}, callback)!=0) { return }
	param = this.paramCheck(param, ['lecture_id', 'title', 'order', 'status', 'url'])

	var insertobj = {
		title:param.title,
		lecture_id:param.lecture_id
	}
	if (param.order) {(insertobj.order = parseInt(param.order))} 
	else {(insertobj.order=-1)}
	if (param.status&&(param.status=='e'||param.status=='w'||param.status=='d')) {
		(insertobj.status = param.status)} 
	else {(insertobj.status='d')}
	
	insertobj.createdate = new Date();
	insertobj.updatedate = new Date();

	var _this = this

	this.post_collection.insert(insertobj, {}, function(e, results){
	    if (results.length!=1 || e) {callback(500, e); return;}
	    _this.post_collection.count({lecture_id:param.lecture_id}, function(e, count) {
			if (e) {callback(500, e); return;}

			_this.lecture_collection.updateById(param.lecture_id, {$set:{postcount:count}}, function(e, count) {
				if (e) {callback(500, e); return;}
				callback(0,success_error_message,results[0])
			})
		})
	    

		
	})
}


// 완료
DST.prototype.postlist = function(param, callback) {
	var _this = this
	// if (this.checkRequiredParamHandler(param, {
	// 		lecture_id:""
	// 	}, callback)!=0) { return }

	var findparam = {}
	if (param.lecture_id) findparam.lecture_id = param.lecture_id
	var lecturefindparam = {_id:"000000000000"};
	if (param.lecture_id) lecturefindparam._id = ObjectId(param.lecture_id)

	if (param.status) {
		param.status = param.status.toLowerCase()
		if (param.status!='e' && param.status!='w' && param.status!='d') {
			callback(601,'"status" parameter is only allow "e", "w", "d"')
			return
		}
		findparam.status = param.status
	}


	_this.lecture_collection.findOne(lecturefindparam, function(e, result) {
		if (e) {result = {}}
		if (result==null) {result = {}}

		_this.post_collection.find(
	  		findparam , 
	  		{_id:1, title:1, order:1, status:1, createdate:1, updatedate:1, url:1} ,
	  		{sort: [['_id',-1]]}).toArray(function(e, results){
			if (e) {callback(500, e); return;}
			else {
				result.list = results;
				callback(0,success_error_message,result)
			}
		})	
	})
  	
}

DST.prototype.updatedeleteposts = function(param, callback) {
	var _this = this
	// console.log("updatedeleteposts:"+JSON.stringify(param))

	if (this.checkRequiredParamHandler(param, {
			lecture_id:""
			// posts:[],
			// order_ids:[]
			// delete_ids:[]
		}, callback)!=0) { return }
	if (param.posts) {
		for (var i=0; i<param.posts.length; i++) {
			if (this.checkRequiredParamHandler(param.posts[i], {
					_id:""
				}, callback)!=0) { return }
			param.posts[i] = this.paramCheck(param.posts[i], ['_id', 'title', 'status'])
		}
	}
	
	if (param.order_ids) {
		for (var i=0; i<param.order_ids.length; i++) {
			if (this.checkRequiredParamHandler(param.order_ids[i], {
					_id:""
				}, callback)!=0) { return }
		}
	}
	if (param.delete_ids) {
		for (var i=0; i<param.delete_ids.length; i++) {
			if (this.checkRequiredParamHandler(param.delete_ids[i], {
					_id:""
				}, callback)!=0) { return }
		}
	}
		


	


	var order_ids = param.order_ids;
	var order_count = (typeof(order_ids)==typeof([]))?order_ids.length:0

	var delete_ids = param.delete_ids;



	// console.log("___________________________")
	// update 강의
	this.updatePost(param.posts,function(success){
		// console.log('::end update post:'+success)
		if (!success) {callback(500, 'DB Error : fail update post'); return;} 	
		// 모든 order -1로 세팅
		_this.post_collection.update({lecture_id:param.lecture_id}, {'$set':{order:-1}}, function(e, result){
			// console.log('::end reset post order:'+result)
			if (e) {callback(500, 'DB Error : fail init post order ');return;} 
			// 강의 order 업데이트
			_this.updatePostOrder(order_ids, order_count, function(success) {
				// console.log('::end update post order:'+success)
				if (!success) {callback(500, 'DB Error : fail update post order '); return;} 	
				// delete 
				_this.deletePostRecursion(delete_ids, function(success) {
					// console.log('::end delete post:'+success)
					if (!success) {callback(500, 'DB Error : fail delete post'); return;} 	
					_this.updatePostCount(param.lecture_id, function(success) {
						if (!success) {callback(500, 'DB Error : fail update post count at lecture');return;} 
						callback(0, success_error_message)
					})
				})
			})
		})
	})
}


DST.prototype.updatePost = function(posts, callback) {
	// console.log('__DST.updatePost')
	var _this = this
	
	if (!posts || posts.length==0) {
		callback(true)
		return
	} else {
		var id = posts[0]._id
		var willupdate = posts[0]
		delete willupdate._id
		this.post_collection.updateById(id, {$set:willupdate}, function(e, result) {
			if (result!==1) {callback(false); return;}
			else {
				posts.splice(0,1)
				_this.updatePost(posts, callback)
			}

		})
	}
}

DST.prototype.updatePostOrder = function(ids, _order, callback) {
	// console.log('__DST.updatePostOrder')
	var _this = this
	
	if (!ids || ids.length==0) {
		callback(true)
		return
	} else {
		var id = ids[0]._id
		// console.log('update order .. id : '+id)
		this.post_collection.updateById(id, {$set:{order:_order}}, function(e, count) {
			if (e) {callback(false); return;}
			else {
				ids.splice(0,1)
				_this.updatePostOrder(ids, --_order, callback)
			}

		})
	}
}

DST.prototype.deletePostRecursion = function(ids, callback) {
	// console.log('__deletePost:'+JSON.stringify(ids))
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

DST.prototype.updatePostCount = function(_id, callback) {
	var _this = this
	this.post_collection.count({lecture_id:_id}, function(e, count) {
		if (e) {callback(false); return;}
		_this.lecture_collection.updateById(_id, {$set:{postcount:count}}, function(e, count) {
			if (e) {callback(false); return;}
			callback(true)
		})
	})
}





DST.prototype.pushnotice = function(param, callback) {
	var _this = this

	if (this.checkRequiredParamHandler(param, {
			title:"",
			description:""
		}, callback)!=0) { return }
	param = this.paramCheck(param, ['title', 'description'])


	var insertobj = {
		title:param.title, 
		description:param.description
	}
	// if (param.order) {(insertobj.order = parseInt(param.order))} 
	// else {(insertobj.order=-1)}
	// if (param.status&&(param.status=='e'||param.status=='w'||param.status=='d')) {
	// 	(insertobj.status = param.status)} 
	// else {(insertobj.status='d')}
	// if (param.imgurl) {(insertobj.imgurl = param.imgurl)} 
	// else {(insertobj.imgurl='')}

	// insertobj.lecturecount = 0
	// insertobj.filepath = ""
	// insertobj.lecture_ids = []
	insertobj.createdate = new Date();
	insertobj.updatedate = new Date();

	this.notice_collection.insert(insertobj, {}, function(e, results){
	    if (e) {callback(500, e); return;}

	    _this.callPush(param, function () {
	    	_this.callPush2(param, function () {
	    		callback(0, success_error_message, ((results.length==1)?results[0]:results))
	    	})
	    });
	    
  	})
}
DST.prototype.noticelist = function(param, callback) {
	var _this = this

	var findparam = {}


  	this.notice_collection.find(
  		findparam , 
  		{/*_id:1, name:1, order:1, status:1, imgurl:1, lecturecount:1*/} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
		if (e) {callback(500, e); return;}

		callback(0,success_error_message,{
			list:results
		})
	})
}
DST.prototype.deletenotice = function(param, callback) {
	if (this.checkRequiredParamHandler(param, {
			_id:""
		}, callback)!=0) { return }

		
	this.notice_collection.removeById(param._id, function(e, count){
		if (e) {callback(500, e); return;}

		callback(0, success_error_message, {count:count});
    })
}

DST.prototype.pushhistorylist = function(param, callback) {
	var _this = this
	console.log("______pushhistorylist");
	if (this.checkRequiredParamHandler(param, {
			pushid:"",
			platform:""
		}, callback)!=0) { return }

	var platform = param.platform.toLowerCase()
	if (platform!="android" && platform!="ios" && platform!="ios_production") {callback(601,"required parameter 'platform' is only 'iOS','android' and 'iOS_production'");return;}

	param = this.paramCheck(param, ['pushid'])


	var push_collection;
	if (platform=='android') push_collection = this.push_android_collection;
	else if (platform=='ios') push_collection = this.push_iOS_collection;
	else if (platform=='ios_production') push_collection = this.push_iOS_production_collection;


	var findquery = {_id:param.pushid};


	push_collection.find(
  		findquery , 
  		{/*_id:1, name:1, order:1, status:1, imgurl:1, lecturecount:1*/} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
		if (e) {callback(500, e); return;}

		console.log("result:"+JSON.stringify(results))
		var push_titles = [];
		if (results && results.length>0) push_titles = results[0].push_titles;
		console.log("1 push_titles:"+push_titles)
		callback(0,success_error_message,{
			list:push_titles
		})

	})
}






DST.prototype.setpushid = function(param, callback) {
	if (this.checkRequiredParamHandler(param, {
			pushid:"",
			lecture_id:"",
			platform:"",
			status:""
		}, callback)!=0) { return }
	var status = param.status.toLowerCase();
	if (status!="y" && status!="n") {callback(601,"required parameter 'status' is only 'y','n'");return;}
	var isinsert = status=="y"

	var platform = param.platform.toLowerCase()
	if (platform!="android" && platform!="ios" && platform!="ios_production") {callback(601,"required parameter 'platform' is only 'iOS','android' and 'iOS_production'");return;}

	param = this.paramCheck(param, ['pushid', 'lecture_id'])


	var push_collection;
	if (platform=='android') push_collection = this.push_android_collection;
	else if (platform=='ios') push_collection = this.push_iOS_collection;
	else if (platform=='ios_production') push_collection = this.push_iOS_production_collection;

	var findquery = {_id:param.pushid};

	var updatequery;
	if (isinsert) updatequery = {$addToSet:{'lecture_ids': param.lecture_id}}
	else updatequery = {$pull:{'lecture_ids': param.lecture_id}}


	push_collection.update(findquery, updatequery, {upsert:true}, function(e, count, upsert) {
		if (e) {callback(500, e); return;}
	    callback(0, success_error_message, upsert)
	})	
}	
DST.prototype.getpush = function(param, callback) {
	var data = {};
	var _this = this;
	
	if (param.platform) param.platform = param.platform.toLowerCase();

	if (param.platform=='ios') {
		_this.push_iOS_collection.find(
	  		{/*lecture_ids:param.lecture_id*/} ,  
	  		{} ,
	  		{sort: [['_id',-1]]}).toArray(function(e, results){
	  		data.ios = results;
	  		callback(0, success_error_message, data)
	  	})
	} else if (param.platform=='ios_production') {
		_this.push_iOS_production_collection.find(
	  		{/*lecture_ids:param.lecture_id*/} ,  
	  		{} ,
	  		{sort: [['_id',-1]]}).toArray(function(e, results){
	  		data.ios_production = results;
	  		callback(0, success_error_message, data)
	  	})
	} else if (param.platform=='android') {
		_this.push_android_collection.find(
	  		{/*lecture_ids:param.lecture_id*/} ,  
	  		{} ,
	  		{sort: [['_id',-1]]}).toArray(function(e, results){
	  		data.android = results;
	  		callback(0, success_error_message, data)
	  	})
	} else {
		_this.push_android_collection.find(
	  		{/*lecture_ids:param.lecture_id*/} ,  
	  		{} ,
	  		{sort: [['_id',-1]]}).toArray(function(e, results){
	  		data.android = results;

			_this.push_iOS_collection.find(
		  		{/*lecture_ids:param.lecture_id*/} ,  
		  		{} ,
		  		{sort: [['_id',-1]]}).toArray(function(e, results){
		  		data.ios = results;

			  	_this.push_iOS_production_collection.find(
			  		{/*lecture_ids:param.lecture_id*/} ,  
			  		{} ,
			  		{sort: [['_id',-1]]}).toArray(function(e, results){
			  		data.ios_production = results;

			  		callback(0, success_error_message, data)
			  	})

		  		
		  	})
	  	})
	}
}


DST.prototype.favolecturelist = function(param, callback) {
	if (this.checkRequiredParamHandler(param, {
			pushid:"",
			platform:""
		}, callback)!=0) { return }



	var platform = param.platform.toLowerCase()
	if (platform!="android" && platform!="ios" && platform!="ios_production") {callback(601,"required parameter 'platform' is only 'iOS','android' and 'iOS_production'");return;}

	
	var push_collection;
	if (platform=='android') push_collection = this.push_android_collection;
	else if (platform=='ios') push_collection = this.push_iOS_collection;
	else if (platform=='ios_production') push_collection = this.push_iOS_production_collection;

	var _this = this;
	push_collection.findOne({_id:param.pushid}, function(e, result) {
		if (e) {callback(500, e); return;}

		if (!result || !result.lecture_ids) {callback(0, success_error_message, {list:[]}); return;}
		var lecture_ids = result.lecture_ids
		
		for (var i=0; i<lecture_ids.length; i++) lecture_ids[i] = ObjectId(lecture_ids[i])
		_this.lecture_collection.find(
			{'_id': {$in:lecture_ids}}, 
			{_id:1, title:1, order:1, status:1, postcount:1}).toArray(function(e, results){
			if (e) {callback(500, e); return;}
			else {
				callback(0, success_error_message, {
					list:results
				})
			}
		})
	})		
}
DST.prototype.setpushid2 = function(param, callback) {
	console.log("set push 2 : " + JSON.stringify(param))
	if (this.checkRequiredParamHandler(param, {
			deviceid:"",
			pushid:"",
			lecture_id:"",
			platform:"",
			status:""
		}, callback)!=0) { return }
	var status = param.status.toLowerCase();
	if (status!="y" && status!="n") {callback(601,"required parameter 'status' is only 'y','n'");return;}
	var isinsert = status=="y"


	var platform = param.platform.toLowerCase()
	if (platform!="android" && platform!="ios" && platform!="ios_production") {callback(601,"required parameter 'platform' is only 'iOS','android' and 'iOS_production'");return;}

	var checkparam = JSON.parse(JSON.stringify(param));
	param = this.paramCheck(param, ['deviceid', 'pushid', 'lecture_id'])

	var push_collection2;
	if (platform=='android') push_collection2 = this.push_android_collection2;
	else if (platform=='ios') push_collection2 = this.push_iOS_collection2;
	else if (platform=='ios_production') push_collection2 = this.push_iOS_production_collection2;

	// 버전이 달라져서 체크

	this.checkPushVersion(checkparam, function () {
		var findquery = {_id:param.deviceid};

		var updatequery;
		if (isinsert) updatequery = {$addToSet:{'lecture_ids': param.lecture_id}, $set:{'pushid': param.pushid}}
		else updatequery = {$pull:{'lecture_ids': param.lecture_id}, $set:{'pushid': param.pushid}}


		push_collection2.update(findquery, updatequery, {upsert:true}, function(e, count, upsert) {
			if (e) {callback(500, e); return;}
			// updatequery = {$set:{'pushid': param.pushid}};
			// push_collection2.update(findquery, updatequery, {upsert:true}, function(e, count, upsert) {})

		    callback(0, success_error_message, upsert)
		})
	})

	
}

DST.prototype.favolecturelist2 = function(param, callback) {
	if (this.checkRequiredParamHandler(param, {
			deviceid:"",
			platform:""
		}, callback)!=0) { return }



	var platform = param.platform.toLowerCase()
	if (platform!="android" && platform!="ios" && platform!="ios_production") {callback(601,"required parameter 'platform' is only 'iOS','android' and 'iOS_production'");return;}

	
	var push_collection2;
	if (platform=='android') push_collection2 = this.push_android_collection2;
	else if (platform=='ios') push_collection2 = this.push_iOS_collection2;
	else if (platform=='ios_production') push_collection2 = this.push_iOS_production_collection2;

	var checkparam = JSON.parse(JSON.stringify(param));
	var _this = this;

	// 버전이 달라져서 체크
	this.checkPushVersion(checkparam, function () {
		push_collection2.findOne({_id:param.deviceid}, function(e, result) {
			if (e) {callback(500, e); return;}

			if (!result || !result.lecture_ids) {callback(0, success_error_message, {list:[]}); return;}
			var lecture_ids = result.lecture_ids
			
			for (var i=0; i<lecture_ids.length; i++) lecture_ids[i] = ObjectId(lecture_ids[i])
			_this.lecture_collection.find(
				{'_id': {$in:lecture_ids}}, 
				{/*_id:1, title:1, */order:0/*, status:1, postcount:1*/}).toArray(function(e, results){
				if (e) {callback(500, e); return;}
				else {
					callback(0, success_error_message, {
						list:results
					})
				}
			})
		})	
	})
}
DST.prototype.pushhistorylist2 = function(param, callback) {
	var _this = this
	// console.log("______pushhistorylist2");
	if (this.checkRequiredParamHandler(param, {
			deviceid:"",
			platform:""
		}, callback)!=0) { return }

	var platform = param.platform.toLowerCase()
	if (platform!="android" && platform!="ios" && platform!="ios_production") {callback(601,"required parameter 'platform' is only 'iOS','android' and 'iOS_production'");return;}

	var checkparam = JSON.parse(JSON.stringify(param));
	param = this.paramCheck(param, ['deviceid'])


	var push_collection2;
	if (platform=='android') push_collection2 = this.push_android_collection2;
	else if (platform=='ios') push_collection2 = this.push_iOS_collection2;
	else if (platform=='ios_production') push_collection2 = this.push_iOS_production_collection2;


	var findquery = {_id:param.deviceid};

	// 버전이 달라져서 체크
	this.checkPushVersion(checkparam, function () {
		push_collection2.find(
				findquery , 
				{/*_id:1, name:1, order:1, status:1, imgurl:1, lecturecount:1*/} ,
				{sort: [['_id',-1]]}).toArray(function(e, results){
			if (e) {callback(500, e); return;}

			console.log("result:"+JSON.stringify(results))
			var push_titles = [];
			if (results && results.length>0) push_titles = results[0].push_titles;
			console.log("1 push_titles:"+push_titles)
			callback(0,success_error_message,{
				list:push_titles
			})

		})
  	})
}
DST.prototype.getpush2 = function(param, callback) {
	var data = {};
	var _this = this;
	
	if (param.platform) param.platform = param.platform.toLowerCase();

	if (param.platform=='ios') {
		_this.push_iOS_collection2.find(
	  		{/*lecture_ids:param.lecture_id*/} ,  
	  		{} ,
	  		{sort: [['_id',-1]]}).toArray(function(e, results){
	  		data.ios = results;
	  		callback(0, success_error_message, data)
	  	})
	} else if (param.platform=='ios_production') {
		_this.push_iOS_production_collection2.find(
	  		{/*lecture_ids:param.lecture_id*/} ,  
	  		{} ,
	  		{sort: [['_id',-1]]}).toArray(function(e, results){
	  		data.ios_production = results;
	  		callback(0, success_error_message, data)
	  	})
	} else if (param.platform=='android') {
		_this.push_android_collection2.find(
	  		{/*lecture_ids:param.lecture_id*/} ,  
	  		{} ,
	  		{sort: [['_id',-1]]}).toArray(function(e, results){
	  		data.android = results;
	  		callback(0, success_error_message, data)
	  	})
	} else {
		_this.push_android_collection2.find(
	  		{/*lecture_ids:param.lecture_id*/} ,  
	  		{} ,
	  		{sort: [['_id',-1]]}).toArray(function(e, results){
	  		data.android = results;

			_this.push_iOS_collection2.find(
		  		{/*lecture_ids:param.lecture_id*/} ,  
		  		{} ,
		  		{sort: [['_id',-1]]}).toArray(function(e, results){
		  		data.ios = results;

			  	_this.push_iOS_production_collection2.find(
			  		{/*lecture_ids:param.lecture_id*/} ,  
			  		{} ,
			  		{sort: [['_id',-1]]}).toArray(function(e, results){
			  		data.ios_production = results;

			  		callback(0, success_error_message, data)
			  	})

		  		
		  	})
	  	})
	}
}






DST.prototype.checkPushVersion = function(param, callback) {
	var _this = this;
	console.log("checkPushVersion param:"+JSON.stringify(param));
	var platform = param.platform.toLowerCase()
	
	var push_collection;
	if (platform=='android') push_collection = this.push_android_collection;
	else if (platform=='ios') push_collection = this.push_iOS_collection;
	else if (platform=='ios_production') push_collection = this.push_iOS_production_collection;

	var push_collection2;
	if (platform=='android') push_collection2 = this.push_android_collection2;
	else if (platform=='ios') push_collection2 = this.push_iOS_collection2;
	else if (platform=='ios_production') push_collection2 = this.push_iOS_production_collection2;


	// 1. 푸시 아이디로 찾는다.
	var findquery = {_id:param.pushid};
	// console.log("logging 1");

	push_collection.find(
  		findquery , 
  		{/*_id:1, name:1, order:1, status:1, imgurl:1, lecturecount:1*/} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
		if (e) {callback(); return;}

		// console.log("logging 2 result:"+JSON.stringify(results))
		var lecture_ids = null;
		

		if (!results) {
			callback();
		} else if (results && results.length>0) {
			// console.log("logging 3")
			lecture_ids = results[0].lecture_ids;


			// 지우기
			var id = param.pushid;
			// if (typeof(param.pushid)==typeof('')) id = ObjectId(param.pushid)
			// console.log("logging 3.1")
			push_collection.remove({_id:id}, function(e){
				if (e) {callback(false); return;}
				// console.log("logging 4")
				if (lecture_ids && lecture_ids.length>0) {
					var findquery = {_id:param.deviceid};
					// console.log("logging 4.1")
					var updatequery;
					if (true/*isinsert*/) updatequery = {$addToSet:{'lecture_ids': { $each:lecture_ids} }/*, $set:{'pushid': param.pushid}*/}
					// else updatequery = {$pull:{'lecture_ids': param.lecture_id}, $set:{'pushid': param.pushid}}


					push_collection2.update(findquery, updatequery, {upsert:true}, function(e, count, upsert) {
						// console.log("logging 5")
						if (e) {callback(); console.log("logging 5.1"); return;}
						// console.log("logging 5.2");
						// updatequery = {$set:{'pushid': param.pushid}};
						// push_collection2.update(findquery, updatequery, {upsert:true}, function(e, count, upsert) {})
						callback();
					    
					})
				} else {
					// console.log("logging 4.2")
					callback();
				}

			})


		}
		






		if (lecture_ids && lecture_ids.length>0) {
			// 진행..
			var findquery = {_id:param.deviceid};

			var updatequery;
			if (true/*isinsert*/) updatequery = {$addToSet:{'lecture_ids': { $each:lecture_ids} }/*, $set:{'pushid': param.pushid}*/}
			// else updatequery = {$pull:{'lecture_ids': param.lecture_id}, $set:{'pushid': param.pushid}}


			push_collection2.update(findquery, updatequery, {upsert:true}, function(e, count, upsert) {
				if (e) {callback(500, e); return;}
				// updatequery = {$set:{'pushid': param.pushid}};
				// push_collection2.update(findquery, updatequery, {upsert:true}, function(e, count, upsert) {})

			    
			})
		} else {
			// 중단
			callback();
		}



		

	})



	// 2. 푸시 
	

}






DST.prototype.dropFaculty = function(param, callback) {
	var _this = this
	this.faculty_collection.remove({}, function(e){
		_this.dropLecture(param, function(){
			_this.dropPost(param, callback)
		})
    })
}
DST.prototype.dropLecture = function(param, callback) {
	var _this = this
	this.lecture_collection.remove({}, function(e){
		// _this.faculty_collection.update({}, {'$set':{lecture_ids:[]}}, function(err, result){
			_this.dropPost(param, callback)
		// })	
    })
}
DST.prototype.dropPost = function(param, callback) {
	// console.log("__dropPost")
	var _this = this
	this.post_collection.remove({}, function(e){
		// console.log("*********************")
		// _this.lecture_collection.update({}, {'$set':{post_ids:[]}}, function(err, result){
			callback(0, "succ")
		// })	
    })
}
DST.prototype.dropNotice = function(param, callback) {
	// console.log("__dropPost")
	var _this = this
	this.notice_collection.remove({}, function(e){
		// console.log("*********************")
		// _this.lecture_collection.update({}, {'$set':{post_ids:[]}}, function(err, result){
			callback(0, "succ")
		// })	
    })
}



DST.prototype.test = function(param, callback) {
	// this.push_android_collection.find(
 //  		{} , 
 //  		{sort: [['_id',-1]]}).toArray(function(e, results){
	// 	if (e) {callback(500, e); return;}

	// 	// for (var i=0; i<results.length; i++) {
	// 	// 	results[i].lecturecount = results[i].lecture_ids.length;
	// 	// 	delete results[i].lecture_ids;
	// 	// }
	// 	callback(0,success_error_message,{
	// 		list:results
	// 	})
	// })
	
	// var _this = this;

	// var setparam = {
	// 	lecturesparsefilepath:"./FacultyFiles/lecturesparsefile_555da22ed976e2466cc00b07",
	// 	postsparsefilepath:"./FacultyFiles/postsparsefilepath_555da22ed976e2466cc00b07"
	// }
	// this.faculty_collection.update({name:"김호원"}, {$set:setparam}, {multi: true}, function(e, count) {
	// 	if (e) {callback(0, e); return;}
	// 	// _this.post_collection.update({}, {$set:{status:"e"}}, {multi: true}, function(e, count) {
	// 	// 	if (e) {callback(0, e); return;}
	// 		callback(0, "this is test api")
	// 	// })
	// })
		
	var _this = this
	this.push_android_collection.remove({}, function(e){})
	this.push_iOS_collection.remove({}, function(e){})
	this.push_iOS_production_collection.remove({}, function(e){})
	callback(0, "this is test api")


	// var param = {delete_ids:[{_id:"554e0dec466777544052cbc6"}]}
	// this.updatedeletefacultys(param, callback)

	
}


DST.prototype.pushtest = function(param, callback) {
	var push_id, count = 1;

	if (param.push_id) push_id = param.push_id
	if (param.count) count = parseInt(param.count)

	if (!param.platform || param.platform=='android') {


		// or with object values
		var message = new gcm.Message({
		    collapseKey: 'demo',
		    delayWhileIdle: true,
		    timeToLive: 3,
		    data: {
		    	lecture_id:"notice",
		    	title:"젠장",
		    	desc: "젠장2",
		        key1: '안녕하세요.',
		        key2: '김동민씨'
		    }
		});

		var server_access_key = 'AIzaSyCdEO6dvF63ujrKa4_qcyRf1YSq1RL0Z3c';//'AIzaSyDd99lQlGjK75wCXHEgMoIONw75Ur_Q8BM';
		var sender = new gcm.Sender(server_access_key);
		var registrationIds = [];

		var registration_id = push_id;//'APA91bFoVlIovSSwaTWVrBNq72ZIoOZk-wq-lWpVhzef3nhRVpB2kwBNfznKsm3XgLHRcs7z22iqVlDe5kd7EPBzIDJMh90OAEZfpxAAQDK8geazFfngpu5Z2Gq_QuA86s6_YYglLF6f36bTv6uLlJ_x0Fey0OAE5Q';
		// At least one required
		for (var i=0; i<count; i++) {
			registrationIds.push(registration_id);
		}



		/**
		 * Params: message-literal, registrationIds-array, No. of retries, callback-function
		 **/
		sender.send(message, registrationIds, 4, function (err, result) {
		    // console.log(result);
		    callback(0, JSON.stringify(result))
		});
	} else {
		var options = { 
			gateway : "gateway.sandbox.push.apple.com", 
			cert: './../parse-schedule2/keys3/cert.pem',//./../parse-schedule2/keys2/
			key: './../parse-schedule2/keys3/key.pem'//./../parse-schedule2/keys2/
		};
		if (param.platform.search('product')!=-1) {
			// console.log("it is ios procution push test")
			options = { 
				gateway : "gateway.push.apple.com",//"gateway.sandbox.push.apple.com", 
				cert: './../parse-schedule2/keys3/cert_production.pem',//
				key: './../parse-schedule2/keys3/key_production.pem',//./../parse-schedule2/keys2/
				production: true
			};
		} else {
			// console.log("it is ios developer push test")
		}

		var apnConnection = new apn.Connection(options);

		


		var note = new apn.Notification();
		note.badge = 1;
		note.sound = 'default'

		
		note.payload = {
			lecture_id:"557c412036119abd6452fec1",
			title:"정컴 학사행정 - 공지사항",
			desc:"param.post_title",
			url:"http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21704&siteId=cse&linkUrl="
		};


	

		var myDeviceArray = []
  		for (var i=0; i<count; i++) {
  			console.log("call ios push!!");
  			
  			if (i==0) {
  				note.alert = new String('saltfactory PUSH TEST ZERO');
  			} else if (i==1) {
  				note.alert = new String('saltfactory PUSH TEST FIRST');
  			} else if (i==2) {
  				note.alert = new String('saltfactory PUSH TEST SECOND');
  			} else if (i==3) {
  				note.alert = new String('saltfactory PUSH TEST THIRD');
  			} else if (i==4) {
  				note.alert = new String('saltfactory PUSH TEST FOURTH');
  			} else {
  				note.alert = new String('saltfactory PUSH TEST '+i);
  			}
  			console.log("test : "+i);
	  		// var token = push_id;//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
	  		// token = '8e88b44f65c7f4ebef50d7be71ab3f6dbb1201015d38e95620fa048ee9b75425';
			var myDevice = new apn.Device(push_id);
			myDeviceArray.push(myDevice);
  		}
  		try {
	  		apnConnection.pushNotification(note, myDeviceArray);
  		} catch (e) {
  			console.log("apn exception : " + e);
		}

  		callback(0, 'success?')

	}

	
}



DST.prototype.deletepush = function (param, callback) {

	var push_collection = null;	
	
	if (param.platform && typeof("")==typeof(param.platform)) 
		param.platform = param.platform.toLowerCase()

	// console.log("param.platform:"+param.platform);
	if (param.platform=='android') {
		push_collection = this.push_android_collection;
	} else if (param.platform=='ios') {
		push_collection = this.push_iOS_collection;
	} else if (param.platform=='ios_production') {
		push_collection = this.push_iOS_production_collection;
	}


	if (push_collection) {
		push_collection.removeById(param.pushid, function(e, count){
			if (e) {callback(500, e); return;}

			callback(0, success_error_message, {count:count});
		})
	} else {
		callback(500, "platform must 'android', 'iOS' and 'ios_production'");
	}
}
DST.prototype.resetpush = function (param, callback) {
	this.push_android_collection.update({}, {'$set':{lecture_ids:[], push_titles:[]}}, {multi: true}, function(e, count, upsert) { 
		
	})
	this.push_iOS_collection.update({}, {'$set':{lecture_ids:[], push_titles:[]}}, {multi: true}, function(e, count, upsert) { 
			
		})
	this.push_iOS_production_collection.update({}, {'$set':{lecture_ids:[], push_titles:[]}}, {multi: true}, function(e, count, upsert) { 
				
			})
	callback(0, success_error_message);
	
}





/*===========================공지 푸시 날리기============================*/
/*===================================================================*/
/*===================================================================*/
/*===================================================================*/
/*===================================================================*/
/*===================================================================*/
DST.prototype.callPush = function (param, callback) {
	this.callAndroidPush(param, callback);
	// this.calliOSPush(param, callback);
}
DST.prototype.callAndroidPush = function (param, callback) {
	var _this = this;
	// var lecture_id = param.lecture_id;
	this.push_android_collection.find(
  		{} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
		// console.log("android push - results:"+results.length);
  			// [{"_id":"AAAAAAAAAAAAAAAAA4","lecture_ids":["555f5f81c42c7dbb51c7c043"]}]


	  	var message = new gcm.Message({
		    collapseKey: 'demo',
		    delayWhileIdle: true,
		    timeToLive: 3,
		    data: {
		        // key1: '안녕하세요.',
		        // key2: '김동민씨',
		        lecture_id:"notice",
		        title:param.title,
		        desc:param.description
		    }
		});

		

		// var registration_id = push_id;//'APA91bFoVlIovSSwaTWVrBNq72ZIoOZk-wq-lWpVhzef3nhRVpB2kwBNfznKsm3XgLHRcs7z22iqVlDe5kd7EPBzIDJMh90OAEZfpxAAQDK8geazFfngpu5Z2Gq_QuA86s6_YYglLF6f36bTv6uLlJ_x0Fey0OAE5Q';
		// At least one required
		// for (var i=0; i<count; i++) {
		// 	registrationIds.push(registration_id);
		// }
		// console.log("Will Push User : "+JSON.stringify(results))
		console.log("android push 1")
		if (results.length>0) {
			console.log("android push 2 (results.length:"+results.length+")")
			var registrationIds = [];
			for (var i=0; i<results.length; i++) {
				var server_access_key = 'AIzaSyCdEO6dvF63ujrKa4_qcyRf1YSq1RL0Z3c';//'AIzaSyDd99lQlGjK75wCXHEgMoIONw75Ur_Q8BM';
				var sender = new gcm.Sender(server_access_key);
				// var registrationIds = [];
				// registrationIds.push(results[i]._id);
				registrationIds.push(results[i]._id)

				if (i%50==49 || i==results.length-1) {
					// console.log("-------------android push---------------(registrationIds.length:"+registrationIds.length+")");
					try {
						sender.send(message, registrationIds, 4, function (err, result) {
							// console.log("android push 3")
						    // console.log(result);
						    // if (!result) result = {}
						    // callback(0, JSON.stringify(result))
						});	
					} catch (e) {

					}
					registrationIds = [];
				}
				
			}
		}
		
		// console.log("android push end ::::")


		_this.calliOSProductionPush(param, callback);
				
	})
	
}

DST.prototype.calliOSProductionPush = function (param, callback) {
	var options = { 
		gateway : "gateway.push.apple.com",//"gateway.sandbox.push.apple.com", 
		cert: './../parse-schedule2/keys3/cert_production.pem',
		key: './../parse-schedule2/keys3/key_production.pem',
		production: true
	};

	var apnConnection = new apn.Connection(options);


	var note = new apn.Notification();
	note.badge = 1;
	note.sound = 'default'

	// title:param.lecture_title,
 //    desc:param.post_title
	note.alert = param.title+" "+param.description;
	note.payload = {
		lecture_id:"notice",
		title:param.title,
		desc:param.description
	};

	// console.log("param.lecture_id:"+param.lecture_id);
	console.log("push ios production 1");
	var _this = this;
	// var lecture_id = param.lecture_id;
	this.push_iOS_production_collection.find(
  		{} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  		console.log("push ios production 2");

  		console.log(JSON.stringify({alert:note.alert})+" - push ids:"+results.length);
  		var myDeviceArray = []
  		for (var i=0; i<results.length; i++) {
  			try {
	  			console.log(i+" - push ios production 3 :" + results[i]._id);
		  		var token = results[i]._id;//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
				var myDevice = new apn.Device(token);
				myDeviceArray.push(myDevice);
  			} catch (e) {

  			}
  			
  		}
  		try {
	  		apnConnection.pushNotification(note, myDeviceArray);
  		} catch (e) {
  			console.log("apn exception : " + e);
		}
  		console.log("push ios production end ::::: ");
		
		 _this.calliOSPush(param, callback);
  	});

}
DST.prototype.calliOSPush = function (param, callback) {

	var options = { 
		gateway : "gateway.sandbox.push.apple.com", 
		cert: './../parse-schedule2/keys3/cert.pem',
		key: './../parse-schedule2/keys3/key.pem'
	};

	var apnConnection = new apn.Connection(options);


	var note = new apn.Notification();
	note.badge = 1;
	note.sound = 'default'

	// title:param.lecture_title,
 //    desc:param.post_title
	note.alert = param.title+" "+param.description;
	note.payload = {'message': '안녕하세요'};

	// console.log("param.lecture_id:"+param.lecture_id);
	console.log("push ios 1");
	var _this = this;
	// var lecture_id = param.lecture_id;
	this.push_iOS_collection.find(
  		{} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  		console.log("push ios 2");

  		console.log(note.alert+" - push ids:"+results.length);
  		var myDeviceArray = []
  		for (var i=0; i<results.length; i++) {
  			
	  			// console.log(i+" - push ios 3 :" + results[i]._id);
		  		var token = results[i]._id;//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
				var myDevice = new apn.Device(token);
				myDeviceArray.push(myDevice);
			
  		}
  		try {
	  		apnConnection.pushNotification(note, myDeviceArray);
  		} catch (e) {
  			console.log("apn exception : " + e);
		}
  		console.log("push ios end ::::: ");
		if (callback) callback();
  	});
}
/*===========================공지 푸시 날리기============================*/
/*===================================================================*/
/*===================================================================*/
/*===================================================================*/
/*===================================================================*/
/*===================================================================*/
DST.prototype.callPush2 = function (param, callback) {
	this.callAndroidPush2(param, callback);
	// this.calliOSPush2(param, callback);
}
DST.prototype.callAndroidPush2 = function (param, callback) {
	var _this = this;
	// var lecture_id = param.lecture_id;
	this.push_android_collection2.find(
  		{} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
		// console.log("android push - results:"+sresults.length);
  			// [{"_id":"AAAAAAAAAAAAAAAAA4","lecture_ids":["555f5f81c42c7dbb51c7c043"]}]


	  	var message = new gcm.Message({
		    collapseKey: 'demo',
		    delayWhileIdle: true,
		    timeToLive: 3,
		    data: {
		        // key1: '안녕하세요.',
		        // key2: '김동민씨',
		        lecture_id:"notice",
		        title:param.title,
		        desc:param.description
		    }
		});

		

		// var registration_id = push_id;//'APA91bFoVlIovSSwaTWVrBNq72ZIoOZk-wq-lWpVhzef3nhRVpB2kwBNfznKsm3XgLHRcs7z22iqVlDe5kd7EPBzIDJMh90OAEZfpxAAQDK8geazFfngpu5Z2Gq_QuA86s6_YYglLF6f36bTv6uLlJ_x0Fey0OAE5Q';
		// At least one required
		// for (var i=0; i<count; i++) {
		// 	registrationIds.push(registration_id);
		// }
		// console.log("Will Push User : "+JSON.stringify(results))
		// console.log("android push 1")
		if (results.length>0) {
			// console.log("android push 2 (results.length:"+results.length+")")
			var registrationIds = [];
			for (var i=0; i<results.length; i++) {
				var server_access_key = 'AIzaSyCdEO6dvF63ujrKa4_qcyRf1YSq1RL0Z3c';//'AIzaSyDd99lQlGjK75wCXHEgMoIONw75Ur_Q8BM';
				var sender = new gcm.Sender(server_access_key);
				// var registrationIds = [];
				// registrationIds.push(results[i]._id);
				registrationIds.push(results[i].pushid)

				if (i%50==49 || i==results.length-1) {
					// console.log("-------------android push---------------(registrationIds.length:"+registrationIds.length+")");
					try {
						sender.send(message, registrationIds, 4, function (err, result) {
							// console.log("android push 3")
						    console.log(result);
						    // if (!result) result = {}
						    // callback(0, JSON.stringify(result))
						});	
					} catch (e) {

					}
					registrationIds = [];
				}
				
			}
		}
		
		// console.log("android push end ::::")


		_this.calliOSProductionPush2(param, callback);
		// if (callback) callback();
				
	})
	
}

DST.prototype.calliOSProductionPush2 = function (param, callback) {
	var options = { 
		gateway : "gateway.push.apple.com",//"gateway.sandbox.push.apple.com", 
		cert: './../parse-schedule2/keys3/cert_production.pem',
		key: './../parse-schedule2/keys3/key_production.pem',
		production: true
	};

	var apnConnection = new apn.Connection(options);


	var note = new apn.Notification();
	note.badge = 1;
	note.sound = 'default'

	// title:param.lecture_title,
 //    desc:param.post_title
	note.alert = param.title+" "+param.description;
	note.payload = {
		lecture_id:"notice",
		title:param.title,
		desc:param.description
	};

	// console.log("param.lecture_id:"+param.lecture_id);
	// console.log("push ios production 1");
	var _this = this;
	// var lecture_id = param.lecture_id;
	this.push_iOS_production_collection2.find(
  		{} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  		// console.log("push ios production 2");

  		// console.log(JSON.stringify({alert:note.alert})+" - push ids:"+results.length);
  		var myDeviceArray = []
  		for (var i=0; i<results.length; i++) {
  			try {
	  			// console.log(i+" - push ios production 3 :" + results[i].pushid);
		  		var token = results[i].pushid;//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
				var myDevice = new apn.Device(token);
				myDeviceArray.push(myDevice);
  			} catch (e) {

  			}
  			
  		}
  		try {
	  		apnConnection.pushNotification(note, myDeviceArray);
  		} catch (e) {
  			console.log("apn exception : " + e);
		}
  		// console.log("push ios production end ::::: ");
		
		 _this.calliOSPush2(param, callback);
  	});

}
DST.prototype.calliOSPush2 = function (param, callback) {

	var options = { 
		gateway : "gateway.sandbox.push.apple.com", 
		cert: './../parse-schedule2/keys3/cert.pem',
		key: './../parse-schedule2/keys3/key.pem'
	};

	var apnConnection = new apn.Connection(options);


	var note = new apn.Notification();
	note.badge = 1;
	note.sound = 'default'

	// title:param.lecture_title,
 //    desc:param.post_title
	note.alert = param.title+" "+param.description;
	note.payload = {'message': '안녕하세요'};

	// console.log("param.lecture_id:"+param.lecture_id);
	// console.log("push ios 1");
	var _this = this;
	// var lecture_id = param.lecture_id;
	this.push_iOS_collection2.find(
  		{} ,  
  		{} ,
  		{sort: [['_id',-1]]}).toArray(function(e, results){
  		// console.log("push ios 2");

  		console.log(note.alert+" - push ids:"+results.length);
  		var myDeviceArray = []
  		for (var i=0; i<results.length; i++) {
  			
	  			console.log(i+" - push ios 3 :" + results[i].pushid);
	  			// console.log(i+" - push ios 3 :" + JSON.stringify(results[i]));
		  		var token = results[i].pushid;//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
				var myDevice = new apn.Device(token);
				myDeviceArray.push(myDevice);
			
  		}
  		try {
	  		apnConnection.pushNotification(note, myDeviceArray);
  		} catch (e) {
  			console.log("apn exception : " + e);
		}
  		// console.log("push ios end ::::: ");
		if (callback) callback();
  	});
}







DST.prototype.setdeveloperpush = function (param, callback) {
	var _this = this;
	if (this.checkRequiredParamHandler(param, {
			pushid:""
		}, callback)!=0) { return }

	var findquery = {_id:param.pushid};
	var updatequery = {_id:param.pushid, badge:0};
	_this.developer_push_collection.remove({}, function(e){
		_this.developer_push_collection.update(findquery, updatequery, {upsert:true}, function(e, count, upsert) {
			if (e) {callback(500, e); return;}
		    callback(0, success_error_message, upsert)
		})	
	})

	
}



// 푸시 정보 날리기
DST.prototype.dropPushCollection = function(param, callback) {
	if (this.checkRequiredParamHandler(param, {
			platform:""
		}, callback)!=0) { return }

	if (param.platform && typeof("")==typeof(param.platform)) 
		param.platform = param.platform.toLowerCase()

	// console.log("param.platform:"+param.platform);
	if (param.platform=='android') {
		push_collection = this.push_android_collection;
	} else if (param.platform=='ios') {
		push_collection = this.push_iOS_collection;
	} else if (param.platform=='ios_production') {
		push_collection = this.push_iOS_production_collection;
	}

	push_collection.remove({}, function(e){
		callback(0, success_error_message);
	})
}

DST.prototype.dropPushCollection2 = function(param, callback) {
	if (this.checkRequiredParamHandler(param, {
			platform:""
		}, callback)!=0) { return }

	if (param.platform && typeof("")==typeof(param.platform)) 
		param.platform = param.platform.toLowerCase()

	// console.log("param.platform:"+param.platform);
	if (param.platform=='android') {
		push_collection = this.push_android_collection2;
	} else if (param.platform=='ios') {
		push_collection = this.push_iOS_collection2;
	} else if (param.platform=='ios_production') {
		push_collection = this.push_iOS_production_collection2;
	}

	push_collection.remove({}, function(e){
		callback(0, success_error_message);
	})
}



exports.DST = DST;
