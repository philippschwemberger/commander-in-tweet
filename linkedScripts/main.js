//this is the js which is doing all the pixi-work and receiving the tweet-data via socket.io

/*
content:
+++ 1.) global variables used in functions +++

+++ 2.) preparation +++

+++ 3.) tweet-Event +++

+++ 4.) defining functions +++

+++ 5.) gameLoop +++
*/


//------------------------------------------------------------------------
//+++
//1.) global variables used in functions
//+++

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor: 0x00ACED, resolution: 1, antialias: true});
document.body.appendChild(renderer.view);

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var screenWidthHalf = screenWidth/2;
var screenHeightHalf = screenHeight/2;

var stage = new PIXI.Container();
var allObj = new PIXI.Container();  //container for the diff parts of one tweet
var background = new PIXI.Container();  //if background pics and instructions text are not in different containers they disply in wrong order
var instructions = new PIXI.Container();
var expContainer = new PIXI.Container();

var trump;
var eagle;
var commanderTxt;
var credits;
var majorKong;

var won;

var score = 0;

var timerScreen1 = 150;
var timerScreen2 = 700; //700

var maxTweets = 3;  //if there is no more space after 3 to 4 tweets they will overlap -- safetyBreak prevents the while loop from running more than n-times

var fontInstr = 'Press Start 2P';

var rectWidth = 500;    //measurements of tweetTexture
var rectHeight = 197; //measurements of tweetTexture former 115;

var frameCount = 0;
var awardCount = 0;





//------------------------------------------------------------------------
//+++
//2.) preparation
//+++

//load all pictures
PIXI.loader.add([   //only one loader function allowed
  'http://i.imgur.com/B6853Id.png', 'http://i.imgur.com/tUFWnMU.jpg', 'http://i.imgur.com/Ah0bauM.png', 'http://i.imgur.com/567woI1.png', 'http://i.imgur.com/6msh6C3.png', 'http://i.imgur.com/iaJheYx.png', 'http://i.imgur.com/zYWTVSo.png', 'http://i.imgur.com/XyGIMu1.png', 
]).load(loadFinished); //sprites are created in loadFinished-function   -> everything on 1st screen
//this loads the image as webgl ready texture to >>PIXI.utils.TextureCache[nameOfFile]<<


//text on 2nd screen     
var gameText = new PIXI.Text('Play the most overrated game on the web!', {fontFamily : fontInstr, fontSize : screenWidth/48, fill : '#FFFFFF', 
        dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6, wordWrap : true, wordWrapWidth : 1500});
    gameText.anchor.set(0.5, 0.5);
    gameText.position.set(window.innerWidth/2, window.innerHeight/2- 2*screenHeightHalf/3);

var hashtag = new PIXI.Text('#NotMyPresident', {fontFamily: fontInstr, fontSize: screenWidth/48, fontStyle : 'italic', fontWeight : 'bold',fill: '#FF0000'});
    hashtag.anchor.set(0.5, 0.5);
    hashtag.position.set(window.innerWidth/2, window.innerHeight/2-screenHeightHalf/2.5);

