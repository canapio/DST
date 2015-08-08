var util = require('util');
var exec = require('child_process').exec,
    child;

var apn = require('apn');

DSTCRUD = require('./dst-dbcrud2').DSTCRUD


var dstcurd = new DSTCRUD('localhost', 27017);


util.log("*********************************************");
util.log("*********************************************");
util.log("*********************************************");
util.log("*********************************************");

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

// dstcurd.readFaculty(function(e, results) {
// 	util.log("readfaculty results:"+JSON.stringify(results));
// });
// dstcurd.readLecture("5552d48020c82ed77ebdb0e2", function(e, results) {
// 	util.log("readlecture results:"+JSON.stringify(results));
// });
// dstcurd.readPost("5552d4b320c82ed77ebdb0e5", function(e, results) {
// 	util.log("readpost results:"+JSON.stringify(results));
// });

var timeoutInterval = 300;//



function startParse () {
	// dstcurd.callPush({lecture_id:"555f5f81c42c7dbb51c7c043"}, function(){})
	setTimeout(nextparse, timeoutInterval);
}


var parsing_depth = -1;
function nextparse () {

	parsing_depth++;

	if (parsing_depth%3==0) {
		loadFacultyList();
	} else if (parsing_depth%3==1) {
		initLoadLectureList();
	} else {
	 	initPostListWithFacultyList();
	}
}



function loadFacultyList () {
	util.log("______parseFacultyList()______");
	var FacultyParser = null;
	var facultyparser = null;
	try {
		FacultyParser = require("./../parsingfile/FacultysParserFile/facultysparser.js").FacultyParser;
		facultyparser = new FacultyParser();
	} catch (e) {util.log("::::::::::catch error:"+e);}

	if (facultyparser) {
		try {
			facultyparser.executeParse(function(parsedFacultyList) {
				dstcurd.readFaculty(function(e, dbFacultyList) {

					// util.log("readfaculty results:"+JSON.stringify(dbFacultyList));

					if (parsedFacultyList.length==0) {
						// Something wrong?
					}
					var willInsertList = getInsertList(dbFacultyList, parsedFacultyList);
					for (var i=0; i<willInsertList.length; i++) {
						willInsertList[i].order = -1;
						willInsertList[i].status = "e";
						willInsertList[i].lecturecount = 0;
						willInsertList[i].beforelecturesparsedcount = 0;
						// willInsertList[i].lecturesparseurl = "";
						willInsertList[i].lecturesparsefilepath = "";
						willInsertList[i].postsparsefilepath = "";
						willInsertList[i].url = willInsertList[i].lecturesparseurl;
						willInsertList[i].createdate = new Date();
						willInsertList[i].updatedate = new Date();
					}




					// util.log("willInsertList:"+JSON.stringify(willInsertList));
					if (willInsertList.length>0) {
						// util.log("1_____")
						// DB에 저장
						dstcurd.createFaculty(willInsertList, function(success) {
							if (success) {
								// util.log("success");
								dstcurd.updateAllFaculty({order:-1}, function(success) {
									updateFacultyOrder(parsedFacultyList, parsedFacultyList.length, function(success) {
										if (success) {
											// 끝
											// util.log("끝1");

										} else {

										}
										setTimeout(nextparse, timeoutInterval);
									})
								})
							} else {
								// util.log("fail");
								setTimeout(nextparse, timeoutInterval);
							}
						});
					} else {
						// util.log("2_____")
						dstcurd.updateAllFaculty({order:-1}, function(success) {
							updateFacultyOrder(parsedFacultyList, parsedFacultyList.length, function(success) {
								if (success) {
									// 끝
									// util.log("끝2");
								} else {

								}
								setTimeout(nextparse, timeoutInterval);
							})
						})
					}
				});
			});
		} catch (e) {
			util.log("::::::::::catch error:"+e); 
			setTimeout(nextparse, timeoutInterval);
		}
	} else { setTimeout(nextparse, timeoutInterval); }
}

function updateFacultyOrder (targetfacultys, _order, callback) {
	// util.log("_order:"+_order);
	if (targetfacultys.length==0) {callback(true);return;}
	dstcurd.updateFaculty({name:targetfacultys[0].name, order:_order}, function(success) {
		if (success) {
			_order--;
			targetfacultys.splice(0, 1);
			updateFacultyOrder(targetfacultys, _order, callback);
		} else {
			callback(false);
		}
	})
}



























