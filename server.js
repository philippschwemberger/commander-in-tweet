/*
This is the application's server part
Setting up a HTTP server and establishing a connection to twitter's' streaming API.
*/

//setting up a server
var express = require('express');
var app = express();                    //initializes app to be a function handler
var http = require('http');
var server = http.createServer(app);    //supply the function handler to an HTTP server 
var io = require('socket.io').listen(server);

server.listen(8080);                    //HTTP server listens on port 8080

//twitter setup
var Twit = require('twit');
var keys = require('./keys');                               // import from keys.js file
var searchFor = require('./config').search_param;           //defined in object config.js
var language = require('./config').language_param;          //defined in object config.js

var T = new Twit(keys);


 //define a route handler '/'  - the route handler get's hit when the website home is hit
app.get('/', function(req, res){    //GET request on homepage
  res.sendFile(__dirname + '/index.html');  //serves the index file to the browser
});



io.sockets.on('connection', function (socket) {
  console.log('Connected');

  var stream = T.stream('statuses/filter', { track: searchFor, lang: language});
          //T.stream connects with twitter API, keeps the connection alive & returns an event Emitter, 
          //which emits an event for tweets with our params - the event we are listening to is defined in stream.on('tweet', ...) could also be 'delete', etc.

  stream.on('tweet', function (tweet) {   //tweet in cb-function rep the data {} - coming from the open stream and the filter parmas
    io.sockets.emit('stream',tweet);     //emits data to the client part, 'stream' is the customEventsName, tweet is the data to be sent
  });


}); 

