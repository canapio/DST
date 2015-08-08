var DEBUG_MODE = true

var express = require('express')
	, multer = require('multer')
	, bodyParser = require('body-parser')
	, methodOverride = require('method-override')
	, DST = require('./dst-mongodb2').DST
	, timeout = require('connect-timeout')


var formidable = require('formidable');
var path = require('path');     //used for file path
var fs =require('fs-extra');    //File System-needed for renaming file etc
var done        =    false;




var app = express()
app.use(bodyParser())


app.use(timeout('30s'));


app.use(function(req, res, next) {
	if (DEBUG_MODE) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	}
	// res.header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	next();
});






app.use(
	multer({ 
	dest: './', 
	rename: function (fieldname, filename, req, res) {
		req.start = Date.now();
		console.log("::::::::::"+fieldname)   //JSON.stringify(fieldname)
		if (req.originalUrl=='/DST/facultysparser/upload') 
			return 'facultysparser';
		return fieldname+'_'+req.start;
		// if (req.body.name && req.body.name.length>3) 
		// 	return req.body.name;
	 //    return "noname_"+Date.now();
	},
	onFileUploadStart: function (file) {
	  	console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
	  	console.log(file.fieldname + ' uploaded to  ' + file.path)
	  	done=true;
	},
	changeDest: function(dest, req, res) {
		// return dest + '../dir';
		if (req.originalUrl && req.originalUrl.length) {
			if (req.originalUrl=='/DST/facultysparser/upload') {
				return dest + '/../parsingfile/FacultysParserFile';
			} else if (req.originalUrl=='/DST/lecturesparser/upload') {
				return dest + '/../parsingfile/LecturesParserFile';
			} else if (req.originalUrl=='/DST/postsparserwithlecture/upload') {
				return dest + '/../parsingfile/PostsParser_LectureFile';
			} else if (req.originalUrl=='/DST/postsparser/upload') {
				return dest + '/../parsingfile/PostsParserFile';
			}
		}
		// console.log("req:"+JSON.stringify(req))
	  	return dest + '/uploads'; 
	}
}));







process.on('uncaughtException', function (err) {
 	console.log('Caught exception: ' + err);
 // 추후 trace를 하게 위해서 err.stack 을 사용하여 logging하시기 바랍니다.
 // Published story에서 beautifule logging winston 참조
});



var dst = new DST('localhost', 27017);



var dberrobj = {
	errcode:500,
	errmsg:"DB Error"
}
function resdberr_json (res, err) {
	console.log("err:"+JSON.stringify(err))

	var newdberrobj = JSON.parse(JSON.stringify( dberrobj ));
	console.log("typeof(err):"+typeof(err))
	if (typeof(err)==typeof("")) {
		newdberrobj.errmsg = err
	} else if (typeof(err)==typeof({})) {
		var servererrmsg = ""
		if (err.name)    servererrmsg += err.name + ":"
		if (err['$err']) servererrmsg += err['$err']
		if (err.code)    servererrmsg += "(code:"+err.code+")"
		newdberrobj.servererrmsg = servererrmsg
	}
	

	console.log("dberrobj:"+JSON.stringify(newdberrobj))
	res.json(newdberrobj)
}
function reserr_json (res, _errcode, _errmsg) {
	var newdberrobj = JSON.parse(JSON.stringify( dberrobj ));
	_errmsg = (typeof(_errmsg)==typeof({}))?(JSON.stringify(_errmsg)):(_errmsg)
	res.json({
		errcode:_errcode,
		errmsg:_errmsg
	})
}

























app.get('/', function(req, res, next) {
  res.send('wooooooooooooooooooooooooo')
})

// // 1. 로그인 - GET (로그인)
// app.get('/DST/login', function(req, res, next) {
// 	// res.header("Access-Control-Allow-Origin", "*")

// 	dst.login(req.query, function(_errcode, _errmsg, _data, e) {
// 		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
// 		else if (e) {resdberr_json(res, e)}
// 		else {
// 			var resjson = {
// 				errcode:0,
// 				errmsg:_errmsg
// 			}
// 			if (_data) {resjson.data = _data;}
			
// 			// 결과 보내기
// 			res.json(resjson)
// 		}
// 	})
// })	




