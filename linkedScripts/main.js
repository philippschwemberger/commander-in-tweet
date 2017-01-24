//this is the js which is doing all the pixi-work and receiving the tweet-data via socket.io

var sound = new Howl({
            src: ['/meetAgain.mp3']
          });

sound.once('load', function(){
    console.log('sound loaded')
    setTimeout(function(){
            sound.play();
        }, 10600);    //msec vs framecount!!!
       
});



var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor: 0x00ACED, resolution: 1, antialias: true});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
var allObj = new PIXI.Container();  //container for the diff parts of one tweet
var background = new PIXI.Container();  //if background pics and instructions text are not in different containers they disply in wrong order
var instructions = new PIXI.Container();

var trump;
var eagle;
var commanderTxt;
var majorKong;

var score = 0;
var timeBeforeStart = 200;
var timeForStartScreen = 500;

var timerScreen1 = 150;
var timerScreen2 = 700; //700

var maxTweets = 3;  //if there is no more space after 3 to 4 tweets they will overlap -- safetyBreak prevents the while loop from running more than n-times

var fontInstr = 'Press Start 2P';

//bombRiding
//'http://i.imgur.com/0tAhdzx.jpg'      --close shot
//'http://i.imgur.com/9etWRiY.jpg'      --distant shot

//load & place trump
//load explosions
PIXI.loader.add([   //only one loader function allowed
  'http://i.imgur.com/B6853Id.png', 'http://i.imgur.com/0tAhdzx.jpg', 'http://i.imgur.com/Ah0bauM.png', 'http://i.imgur.com/MbjpZIK.png', 'http://i.imgur.com/6msh6C3.png', 'http://i.imgur.com/iaJheYx.png', 'http://i.imgur.com/zYWTVSo.png', 'http://i.imgur.com/XyGIMu1.png', 
]).load(loadFinished); 
//this loads the image as webgl ready texture to >>PIXI.utils.TextureCache[nameOfFile]<<

function loadFinished(){
    console.log('pic loaded');

    //twitter eagle
    eagle = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/B6853Id.png'].texture);
    eagle.anchor.set(0.5, 0.5);
    eagle.scale.set(0.8, 0.8);
    eagle.position.set(window.innerWidth/2, window.innerHeight/2-100);

    commanderTxt = new PIXI.Text('COMMANDER-IN-TWEET', {fontFamily: "Kumar One"  , fontSize: 48, fontWeight : 'bold',fill: '#FFFFFF', dropShadow : true,
            dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6 });
    commanderTxt.anchor.set(0.5, 0.5);
    commanderTxt.position.set(window.innerWidth/2, window.innerHeight/2+180);


    //major kong
    majorKong = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/0tAhdzx.jpg'].texture);
    majorKong.anchor.set(0.5, 0.5);
    majorKong.scale.set(1.2, 1.2);
    majorKong.position.set(window.innerWidth/2, window.innerHeight/2);
    

    trump = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/MbjpZIK.png'].texture);
    trump.anchor.set(0.5, 1);
    trump.scale.set(0.5, 0.5);
    trump.position.set(window.innerWidth/2, window.innerHeight);
    stage.addChild(trump);

    

    background.addChild(eagle);
    background.addChild(commanderTxt);

    background.addChild(majorKong);
    background.addChild(trump);
    trump.visible = false;
    majorKong.visible = false;

    //the sprite is created when needed
    /*tweetTexture = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/6msh6C3.png'].texture);

    exp1 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/iaJheYx.png'].texture);
    exp2 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/zYWTVSo.png'].texture);
    exp3 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/XyGIMu1.png'].texture);*/
}





var count = 0;  //don't know why the event is triggered twice

var socket = io();   //io() creates an instance of socket.io that can listen to the customEvent 'stream', made in server.js
//socket.connect('http://localhost:8080');  //no need to specifying any URL here since it defaults to trying to connect to the host that serves the page.

