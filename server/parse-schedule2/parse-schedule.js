
var cron = require('node-schedule');
require('date-utils');

var exec = require('child_process').exec,
    child;


var rule = new cron.RecurrenceRule();
rule.minute = 0;
cron.scheduleJob(rule, function(){
    console.log(new Date(), 'Scheduling now');
    
    if (child) {
    	delete child;
    	child = null;
    }


	var nowdate = new Date();
	var datestring = nowdate.toFormat('YYYY_MM_DD');
	var logdir = '/usr/local/nodeprj3/parse-schedule2/log/'
    var execstr = 'forever -al '+logdir+datestring+'.log -ao '+logdir+datestring+'.out.log -ae '+logdir+datestring+'.err.log start parse-core3.js'
	child = exec(execstr,

	  function (error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});
});