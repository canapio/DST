var Iconv = require('iconv').Iconv;
var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');
var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {



var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
 //http://borame.cs.pusan.ac.kr/lecture/fr_lecture_s2015_1.htm
jsdom.env({// 
  url: "http://borame.cs.pusan.ac.kr/lecture/left_s2015-2.htm",
  encoding:'binary',
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;


    var returnList = []
    //#menu table tbody tr
    var beforeLecture = false;
    var urlcount = 0;
    $("#menu table tbody tr").each(function () {
    	// console.log("_ _ _ _");
    	if (!beforeLecture) {
    		if ($(this).find('td font').html() && $(this).find('td font').html().length>0) {

    		} else {

    			// $(this).find('td a').html()
    			// $(this).find('td a').attr('href')

    			var lecture = $(this).find('td a').html()
    			
		        // if (lecture.search('<')!=-1) lecture = lecture.substring(0, lecture.search('<'));
		        var url = 'http://borame.cs.pusan.ac.kr/lecture/'+$(this).find('td a').attr('href')
                // console.log(lecture + ", " + url);
		        if (lecture && url && url.search('.htm')!=-1) {
		        	if (lecture.search('<')!=-1) lecture = lecture.substring(0, lecture.search('<'));
		        	lecture = lecture.trim();
                    
		        	// lecture = escape(lecture)
                    var buf = new Buffer(lecture.length);
                    buf.write(lecture, 0, lecture.length, 'binary');
                    lecture = iconv.convert(buf).toString();
                    // console.log(lecture);
                    if (lecture!='교수계획표') {
                        urlcount++;
                        var returnInfo = {title:lecture, postsparseurl:url};
                        returnList.push(returnInfo);    
                        jsdom.env({// 
                          url: url,
                          // encoding:'utf8',
                          src: [jquery],
                          done: function (errors, window) {
                            var $ = window.$;
                            urlcount--;
                            $("body table tbody tr td table tr td p a").each(function () {
                                var url = $(this).attr('href');
                                // console.log("url:::"+url)
                                
                                // console.log('img src:'+$(this).find('img').attr('src'));
                                if ($(this).find('img').attr('src').search('lect_note.gif')!=-1) {

                                    returnInfo.postsparseurl = 'http://borame.cs.pusan.ac.kr/lecture/'+url
                                    // console.log("_________::"+JSON.stringify(returnInfo));
                                    
                                    
                                }
                                
                                
                            })
                            if (urlcount==0) {

                                for (var i=0; i<returnList.length; i++) {
                                    var t1 = returnList[i].title;
                                    var url1 = returnList[i].postsparseurl;
                                    if (url1.search('20')!=-1) {
                                        returnList[i].title = "["+url1.substring(url1.search('20'), url1.search('20')+4)+"] " + returnList[i].title;    
                                    }
                                }

                                callback(returnList);
                            }

                          }
                        })
                    }
                    
    				
    			}
		        
    		}


    		if ($(this).find('td font').html()=='지난 강의') {
    			beforeLecture = true;
    		}
    	}
    	

        
      	
    });

    // for (var i=0; i<returnList.length; i++) {
    // 	console.log(returnList[i].title + "\t" + returnList[i].postsparseurl);
    // }

    

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