setTimeout(function () {
	console.log("test1");
	setTimeout(function () {
		console.log("test2");
		setTimeout(function () {
			console.log("test3");
		}, 1000);
	}, 1000);
}, 1000);