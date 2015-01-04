var CronJob = require('cron').CronJob;

var M2X = require('m2x');
var apiKey = process.env.M2X_API_KEY;
var deviceId = process.env.M2X_DEVICE_ID;
var wunderAppId = process.env.WUNDER_APP_ID;
var wunderDevId = process.env.WUNDER_DEV_ID;
var wunderToken = process.env.WUNDER_TOKEN;
if (!apiKey) return console.log('Please set M2X_API_KEY environment variable first!');
if (!deviceId) return console.log('Please set M2X_DEVICE_ID environment variable first!');
if (!wunderAppId) return console.log('Please set wunderAppId environment variable first!');
if (!wunderDevId) return console.log('Please set wunderDevId environment variable first!');
if (!wunderToken) return console.log('Please set wunderToken environment variable first!');

var m2x = new M2X(apiKey);

//new CronJob('*/10 * * * * *', function(){
//  var temp = 70 + (Math.random()*10);
  //utils.getThermostatAttributes().then(function(data) {
  //  console.log(data);
  //  console.log('Temperature reading is %sF. Sending to M2X', data.value);
  //  m2x.devices.setStreamValue(deviceId, 'temperature', {value: data.value}, function(data){
  //    console.log(data);
  //  });
  //});
//
//}, null, true, "America/Los_Angeles");
//

var sendToM2x = function(value, callback) {
  m2x.devices.setStreamValue(deviceId, 'towel', {value: value}, callback);
};


var relayr = require('relayr');

var relayrKeys = {
  app_id: wunderAppId,
  dev_id: wunderDevId,
  token:  wunderToken
};

relayr.connect(relayrKeys);

var watchingForTowelChange = 0;

relayr.listen(function(err,data){
  //fires for every sensor event
  if (err) {
    console.log("Oh No!", err)
  } else {
    console.log(data);
    if ((data.prox > 1500) && (watchingForTowelChange > 3)) {
      watchingForTowelChange = 0;
      sendToM2x(1, function(data) {
        console.log(data);
      })
    }
    if (data.prox < 1000) {
      watchingForTowelChange++;
    }
  }
});
