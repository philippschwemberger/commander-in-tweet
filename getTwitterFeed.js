/*Simple way of logging tweets with a certain parameter to the console
using the 'twit' package and twitter's streaming API*/

var Twit = require('twit')
var keys = require('./keys'); // import from keys.js file

var searchFor = require('./config').search_param;  //defined in object config.js
var language = require('./config').language_param;    //defined in object config.js


var T = new Twit(keys);


var stream = T.stream('statuses/filter', { track: searchFor, lang: language})

stream.on('tweet', function (tweet) {
  console.log(tweet.text);
})

