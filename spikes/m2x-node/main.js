var CronJob = require('cron').CronJob;

var M2X = require('m2x');
var apiKey = process.env.M2X_API_KEY;
var deviceId = process.env.M2X_DEVICE_ID;
if (!apiKey) return console.log('Please set M2X_API_KEY environment variable first!');
if (!deviceId) return console.log('Please set M2X_DEVICE_ID environment variable first!');

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
  app_id: "d7992799-c1a3-4c65-add7-36a9c80de205",
  dev_id: "e60e1ae5-a773-4455-8b52-ab33d5a68e71",
  token:  "rXqTUGm8yJvCQt_0Aogavo4DqlAfjY-p"
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
