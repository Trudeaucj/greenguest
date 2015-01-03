var M2X = require('m2x');
var apiKey = process.env.M2X_API_KEY;
var deviceId = process.env.M2X_DEVICE_ID;
if (!apiKey) return console.log('Please set M2X_API_KEY environment variable first!');
if (!deviceId) return console.log('Please set M2X_DEVICE_ID environment variable first!');

var m2x = new M2X(apiKey);
m2x.devices.streamValues(deviceId, 'temperature', {}, function(data){
  console.log('Current temperature is %s', data.json.values[0].value);
});

m2x.devices.streamStats(deviceId, 'temperature', {}, function(data){
  console.log('Average temperature is %s', data.json.stats.avg);
});

m2x.devices.streamValues(deviceId, 'lightswitch', {}, function(data){
  console.log('Lightswitch is %s', data.json.values[0].value);
});

m2x.devices.streamValues(deviceId, 'proximity', {}, function(data){
  console.log('Proximity sensor determines room is %s', data.json.values[0].value);
});

m2x.devices.streamStats(deviceId, 'water', {}, function(data){
  console.log('Total water usage is %s gallons', data.json.stats.count * data.json.stats.avg);
});

m2x.devices.streamValues(deviceId, 'energy', {}, function(data){
  console.log('Current energy usage is %sW', data.json.values[0].value);
});

m2x.devices.streamStats(deviceId, 'energy', {}, function(data){
  var kwPerMin = data.json.stats.count * data.json.stats.avg / 1000;
  var kwPerHour = kwPerMin / 60;
  console.log('Total energy usage is %s kWH', kwPerHour );
});

