#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var ncp = require('ncp').ncp;
var path = require('path');
var currentPath = path.resolve(process.cwd());
var fwFolder = path.join(path.resolve(__dirname, ".."),"fw");
var packageJson = require("../package.json");

var everFwBuild = {
  create : function() {
    console.log("ever-js cli");
    console.log("=============");
    console.log("Copying the framwork structure");
    console.log("To : " + currentPath );
    ncp(fwFolder, currentPath, function (err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Framework setting-up completed");
        console.log("Please run following commands to begin");
        console.log("node install");
        console.log("node start");
      }
    });
  },
  help : function() {
    console.log("Please run ", "everjs init");
  }
}

program
  .version(packageJson.version, "-v, --version")
  .option("-i, --init", "Create new project")
  .parse(process.argv);

if(program.init) {
  everFwBuild.create();
} else {
  everFwBuild.help();
}