//triggered everytime a 'stream' event == a tweet comes in
socket.on('stream', function(tweet){  
    

    count += 1; 
 
    if(count %2 == 0 && frameCount > timerScreen2 && allObj.children.length < maxTweets){  //make sure text is only printed once, and not more than the maxTweets are shown

        //1 obj represents: text, user, tweetTexture
        var obj = new PIXI.Container();

        var rectWidth = 500;    //measurements of tweetTexture
        var rectHeight = 197; //measurements of tweetTexture former 115;

     

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
                var x1 = allObj.getChildAt(i).getChildAt(0).getGlobalPosition().x;
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
     

  
        obj.addChild(tweetTexture);
        obj.addChild(username);
        obj.addChild(time);
        obj.addChild(message);

        //console.log(obj.toGlobal(0,0));   doesn't work with containers, only with sprites
    /*     console.log('X coord. of tweetTexture from obj: ' + obj.getChildAt(0).getGlobalPosition().x);  //I can't access via: obj.tweetTexture.getGlo...
         console.log('Y coord. of tweetTexture from obj: ' + obj.getChildAt(0).getGlobalPosition().y);*/

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
            scorePtText.text = score + ' points'

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
new Howl({src: ['/explosion.mp3'], volume: 0.3}).play();

    exp1 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/iaJheYx.png'].texture);
     exp1.anchor.set(0.5, 0.7);
     exp1.position.set(x, y);
    exp2 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/zYWTVSo.png'].texture);
     exp2.anchor.set(0.5, 0.7);
     exp2.position.set(x, y);
    exp3 = new PIXI.Sprite(PIXI.loader.resources['http://i.imgur.com/XyGIMu1.png'].texture);
     exp3.anchor.set(0.5, 0.7);
     exp3.position.set(x, y);
     console.log('coord. of explosion: ' + exp3.getGlobalPosition());   //works with sprite
     

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
    fontFamily : fontInstr,
    fontSize : '36px',
    fill : '#FFFFFF',
    dropShadow : true,
    dropShadowColor : '#000000',
    dropShadowAngle : Math.PI / 6,
    dropShadowDistance : 6,
    wordWrap : true,
    wordWrapWidth : 1500
};

//initial text        
var gameText = new PIXI.Text('Play the most overrated game on the web!', style);
        gameText.anchor.set(0.5, 0.5);
        gameText.position.set(window.innerWidth/2, window.innerHeight/2-250);

var hashtag = new PIXI.Text('#NotMyPresident', {fontFamily: fontInstr, fontSize: 36, fontStyle : 'italic', fontWeight : 'bold',fill: '#FF0000'});
        hashtag.anchor.set(0.5, 0.5);
        hashtag.position.set(window.innerWidth/2, window.innerHeight/2-130);

var instr = new PIXI.Text('Click on the incoming tweets to gain points!', {fontFamily: fontInstr, fontSize: 24, fill: '#00ACED' ,dropShadow : false,
            dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
        instr.anchor.set(0.5, 0.5);
        instr.position.set(window.innerWidth/2, window.innerHeight/2);

var bgIncomingTw = new PIXI.Graphics();
    bgIncomingTw.beginFill(0xFFFFFF);
    bgIncomingTw.drawRoundedRect(200, instr.position.y-25, 1125, 45, 10); // drawRoundedRect(x, y, width, height, radius)
    bgIncomingTw.endFill();

    

    instructions.addChild(bgIncomingTw);
    instructions.addChild(gameText);
    instructions.addChild(hashtag);
    instructions.addChild(instr);

    instructions.visible = false;
   

    //tricky with displaying order text in front of pics
    stage.addChild(background);
    stage.addChild(instructions);
    

//score:
var scoremsg = 'SCORE:';
var scoreText = new PIXI.Text(scoremsg, {fontFamily: fontInstr, fontSize: 24, fill: '#FFFFFF', 
    dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
        //scoreText.anchor.set(0.5, 0.5);
        scoreText.position.set(150, window.innerHeight-150);
    
    stage.addChild(scoreText);

var scorePt = score + ' points';
var scorePtText = new PIXI.Text(scorePt, {fontFamily: 'Press Start 2P', fontSize: 18, fill: '#FFFFFF', 
    dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 6});
        //scoreText.anchor.set(0.5, 0.5);
        scorePtText.position.set(150, window.innerHeight-100);

var rdRect = new PIXI.Graphics();
    rdRect.beginFill(0x00ACED);
    rdRect.drawRoundedRect(scorePtText.position.x-20, scorePtText.position.y-15, 190, 45, 10); // drawRoundedRect(x, y, width, height, radius)
    rdRect.endFill();
    
    stage.addChild(rdRect);
    stage.addChild(scorePtText);

scoreText.visible = false;
scorePtText.visible = false;
rdRect.visible = false;

    


//award words 7items
var awards = ["You have such great potential. But you are just sitting around and having a good time. So sad!", "you're highly overrated!",
  "Hmmm, not so bad. You want to be in my cabinet?", "BIGLY !!!", "AMAZING!", "TREMENDOUS!"]

var awardText = new PIXI.Text('', {fontFamily: "Arial", fontSize: 36, fontStyle : 'italic', fontWeight : 'bold', fill: '#00ACED' 
    /*, stroke : '#000000',strokeThickness : 1*/ ,dropShadow : true, dropShadowColor : '#000000', dropShadowAngle : Math.PI / 6, dropShadowDistance : 4,
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

   if(frameCount>timerScreen1){
       eagle.visible = false;
       commanderTxt.visible = false;

       trump.visible = true;
      
       instructions.visible = true;
   }

    if(frameCount>timerScreen2){
        
        instructions.visible = false;

        scoreText.visible = true;
        scorePtText.visible = true;
        rdRect.visible = true;
        majorKong.visible = true;
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

