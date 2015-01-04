# Setup
1. `cd gg_web`  
1. `bower install`  
1. `python -m SimpleHTTPServer 8004`  
1. visit `localhost:8004/index.html?apiKey=<KEY>&deviceId=<DEVICE>` for the hotel owner view
1. visit `localhost:8004/mobile.html?apiKey=<KEY>&deviceId=<DEVICE>` for the mobile guest view


http://localhost:8004/index.html  
http://localhost:8004/mobile.html  
http://localhost:8004/checkin.html  
http://localhost:8004/checkout.html  


/index and /mobile need the apiKey to show data. _The mobile progress bars aren't hooked up to live data._  The checkin -> mobile.html flow doesn't pass the apiKey because we are trying to keep that out of the repo.