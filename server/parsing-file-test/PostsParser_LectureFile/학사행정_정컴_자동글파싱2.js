var najax = require('najax');
var jsdom = require("jsdom");
var fs = require("fs");



PostParser = function () {

}
// 
PostParser.prototype.executeParse = function(postparseurl, callback) {


var jquery = fs.readFileSync("js/jquery.js", "utf-8");
 
jsdom.env({
  url: postparseurl,
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;

    var isLectureBoard = false;
    if (postparseurl=='http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21709&siteId=cse&linkUrl=') {
    	isLectureBoard = true;
    }
    
    var returlArray = []
    $("#board-container div.list form table tbody tr").each(function () {

    	var writer = null;
    	if (isLectureBoard) {
	    	$(this).find('td').each(function () {

	    		if (!writer) {
		    		if (!$(this).attr('class')) {
		    			writer = $(this).html() 
		    			writer = writer.trim();
			    		writer = writer.trim();
			    		if (writer.search('&nbsp;')!=-1) {
			    			while (true) {
								var findIndex = writer.search('&nbsp;');
								if (findIndex==-1) break;
								else {
									var t1 = writer.substring(0, findIndex);
									var t2 = writer.substring(findIndex+'&nbsp;'.length, writer.length);
									writer = t1 + ' ' + t2;
								}
							}
			    			writer = writer.trim();
			    		}
		    		}	
	    		}
	    		
	    	})		
		}
    	
    	$(this).find('td.title').each(function () {

    		if ($(this).find('strong').html()) _title = $(this).find('strong').html();
	    	$(this).find('a').each(function() {
	    		var title = $(this).html();

	    		var href = 'http://uwcms.pusan.ac.kr/user/'+$(this).attr('href');

	    		if (title.search('<strong>')!=-1) {
	    			var sindex = title.search('<strong>');
	    			title = title.substring(0, sindex) + title.substring(sindex+'<strong>'.length, title.length);
	    			if (title.search('</strong>')!=-1) {
	    				var sbindex = title.search('</strong>');
		    			title = title.substring(0, sindex) + title.substring(sbindex+'</strong>'.length, title.length);
	    			}
	    		}
	    		if (title.search('<img')!=-1) {
	    			var t1 = title.substring(0, title.search('<img'))
	    			var t2 = title.substring(title.search('<img'), title.length);
	    			if (t2.search('>')) {
	    				t2 = t2.substring(t2.search('>')+'>'.length, title.length);
	    			}
	    			title = t1+t2;
	    		}
	    		if (title.search('<font')!=-1) {
	    			var t1 = title.substring(0, title.search('<font'))
	    			var t2 = title.substring(title.search('<font'), title.length);
	    			if (t2.search('</font>')) {
	    				t2 = t2.substring(t2.search('</font>')+'</font>'.length, title.length);
	    			}
	    			title = t1+t2;
	    		}

	    		title = title.trim();
	    		title = title.trim();
	    		if (title.search('&nbsp;')!=-1) {
	    			while (true) {
						var findIndex = title.search('&nbsp;');
						if (findIndex==-1) break;
						else {
							var t1 = title.substring(0, findIndex);
							var t2 = title.substring(findIndex+'&nbsp;'.length, title.length);
							title = t1 + ' ' + t2;
						}
					}
	    			title = title.trim();
	    			console.log("++++++++++++++++++++++++++++++++++++ I find trim!! : " + JSON.stringify(title));
	    		}
	    		// console.log(JSON.stringify({title:title, url:href}));

	    		if (writer) {
	    			title = writer + " | " + title;
	    		}
	    		returlArray.push({title:title, url:href})
	    	})
    	})

    	
    })
	callback(returlArray);
  }
});
};



String.prototype.trim = function () {
	var str = this;
	
	
	str = str.replace('/&nbsp;/gi;', '');
	str = str.replace('/\n/gi', '');
	str = str.replace('/\r/gi', '');
	str = str.replace('/\t/gi', '');
	if (str.length==0) return str;
	for (var i=0; i<str.length; i++) {
		if (str.charAt(i)==' ' 
			|| str.charAt(i)=='\n'
			|| str.charAt(i)=='\r'
			|| str.charAt(i)=='\t') {
			if (i==str.length-1) {
				str = '';
				break;
			}
			continue;
		}

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

	

	if (str.search('&nbsp;')==0) {
		str = str.substring('&nbsp;'.length, str.length);
		str = str.trim();
	}

	if (str.search('&nbsp;')!=-1 && str.search('&nbsp;')==str.length-'&nbsp;'.length) {
		str = str.substring(0, str.length-'&nbsp;'.length);
		str = str.trim();
	}
	
	return str;
}



exports.PostParser = PostParser;
