var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {



var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
// jsdom.env({
//   url: "http://se.ce.pusan.ac.kr/xe/?mid=lecture_present",
//   src: [jquery],
//   done: function (errors, window) {
//     var $ = window.$;
//     // console.log("HN Links");


    

//   }
// });
    var returnLectureList = []


    

    returnLectureList.push({title:"시스템소프트웨어 강의노트", postsparseurl:"http://se.ce.pusan.ac.kr/xe/index.php?mid=kaluas_se_201502_note"});


    // for (var i=0; i<returnLectureList.length; i++) {
    //  console.log(returnLectureList[i].title + ":::::" + returnLectureList[i].postsparseurl );
    // }

    callback(returnLectureList);
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