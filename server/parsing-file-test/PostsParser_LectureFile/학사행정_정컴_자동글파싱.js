var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

PostParser = function () {

}

PostParser.prototype.executeParse = function(postparseurl, callback) {


var jquery = fs.readFileSync("js/jquery.js", "utf-8");


console.log(JSON.stringify({title:"공지사항 : [학과활동] 조맹섭박사초청특강 최종학과활동인정명단 및 초청특강자료공유\r\n\t\t&nbsp;".trim()}))

najax({ 
	url:postparseurl, 
	type:'GET' 
}).success(function(html){
	html = html.substring(html.search('<form')+'<form'.length, html.length);
	html = html.substring(html.search('<form')+'<form'.length, html.length);
	html = html.substring(0, html.search('</form'));
	var trArray = html.split('<tr');
	var findStr = '<a href=\''

	var returlArray = []
	for (var i=0; i<trArray.length; i++) {
		trArray[i] = trArray[i].substring(trArray[i].search(findStr)+findStr.length, trArray[i].length);
		var url =  'http://uwcms.pusan.ac.kr/user/'+trArray[i].substring(0, trArray[i].search('\''));
		trArray[i] = trArray[i].substring(trArray[i].search('>')+'>'.length, trArray[i].length);
		trArray[i] = trArray[i].substring(0, trArray[i].search('<')).trim();
		// console.log(":"+JSON.stringify(trArray[i].trim()));
		if (trArray[i].length>1 && url.length!='http://uwcms.pusan.ac.kr/user/'.length) returlArray.push({title:trArray[i], url:url})
	}                                                                                                                                                                                                                                                                                                                                                                                                         
	// for (var i=0; i<trArray.length; i++) trArray[i] = trArray[i].trim();


	// for (var i=0; i<returlArray.length; i++) {
	// 	console.log('::'+returlArray[i].title + ' - ' + returlArray[i].url)
	// }
	// console.log("::::"+JSON.stringify(returlArray))
	// console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n"+ returlArray.length)


	callback(returlArray);


}).error(function(err){

});


}

// jsdom.env({
//   url: postparseurl,
//   src: [jquery],
//   done: function (errors, window) {
//     var $ = window.$;
    

//     var returnList = []


//   //   console.log($(this).html());
//   //   $("#board-container").each(function () {
//   //   	// console.log($(this).html());
// 		// // returnList.push({title:$(this).html().trim()});
//   //   });

//     // logging
//     // for (var i=0; i<returnList.length; i++) {
//     // 	console.log(returnList[i].title);
//     // }
//     // console.log("returnList.length:"+returnList.length);
    
//     // callback(returnList);

//   }
// });
// };



String.prototype.trim = function () {
	var str = this;
	str = str.replace('/&nbsp/gi;', '');
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

