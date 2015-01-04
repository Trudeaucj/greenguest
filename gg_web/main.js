loopCurrentTemp();
loopAverageTemp();
loopWater();
loopTowels();
loopEnergy();

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function convertToF(temp){
    var tempC = (temp / 2) - 40;
    return (tempC * 1.8) + 32;
};

var m2x = new M2X(getParameterByName('apiKey'));
var deviceId = getParameterByName('deviceId');

function getCurrentTemperature() {
  m2x.devices.streamValues(deviceId, 'temperature', {}, function(data){
    // console.log('Current temperature is %sF', data.values[0].value);
    $("#current-temperature").html(Math.round(convertToF(data.values[0].value)*1000)/1000);
    loopCurrentTemp();
  });
}

function loopCurrentTemp() {
  setTimeout(function(){
    getCurrentTemperature();
  },2000)
}

function getAverageTemperature() {
  m2x.devices.streamStats(deviceId, 'temperature', {}, function(data){
    $("#average-temperature").html(Math.round(convertToF(data.stats.avg)*1000/1000));
    loopAverageTemp();
  });
}

function loopAverageTemp() {
  setTimeout(function(){
      getAverageTemperature();
    },2000)
}

// function getLight() {
//   m2x.devices.streamValues(deviceId, 'lightswitch', {}, function(data){
//     console.log('Lightswitch is %s', data.values[0].value);
//   });
// }


// m2x.devices.streamValues(deviceId, 'proximity', {}, function(data){
//   console.log('Proximity sensor determines room is %s', data.values[0].value);
// });

// m2x.devices.streamValues(deviceId, 'door', {}, function(data){
//   console.log('Door is %s', data.values[0].value);
// });

function getWater() {
  m2x.devices.streamStats(deviceId, 'water', {}, function(data){
    // console.log('Total water usage is %s gallons', data.stats.count * data.stats.avg);
    $("#water-total").html(Math.round(data.stats.count * data.stats.avg * 1000)/1000);
    loopWater();
  });
}
function loopWater() {
  setTimeout(function(){
      getWater();
    },2000)
}

function getEnergy() {
  m2x.devices.streamStats(deviceId, 'energy', {}, function(data){
    var kwPerMin = data.stats.count * data.stats.avg / 1000;
    var kwPerHour = kwPerMin / 60;
    // console.log('Total energy usage is %s kWH', kwPerHour );
    $("#energy-total").html(kwPerHour);
    loopEnergy();
  });
}

function loopEnergy() {
  setTimeout(function(){
      getEnergy();
    },2000)
}

function neverForgetYourTowel() {
  m2x.devices.streamStats(deviceId, 'towel', {}, function(data){
    // console.log('%s towels have been replaced', data.stats.count * data.stats.avg);
    $("#towels-replaced").html(data.stats.count * data.stats.avg);
    loopTowels();
  });
}

function loopTowels() {
  setTimeout(function(){
      neverForgetYourTowel();
    },2000)
}