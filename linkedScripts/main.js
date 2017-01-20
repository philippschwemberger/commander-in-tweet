//this is the js which is doing all the pixi-work and receiving the tweet-data via socket.io


var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor: 0x1099bb, resolution: 1});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
var allObj = new PIXI.Container();  //container for the diff parts of one tweet
var trump;

var score = 0;
var maxTweets = 8;




//load & place trump
//load explosions
PIXI.loader.add([   //only one loader function allowed
    'http://i.imgur.com/MbjpZIK.png', 'http://i.imgur.com/iaJheYx.png', 'http://i.imgur.com/zYWTVSo.png', 'http://i.imgur.com/XyGIMu1.png', 
]).load(loadFinished); 
//this loads the image as webgl ready texture to >>PIXI.utils.TextureCache[nameOfFile]<<

function loadFinished(){
    console.log('pic loaded');
    trump = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/MbjpZIK.png'].texture);
    trump.anchor.set(0.5, 1);
    trump.scale.set(0.5, 0.5);
    trump.position.set(window.innerWidth/2, window.innerHeight);
    stage.addChild(trump);

    exp1 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/iaJheYx.png'].texture);
    exp2 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/zYWTVSo.png'].texture);
    exp3 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/XyGIMu1.png'].texture);
}





var count = 0;  //don't know why the event is triggered twice

var socket = io();   //io() creates an instance of socket.io that can listen to the customEvent 'stream', made in server.js
//socket.connect('http://localhost:8080');  //no need to specifying any URL here since it defaults to trying to connect to the host that serves the page.

//triggered everytime a 'stream' event == a tweet comes in
socket.on('stream', function(tweet){  
    

    count += 1; 
 
    if(count %2 == 0 && frameCount > 100){  //make sure text is only printed once

        //1 obj represents: text, user, rectangle
        var obj = new PIXI.Container();

        var rectWidth = 500;
        var rectHeight = 115;

        //var takenPos = [];

        //create random positions for tweet obj
        var pos = [getRandomInt(0, window.innerWidth - rectWidth), getRandomInt(0, window.innerHeight - rectHeight - trump.height)];
        
       
        /*if(takenPos.length > maxTweets){
            takenPos.splice(takenPos[0], 1);
        }
        takenPos.push(pos);
        console.log(takenPos[0]);*/
        

        var rectangle = new PIXI.Graphics();
            rectangle.lineStyle(1, 0x000000, 0.5);
            rectangle.beginFill(0xFFFFFF);
            rectangle.drawRect(0, 0, rectWidth, rectHeight);
            rectangle.endFill();
            rectangle.position.set(pos[0], pos[1]);
        
    
        
        //TWEET text processing
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


        var username = new PIXI.Text(tweetUser, {fontFamily: "Arial", fontSize: fontSzUser, fill: '#000000'});
        username.resolution = 2;    //don't know it that really helps
        username.position.set(pos[0] + xOff, pos[1] + yOff);

        var time = new PIXI.Text(createdAt, {fontFamily: "Arial", fontSize: fontSzTime, fill: '#000000'});
        time.resolution = 2;
        time.position.set(pos[0] + xOff, pos[1] + yOff + fontSzUser*1.15);

        var message = new PIXI.Text(tweetText, {fontFamily: "Arial", fontSize: fontSzTweet, fill: '#000000', wordWrap: true, wordWrapWidth: (rectWidth-xOff*2)}); //fill: '#55ACEE' 
        message.position.set(pos[0] + xOff, pos[1] + yOfftweet);
     

    

        obj.addChild(rectangle);
        obj.addChild(username);
        obj.addChild(time);
        obj.addChild(message);

        //make sprites interactive
        obj.interactive = true;
        obj.on('mousedown', onMouseDown);
       
        function onMouseDown(event){    //mouseEvent
            var x = event.data.getLocalPosition(obj).x;     //get the mouseX,Y where the user clicked
            var y = event.data.getLocalPosition(obj).y;
            //remove obj when clicked on it
            allObj.removeChild(this);
            console.log('object removed');
            explode(x, y);  //call explosion function and place it at the last click on an interactive sprite
            score++;
            scoreText.text = 'Your score is:\n' + score + ' points'

            //check for ever n display an award message
            if(score %5 == 0){
                displayAward(awardCount);
                awardCount++;
            }
        }
        
        allObj.addChild(obj);
        stage.addChild(allObj);
        console.log('objects in stage: ' + allObj.children.length);

        
        //if there are more than 5 tweets delete the first one
        if(allObj.children.length > maxTweets){
            allObj.removeChild(allObj.children[0]);
        }


    }  //end of if-loop (coping with doubled event)

}); //end of event 'stream'



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//WORKAROUND because I had troubles with PIXI.MovieClie or PIXI.animatedSprite for making sprite sheet animations 
function explode(x, y){
    exp1 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/iaJheYx.png'].texture);
     exp1.anchor.set(0.5, 0.7);
     exp1.position.set(x, y);
    exp2 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/zYWTVSo.png'].texture);
     exp2.anchor.set(0.5, 0.7);
     exp2.position.set(x, y);
    exp3 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/XyGIMu1.png'].texture);
     exp3.anchor.set(0.5, 0.7);
     exp3.position.set(x, y);
     console.log(x, + 'y: ' + y);

     var time = 400;

    stage.addChild(exp1);
    setTimeout(function(){
        stage.removeChild(exp1);
        stage.addChild(exp2);
        setTimeout(function(){
            stage.removeChild(exp2);
            stage.addChild(exp3);
            setTimeout(function(){
                stage.removeChild(exp3);
                //stage.addChild(exp n);
            }, time);
        }, time);
    }, time);
}