var instr = new PIXI.Text('Click on the incoming tweets to gain points!', {fontFamily: fontInstr, fontSize: screenWidth/64, fill: '#00ACED',
        dropShadow : false, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
    instr.anchor.set(0.5, 0.5);
    instr.position.set(window.innerWidth/2, window.innerHeight/2 - screenHeightHalf/8);

var bgIncomingTw = new PIXI.Graphics();
    bgIncomingTw.beginFill(0xFFFFFF);
    bgIncomingTw.drawRoundedRect(helperWidth(200), instr.position.y-helperWidth(25) , helperWidth(1125), helperWidth(45), helperWidth(10)); 
    bgIncomingTw.endFill();

var gameStart = new PIXI.Text('Game starts in: ', {fontFamily : fontInstr, fontSize : screenWidth/64, fill : '#FFFFFF', 
        dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
    gameStart.anchor.set(0.5, 0.5);
    gameStart.position.set(window.innerWidth/2, window.innerHeight/2+ screenHeightHalf/7);

    //adding to container
    instructions.addChild(bgIncomingTw);
    instructions.addChild(gameText);
    instructions.addChild(hashtag);
    instructions.addChild(instr);
    instructions.addChild(gameStart);

    instructions.visible = false;
   
    //tricky with display-order: text in front of pictures
    stage.addChild(background);
    stage.addChild(instructions);
    stage.addChild(expContainer);
    

//text on 3rd screen
var scoremsg = 'SCORE:';
var scoreText = new PIXI.Text(scoremsg, {fontFamily: fontInstr, fontSize: screenWidth/64, fill: '#FFFFFF', 
        dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
    scoreText.position.set(helperWidth(150), window.innerHeight-helperHeight(150));
    
    stage.addChild(scoreText);

var scorePt = score + ' points';
var scorePtText = new PIXI.Text(scorePt, {fontFamily: 'Press Start 2P', fontSize: screenWidth/85, fill: '#FFFFFF', 
        dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
    scorePtText.position.set(helperWidth(150), window.innerHeight-helperHeight(100));

var rdRect = new PIXI.Graphics();
    rdRect.beginFill(0x00ACED);
    rdRect.drawRoundedRect(scorePtText.position.x-helperWidth(20), scorePtText.position.y-helperWidth(15), helperWidth(190), helperWidth(45), helperWidth(10)); // drawRoundedRect(x, y, width, height, radius)
    rdRect.endFill();
    
    stage.addChild(rdRect);
    stage.addChild(scorePtText);

    scoreText.visible = false;
    scorePtText.visible = false;
    rdRect.visible = false;


var awards = ["You have such great potential. But you are just sitting around and having a good time. So sad!", "you're highly overrated!",
  "Hmmm, not so bad. You want to be in my cabinet?", "BIGLY !!!", "AMAZING!", "TREMENDOUS!"]

var awardText = new PIXI.Text('', {fontFamily: "Arial", fontSize: screenWidth/42, fontStyle : 'italic', fontWeight : 'bold', fill: '#00ACED', 
        dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 4, wordWrap : true, wordWrapWidth : helperWidth(500)});
        awardText.position.set(window.innerWidth/2+helperWidth(170), window.innerHeight-helperHeight(200));        
        awardText.rotation = 6.13;

    stage.addChild(awardText);



//text on 4th screen
won1 = new PIXI.Text('CONGRATULATIONS', {fontFamily: fontInstr, fontSize: screenWidth/40, fill: '#FFFFFF', 
        dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
    won1.anchor.set(0.5, 0.5);
    won1.position.set(window.innerWidth/2, window.innerHeight/2- screenHeightHalf/6);

won2 = new PIXI.Text('YOU ARE A GREAT COMMANDER-IN-TWEET', {fontFamily: fontInstr, fontSize: screenWidth/48, fill: '#FFFFFF', 
        dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
    won2.anchor.set(0.5, 0.5);
    won2.position.set(window.innerWidth/2, window.innerHeight/2);

    stage.addChild(won1);
    stage.addChild(won2);
    won1.visible = false;
    won2.visible = false;



//SOUND
var sound = new Howl({
            src: ['/marchingCut.mp3'],
            loop: true
          });

sound.once('load', function(){
    console.log('sound loaded')
    setTimeout(function(){
            sound.play();
        }, 11666);    //msec vs framecount!!!
       
});


//------------------------------------------------------------------------
//+++
//3.) tweet-Event
//+++

var count = 0;  //don't know why the event is triggered twice

var socket = io();   //io() creates an instance of socket.io that can listen to the customEvent 'stream', made in server.js
//socket.connect('http://localhost:8080');  //no need to specifying any URL here since it defaults to trying to connect to the host that serves the page.

socket.on('stream', function(tweet){    //triggered everytime a 'stream' event == a tweet comes in
    
    count += 1; 
 
    if(count %2 == 0 && frameCount > timerScreen2 && allObj.children.length < maxTweets){  //make sure text is only printed once, and not more than the maxTweets are shown

        //1 obj represents: text, user, tweetTexture
        var obj = new PIXI.Container();

        //create random positions for tweet obj
        var pos;
        
        calcPos();
       
        function calcPos(){
            //first try
            pos = [getRandomInt(0, window.innerWidth - rectWidth), getRandomInt(0, window.innerHeight - rectHeight - trump.height)];

            var safetyBreak = 0;
            while(checkOverlap()){    //if it overlaps create a new pos     
                pos = [getRandomInt(0, window.innerWidth - rectWidth), getRandomInt(0, window.innerHeight - rectHeight - trump.height)];
                console.log('retry');
                safetyBreak++;
                if(safetyBreak > 20){
                    break;
                }
            }
        }
      
        function checkOverlap(){  //loop through all exiting objs
         var result = false;
            for(var i = 0; i<allObj.children.length; i++){

                //get obj(i) and then get the first one of it's children (=tweetTexture)
                var x1 = allObj.getChildAt(i).getChildAt(0).getGlobalPosition().x;  //I can't access via: obj.tweetTexture.getGlo...
                var y1 = allObj.getChildAt(i).getChildAt(0).getGlobalPosition().y;

                if(pos[0] >= (x1 -rectWidth) && pos[1] >= (y1-rectHeight) && pos[0] <= (x1 + rectWidth) && pos[1] <= (y1 + rectHeight)){
                    result = true;
                    console.log('overlapping!!!!')
                }
            }
         return result;
        }

        //create tweet background with untaken position
        var tweetTexture = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/6msh6C3.png'].texture);
            tweetTexture.position.set(pos[0], pos[1]);
        
        //TWEET text processing
        var fontSzUser = 16;
        var fontSzTweet = 14;
        var fontSzTime = 14;
        var xOff = 23;
        var yOff = 23;
        var yOfftweet = 4*fontSzTweet;
      
        var tweetUser = tweet.user.name;
        var createdAt;
        var tweetText = tweet.text;

        createdAt = 'created at: ' + tweet.created_at.substring(11,19)+' GMT';


        var username = new PIXI.Text(tweetUser, {fontFamily: "Arial", fontSize: fontSzUser, fontWeight : 'bold', fill: '#000000'});
            username.resolution = 2;    //don't know it that really helps
            username.position.set(pos[0] + xOff, pos[1] + yOff);

        var time = new PIXI.Text(createdAt, {fontFamily: "Arial", fontSize: fontSzTime, fill: '#000000'});
            time.resolution = 2;
            time.position.set(pos[0] + xOff, pos[1] + yOff + fontSzUser*1.45);

        var message = new PIXI.Text(tweetText, {fontFamily: "Arial", fontSize: fontSzTweet, fill: '#000000', wordWrap: true, wordWrapWidth: (rectWidth-xOff*2)}); //fill: '#55ACEE' 
            message.position.set(pos[0] + xOff, pos[1] + yOff + yOfftweet);
     
        //adding to container
        obj.addChild(tweetTexture);
        obj.addChild(username);
        obj.addChild(time);
        obj.addChild(message);

        //make sprites interactive
        obj.interactive = true;
        obj.on('mousedown', onMouseDown);

        //onMouseDown doesn't work if it's outside of if-loop
        function onMouseDown(event){    //mouseEvent
            var x = event.data.getLocalPosition(obj).x;     //get the mouseX,Y where the user clicked
            var y = event.data.getLocalPosition(obj).y;
            //remove obj when clicked on it
            allObj.removeChild(this);
            console.log('object removed');
            explode(x, y);  //call explosion function and place it at the last click on an interactive sprite
            score++;
            scorePtText.text = score + ' points'

            //check for every n display an award message
            if(score %5 == 0){
                displayAward(awardCount);
                awardCount++;
            }
        }

       

       
        //adding to container
        allObj.addChild(obj);
        
        stage.addChild(allObj);
        console.log('objects in stage: ' + allObj.children.length);

        /*//way of keeping the feed up to date - but it reduces readability
        //if there are more than 5 tweets delete the first one
        if(allObj.children.length > maxTweets){
            allObj.removeChild(allObj.children[0]);
        }*/

    }  //end of if-loop (coping with doubled event)

}); //end of event 'stream'


//------------------------------------------------------------------------
//+++
//4.) defining functions
//+++

function helperWidth(value){  //number that fits for 1536px, actual screenWidth/screenHeight
    return value*screenWidth/1536;    //1536px = width at 1920x1080px screen
}

function helperHeight(value){  //number that fits for 1536px, actual screenWidth/screenHeight
    return value*screenHeight/736;    //736px = height at 1920x1080px screen
}

function loadFinished(){
    console.log('pic loaded');

    //1st screen
    eagle = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/B6853Id.png'].texture);
    eagle.anchor.set(0.5, 0.5);
    eagle.scale.set(helperHeight(424)/eagle.width, helperHeight(424)/eagle.width);  //424px = trumps height at 1080px screen 
    eagle.position.set(window.innerWidth/2, window.innerHeight/2-screenHeightHalf/3.7);

    commanderTxt = new PIXI.Text('COMMANDER-IN-TWEET', {fontFamily: "Kumar One"  , fontSize: screenWidth/32, fontWeight : 'bold',fill: '#FFFFFF', dropShadow : true,
            dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6 });
    commanderTxt.anchor.set(0.5, 0.5);
    commanderTxt.position.set(window.innerWidth/2, window.innerHeight/2 + screenHeightHalf/2);

    credits = new PIXI.Text("credits: Stanley Kubrick, Dr. Strangelove; When Johnny Comes Marching Home", {fontFamily: "Arial"  , fontSize: screenWidth/85, fontWeight : 'bold',fill: '#FFFFFF', dropShadow : true,
            dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 1 });
    credits.anchor.set(0.5, 0.5);
    credits.position.set(window.innerWidth/2, window.innerHeight - screenHeightHalf/8);

    //2nd screen
    trump = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/567woI1.png'].texture);
    trump.anchor.set(0.5, 1);
    var calcHelp = 362*screenHeight/736;    //362px trump.width at fullscreen , 736 screenHeight bei 1080px
    trump.scale.set(calcHelp/trump.width, calcHelp/trump.width);
    trump.position.set(window.innerWidth/2, window.innerHeight);
    stage.addChild(trump);

    //3rd screen
    majorKong = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/tUFWnMU.jpg'].texture);
    majorKong.anchor.set(0.5, 0.5);
    majorKong.scale.set(screenWidth/majorKong.width, screenWidth/majorKong.width);
    majorKong.position.set(window.innerWidth/2, window.innerHeight/2);
    
    //adding to container
    background.addChild(eagle);
    background.addChild(commanderTxt);
    background.addChild(credits);

    background.addChild(majorKong);
    background.addChild(trump);
    trump.visible = false;
    majorKong.visible = false;

}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//WORKAROUND because I had troubles with PIXI.MovieClie or PIXI.animatedSprite for making sprite sheet animations 
function explode(x, y){
new Howl({src: ['/explosion.mp3'], volume: 0.3}).play();

    exp1 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/iaJheYx.png'].texture);
     exp1.anchor.set(0.5, 0.7);
     exp1.scale.set(helperHeight(320)/exp1.width);  //320 at 1920screen
     exp1.position.set(x, y);
    exp2 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/zYWTVSo.png'].texture);
     exp2.anchor.set(0.5, 0.7);
     exp2.scale.set(helperHeight(320)/exp2.width); 
     exp2.position.set(x, y);
    exp3 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/XyGIMu1.png'].texture);
     exp3.anchor.set(0.5, 0.7);
     exp3.scale.set(helperHeight(320)/exp3.width); 
     exp3.position.set(x, y);
     console.log('coord. of explosion: ' + exp3.getGlobalPosition());   //sprite.getGlobalPosition() works only with sprite
     
    var time = 400;

    expContainer.addChild(exp1);
    setTimeout(function(){
        expContainer.removeChild(exp1);
        expContainer.addChild(exp2);
        setTimeout(function(){
            expContainer.removeChild(exp2);
            expContainer.addChild(exp3);
            setTimeout(function(){
                expContainer.removeChild(exp3);
                //allobj.addChild(exp n);
            }, time);
        }, time);
    }, time);
}

//gets called in mouseDown  
function displayAward(i){
    awardText.text = awards[i];
   setTimeout(function(){
        awardText.text = '';
    }, 5000);
}

var seconds = 9;
function setTime(){
    gameStart.text = 'Game starts in: ' + seconds;
    seconds--;
}



//------------------------------------------------------------------------
//+++
//5.) game loop
//+++


//start gameLoop()  - gets called every 60 seconds
gameLoop();
console.log('loop started');

//looping function
function gameLoop(){
    requestAnimationFrame(gameLoop);

   if(frameCount>timerScreen1){
       eagle.visible = false;
       commanderTxt.visible = false;
       credits.visible = false;

       trump.visible = true;
       instructions.visible = true;
       if(frameCount%60 == 0){
           setTime();
       }
   }

    if(frameCount>timerScreen2){
        instructions.visible = false;

        scoreText.visible = true;
        scorePtText.visible = true;
        rdRect.visible = true;
        majorKong.visible = true;
       
    }

    if(score>30){
        allObj.visible = false;
        expContainer.visible = false;
        won1.visible = true;
        won2.visible = true;
    }

    frameCount++;
    renderer.render(stage);
}


