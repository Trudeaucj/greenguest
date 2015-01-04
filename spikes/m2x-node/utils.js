var request = require('browser-request'),
  Q = require('q'),
  _ = require('underscore');

var appKey = 'JE_4C8BB3F6D02E1B0B_1';
//var appKey = process.env.DIGITAL_LIFE_APP_KEY;
var userId = '553474459';
//var userId = process.env.DIGITAL_LIFE_USERID;
var password = 'NO-PASSWD';
//var password = process.env.DIGITAL_LIFE_PASSWORD;
var domain = 'DL';

if (!appKey) return console.log('Please set DIGITAL_LIFE_APP_KEY environment variable first!');
if (!userId) return console.log('Please set DIGITAL_LIFE_USERID environment variable first!');
if (!password) return console.log('Please set DIGITAL_LIFE_PASSWORD environment variable first!');

exports.serviceURL = "https://systest.digitallife.att.com:443/penguin/api/";


exports.post = function(options) {
  var temp = exports.serviceURL;
  temp = temp + options.API;

  var deferred = Q.defer();

  request.post({url:temp, qs:options.queryParameters, headers:options.headers, body:options.body}, function(error, response, body) {
    // Error with the actual request
    if (error) {
      return deferred.reject(error);
    }

    // Non-200 HTTP response code
    if (response.statusCode != 200) {
      return deferred.reject(error);
    }

    parsedBody = JSON.parse(body);

    // 200, but Error in token payload
    if (parsedBody.Error) return deferred.reject({'error':parsedBody.Message});
    deferred.resolve(parsedBody);
  });
  return deferred.promise;
};


exports.get = function(options) {
  var temp = exports.serviceURL;
  temp = temp + options.API;

  var deferred = Q.defer();

  request({url:temp, headers:options.headers}, function(error, response, body) {
    // Error with the actual request
    if (error) {
      return deferred.reject(error);
    }

    // Non-200 HTTP response code
    if (response.statusCode != 200) {
      return deferred.reject(response);
    }

    var parsedBody = JSON.parse(body);

    // 200, but Error in token payload
    if (parsedBody.Error) return deferred.reject({error: parsedBody});
    deferred.resolve(parsedBody);
  });
  return deferred.promise;
};

exports.getAuth = function(options) {
  options = {
    API : 'authtokens',
    queryParameters : {
      userId : userId,
      appKey : appKey,
      password : password,
      domain : domain
    }
  };
  return exports.post(options);
};

var gatewayId;
var authToken;
var requestToken;
var appKey;

exports.getDevices = function(options) {
  return exports.getAuth()
  .then(function (data) {
    gatewayId = data.content.gateways[0].id;
    authToken = data.content.authToken;
    requestToken = data.content.requestToken;
    options = {
      API : gatewayId + '/devices',
      headers : {
        Authtoken : authToken,
        Requesttoken: requestToken,
        Appkey : appKey
      }
    };
    return exports.get(options)
  });
};

//thermostat
//light switch
//motion detector
//door lock
//water sensor

exports.getDeviceByName = function(name) {
  var deferred = Q.defer();

  exports.getDevices()
  .then(function(devices) {
    deferred.resolve(_.where(devices.content, {'deviceType':name}));
  });
  return deferred.promise;
};

exports.turnDeviceOff = function() {
  return exports.getDeviceByName('smart-plug')
  .then(function(data) {
    var options = {
      headers : {
        Authtoken : authToken,
        Requesttoken: requestToken,
        Appkey : appKey
      },
      //'PE00000008' is the main stage smart plug
      API : gatewayId + '/devices/' + data[0].deviceGuid + '/switch',
      body : 'off'
    };
    return exports.post(options);
  });
};

//exports.turnDeviceOff().then(function(data) {console.log(data)});

exports.getAttributeByLabel = function(name, label) {
  var deferred = Q.defer();

  exports.getDeviceByName(name)
    .then(function(device) {
      deferred.resolve(_.where(device[0].attributes, {'label':label})[0]);
    });
  return deferred.promise;
};

exports.getThermostat = function() {
  return exports.getDeviceByName('thermostat')
};

exports.getThermostatAttributes = function() {
  return exports.getAttributeByLabel('thermostat', 'temperature');
};

//exports.getThermostatAttributes().then(function(data) {
//  console.log(data);
//});

exports.getWaterSensor = function() {
  return exports.getDeviceByName('water-sensor')
};

exports.getMontionSensor = function() {
  return exports.getDeviceByName('motion-sensor')
};

exports.getDoorlock = function() {
  return exports.getDeviceByName('door-lock')
};

exports.getDoorlock = function() {
  return exports.getDeviceByName('door-lock')
};
