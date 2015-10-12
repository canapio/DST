

console.log("_______________ start _________________");
console.log("______________ lecture ________________");
console.log("_______________ parse _________________");




var path = '../parsing-file-test/LecturesParserFile/'
path += '학사행정_정컴_강의목록파싱';//'우균교수님_강의목록파싱';

var LectureParser = require(path).LectureParser;
var lectureparser = new LectureParser();
if (lectureparser) {
	lectureparser.executeParse(function(parsedLectureList) {
		for (var i=0; i<parsedLectureList.length; i++) {
			console.log(i+' ::: '+parsedLectureList[i].title+' - '+parsedLectureList[i].postsparseurl);
		}

	})
}