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
    try {
      var $ = window.$;
      // console.log("HN Links");
      

      var returnList = []



      $("#board_list").each(function () {
        	$(this).find('tr.notice td.title a').each(function(){
            var _url = 'http://square.cse.pusan.ac.kr' + $(this).attr('href');
            if (_url.search('#comment')!=_url.length-"#comment".length) {
        		  returnList.push({title:$(this).html().trim(), url:_url});
            }
          });
          $(this).find('tr td.title a').not('tr.notice').each(function(){
            var _url = 'http://square.cse.pusan.ac.kr' + $(this).attr('href');
            if (_url.search('#comment')!=_url.length-"#comment".length) {
          	 returnList.push({title:$(this).html().trim(), url:_url});
            }
          })
      });

      // logging
      // for (var i=0; i<returnList.length; i++) {
      // 	console.log(returnList[i].title);
      // }
      // console.log("returnList.length:"+returnList.length);
      
      callback(returnList);
    } catch (e) {console.log("exception error : "+e);callback([])};
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

