var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

PostParser = function () {

}

PostParser.prototype.executeParse = function(postparseurl, callback) {


var jquery = fs.readFileSync("js/jquery.js", "utf-8");

var arr = postparseurl.split('/');
var lecture2 = arr[arr.length-1];
postparseurl = postparseurl.substring(0, postparseurl.length-lecture2.length-1);

 
jsdom.env({
  url: postparseurl,
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;
    // console.log("HN Links");


    var returnList = []


    //form table tbody tr td nobr a
    //  tbody tr td nobr a
    $("div.simpleWidgetStyle").each(function() {
      if ($(this).find('h2').html()==lecture2) {
        // console.log("__"+$(this).find('h2').html());  
        $(this).find('div div table tbody tr td.title a').each(function(){
          var _url = 'http://pl.pusan.ac.kr'+$(this).attr('href');
          if (_url.search('#comment')!=_url.length-"#comment".length) {
            if ($(this).find('span').html()) {
              returnList.push({title:$(this).find('span').html().trim(), url:_url});
            } else {
              returnList.push({title:$(this).html().trim(), url:_url});
            }
          } 
          
        })
        
        
      }
    		// 
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

