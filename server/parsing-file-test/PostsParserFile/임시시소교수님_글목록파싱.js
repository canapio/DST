var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");

PostParser = function () {

}

PostParser.prototype.executeParse = function(url, callback) {

console.log("___1");

var jquery = fs.readFileSync("js/jquery.js", "utf-8");
// var count = 0;
jsdom.env({
  url: "http://se.ce.pusan.ac.kr/xe/index.php?mid=kaluas_se_201502_note",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;
    // console.log("HN Links");
    // console.log("___2");

    var returnPostList = []
    // #pageLeftT div ul.subMenu li a font
    // #pageLeftT div ul.subMenu li ul li a font
    var num = 0;
    var lecturetitle1 = null;
    $("form.boardListForm fieldset table.boardList tbody tr td.title a").each (function() {
        
        var posttitle;
        var _url = "http://se.ce.pusan.ac.kr"+$(this).attr('href');


        var ulhtml = $(this).find('span').html();
        if (ulhtml) {
          // console.log("___________________:"+$(this).find('span').html())
          posttitle = $(this).find('span').html();
        } else {
          // console.log("___________________:"+$(this).html())
          posttitle = $(this).html();
        }

        returnPostList.push({
          title:posttitle.trim(),
          url:_url
        })
        // var ulhtml = $(this).find('ul').html();
        // if (ulhtml) {
        //     $(this).find('ul li').each(function(){
        //         num++;
        //         var lecturetitle2 = $(this).find('a font').html();
        //         // console.log("    "+num+"-lecturetitle2:"+lecturetitle2.trim() + "      "+$(this).find('a').attr('href'));
                // returnLectureList.push({
                //   title:lecturetitle1+"-"+lecturetitle2.trim(),
                //   postsparseurl:'http://prof.pusan.ac.kr'+$(this).find('a').attr('href')
                // })
        //     })
            
        // } else {
        //     // console.log("ulhtml:"+ulhtml)
        //     lecturetitle1 = $(this).find('a font').html().trim();
        //     // console.log("lecturetitle1:"+lecturetitle1.trim() + "      "+$(this).find('a').attr('href'));
        // }


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
    callback(returnPostList);
    
    
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


exports.PostParser = PostParser;