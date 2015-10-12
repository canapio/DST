
console.log("_______________ start _________________");
console.log("_______________ post __________________");
console.log("_______________ parse _________________");


var path = '../parsing-file-test/PostsParser_LectureFile/'


path += '학사행정_정컴_자동글파싱2';
var url = 'http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21704&siteId=cse&linkUrl='


var PostParser = require(path).PostParser;
var postparser = new PostParser();
if (postparser) {
	
	postparser.executeParse(url, function(parsedPostList) {
		for (var i=0; i<parsedPostList.length; i++) {
			console.log(i+' ::: '+parsedPostList[i].title +" - " + parsedPostList[i].url);
		}
	})
}
// http://eslab.byus.net/bbs/bbs/board.php?bo_table=comsys2015