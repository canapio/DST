var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {



var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
jsdom.env({
  url: "http://mobile.pusan.ac.kr/Lecture_2015_1",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;
    // console.log("HN Links");


    var returnList = []




    $("ul.ul2 li.li2").each(function () {
    	var lecture1 = $(this).find('a.a2').html();
    	// console.log('::1::lecture1:'+lecture1+"     "+lecture1.search('<'));
    	if (lecture1.search('<')!=-1) lecture1 = lecture1.substring(0, lecture1.search('<'));
    	// console.log('::2::lecture1:'+lecture1);
    	if (lecture1.search('지난 강의')==-1) {
	    	$(this).find('ul.ul3 li a.a3').each(function(){
		        var lecture2 = $(this).html();
		        var url = $(this).attr('href');
		        returnList.push({title:lecture1+' - '+lecture2, postsparseurl:url});
	        });
    	}
      	
    });

    // for (var i=0; i<returnList.length; i++) {
    // 	console.log(returnList[i].title + "\t" + returnList[i].postsparseurl);
    // }

    // console.log(JSON.stringify(lecturearr));
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