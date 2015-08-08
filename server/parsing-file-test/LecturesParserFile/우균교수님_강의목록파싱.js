var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");
// var Iconv = require('iconv').Iconv;
// var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');

// console.log("raw : "+req.body.msg_list);
// console.log("iconv : "+ iconv.convert(new Buffer("", encoding='utf8')).toString());
// console.log("unes : "+decodeURIComponent(req.body.msg_list)); //URIError: URI malformed at decodeURIComponent (native) <-- why??


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
  url: "http://164.125.34.101/lecture/lec_2015_spring.html",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;
    // console.log("HN Links");


    var returnLectureList = []
    var lecturearrayarray = []

    $("body table tbody tr td table tbody tr td table tbody tr td").each (function() {

		if ($(this).attr('valign')=='top') {
			$(this).find('table tbody tr td').each(function() {
				if ($(this).css('background-image') && $(this).css('background-image').length>1) {
					$(this).find('a').each(function() {
						
						// var lecure1 = iconv.convert(new Buffer($(this).html(), encoding='utf8')).toString()
						// console.log("       lecure1:"+$(this).html());
						var url = $(this).attr('href');
						var lecturearray  = []
						lecturearrayarray.push(lecturearray);
						// var lectureInfo = {};
						// returnLectureList.push(lectureInfo);
						var lecturearrayIndex = lecturearrayarray.length-1;
						count++;
						jsdom.env({
						  url: url,
						  src: [jquery],
						  done: function (errors, window) {
						  	// console.log(kkk)
						    var $ = window.$;
						    var lecture1 = $('title').html();
						    if (lecture1.search('메인')!=-1) {
						    	lecture1 = lecture1.substring(0, lecture1.search('메인'));
						    	lecture1 = lecture1.trim();
						    	if (lecture1.search('-')==lecture1.length-1) {
						    		lecture1 = lecture1.substring(0, lecture1.length-1);
						    		lecture1 = lecture1.trim();
						    	}
						    }
						    // console.log("[" + lecture1 +"]");
						    $("div.simpleWidgetStyle").each(function() {

						    	// console.log("______-------_______ " + $(this).find('h2').html());
						    	var lecture2 = $(this).find('h2').html();


						    	var lectureInfo = {};
						    	lectureInfo.title = lecture1 + ' - ' + lecture2;
						    	// var _url = url+'/'+lecture2;//$(this).find('a').attr('href');
						    	
						    	lectureInfo.postsparseurl = url+'/'+lecture2;
						    	lectureInfo.url = $(this).find('a').attr('href');
						    	lecturearrayarray[lecturearrayIndex].push(lectureInfo);
						    })

						    count--;
						    if (count==0) {
						    	for (var i=0; i<lecturearrayarray.length; i++) {
						    		var lecturearray = lecturearrayarray[i];
						    		for (var j=0; j<lecturearray.length; j++) {
						    			returnLectureList.push(lecturearray[j]);
						    		}
						    	}
						    	callback(returnLectureList);
						    }
						    

					      }
						});


						
					})


				}


			})
				
		}
		// if ("과제제출"!=$(this).html()) {
		// 	count++;
		// 	var lecture = $(this).html();
		// 	lecturearr.push(lecture);
		// 	lectureurldic[lecture] = "";
		// 	var url = $(this).attr('href');
		// 	jsdom.env({
		// 	  url: url,
		// 	  src: [jquery],
		// 	  done: function (errors, window) {
		// 	    var $ = window.$;
		// 	   	url = $("#advanced_iframe").attr('src');
		// 	   	lectureurldic[lecture] = url;
			   	
		// 	   	count--
		// 	   	if (count==0) {
		// 	   		for (var i=0; i<lecturearr.length; i++) {
		// 	   			returnLectureList.push({title:lecturearr[i], postsparseurl:lectureurldic[lecturearr[i]]});
		// 	   		}
		// 	   		callback(returnLectureList);
		// 	   	}
		// 	  }
		// 	});
		// }
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