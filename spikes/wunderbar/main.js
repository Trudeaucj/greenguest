var relayr = require('relayr');

var relayrKeys = {
  app_id: "d7992799-c1a3-4c65-add7-36a9c80de205",
  dev_id: "e60e1ae5-a773-4455-8b52-ab33d5a68e71",
  token:  "rXqTUGm8yJvCQt_0Aogavo4DqlAfjY-p"
};

relayr.connect(relayrKeys);

relayr.listen(function(err,data){
  //fires for every sensor event
  if (err) {
    console.log("Oh No!", err)
  } else {
    console.log(data);
  }
});
