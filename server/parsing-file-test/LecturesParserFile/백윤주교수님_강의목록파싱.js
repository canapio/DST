var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}


var _callback;
var count = 0;
LectureParser.prototype.executeParse = function(callback) {
_callback = callback;


var jquery = fs.readFileSync("js/jquery.js", "utf-8");

var lecturearr = []
var lectureurldic = {}
jsdom.env({
  url: "http://eslab.ismine.net/?page_id=832",//http://eslab.ismine.net/?page_id=705",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;
    // console.log("HN Links");


    var returnLectureList = []


    $("div aside ul li ul li a").each (function() {
		// console.log("______-------_______" + $(this).html());
		if ("과제제출"!=$(this).html()) {
			count++;
			var lecture = $(this).html();
			lecturearr.push(lecture);
			lectureurldic[lecture] = "";
			var url = $(this).attr('href');
			jsdom.env({
			  url: url,
			  src: [jquery],
			  done: function (errors, window) {
			    var $ = window.$;
			   	url = $("#advanced_iframe").attr('src');
			   	lectureurldic[lecture] = url;
			   	
			   	count--
			   	if (count==0) {
			   		for (var i=0; i<lecturearr.length; i++) {
			   			returnLectureList.push({title:lecturearr[i], postsparseurl:lectureurldic[lecturearr[i]]});
			   		}
			   		callback(returnLectureList);
			   	}
			  }
			});
		}
    });


    // for (var i=0; i<returnLectureList.length; i++) {
    // 	console.log(returnLectureList[i].title + ":::::" + returnLectureList[i].postsparseurl );
    // }

    

  }
});


};



String.prototype.trim = function () {
	var str = this;
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