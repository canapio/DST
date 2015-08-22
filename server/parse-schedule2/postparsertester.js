
console.log("_______________ start _________________");
console.log("_______________ post __________________");
console.log("_______________ parse _________________");


var path = '../parsing-file-test/PostsParser_LectureFile/'


path += '최윤호교수님_자동글파싱';
var url = 'http://prof.pusan.ac.kr/user/indexSub.action?codyMenuSeq=7238&siteId=sec&linkUrl='


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