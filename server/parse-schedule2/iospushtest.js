var apn = require('apn');


calliOSProductionPush({
	title:"[커피페이 동승민 개별공지]",
	desc:"그런 표정 짓는다고 물러주지 않습니다.",
	pushids:[
	"743a63059ce33774b28091dab523f5735161900ce5868e66ed8538bdc314a4c4",
	"f15cf060ac3b72ed9b3f7d04f48f41b70b97b1a36b4711a53ca9f1293880ce1e", 	// 승민
	"8a6b3d0ca32f63b395df021a5ab533918fe5fe7dce49d0c57268ae74948d7271",     // 동민
	]
})
/*
<canapio's ipad>
"_id": "600A4A41-6F7D-4821-89FA-454068BE6186",
"pushid": "743a63059ce33774b28091dab523f5735161900ce5868e66ed8538bdc314a4c4"

<승민>
"_id": "6FA73FEB-4C58-4B7A-8319-9E4C75694344",
"pushid": "f15cf060ac3b72ed9b3f7d04f48f41b70b97b1a36b4711a53ca9f1293880ce1e",

<동민>
"_id": "F1BDE1EF-AACF-4C49-9CDE-41F111E6B5BD",
"pushid": "8a6b3d0ca32f63b395df021a5ab533918fe5fe7dce49d0c57268ae74948d7271"

*/
function calliOSProductionPush (param) {
	var options = { 
		gateway : "gateway.push.apple.com",//"gateway.sandbox.push.apple.com", 
		cert: './keys3/cert_production.pem',
		key: './keys3/key_production.pem',
		production: true
	};

	var apnConnection = new apn.Connection(options);


	var note = new apn.Notification();
	note.badge = 1;
	note.sound = 'default'


	note.alert = param.title+" "+param.desc;
	note.payload = {
		lecture_id:"notice",
		title:param.title,
		desc:param.desc
	};

	
	if (param.pushids && typeof(param.pushids)==typeof([])) {
		console.log("push ios production 1");
		for(var i=0; i<param.pushids.length; i++) {
			try {
				console.log(i+" - push ios production 2 :" + param.pushids[i]);
				var token = param.pushids[i];//'앞에서 Xcode로 build 하면서 획득한 아이폰 디바이스 토큰을 입력한다.'
				var myDevice = new apn.Device(token);
				apnConnection.pushNotification(note, myDevice);
			} catch (e) {

			}	
		}	
	}
	console.log("end push ios production");

}