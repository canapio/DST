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

    var firsttbody = true;
    // body table tbody tr td table tbody tr td[width=795] table tbody tr td div[align=center] table tbody tr td table tbody tr td a
    $("#board-container div.list form table tbody tr td.title a").each(function () {
    	// console.log("::::"+$(this).html().trim()+"  "+$(this).attr('href'))
    	
    	var _url = 'http://prof.pusan.ac.kr/user/' + $(this).attr('href');
    	// console.log("::::"+$(this).html().trim())
		returnList.push({title:$(this).html().trim(), url:_url});	
    });

    // logging
    // for (var i=0; i<returnList.length; i++) {
    // 	console.log(returnList[i].title);
    // }
    // console.log("returnList.length:"+returnList.length);
    
    callback(returnList);

  }
});
};



String.prototype.trim = function () {
	var str = this;
	
	str = str.replace('/&nbsp;/gi;', '');
	str = str.replace('/\n/gi', '');
	str = str.replace('/\r/gi', '');
	str = str.replace('/\t/gi', '');
	if (str.length==0) return str;
	for (var i=0; i<str.length; i++) {
		if (str.charAt(i)==' ' 
			|| str.charAt(i)=='\n'
			|| str.charAt(i)=='\r'
			|| str.charAt(i)=='\t') {
			if (i==str.length-1) {
				str = '';
				break;
			}
			continue;
		}

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
	if (str.search('&nbsp;')==0) {
		str = str.substring('&nbsp;'.length, str.length);
		str = str.trim();
	}
	if (str.search('&nbsp;')==str.length-'&nbsp;'.length) {
		str = str.substring(0, str.length-'&nbsp;'.length);
		str = str.trim();
	}
	return str;
}



exports.PostParser = PostParser;

