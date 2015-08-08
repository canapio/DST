var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {



var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
 //http://borame.cs.pusan.ac.kr/lecture/fr_lecture_s2015_1.htm
jsdom.env({// 
  url: "http://ai.ce.pusan.ac.kr/index.php?mid=board_Cqum41",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;


    var returnList = []
    var urlWaitingCount = 0;
    var postlecture = "";
    $("ul.snb_navi li a").each(function () {
    	// console.log("_ _ _ _");

    	var lecture = $(this).html()
    	lecture = lecture.trim();
    	if (lecture.search('Homework')!=-1) {
    		lecture = postlecture + ' ' + lecture;
    	} else {
    		postlecture = lecture;
    	}
    	

		var url = $(this).attr('href');
		var returnInfo = {title:lecture, postsparseurl:url};
		returnList.push(returnInfo);       

		urlWaitingCount++;
		jsdom.env({// 
		  url: url,
		  src: [jquery],
		  done: function (errors, window) {
		    var $ = window.$; 
		    urlWaitingCount--;
		    $("form.bd_pg fieldset a.frst_last").each(function () {
		    	url = $(this).attr('href');
		    	returnInfo.postsparseurl = url;
		    })
		    if (urlWaitingCount==0) {
		    	callback(returnList);
		    }
		  }
		})
    });


    urlWaitingCount++;
	jsdom.env({// 
	  url: "http://ai.ce.pusan.ac.kr/index.php?mid=board_xxbE88",
	  src: [jquery],
	  done: function (errors, window) {
	    var $ = window.$;


	    

	    $("ul.snb_navi li a").each(function () {
	    	// console.log("_ _ _ _");

	    	var lecture = $(this).html()
	    	lecture = lecture.trim();
	    	
			var url = $(this).attr('href');
			var returnInfo = {title:lecture, postsparseurl:url};
			returnList.push(returnInfo);

			urlWaitingCount++;
			jsdom.env({// 
			  url: url,
			  src: [jquery],
			  done: function (errors, window) {
			    var $ = window.$; 
			    urlWaitingCount--;
			    $("form.bd_pg fieldset a.frst_last").each(function () {
			    	url = $(this).attr('href');
			    	returnInfo.postsparseurl = url;
			    })
			    if (urlWaitingCount==0) {
			    	callback(returnList);
			    }
			  }
			})        
	    });


	    urlWaitingCount--;
	    if (urlWaitingCount==0) {
	    	callback(returnList);
	    }
		// for (var i=0; i<returnList.length; i++) {
	 //    	console.log(returnList[i].title + "\t" + returnList[i].postsparseurl);
	 //    }

	    
	  }
	});
  }
});

};




String.prototype.trim = function () {
	var str = this;
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