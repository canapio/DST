var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {



var jquery = fs.readFileSync("js/jquery.js", "utf-8");





var returnNoticeList = null
var returnCommunityList = null

var noticeConnect = false
var communityConnect = false

jsdom.env({
  url: "http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21679&siteId=cse",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;

    // console.log("HN Links : ");
    if (errors) {
    	for (var i=0; i<errors.length; i++) {
	    	// console.log("___________________");
	    	for (var key in errors[i]) {
	    		console.log(errors[i][key])	
	    	}
	    }
    } else {
    	// console.log("no error");
    }
    
    // console.log("HN Links");


    returnNoticeList = []




	$('#pageLeftT div ul li a').each(function() {
		var url = $(this).attr('href');
		$(this).find('font').each(function() {
			// console.log($(this).html());		
			var title = $(this).html().trim();
			if (title=='공지사항' || title=='규정 및 양식') {
				title = "정컴 학사행정 - " + title;
				returnNoticeList.push({title:title, postsparseurl:'http://uwcms.pusan.ac.kr'+url});
			}
			
		})
	});

	// for (var i=0; i<returnArray.length; i++) {
	// 	console.log(returnArray[i].title+' - '+returnArray[i].postsparseurl);
	// }

    /*
    0 ::: 공지사항 - http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21704&siteId=cse&linkUrl=
	1 ::: 규정 및 양식 - http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21706&siteId=cse
	2 ::: 질문 및 답변 - http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21708&siteId=cse
    */

    // console.log(JSON.stringify(lecturearr));
    noticeConnect = true;
    if (noticeConnect && communityConnect) {
    	returnListAtCallback ();
    }
    

  }
});




var jquery = fs.readFileSync("js/jquery.js", "utf-8");

jsdom.env({
  url: "http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21680&siteId=cse",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;

    // console.log("HN Links : ");
    if (errors) {
    	for (var i=0; i<errors.length; i++) {
	    	// console.log("___________________");
	    	for (var key in errors[i]) {
	    		console.log(errors[i][key])	
	    	}
	    }
    } else {
    	// console.log("no error");
    }
    
    // console.log("HN Links");


    returnCommunityList = []




	$('#pageLeftT div ul li a').each(function() {
		var url = $(this).attr('href');
		$(this).find('font').each(function() {
			// console.log($(this).html());		
			var title = $(this).html().trim();
			if (title!='갤러리') {
				title = "정컴 커뮤니티 - " + title;
				returnCommunityList.push({title:title, postsparseurl:'http://uwcms.pusan.ac.kr'+url});
			}
			
		})
	});

	// for (var i=0; i<returnArray.length; i++) {
	// 	console.log(returnArray[i].title+' - '+returnArray[i].postsparseurl);
	// }

    /*
    0 ::: 공지사항 - http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21704&siteId=cse&linkUrl=
	1 ::: 규정 및 양식 - http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21706&siteId=cse
	2 ::: 질문 및 답변 - http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21708&siteId=cse
    */

    // console.log(JSON.stringify(lecturearr));
    communityConnect = true;
    if (noticeConnect && communityConnect) {
    	returnListAtCallback ();
    }
    

  }
});

function returnListAtCallback () {
	for (var i=0; i<returnCommunityList.length; i++) {
		returnNoticeList.push(returnCommunityList[i]);	
	}
	var returnList = returnNoticeList;
	callback(returnList);
}
};








LectureParser.prototype.trim = function (str) {
	for (var i=0; i<str.length; i++) {
		if (str.charAt(i)==' ' 
			|| str.charAt(i)=='\n'
			|| str.charAt(i)=='\r'
			|| str.charAt(i)=='\t') continue;

		str = str.substring(i, str.length);
		break;
	}
	

	for (var i=str.length-1; i>=0; i--) {
		if (str.charAt(i)==' ' 
			|| str.charAt(i)=='\n'
			|| str.charAt(i)=='\r'
			|| str.charAt(i)=='\t') continue;

		str = str.substring(0, i+1);
		break;
	}

	return str;
}


exports.LectureParser = LectureParser;