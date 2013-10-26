Exosphere-Bootstrap-Template
============================

A starter template using Twitter Bootstrap, Node.js, and Express

Anything that ```looks like this``` is a command you should run in your console (Terminal on OSX)

### Getting Started (A Simple Static Website) ###

- Check out this repo: ```git clone https://github.com/SteveJohnson/Exosphere-Bootstrap-Template```
- Go into the repo directory: ```cd Exosphere-Bootstrap-Template```
- Install any required node modules as detailed in the package.json file 
([Forever](https://github.com/nodejitsu/forever), 
[Express](http://expressjs.com/), 
[MongoDB](http://www.mongodb.org/),
[Monk](https://github.com/LearnBoost/monk)) 
```npm install```
- Launch the app: ```node app/simple.js```
- [See it in action! (http://localhost:3000)](http://localhost:3000)
- [See it in action! (http://localhost:3000/html/index.htm)](http://localhost:3000/html/index.htm)
- When you want to stop your app, press (Control and C at the same time) ```Ctrl-C```


### A Simple Static Website (with Pretty URLs!) ###

- [EJS](http://embeddedjs.com/) was already installed with ```npm install``` (as well as included within the node_modules directory). Check out the package.json file to understand dependencies
- Launch the app: ```node app/prettyurls.js```
- [See it in action! (http://localhost)](http://localhost)
- [See it in action! (http://localhost/login)](http://localhost/login)
- When you want to stop your app, press (Control and C at the same time) ```Ctrl-C```


### User Authentication and Storage with MongoDB ###

- [MongoDB](http://www.mongodb.org/) was already installed with ```npm install``` (as well as included within the node_modules directory). Check out the package.json file to understand dependencies
- Launch the app: ```node app/mongodb.js```
- [See it in action! (http://localhost)](http://localhost)
- When you want to stop your app, press (Control and C at the same time) ```Ctrl-C```

### Extras! ###

- Launch your app in the background ```node app/simple.js &```
- See all the running node processes ```node_modules/forever/bin/forever list```
- Install Forever globally so you can type ```forever list``` by running ```sudo npm install -g forever```


### Troubleshooting ###
- If you are on OSX and get an error like: "(libuv) Failed to create kqueue (24)" when running ```node_modules/forever/bin/forever list```, run this command ```ulimit -n 8192```. That will increase the number of open files your system allows


### Additional Notes ###

- lib/bootstrap is a Git submodule of https://github.com/twbs/bootstrap
- assets/ contains the contents of lib/bootstrap/dist and lib/bootstrap/js