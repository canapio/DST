var najax = require('najax');


FacultyParser = function () {

}

FacultyParser.prototype.executeParse = function(callback) {
var _this = this;
najax({ 
	url:'http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21694&siteId=cse&linkUrl=', 
	type:'GET' 
}).success(function(html){
	
	var listdivhtml = '<table class="pro_list">';

	var facultyhtmlarray = html.split(listdivhtml)
	facultyhtmlarray.splice(0,1);
	// console.log("facultyhtmlarray.length:"+facultyhtmlarray.length);

	var str;
	var findindex;

	var _imgurl, _name, _url;

	var facultyArray = [];

	facultyArray.push({name:'정보컴퓨터공학부', lecturesparseurl:'http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21704&siteId=cse&linkUrl='});
	// facultyArray.push({name:'정보컴퓨터공학부 연구', lecturesparseurl:'http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21700&siteId=cse&linkUrl='});
	
	for (var i=0; i<facultyhtmlarray.length; i++) {
		var facultyhtml = facultyhtmlarray[i];
		
		_imgurl = "";
		_name = "";
		_url = "";

		str = "<img src=\'";
		findindex = facultyhtml.search(str);
		if (findindex!=-1) {
			facultyhtml = facultyhtml.substring(findindex+1+str.length, facultyhtml.length);		

			str = "\'";
			findindex = facultyhtml.search(str);
			if (findindex!=-1) {
				_imgurl = 
				_imgurl = "http://uwcms.pusan.ac.kr/"+facultyhtml.substring(0, findindex);
				facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);		
			}
		}
		


		str = "성명";
		findindex = facultyhtml.search(str);
		if (findindex==-1) continue;
		facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);		

		str = "<a href=";
		findindex = facultyhtml.search(str);
		if (findindex==-1) continue;
		facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);


		str = ">";
		findindex = facultyhtml.search(str);
		if (findindex==-1) continue;
		facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);


		str = "</a>";
		findindex = facultyhtml.search(str);
		if (findindex==-1) continue;
		_name = facultyhtml.substring(0, findindex);
		_name = _this.trim(_name);
		facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);

		var faculty = {name:_name}
		faculty.imgurl = _imgurl;

		if (_name.search('���')!=-1) continue;
		facultyArray.push(faculty);

		str = "홈페이지";
		findindex = facultyhtml.search(str);
		if (findindex==-1) continue;
		facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);		

		str = "<a href=\"";
		findindex = facultyhtml.search(str);
		if (findindex==-1) continue;
		facultyhtml = facultyhtml.substring(findindex+str.length, facultyhtml.length);


		str = "\"";
		findindex = facultyhtml.search(str);
		if (findindex==-1) continue;
		_url = facultyhtml.substring(0, findindex);

		faculty.lecturesparseurl = _url;


	}


	
	callback(facultyArray);
	// callback([facultyArray[facultyArray.length-2], facultyArray[facultyArray.length-1]]);


}).error(function(err){

});
};



FacultyParser.prototype.trim = function (str) {
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


exports.FacultyParser = FacultyParser;