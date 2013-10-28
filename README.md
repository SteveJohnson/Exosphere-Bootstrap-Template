Exosphere-Bootstrap-Template
============================

A starter web template using:
- [Node.js](http://nodejs.org/) - "a platform built for easily building fast, scalable network applications"
- [Bootstrap](http://getbootstrap.com/) - "front-end framework for faster and easier web development"
- [MongoDB](http://www.mongodb.org/) - "the leading NoSQL document database"

### Getting Started ###

##### Anything that ```looks like this``` is a command you should run in your console (Terminal on OSX) #####

1. Install Git
  - Windows
    1. Download and install: http://msysgit.github.com/
  - OSX
    1. Install MacPorts: http://www.macports.org/install.php
    2. ```sudo port install git-core +svn +doc +bash_completion +gitweb```
2. Install Node.js
  - Windows
    1. Download and install: http://nodejs.org/download/
  - OSX
    1. ```sudo port install nodejs```
3. Install MongoDB
  - Windows
    1. Download and install: http://www.mongodb.org/downloads
  - OSX
    1. ```sudo port install mongodb```
4. Check out this repo: ```git clone https://github.com/SteveJohnson/Exosphere-Bootstrap-Template```

### A Simple Static Website ###

- Go into the repo directory: ```cd Exosphere-Bootstrap-Template```
- Install any required node modules as detailed in the package.json file

  - [Forever](https://github.com/nodejitsu/forever)
  - [Express.Io](https://github.com/techpines/express.io) (a combination of [Express](http://expressjs.com/) and [Socket.Io](https://github.com/LearnBoost/socket.io)
  - [MongoDB](http://www.mongodb.org/)
  - [Monk](https://github.com/LearnBoost/monk)

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


### Saving State with MongoDB ###

- [MongoDB](http://www.mongodb.org/) was already installed with ```npm install``` (as well as included within the node_modules directory). Check out the package.json file to understand dependencies
- Launch the app: ```node app/mongodb.js```
- [See it in action! (http://localhost/vote)](http://localhost/vote)
- When you want to stop your app, press (Control and C at the same time) ```Ctrl-C```


### Extras! ###

- Launch your app in the background ```node app/simple.js &```
- See all the running node processes ```node_modules/forever/bin/forever list```
- Install Forever globally so you can type ```forever list``` by running ```sudo npm install -g forever```


### Troubleshooting ###
- If you are on OSX and get an error like: "(libuv) Failed to create kqueue (24)" when running ```node_modules/forever/bin/forever list```, run this command ```ulimit -n 2048```. That will increase the number of open files your system allows


### Additional Notes ###

- lib/bootstrap is a Git submodule of https://github.com/twbs/bootstrap - download it with ```git submodule init && git submodule update```
- assets/ contains the contents of lib/bootstrap/dist and lib/bootstrap/js