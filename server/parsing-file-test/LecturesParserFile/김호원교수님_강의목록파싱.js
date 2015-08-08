var najax = require('najax');


LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {
var _this = this;
najax({ 
	url:'http://infosec.pusan.ac.kr/bbs/zboard.php?id=u2015_1_cs_hw', 
	type:'GET' 
}).success(function(html){
	

	var returnLectureList = []

	var str;
	var findindex;


	str = '<table ';
	
	
	var tableArray = html.split('<table ')
	var realTableArray = [];
	for (var i=0; i<tableArray.length; i++) {
		findindex = tableArray[i].search('대학원');	
		if (findindex!=-1) {realTableArray.push(tableArray[i]);continue;}

		findindex = tableArray[i].search('학부');	
		if (findindex!=-1) realTableArray.push(tableArray[i]);
	}

	for (var i=0; i<realTableArray.length; i++) {
		

		// console.log(JSON.stringify(lecturelist));

		var title1 = "";
		findindex = realTableArray[i].search('대학원');	
		if (findindex!=-1) title1 = "대학원";

		findindex = realTableArray[i].search('학부');	
		if (findindex!=-1) title1 = "학부";


		// console.log("title1:"+title1)





		str = "&nbsp;+&nbsp;";
		var lecturelist = realTableArray[i].split(str)
		if (lecturelist.length>0) lecturelist.splice(0,1);

		for (var j=0; j<lecturelist.length; j++) {
			str = '<br>';
			findindex = lecturelist[j].search(str);
			if (findindex==-1) continue;
			


			var lecturename = lecturelist[j].substring(0, findindex);
			// console.log("  lecturename:"+lecturename);

			lecturelist[j] = lecturelist[j].substring(findindex, lecturelist[j].length);


			str = '<a href='
			var lectureRawList = lecturelist[j].split(str);
			if (lectureRawList.length==0) continue;
			lectureRawList.splice(0, 1);

			for (var k=0; k<lectureRawList.length; k++) {
				str = '>';
				findindex = lectureRawList[k].search(str);

				var _postparseurl = "";
				if (findindex!=-1) {
					_postparseurl = "http://infosec.pusan.ac.kr"+lectureRawList[k].substring(0, findindex);
				}
				
				// url 뽑기
				//
				//
				//
				//

				str = ">";
				findindex = lectureRawList[k].search(str);
				lectureRawList[k] = lectureRawList[k].substring(findindex+str.length, lectureRawList[k].length);

				str = "<";
				findindex = lectureRawList[k].search(str);
				var lecturename2 = lectureRawList[k].substring(0, findindex);

				var lecturetitle = lecturename + " - " + lecturename2;
				returnLectureList.push({title:lecturetitle, postsparseurl:_postparseurl})
			}

		}

	}



	callback(returnLectureList);













	// var listdivhtml = '<table ';

	// var facultyhtmlarray = html.split(listdivhtml)
	// facultyhtmlarray.splice(0,1);
	// console.log("facultyhtmlarray.length:"+facultyhtmlarray.length);

	

	// var _imgurl, _name, _url;

	// var facultyArray = [];
	// for (var i=0; i<facultyhtmlarray.length; i++) {
	// 	var facultyhtml = facultyhtmlarray[i];
		
	// 	_imgurl = "";
	// 	_name = "";
	// 	_url = "";

	// 	str = "<img src=\'";
	// 	findindex = facultyhtml.search(str);
	// 	if (findindex!=-1) {
	// 		facultyhtml = facultyhtml.substring(findindex+1+str.length, facultyhtml.length);		

	// 		str = "\'";
	// 		findindex = facultyhtml.search(str);
	// 		if (findindex!=-1) {
	// 			_imgurl = 
	// 			_imgurl = "http://uwcms.pusan.ac.kr/"+facultyhtml.substring(0, findindex);
	// 			facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);		
	// 		}
	// 	}
		


	// 	str = "성명";
	// 	findindex = facultyhtml.search(str);
	// 	if (findindex==-1) continue;
	// 	facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);		

	// 	str = "<a href=";
	// 	findindex = facultyhtml.search(str);
	// 	if (findindex==-1) continue;
	// 	facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);


	// 	str = ">";
	// 	findindex = facultyhtml.search(str);
	// 	if (findindex==-1) continue;
	// 	facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);


	// 	str = "</a>";
	// 	findindex = facultyhtml.search(str);
	// 	if (findindex==-1) continue;
	// 	_name = facultyhtml.substring(0, findindex);
	// 	_name = _this.trim(_name);
	// 	facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);

	// 	var faculty = {name:_name}
	// 	faculty.imgurl = _imgurl;
	// 	facultyArray.push(faculty);

	// 	str = "홈페이지";
	// 	findindex = facultyhtml.search(str);
	// 	if (findindex==-1) continue;
	// 	facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);		

	// 	str = "<a href=\"";
	// 	findindex = facultyhtml.search(str);
	// 	if (findindex==-1) continue;
	// 	facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);


	// 	str = "\"";
	// 	findindex = facultyhtml.search(str);
	// 	if (findindex==-1) continue;
	// 	_url = facultyhtml.substring(0, findindex);

	// 	faculty.url = _url;
	// }



	// callback(facultyArray);


}).error(function(err){

});
};



LectureParser.prototype.trim = function (str) {
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


exports.LectureParser = LectureParser;