// 2. 교수님 추가 - Insert (관리자)
app.post('/DST/addfaculty', function(req, res, next) {
	dst.addfaculty(req.body, function(_errcode, _errmsg, _data, e) {
		if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}

			// 결과 보내기
			res.json(resjson)
		}
	})
})

// 3. 교수님 목록 조회 - Read (관리자, 사용자)
app.get('/DST/facultylist', function(req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*")

	dst.facultylist(req.query, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, e)}
		else {
			var resjson = {
				errcode:0,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})	


// 4. 교수님 갱신 및 삭제 - Update, Delete (관리자)
app.post('/DST/updatedeletefacultys', function(req, res, next) {
	dst.updatedeletefacultys(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})		
})



// 5. 강의 추가 - Insert (관리자)
app.post('/DST/addlecture', function(req, res, next) {
	dst.addlecture(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})

// 6. 강의 목록 조회 - Read (관리자, 사용자)
app.get('/DST/lecturelist', function(req, res, next) {
	dst.lecturelist(req.query, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})

// 7. 강의목록 갱신 및 삭제 - Update, Delete (관리자)
app.post('/DST/updatedeletelectures', function(req, res, next) {
	dst.updatedeletelectures(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})		
})



// 8. 세부 글 추가 - Insert (관리자)
app.post('/DST/addpost', function(req, res, next) {
	dst.addpost(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})


// 9. 세부 목록 조회 - Read (관리자, 사용자)
app.get('/DST/postlist', function(req, res, next) {
	dst.postlist(req.query, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})



// 10. 세부목록 갱신 및 삭제 - Update, Delete (관리자)
app.post('/DST/updatedeleteposts', function(req, res, next) {
	dst.updatedeleteposts(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})		
})



// 11. 안드로이드 유저 푸시 등록, 해제(즐겨찾기 등록, 해제) - Insert, Delete (사용자)
app.post('/DST/setpushid', function(req, res, next) {
	dst.setpushid(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})		
})


app.get('/DST/push', function(req, res, next) {
	dst.getpush(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})		
})