// 2. 교수님마다 LectureParser 실행시켜서 강의목록 갱신
var facultyArrayForParseLecture = [];
function initLoadLectureList () {
	util.log("______initLoadLectureList()______");
	facultyArrayForParseLecture = [];
	dstcurd.readFaculty(function(e, dbFacultyList) {
		facultyArrayForParseLecture = dbFacultyList;
		setTimeout(loadLectureList, timeoutInterval);
	})
}
function loadLectureList () {
	if (!facultyArrayForParseLecture) {
		return;
	} else if (facultyArrayForParseLecture.length==0) { 
		// 초기 루프로 돌아가기
		// util.log("endendend++++");
		facultyArrayForParseLecture = null;
		// startParse();
		setTimeout(nextparse, timeoutInterval);
		return;
	} else {
		var faculty = facultyArrayForParseLecture[0];
		util.log("  loadLectureList() - "+faculty.name);
		facultyArrayForParseLecture.splice(0, 1);
		// util.log("faculty:"+JSON.stringify(faculty.name));
		if (faculty.status=='d' || !faculty.lecturesparsefilepath || faculty.lecturesparsefilepath.length<4) {
			// util.log(faculty.name+" - disable or no file");
			setTimeout(loadLectureList, timeoutInterval);	
			return;
		} else {
			// util.log(faculty.name+" - start lecture parse with path : "+faculty.lecturesparsefilepath);
			var LectureParser = null;
			var lectureparser = null;
			try {
				LectureParser = require(faculty.lecturesparsefilepath).LectureParser;
				lectureparser = new LectureParser();
			} catch (e) {util.log("::::::::::catch error:"+e);}
			if (lectureparser) {
				try {
					lectureparser.executeParse(function(parsedLectureList) {
						parsedLectureList = getHtmlParse(parsedLectureList);
						dstcurd.readLecture(faculty._id, function(e, dbLectureList) {
							var willInsertList = getInsertList(dbLectureList, parsedLectureList);

							for (var i=0; i<willInsertList.length; i++) {
								willInsertList[i].faculty_id = String(faculty._id);
								willInsertList[i].order = -1;
								willInsertList[i].status = "e";
								willInsertList[i].postcount = 0;
								willInsertList[i].beforepostsparsedcount = 0;
								// willInsertList[i].postsparseurl = ""; // 앞에서 저장함
								willInsertList[i].postsparsefilepath = ""; 
								if (!willInsertList[i].url) willInsertList[i].url = willInsertList[i].postsparseurl;
								willInsertList[i].createdate = new Date();
								willInsertList[i].updatedate = new Date();
							}


							var updateLectureOrderCallback = function(success) {
								if (success) {// util.log("끝1"); 
								} else { }
								setTimeout(loadLectureList, timeoutInterval);
							}
							// util.log(":::::1");
							var lecturecount = dbLectureList.length + willInsertList.length;
							dstcurd.updateFaculty({name:faculty.name, lecturecount:lecturecount}, function(success) {
								if (success) {
									if (willInsertList.length>0) {
										// DB에 저장
										dstcurd.createLecture(willInsertList, function(success) {
											if (success) {
												dstcurd.updateAllLecture({faculty_id:String(faculty._id), order:-1}, function(success) {
													updateLectureOrder(parsedLectureList, parsedLectureList.length, updateLectureOrderCallback)
												})	
											} else {
												setTimeout(loadLectureList, timeoutInterval);
											}
										});
									} else {
										dstcurd.updateAllLecture({faculty_id:String(faculty._id), order:-1}, function(success) {
											updateLectureOrder(parsedLectureList, parsedLectureList.length, updateLectureOrderCallback)
										})
									}	
								} else {
									dstcurd.updateAllLecture({faculty_id:String(faculty._id), order:-1}, function(success) {
										updateLectureOrder(parsedLectureList, parsedLectureList.length, updateLectureOrderCallback)
									})
								}				
							})
						})
					})
				} catch (e) {
					util.log("::::::::::catch error:"+e); 
					setTimeout(loadLectureList, timeoutInterval);
				}
			} else {setTimeout(loadLectureList, timeoutInterval);}
		}
	} 
}




