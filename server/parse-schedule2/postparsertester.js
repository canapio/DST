
console.log("_______________ start _________________");
console.log("_______________ post __________________");
console.log("_______________ parse _________________");


var path = '../parsing-file-test/PostsParser_LectureFile/'


path += '임시시소교수님_자동글파싱2';
var url = 'http://cafe.naver.com/ArticleList.nhn?search.clubid=28225253&search.menuid=1&search.boardtype=L'


var PostParser = require(path).PostParser;
var postparser = new PostParser();
if (postparser) {
	
	postparser.executeParse(function(url, parsedPostList) {
		for (var i=0; i<parsedPostList.length; i++) {
			console.log(i+' ::: '+parsedPostList[i].title +" - " + parsedPostList[i].url);
		}
	})
}
// http://eslab.byus.net/bbs/bbs/board.php?bo_table=comsys2015