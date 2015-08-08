var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {



var jquery = fs.readFileSync("./js/jquery.js", "utf-8");
 
 //http://borame.cs.pusan.ac.kr/lecture/fr_lecture_s2015_1.htm
jsdom.env({// 
  url: "http://nclab.blogspot.kr/",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;


    var returnList = []
    //
    $("div.tabs div.widget div ul li a").each(function () {
    	// console.log("_ _ _ _");

    	var lecture = $(this).html()
    	lecture = lecture.trim();
    	
		var url = $(this).attr('href');
		returnList.push({title:lecture, postsparseurl:url});        
    });






		// for (var i=0; i<returnList.length; i++) {
	 //    	console.log(returnList[i].title + "\t" + returnList[i].postsparseurl);
	 //    }

	    callback(returnList);

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