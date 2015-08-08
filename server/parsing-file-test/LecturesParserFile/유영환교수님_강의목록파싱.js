var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {



var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
jsdom.env({
  url: "http://uc.cse.pusan.ac.kr/xe/graduate_board",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;
    // console.log("HN Links");


    var returnLectureList = []

    var arr = []
    $("div.other_site a").each (function() {
        var url = $(this).attr('href');
        var lecture1 = null;
        if ($(this).find('img').attr('alt')=='Graduate') {
            lecture1 = 'Graduate';
        } else if ($(this).find('img').attr('alt')=='Undergraduate') {
            lecture1 = 'Undergraduate';
        }

        if (lecture1) {
            returnLectureList.push({title:lecture1, postsparseurl:url});
        }

    	// $(this).find("div div.tabWidget div.tabBox").each( function() {
    	// 	console.log("______-------_______");
    	// 	var lecture1 = null;
    	// 	$(this).find("div div a").each( function(argument) {
    	// 		// console.log(":::::"+$(this).html());
    	// 		var lecture2 = "";
    	// 		if (!lecture1) {
    	// 			lecture1 = $(this).html()
    	// 			lecture2 = "공지사항";
    	// 		} else {
    	// 			lecture2 = $(this).html()
    	// 		}
    	// 		var url = "http://se.ce.pusan.ac.kr" + $(this).attr('href');
    	// 		var _title = lecture1.trim()+" - "+lecture2.trim();
    	// 		returnLectureList.push({title:_title, postsparseurl:url});
    	// 	})
    	// })
    });


    // for (var i=0; i<returnLectureList.length; i++) {
    // 	console.log(returnLectureList[i].title + ":::::" + returnLectureList[i].postsparseurl );
    // }

    callback(returnLectureList);

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