//variable Text on screen
var style = {
    fontFamily : 'Arial',
    fontSize : '48px',
    fontStyle : 'italic',
    fontWeight : 'bold',
    fill : '#F7EDCA',
    stroke : '#4a1850',
    strokeThickness : 5,
    dropShadow : true,
    dropShadowColor : '#000000',
    dropShadowAngle : Math.PI / 6,
    dropShadowDistance : 6,
    wordWrap : true,
    wordWrapWidth : 1000
};

//initial text        
var gameText = new PIXI.Text('Play the most overrated game on the web!', style);
        gameText.anchor.set(0.5, 0.5);
        gameText.position.set(window.innerWidth/2, window.innerHeight/2-250);

var hashtag = new PIXI.Text('#NotMyPresident', {fontFamily: "Arial", fontSize: 48, fontStyle : 'italic', fontWeight : 'bold',fill: '#FF0000'});
        hashtag.anchor.set(0.5, 0.5);
        hashtag.position.set(window.innerWidth/2, window.innerHeight/2-150);

var instructions = new PIXI.Text('Click on the incoming tweets to gain points!', {fontFamily: "Arial", fontSize: 36, fontWeight : 'bold',fill: '#F7EDCA', stroke : '#4a1850', strokeThickness : 2, dropShadow : true,
            dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
        instructions.anchor.set(0.5, 0.5);
        instructions.position.set(window.innerWidth/2, window.innerHeight/2);

    stage.addChild(gameText);
    stage.addChild(hashtag);
    stage.addChild(instructions);

//score:
var scoremsg = 'Your score is:\n' + score + ' points';
var scoreText = new PIXI.Text(scoremsg, {fontFamily: "Arial", fontSize: 30, fontStyle : 'italic', fontWeight : 'bold', fill: '#FF0000', 
    stroke : '#4a1850',strokeThickness : 3,dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
        //scoreText.anchor.set(0.5, 0.5);
        scoreText.position.set(150, window.innerHeight-150);
    
    stage.addChild(scoreText);

//award words 7items
var awards = ["You have such great potential. But you are just sitting around and having a good time. So sad!", "you're highly overrated!",
  "Hmmm, not so bad. You want to be in my cabinet?", "Bigly!!!", "Amazing!", "Tremendous!"]

var awardText = new PIXI.Text('', {fontFamily: "Arial", fontSize: 30, fontStyle : 'italic', fontWeight : 'bold', fill: '#FF0000', 
    stroke : '#4a1850',strokeThickness : 3,dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6,
    wordWrap : true, wordWrapWidth : 500});
        //scoreText.anchor.set(0.5, 0.5);
        awardText.position.set(window.innerWidth/2+170, window.innerHeight-200);        //trump.x +trump.width, trump.y -trump.height); -> i think trump is at this point undefined
        awardText.rotation = 6.13;

    stage.addChild(awardText);

//counts for gameLoop
var frameCount = 0;
var awardCount = 0;

//start gameLoop()  - gets called every 60 seconds
gameLoop();
console.log('loop started');

//looping function
function gameLoop(){
    requestAnimationFrame(gameLoop);

    if(frameCount>500){
        gameText.visible = false;
        hashtag.visible = false;
        instructions.visible = false;
    }
    frameCount++;

    

    renderer.render(stage);
}

//gets called in mouseDown 
function displayAward(i){
    awardText.text = awards[i];
   setTimeout(function(){
        awardText.text = '';
    }, 5000);
}

