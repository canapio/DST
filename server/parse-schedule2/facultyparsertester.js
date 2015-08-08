

console.log("_______________ start _________________");
console.log("______________ lecture ________________");
console.log("_______________ parse _________________");

var path = '../parsing-file-test/FacultysParserFile/'
path += 'facultysparser';

var FacultyParser = require(path).FacultyParser;
var facultyparser = new FacultyParser();
if (facultyparser) {
	facultyparser.executeParse(function(parsedFacultyList) {
		for (var i=0; i<parsedFacultyList.length; i++) {
			console.log(i+' ::: '+parsedFacultyList[i].name+' - '+parsedFacultyList[i].lecturesparseurl);
		}
	})
}
