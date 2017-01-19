//PIXI   

/*//Aliases
var Container = PIXI.Container();*/


var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();


var count = 0;  //don't know why the event is triggered twice

var socket = io();   //io() creates an instance of socket.io that can listen to the customEvent 'stream', made in server.js
//socket.connect('http://localhost:8080');  //no need to specifying any URL here since it defaults to trying to connect to the host that serves the page.
socket.on('stream', function(tweet){  
    
    var tweetText = tweet.text;
    var tweetUser = tweet.user.name;

    count += 1; 

    //if there are more than 5 tweets delete the first one
    if(stage.children.length > 5){
        stage.removeChild(stage.children[0]);
    }
        
    if(count %2 == 0){  //make sure text is only printed once
        //console.log('event happened' + tweet.text);

        var obj = new PIXI.Container();

        var rectWidth = 500;
        var rectHeight = 100;

        var pos = [getRandomInt(0, window.innerWidth - rectWidth), getRandomInt(0, window.innerHeight - rectHeight)];

        var rectangle = new PIXI.Graphics();
            //rectangle.lineStyle(4, 0xFF3300, 1);
            rectangle.beginFill(0x66CCFF);
            rectangle.drawRect(0, 0, rectWidth, rectHeight);
            rectangle.endFill();
            rectangle.position.set(pos[0], pos[1]);
        
    
        
        //text processing
        var fontSzUser = 16;
        var fontSztweet = 14;
        var xOff = 10;
        var yOff = 10;
        var yOfftweet = 3*fontSztweet;
        var chunks = [];  //divide tweet in two lines

        for (var i = 0; i < tweetText.length; i += 70) {
            chunks.push(tweetText.substring(i, i + 70));
        } 
    
        /*console.log('chunk one ' + chunks[0]);
        console.log('chunk two ' + chunks[1]);*/

        

        var username = new PIXI.Text(tweetUser, {fontFamily: "Arial", fontSize: fontSzUser, fill: 'white'});
        username.position.set(pos[0] + xOff, pos[1] + yOff);

        var tweetp1 = new PIXI.Text(chunks[0], {fontFamily: "Arial", fontSize: fontSztweet, fill: 'white'}); //fill: '#55ACEE' 
        tweetp1.position.set(pos[0] + xOff, pos[1] + yOfftweet);

        var tweetp2 = new PIXI.Text(chunks[1], {fontFamily: "Arial", fontSize: fontSztweet, fill: 'white'}); //fill: '#55ACEE' 
        tweetp2.position.set(pos[0] + xOff, pos[1] + yOfftweet + fontSztweet*1.2);

        obj.addChild(rectangle);
        obj.addChild(username);
        obj.addChild(tweetp1);
        obj.addChild(tweetp2)
        
        stage.addChild(obj);
        renderer.render(stage);   //here the pixi magic happens

        console.log(stage.children.length);
    }


});



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}