function updateLectureOrder (targetlectures, _order, callback) {
	if (targetlectures.length==0) {callback(true);return;}
	// console.log('targetlectures[0]:'+JSON.stringify(targetlectures[0]))
	var updatequery = {
		title:targetlectures[0].title, 
		postsparseurl:targetlectures[0].postsparseurl,
		url:targetlectures[0].url,
		order:_order
	}
	dstcurd.updateLecture(updatequery, function(success) {
		if (success) {
			_order--;
			targetlectures.splice(0, 1);
			updateLectureOrder(targetlectures, _order, callback);
		} else {
			callback(false);
		}
	})
}


























// 3. 글 목록 파싱
var lectureArrayForParsePost = [];
var nowFacultyWithPostParse = null;
function initPostListWithFacultyList () {
	util.log("______initPostListWithFacultyList()______");
	facultyArrayForParseLecture = [];
	dstcurd.readFaculty(function(e, dbFacultyList) {
		facultyArrayForParseLecture = dbFacultyList;
		setTimeout(initPostListWithLectureList, timeoutInterval);
	})
}
function initPostListWithLectureList () {
	
	if (!facultyArrayForParseLecture) {
		// util.log("_______________________________");
		return;
	} else if (facultyArrayForParseLecture.length==0) {
		facultyArrayForParseLecture = null;
		// 끝
		util.log("_______________________________");
		util.log("_______________________________");
		util.log("_______________________________");
		util.log("_______________________________");
		util.log("_______________________________");
		//
		//
		//
		//
		//
		// startParse(); // 무한 루프
		// process.on('exit', function() { process.exit(1); });a
		setTimeout(stopprocess, 1000*60*10)
		// setTimeout(process.exit, 1000*60*10)		// 10분뒤 종료
		//
		//
		//
		//
		//
		return;
	} else {
		var faculty = facultyArrayForParseLecture[0];
		util.log("  initPostListWithLectureList() - ["+faculty.name+"]");
		nowFacultyWithPostParse = faculty;
		facultyArrayForParseLecture.splice(0, 1);
		lectureArrayForParsePost = [];
		dstcurd.readLecture(faculty._id, function(e, dbLectureList) {
			lectureArrayForParsePost = dbLectureList;
			setTimeout(loadPostList, timeoutInterval);
		})
	}
	
}

