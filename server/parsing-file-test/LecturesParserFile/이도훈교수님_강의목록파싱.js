var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {



var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
 //http://borame.cs.pusan.ac.kr/lecture/fr_lecture_s2015_1.htm
jsdom.env({// 
  url: "http://164.125.35.15/visbic_course/index.php?mid=LA1501notice",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;

    //div.gnb ul li
	//a
	//ul li a
    var returnList = []

    var lecList = [];
    var lecDic = {}
    $("div.gnb ul li").each(function () {
    	// console.log("_ _ _ _");

    	var lecture2 = $(this).find("a").html()

    	
    	$(this).find("ul li a").each(function () {
    		var lecture1 = $(this).html()
    		var lecture = lecture1 + ' - ' + lecture2;
    		var url = 'http://164.125.35.15' + $(this).attr('href');
    		returnList.push({title:lecture, postsparseurl:url});        
    	})


		
    });

    // for (var i=0; i<returnList.length; i++) {
    // 	console.log(returnList[i].title + "\t" + returnList[i].postsparseurl);
    // }

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