// 12. 즐겨찾기 목록 조회 - Read (사용자)
app.get('/DST/favolecturelist', function(req, res, next) {
	dst.favolecturelist(req.query, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})



// 13. 공지 등록 - Insert, Push Notification (관리자)
app.post('/DST/pushnotice', function(req, res, next) {
	dst.pushnotice(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})

// 14. 공지 목록 조회 - Read (사용자, 관리자)
app.get('/DST/noticelist', function(req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*")

	dst.noticelist(req.query, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, e)}
		else {
			var resjson = {
				errcode:0,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})	

// 15. 공지 삭제 - Delete (관리자)
app.post('/DST/deletenotice', function(req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*")

	dst.deletenotice(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, e)}
		else {
			var resjson = {
				errcode:0,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})	


// 16. 푸시 히스토리 목록 조회 - Read (사용자)
app.get('/DST/pushhistorylist', function(req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*")

	dst.pushhistorylist(req.query, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, e)}
		else {
			var resjson = {
				errcode:0,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})	




// 17. 안드로이드 유저 푸시 등록, 해제2(즐겨찾기 등록, 해제) - Insert, Delete (사용자)
app.post('/DST/setpushid2', function(req, res, next) {
	dst.setpushid2(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})		
})
// 18. 즐겨찾기 목록 조회2 - Read (사용자)
app.get('/DST/favolecturelist2', function(req, res, next) {
	dst.favolecturelist2(req.query, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})
// 19. 푸시 히스토리 목록 조회2 - Read (사용자)
app.get('/DST/pushhistorylist2', function(req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*")

	dst.pushhistorylist2(req.query, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, e)}
		else {
			var resjson = {
				errcode:0,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})	

app.get('/DST/push2', function(req, res, next) {
	dst.getpush2(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})		
})
















app.post('/file-upload', function(req, res, next) {
    console.log(req.body);
    console.log(req.files);
});



















// 테스트용
app.delete('/DST/faculty/all', function(req, res, next) {
	dst.dropFaculty(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})

app.delete('/DST/lecture/all', function(req, res, next) {
	dst.dropLecture(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})

app.delete('/DST/post/all', function(req, res, next) {
	dst.dropPost(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})



app.delete('/DST/notice/all', function(req, res, next) {
	dst.dropNotice(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})

app.delete('/DST/deletepush', function(req, res, next) {
	dst.dropPushCollection(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})

app.delete('/DST/deletepush2', function(req, res, next) {
	dst.dropPushCollection2(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})






app.post('/DST/facultysparser/upload',function(req,res){
	console.log("req.start:"+req.start);
	// console.log("startTime:"+startTime);
	if(done==true){
		
		console.log(req.files);
		res.json({
			errcode:0,
			errmsg:'success'
		});
	}
});

app.post('/DST/lecturesparser/upload',function(req,res){
	if(done==true){
		var param = {
			_id:req.body.faculty_id, 
			lecturesparsefilepath:'../parsingfile/LecturesParserFile/'+req.body.faculty_id+'_'+req.start};
		dst.updateFaculty([param], function(success) {
			if (success) {
				res.json({
					errcode:0,
					errmsg:'success'
				});
			} else {
				res.json({
					errcode:555,
					errmsg:"fail to update faculty 'lecturesparsefilepath' param"
				});
			}
		});
	}
});

app.post('/DST/postsparserwithlecture/upload',function(req,res){
	if(done==true){
		var param = {
			_id:req.body.faculty_id, 
			postsparsefilepath:'../parsingfile/PostsParser_LectureFile/'+req.body.faculty_id+'_'+req.start};
		dst.updateFaculty([param], function(success) {
			if (success) {
				res.json({
					errcode:0,
					errmsg:'success'
				});
			} else {
				res.json({
					errcode:555,
					errmsg:"fail to update faculty 'postsparsefilepath' param"
				});
			}
		});
	}
});

app.post('/DST/postsparser/upload',function(req,res){
	if(done==true){
		var param = {
			_id:req.body.lecture_id, 
			postsparsefilepath:'../parsingfile/PostsParserFile/'+req.body.lecture_id+'_'+req.start}
		dst.updateLecture([param], function(success) {
			if (success) {
				res.json({
					errcode:0,
					errmsg:'success'
				});
			} else {
				res.json({
					errcode:555,
					errmsg:"fail to update lecture 'postsparsefilepath' param"
				});
			}
		});
	}
});









app.get('/DST/pushtest', function(req, res, next) {
	dst.pushtest(req.query, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})
app.get('/DST/deletepush', function(req, res, next) {
	dst.deletepush(req.query, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})

app.post('/DST/resetpush', function(req, res, next) {
	dst.resetpush(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})


app.post('/DST/setdeveloperpush', function(req, res, next) {
	dst.setdeveloperpush(req.body, function(_errcode, _errmsg, _data, e) {
		if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
		else if (e) {resdberr_json(res, _errmsg)}
		else {
			var resjson = {
				errcode:_errcode,
				errmsg:_errmsg
			}
			if (_data) {resjson.data = _data;}
			
			// 결과 보내기
			res.json(resjson)
		}
	})
})

app.get('/DST/checkpushversion', function(req, res, next) {
	dst.checkPushVersion(req.query, function() {
	})
	res.json({"success":"maybe succee"});
})



// "_id": "50f41e4603169886a836a1e69248981552ef60299193491ef0f6a76f88d7eb4f",
// "lecture_ids": [
// "557c412036119abd6452fec1",
// "557c412036119abd6452fec2",
// "556eed758ec052d26ec1fa9b",
// "556eed758ec052d26ec1fa9d"
// ],


// "_id": "5C19315D-408A-468C-9022-4C84BC00C6B2",
// "pushid": "50f41e4603169886a836a1e69248981552ef60299193491ef0f6a76f88d7eb4f",
// "lecture_ids": [
// "557c412036119abd6452fec1",
// "557c412036119abd6452fec2"
// ],


// app.get('/DST/test', function(req, res, next) {
// 	// dst.test(req.query, function(_errcode, _errmsg, _data, e) {
// 	// 	if (_errcode!=0) {reserr_json(res, _errcode, _errmsg)}
// 	// 	else if (e) {resdberr_json(res, _errmsg)}
// 	// 	else {
// 	// 		var resjson = {
// 	// 			errcode:_errcode,
// 	// 			errmsg:_errmsg
// 	// 		}
// 	// 		if (_data) {resjson.data = _data;}
			
// 	// 		// 결과 보내기
// 	// 		res.json(resjson)
// 	// 	}
// 	// })

// 	res.json({
// 		errcode:0,
// 		errmsg:"very very success.",
// 		request:req.query
// 	})
// })









app.listen(3003)