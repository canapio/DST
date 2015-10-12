var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");
var Iconv = require('iconv').Iconv;
var iconv = new Iconv('ksc5601', 'UTF-8//TRANSLIT//IGNORE');

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {



var jquery = fs.readFileSync("./js/jquery.js", "utf-8");
 
 //http://borame.cs.pusan.ac.kr/lecture/fr_lecture_s2015_1.htm
jsdom.env({// 
  url: "http://stem.cs.pusan.ac.kr/",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;


    var returnList = []
    //
    $("html body div.WordSection1 ul li.MsoNormal a span").each(function () {
    	var lecture = $(this).html()
    	lecture = lecture.trim();

    	console.log("lecture:"+lecture)
    	var buf = new Buffer(lecture.length);
        buf.write(lecture, 0, lecture.length, 'binary');
        lecture = iconv.convert(buf).toString();


     // var dataIn = new Uint8Array(lecture/*[0xA1, 0xB4]*/);
     // var str = new TextDecoder('KSC5601').decode(dataIn);
     // var codePoint = str.codePointAt(0);
    	console.log("_ _ _ _" + lecture);

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