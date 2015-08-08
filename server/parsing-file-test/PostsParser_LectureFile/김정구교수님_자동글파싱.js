var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

PostParser = function () {

}
// 
PostParser.prototype.executeParse = function(postparseurl, callback) {


var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
jsdom.env({
  url: postparseurl,
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;


    var returnList = []



    $("form table tbody tr td.title a").each(function () {
      // console.log("_-_-_-");
      var _title = $(this).html();
      var _url = 'http://prof.pusan.ac.kr/user/' + $(this).attr('href');
      if ($(this).find('span').html()) _title = $(this).find('span').html();
      _title = _title.split("&nbsp;").join(" ");
      returnList.push({title:_title.trim(), url:_url});
    });

    // logging
    // for (var i=0; i<returnList.length; i++) {
    //   console.log(returnList[i].title);
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

