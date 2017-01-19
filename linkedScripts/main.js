//this is the js which is doing all the pixi-work


var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor: 0x1099bb});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();


//start gameLoop()  - gets called every 60 seconds
gameLoop();
console.log('loop started');



var count = 0;  //don't know why the event is triggered twice

var socket = io();   //io() creates an instance of socket.io that can listen to the customEvent 'stream', made in server.js
//socket.connect('http://localhost:8080');  //no need to specifying any URL here since it defaults to trying to connect to the host that serves the page.

//triggered everytime a 'stream' event == a tweet comes in
socket.on('stream', function(tweet){  
    

    count += 1; 
 
    if(count %2 == 0){  //make sure text is only printed once

        //1 obj represents: text, user, rectangle
        var obj = new PIXI.Container();

        var rectWidth = 500;
        var rectHeight = 100;

        //create random positions for tweet obj
        var pos = [getRandomInt(0, window.innerWidth - rectWidth), getRandomInt(0, window.innerHeight - rectHeight)];

        var rectangle = new PIXI.Graphics();
            rectangle.lineStyle(1, 0xFFFFFF, 1);
            rectangle.beginFill(0x66CCFF);
            rectangle.drawRoundedRect(0, 0, rectWidth, rectHeight, 8);
            rectangle.endFill();
            rectangle.position.set(pos[0], pos[1]);
        
    
        
        //text processing
        var fontSzUser = 16;
        var fontSzTweet = 14;
        var fontSzTime = 12;
        var xOff = 10;
        var yOff = 10;
        var yOfftweet = 3.5*fontSzTweet;
      
        var tweetUser = tweet.user.name;
        var createdAt;
        var tweetText = tweet.text;

        createdAt = 'created at: ' + tweet.created_at.substring(11,19)+' GMT';


        var username = new PIXI.Text(tweetUser, {fontFamily: "Arial", fontSize: fontSzUser, fill: 'white'});
        username.position.set(pos[0] + xOff, pos[1] + yOff);

        var time = new PIXI.Text(createdAt, {fontFamily: "Arial", fontSize: fontSzTime, fill: 'white'});
        time.position.set(pos[0] + xOff, pos[1] + yOff + fontSzUser*1.15);

        var message = new PIXI.Text(tweetText, {fontFamily: "Arial", fontSize: fontSzTweet, fill: 'white', wordWrap: true, wordWrapWidth: (rectWidth-xOff*2)}); //fill: '#55ACEE' 
        message.position.set(pos[0] + xOff, pos[1] + yOfftweet);
     

        obj.addChild(rectangle);
        obj.addChild(username);
        obj.addChild(time);
        obj.addChild(message);

        //make sprites interactive
        obj.interactive = true;
        obj.on('mousedown', onMouseDown);
       
        function onMouseDown(){
            //remove obj when clicked on it
            stage.removeChild(this);
            console.log('object removed');
        }
        
        stage.addChild(obj);
        console.log('objects in stage: ' + stage.children.length);

        
        //if there are more than 5 tweets delete the first one
        if(stage.children.length > 3){
            stage.removeChild(stage.children[0]);
        }


    }  //end of if-loop (coping with doubled event)

}); //end of event 'stream'


function gameLoop(){
    requestAnimationFrame(gameLoop);

    renderer.render(stage);
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}