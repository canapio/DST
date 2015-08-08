var najax = require('najax');


PostParser = function () {

}

PostParser.prototype.executeParse = function(postparseurl, callback) {
var _this = this;
najax({ 
	url:postparseurl, 
	type:'GET' 
}).success(function(html){
	

	var returnPostList = []

	var str;
	var findindex;


	str = "<td align=left>";//"<td align='center' class='listnum'";

	var tableHTMLArray = html.split(str);
	tableHTMLArray.splice(0, 1);
	for (var i=0; i<tableHTMLArray.length-1; i++) {

		tableHTMLArray[i] += tableHTMLArray[i+1];
		tableHTMLArray.splice(i+1, 1);
	}
	
	
	for (var i=0; i<tableHTMLArray.length; i++) {
		
		str = "<a href=";
		findindex = tableHTMLArray[i].search(str);
		tableHTMLArray[i] = tableHTMLArray[i].substring(findindex+str.length, tableHTMLArray[i].length);


	// 	console.log(tableHTMLArray[i]+"\n\n\n\n");

		str = ">";
		findindex = tableHTMLArray[i].search(str);
		tableHTMLArray[i] = tableHTMLArray[i].substring(findindex+str.length, tableHTMLArray[i].length);


		str = "</a>";
		findindex = tableHTMLArray[i].search(str);



		var _title = tableHTMLArray[i].substring(0, findindex);
		returnPostList.push({title:_title});



		// console.log("i:"+i);
	}



	


	callback(returnPostList);








}).error(function(err){

});
};



PostParser.prototype.trim = function (str) {
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

