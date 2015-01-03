var request = require('request'),
  Q = require('q');

var appKey = process.env.DIGITAL_LIFE_APP_KEY;
var userId = process.env.DIGITAL_LIFE_USERID;
var password = process.env.DIGITAL_LIFE_PASSWORD;
var domain = 'DL';

if (!appKey) return console.log('Please set DIGITAL_LIFE_APP_KEY environment variable first!');
if (!userId) return console.log('Please set DIGITAL_LIFE_USERID environment variable first!');
if (!password) return console.log('Please set DIGITAL_LIFE_PASSWORD environment variable first!');

exports.serviceURL = "https://systest.digitallife.att.com:443/penguin/api/";


exports.get = function(options) {
  var temp = exports.serviceURL;
  temp = temp + options.API;

  var deferred = Q.defer();

  request.post({url:temp, qs:options.queryParameters}, function(error, response, body) {
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
  exports.get(options)
    .then(function(data) {
      console.log(data);
    })
    .fail(function(error) {
      console.log(error);
    });
};

exports.getAuth();