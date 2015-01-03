exports.get = function(options) {
  var deferred = Q.defer();

  var headers = buildHeader(options);

  request({url:buildUrl(options), qs:options.queryParameters, headers:headers}, function(error, response, body) {
    // Error with the actual request
    if (error) {
      return deferred.reject(error);
    }

    // Non-200 HTTP response code
    if (response.statusCode != 200) {
      return deferred.reject(buildError(options, response, body));
    }

    var parsedBody;
    if (options.contentType) {
      xml.getCleansedObjectFromXmlBody(body, function (err, result) {
        if (err){
          parsedBody = err;
        } else {
          parsedBody = result;
        }
      });
    } else {
      parsedBody = JSON.parse(body);
    }

    // 200, but Error in token payload
    if (parsedBody.Error) return deferred.reject({'error':parsedBody.Message});
    deferred.resolve(parsedBody);
  });
  return deferred.promise;
};
