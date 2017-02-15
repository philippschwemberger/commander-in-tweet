COMMANDER-IN-TWEET
==================
Is a **browser game** created with **node.js**, **socket.io** and **pixi.js** using the **twitter API** to get the latest tweets about *#Whateveryoulike*  

If you want to feel as powerful as the american president, or if you're just wondering what the main tasks of an american precidency are nowadays, you should definitely check this out. 

##Description:  
First we set up an HTTP server in the server-side part of the application and establish a connection to twitter's streaming API to get twitter messages in real time. Every time a twitter message with a certain # (predefined in **config.js**) is detected we transfer the author's name, and the message's contenct to the client-side via a socket connection.  
Now the received info gets displayed onto the browser window unsing pixi.js. It won't be more than 3 tweets at a time to ensure the readability. Now it's the player's turn to click on the tweets in order to atomize them and gain points.

##Installation:  
**Requirements:**  

1. **node.js** has to be installed. If you haven't already, download it here: https://nodejs.org/en/download/  
2. You need a **twitter Account to authenticate** with your personal consumer key and access token. You can find your keys at: https://dev.twitter.com/ at the very bottom under *Tools* -> *Manage my Apps*

####How to install:  
1. **clone** or **download** the repository  
  
2. unzip and navigate to the downloaded folder  
  
3. open **yourKeys.js**, insert your personal authentication keys and save the file
  
4. navigate via the terminal or your favorite command-line interface to the downloaded folder: $ cd 'pathOfFolder'  or  > cd 'pathOfFolder' (make sure you navigated to the folder with README.md in it)   

4. in the CLI, insert: $ **npm install**  (this installs the packages in the "dependencies" of package.json)

5. and afterwards: $ **node server.js** -> this will start the server program.  

6. redirect your browser to http://localhost:8080  
  
**CONGRATULATIONS!** Now you are the commander-in-tweet.

###Attribution:
"[Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb (1964)](https://www.flickr.com/photos/tom-margie/4050083521)" by [Insomnia Cured Here](https://www.flickr.com/photos/tom-margie/) is licensed under CC BY-SA 2.0  
"[The Donald Trump](https://www.flickr.com/photos/joeshlabotnik/360480150/)" by [Joe Shlabotnik](https://www.flickr.com/photos/joeshlabotnik/) is licensed under CC BY 2.0 / picture is cut out and modified

