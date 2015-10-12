var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {



var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
jsdom.env({
  url: "http://pnucas.org/xe/index.php?mid=bbs_2015experiment",//http://pnucas.org/xe/index.php?mid=bbs_2015ComputerArchitectures",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;


    var returnList = []
    //div.nav-tabs ul li a
    $("#body div.container div ul.nav li a").each(function () {
        var lecture = $(this).html();
        if (lecture.search('<')!=-1) lecture = lecture.substring(0, lecture.search('<'));
        var url = 'http://pnucas.org' + $(this).attr('href');
        returnList.push({title:lecture, postsparseurl:url});
      	
    });

    // for (var i=0; i<returnList.length; i++) {
    // 	console.log(returnList[i].title + "\t" + returnList[i].postsparseurl);
    // }

    callback(returnList);

  }
});

// jsdom.env({
//   url: "http://news.ycombinator.com/",
//   src: [jquery],
//   done: function (errors, window) {
//     var $ = window.$;
//     console.log("HN Links");
//     $("td.title:not(:last) a").each(function () {
//       console.log(" -", $(this).attr('href'));
//     });
//   }
// });




// var _this = this;
// najax({ 
// 	url:'http://square.cse.pusan.ac.kr/xe/board_mTVp73', 
// 	type:'GET' 
// }).success(function(html){
	

// 	var returnLectureList = []

// 	var str;
// 	var findindex;

// 	str = 'gnb'
// 	findindex = html.search(str);
// 	if (findindex==-1) {callback(returnLectureList); return;}

// 	html = html.substring(findindex, html.length);


// 	str = '<form action';
// 	findindex = html.search(str);

// 	if (findindex!=-1) html = html.substring(0, findindex);

// 	console.log("html:\n"+html);


// 	callback(returnLectureList); return;











// 	str = '<table ';
	
	
// 	var tableArray = html.split('<table ')
// 	var realTableArray = [];
// 	for (var i=0; i<tableArray.length; i++) {
// 		findindex = tableArray[i].search('대학원');	
// 		if (findindex!=-1) {realTableArray.push(tableArray[i]);continue;}

// 		findindex = tableArray[i].search('학부');	
// 		if (findindex!=-1) realTableArray.push(tableArray[i]);
// 	}

// 	for (var i=0; i<realTableArray.length; i++) {
		

// 		// console.log(JSON.stringify(lecturelist));

// 		var title1 = "";
// 		findindex = realTableArray[i].search('대학원');	
// 		if (findindex!=-1) title1 = "대학원";

// 		findindex = realTableArray[i].search('학부');	
// 		if (findindex!=-1) title1 = "학부";


// 		// console.log("title1:"+title1)





// 		str = "&nbsp;+&nbsp;";
// 		var lecturelist = realTableArray[i].split(str)
// 		if (lecturelist.length>0) lecturelist.splice(0,1);

// 		for (var j=0; j<lecturelist.length; j++) {
// 			str = '<br>';
// 			findindex = lecturelist[j].search(str);
// 			if (findindex==-1) continue;
			


// 			var lecturename = lecturelist[j].substring(0, findindex);
// 			// console.log("  lecturename:"+lecturename);

// 			lecturelist[j] = lecturelist[j].substring(findindex, lecturelist[j].length);


// 			str = '<a href='
// 			var lectureRawList = lecturelist[j].split(str);
// 			if (lectureRawList.length==0) continue;
// 			lectureRawList.splice(0, 1);

// 			for (var k=0; k<lectureRawList.length; k++) {
// 				str = '>';
// 				findindex = lectureRawList[k].search(str);

// 				var _postparseurl = "";
// 				if (findindex!=-1) {
// 					_postparseurl = "http://infosec.pusan.ac.kr"+lectureRawList[k].substring(0, findindex);
// 				}
				
// 				// url 뽑기
// 				//
// 				//
// 				//
// 				//

// 				str = ">";
// 				findindex = lectureRawList[k].search(str);
// 				lectureRawList[k] = lectureRawList[k].substring(findindex+str.length, lectureRawList[k].length);

// 				str = "<";
// 				findindex = lectureRawList[k].search(str);
// 				var lecturename2 = lectureRawList[k].substring(0, findindex);

// 				var lecturetitle = lecturename + " - " + lecturename2;
// 				returnLectureList.push({title:lecturetitle, postsparseurl:_postparseurl})
// 			}

// 		}

// 	}



// 	callback(returnLectureList);

// }).error(function(err){

// });
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