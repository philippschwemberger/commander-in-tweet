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

var portNr = require('./config/listenAtPort').port;
server.listen(portNr);                    //HTTP server listens on port defined in config folder, set to 8080

//twitter setup
var Twit = require('twit');
var keys = require('./config/yourKeys');                               // import from yourKeys.js file
var searchFor = require('./config/searchParams').search_param;           //defined in object config.js
var language = require('./config/searchParams').language_param;          //defined in object config.js

var T = new Twit(keys);

//handing the dir of main.js files to the browser

//var path = require('path');
//app.use(express.static(path.join(__dirname, 'linkedScripts')));   //js file has to be in dir: 'linkedScripts'

//if I don't want to have my .js file in another dir I could use this, 
app.use(express.static('../commander-in-tweet')); //move up one directory and then the dir the file is in -> main directory
//but then the dir of all files had to be called 'commander-in-tweet' on each users computer

//serve music files
app.use(express.static(__dirname + '/public'));

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
    console.log('tweeted');
  });


}); 

