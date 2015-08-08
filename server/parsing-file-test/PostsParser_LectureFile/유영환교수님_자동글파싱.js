var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

PostParser = function () {

}

PostParser.prototype.executeParse = function(postparseurl, callback) {


var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
jsdom.env({
  url: postparseurl,
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;
    // console.log("HN Links");


    var returnList = []


    $("#newspace form table.boardList tbody tr td.title a").each(function () {
    	returnList.push({
    		title:$(this).html().trim(), 
    		url:'http://uc.cse.pusan.ac.kr'+$(this).attr('href')
    	});
    });

    // logging
    // for (var i=0; i<returnList.length; i++) {
    // 	console.log(returnList[i].title +' - '+returnList[i].url);
    // }
    // console.log("returnList.length:"+returnList.length);
    
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



exports.PostParser = PostParser;

