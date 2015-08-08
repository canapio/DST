
console.log("_______________ start _________________");
console.log("_______________ post __________________");
console.log("_______________ parse _________________");


var path = '../parsing-file-test/PostsParser_LectureFile/'


path += '채흥석교수님_자동글파싱';
var url = 'http://square.cse.pusan.ac.kr/xe/board_atNj22'


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