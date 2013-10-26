Exosphere-Bootstrap-Template
============================

A starter template using Twitter Bootstrap


### Getting Started ###

Run the following commands in your console (Terminal on OSX)

- Check out this project: 

```git clone https://github.com/SteveJohnson/Exosphere-Bootstrap-Template```
- Go into the project directory: ```cd Exosphere-Bootstrap-Template```
- Install any required node modules as detailed in the package.json file ```npm install```
- Install [Forever](https://github.com/nodejitsu/forever) - a utility that keeps your node app running... forever :) : ```npm install forever -g```
- Launch the app and tell forever to monitor the directory for changes so they'll be deployed automatically: ```forever start -w app/app.js```
- [See it in action!](http://localhost:3000)


### Additional Notes ###

- lib/bootstrap is a Git submodule of https://github.com/twbs/bootstrap
- assets/ contains the contents of lib/bootstrap/dist and lib/bootstrap/js