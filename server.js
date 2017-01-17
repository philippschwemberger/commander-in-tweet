/*
Setting up a HTTP server and establishing a connection to twitter's' streaming API.
The tweets with a certain # (which is defined in config.js) are sent to the browser in a simple way.
*/

//setting up a server
var express = require('express');
var app = express();                    //initializes app to be a function handler
var http = require('http')
var server = http.createServer(app);    //supply the function handler to an HTTP server 

server.listen(8080);                    //HTTP server listens on port 8080

//twitter setup
var Twit = require('twit')
var keys = require('./keys');                               // import from keys.js file
var searchFor = require('./config').search_param;           //defined in object config.js
var language = require('./config').language_param;          //defined in object config.js

var T = new Twit(keys);

//Using the Streaming API
var stream = T.stream('statuses/filter', { track: searchFor, lang: language})

stream.on('tweet', function (tweet) {
  sendToBrowser(tweet.text);
})


//works in this way only for one tweet - refresh only logs ('sendTo...') again with same TwitterMsg
//so the event 'tweet' doesn't hand a new Msg to the function sendToBrowser or trigger sendToBrowser again
function sendToBrowser(twitterMsg){

  //define a route handler '/'  - the route handler get's hit when the website home is hit
  app.get('/', function(req, res){
    console.log('sendToBrowserTriggered');
    res.send('<p>' + twitterMsg + '</p>');  
  });

}

