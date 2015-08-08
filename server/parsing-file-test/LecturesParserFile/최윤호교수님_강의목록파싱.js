var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

LectureParser = function () {

}

LectureParser.prototype.executeParse = function(callback) {

console.log("___1");

var jquery = fs.readFileSync("js/jquery.js", "utf-8");
// var count = 0;
jsdom.env({
  url: "http://prof.pusan.ac.kr/user/indexSub.action?codyMenuSeq=6630&siteId=sec",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;
    // console.log("HN Links");
    console.log("___2");

    var returnLectureList = []
    // #pageLeftT div ul.subMenu li a font
    // #pageLeftT div ul.subMenu li ul li a font
    var num = 0;
    $("#pageLeftT div ul.subMenu li").each (function() {
        var ulhtml = $(this).find('ul').html();
        if (ulhtml) {
            $(this).find('ul li').each(function(){
                num++;
                var lecturetitle1 = $(this).find('a font').html();
                console.log("    "+num+"-lecturetitle2:"+lecturetitle1.trim() + "      "+$(this).find('a').attr('href'));
            })
            
        } else {
            console.log("ulhtml:"+ulhtml)
            var lecturetitle1 = $(this).find('a font').html();
            console.log("lecturetitle1:"+lecturetitle1.trim() + "      "+$(this).find('a').attr('href'));
        }


      //   console.log("___3:"+count);
      //   // count ++;
      //   var url = $(this).attr('href');
      //   var lecture = $(this).html();
      //   var returnLecture = {title:lecture}
      //   returnLectureList.push(returnLecture)
      //   jsdom.env({
      //     url: url,
      //     src: [jquery],
      //     done: function (errors, window) {
      //       var $ = window.$;
      //       // returnLecture.postsparseurl = "";

      //       $('ul li span a').each(function () {
      //           if ('게시판 바로가기'==$(this).html()) {
      //               returnLecture.postsparseurl = $(this).attr('href');
      //           }
      //       })

      //       count --;
      //       if (count==0) {
      //           callback(returnLectureList);
      //       }
      //     }
      // })
    })
    
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