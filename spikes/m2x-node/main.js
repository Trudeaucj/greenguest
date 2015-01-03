var CronJob = require('cron').CronJob;

var M2X = require('m2x');
var apiKey = process.env.M2X_API_KEY;
var deviceId = process.env.M2X_DEVICE_ID;
if (!apiKey) return console.log('Please set M2X_API_KEY environment variable first!');
if (!deviceId) return console.log('Please set M2X_DEVICE_ID environment variable first!');

var m2x = new M2X(apiKey);

new CronJob('*/10 * * * * *', function(){
  var temp = 70 + (Math.random()*10);
  console.log('Temperature reading is %sF. Sending to M2X', temp);
  m2x.devices.setStreamValue(deviceId, 'temperature', {value: temp}, function(data){
    console.log(data);
  });
}, null, true, "America/Los_Angeles");