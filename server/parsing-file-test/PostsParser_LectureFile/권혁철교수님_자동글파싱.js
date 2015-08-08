var Iconv = require('iconv').Iconv;
var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');
var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

PostParser = function () {

}

PostParser.prototype.executeParse = function(postparseurl, callback) {


var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
jsdom.env({
  url: postparseurl,
  encoding:'binary',
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;
    // console.log("HN Links");


    var returnList = []
    // html body div table tbody tr td font        
    // html body div table tbody tr td a font 

    var title1 = ''
    $("html body div table tbody tr").each(function () {
    	var t1 = $(this).find('td font').html();
        if (t1 && t1.length>1) {
            title1 = t1;
        }
        var title2 = $(this).find('td a font').html();
        var url = $(this).find('td a').attr('href');
        
        if (url && url.search('../')==0) {
            url = url.substring('../'.length, url.length);
            url = 'http://borame.cs.pusan.ac.kr/'+url;
        }

        var title = title1+' - '+title2
        // lecture = escape(lecture)
        var buf = new Buffer(title.length);
        buf.write(title, 0, title.length, 'binary');
        title = iconv.convert(buf).toString();

        while (true) {
            var findIndex = title.search('&nbsp;');
            if (findIndex==-1) break;
            else {
                var t1 = title.substring(0, findIndex);
                var t2 = title.substring(findIndex+'&nbsp;'.length, title.length);
                title = t1 + '' + t2;
            }
        }

        returnList.push({title:title, url:url});

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