function loadPostList () {
	
	if (!lectureArrayForParsePost) {
		return;
	} else if (lectureArrayForParsePost.length==0) { 
		// 초기 루프로 돌아가기
		// util.log("end lecture");
		lectureArrayForParsePost = null;

		setTimeout(initPostListWithLectureList, timeoutInterval);
		
		return;
	} else {
		var lecture = lectureArrayForParsePost[0];
		util.log("    loadPostList() - ["+lecture.title+"]");
		lectureArrayForParsePost.splice(0, 1); 
		// util.log("      lecture:"+lecture.title)

		if (nowFacultyWithPostParse.status=='d' || lecture.status=='d') {
			loadPostList();
			// loadLectureList();
			return;
		}


		var parseCallback = function (parsedPostList) {
			parsedPostList = getHtmlParse(parsedPostList);
			dstcurd.readPost(lecture._id, function(e, dbPostList) {
				var willInsertList = getInsertList(dbPostList, parsedPostList);
				for (var i=0; i<willInsertList.length; i++) {
					willInsertList[i].lecture_id = String(lecture._id);
					willInsertList[i].order = -1;
					willInsertList[i].status = "e";
					willInsertList[i].createdate = new Date();
					willInsertList[i].updatedate = new Date();
				}


				var postcount = dbPostList.length + willInsertList.length;
				dstcurd.updateLecture({title:lecture.title, postcount:postcount}, function(success) {
					var updatePostOrderCallback = function(success) {
						if (success) { //util.log("끝1");
						} else { }
						setTimeout(loadPostList, timeoutInterval);
					}
					if (success) {
						
						if (willInsertList.length>0) {
							// DB에 저장
							dstcurd.createPost(willInsertList, function(success, newposts) {
								if (success) {
									// util.log("success new posts : "+JSON.stringify(newposts));
									dstcurd.updateAllPost({lecture_id:String(lecture._id), order:-1}, function(success) {
										updatePostOrder(parsedPostList, parsedPostList.length, updatePostOrderCallback)
									})
								} else {
									// util.log("fail");
									setTimeout(loadPostList, timeoutInterval);
								}
							});
						} else {
							dstcurd.updateAllPost({lecture_id:String(lecture._id), order:-1}, function(success) {
								updatePostOrder(parsedPostList, parsedPostList.length, updatePostOrderCallback)
							})
						}
					} else {
						dstcurd.updateAllPost({lecture_id:String(lecture._id), order:-1}, function(success) {
							updatePostOrder(parsedPostList, parsedPostList.length, updatePostOrderCallback)
						})
					}
				})
				
				
			})
		}

		if (lecture.postsparsefilepath && lecture.postsparsefilepath.length>4) {
			// util.log("post file 직접 파싱")
			var PostParser = null;
			var postparser = null;
			try {
				PostParser = require(lecture.postsparsefilepath).PostParser;
				postparser = new PostParser();
			} catch (e) {util.log("::::::::::catch error:"+e);}
			if (postparser) {
				try {
					postparser.executeParse(parseCallback);
				} catch (e) {
					util.log("::::::::::catch error:"+e); 
					setTimeout(loadPostList, timeoutInterval);
				}
			} else {setTimeout(loadPostList, timeoutInterval);}
			return;
		} else if (nowFacultyWithPostParse.postsparsefilepath && nowFacultyWithPostParse.postsparsefilepath.length>4 && lecture.postsparseurl && lecture.postsparseurl.length>4) {
			// util.log("post file 간접 파싱")
			var PostParser = null;
			var postparser = null;
			try {
				PostParser = require(nowFacultyWithPostParse.postsparsefilepath).PostParser;
				postparser = new PostParser();
			} catch (e) {util.log("::::::::::catch error:"+e);}
			if (postparser) {
				try {
					postparser.executeParse(lecture.postsparseurl, parseCallback);
				} catch (e) {
					util.log("::::::::::catch error:"+e); 
					setTimeout(loadPostList, timeoutInterval);
				}
			} else {setTimeout(loadPostList, timeoutInterval);}
			return;
		} else {
			loadPostList();
			//loadLectureList();
			return;	
		}

			

		


		setTimeout(loadPostList, timeoutInterval);
	}
}








function updatePostOrder (targetposts, _order, callback) {
	if (targetposts.length==0) {callback(true);return;}
	dstcurd.updatePost({title:targetposts[0].title, order:_order}, function(success) {
		if (success) {
			_order--;
			targetposts.splice(0, 1);
			updatePostOrder(targetposts, _order, callback);
		} else {
			callback(false);
		}
	})
}




































function getInsertList (oldList, newList) {
	var oldList = JSON.parse(JSON.stringify( oldList ));
	var newList = JSON.parse(JSON.stringify( newList ));

	for (var i=0; i<oldList.length; i++) {
		for (var j=0; j<newList.length; j++) {
			if (oldList[i].name) {
				if (oldList[i].name==newList[j].name) {
					newList.splice(j, 1);
					j--;
				}
			} else if (oldList[i].title) {
				if (oldList[i].title==newList[j].title) {
					newList.splice(j, 1);
					j--;
				}
			}
		}
	}
	return newList;
}
function getHtmlParse (list) {
	for (var i=0; i<list.length; i++) {
		if (list[i].title) {
			list[i].title = list[i].title.replaceAll('&lt;', '<');
			list[i].title = list[i].title.replaceAll('&gt;', '>');
			list[i].title = list[i].title.replaceAll('&amp;', '&');
		} else if (list[i].name) {
			list[i].name = list[i].name.replaceAll('&lt;', '<');
			list[i].name = list[i].name.replaceAll('&gt;', '>');
			list[i].name = list[i].name.replaceAll('&amp;', '&');
		} 
	}
	return list;
}




function stopprocess () {

	var title = "Parse Success"
	var nowtime = new Date();

	// 1. DB에 기록 남기기
	dstcurd.scheduleLog({title:title, parseendtime:nowtime}, function(){});





	// 2. 푸시
	dstcurd.calliOSDeveloperPush({title:title, nowtime:nowtime}, function(){});






	// 3. 2초 뒤에 프로세스 제거
	setTimeout(function () {
		child = exec('forever stop parse-core3.js',

		function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
			  console.log('exec error: ' + error);
			}
		});
	}, 1000*5)
	
}











startParse();