'use strict'
var fs = require("fs");
var path = require("path");
var util = require("util");
var _ = require("lodash");

var banner = require("./Banner");
var server = require("./Server");

var kernel = function() {
  var self = {};
  var pub = {};

  //Folder structure
  self.fileStructure = {
    MY_DEPTH_FROM_ROOT : "..",
    LIB : "lib",
    RESTIFY_CONFIG : "restifyConfig",
    USER_MIDDLE_WARE : "middleware",
    ROUTES : "routes/Routes.js",
    USER_FILTERS : "filters",
    GLOBAL_CONFIG : "config"
  };
  
  //File Extensions
  self.fileExtensions = {
    JAVASCRIPT : ".js",
    JSON : ".json"
  }

  //Need package json
  self.packageJson = require(util.format("%s/package.json", self.fileStructure.MY_DEPTH_FROM_ROOT ));

  //Lib loader
  self.loadLib = function(libPath) {
    util.log("------------------------------");
    util.log("Loading Libraries...");
    return self.buildStructureFromFileSet(self.loadFiles(libPath));
  }

  //User Middleware loader
  self.loadUserMiddleWare = function(userMiddlewarePath) {
    util.log("------------------------------");
    util.log("Loading User middleware...");
    return self.buildStructureFromFileSet(self.loadFiles(userMiddlewarePath));
  }

  //Filter Loader
  self.loadUserFilters = function(filterPath) {
    util.log("------------------------------");
    util.log("Loading User filters...");
    return self.buildStructureFromFileSet(self.loadFiles(filterPath));
  }

  //User Routes loader
  self.loadUserRoutes = function(routesFolderPath, dependencies) {
    util.log("------------------------------");
    util.log("Loading User routes...");
    var router = require(routesFolderPath).getRoutes(dependencies);
    return router;
  }

  //Restify Config Loader
  self.loadResifyConfig = function(configPath) {
    util.log("------------------------------");
    util.log("Loading Restify Configs...");
    return self.buildStructureFromFileSet(self.loadFiles(configPath));
  }

 //Global Config Reader
  self.loadGlobalConfig = function() {
    util.log("------------------------------");
    util.log("Loading Global Configs...");
    return require('config');
  }
    
  self.buildStructureFromFileSet = function(fileSet) {
    var structure = {};
    if(!_.isEmpty(fileSet)) {
      _.forEach(fileSet, function (modulePath, varName) {
        util.log("\t[" + varName + "] => " + modulePath);
        structure[varName] = require(modulePath);
      });
    }
    return structure;
  }

  self.loadFiles = function(relativePathFromKernal, fileExtensionFilter) {
    var fileExtension = fileExtensionFilter ? fileExtensionFilter : self.fileExtensions.JAVASCRIPT;
    var fileList = fs.readdirSync(path.resolve(relativePathFromKernal));
    var fileSet = {};
    _.forEach(fileList, function(file){
      if(path.extname(file).toLowerCase() == fileExtension) {
        fileSet[path.basename(file, fileExtension)] =
          util.format("%s/%s", self.fileStructure.MY_DEPTH_FROM_ROOT, path.join(relativePathFromKernal, path.basename(file, fileExtension) ));
      }
    });
    return fileSet;
  }

  pub.start = function() {
    util.log(banner.display(self.packageJson));
    
    /************************************
     * Making the global config folder content available global
     */
    GLOBAL.GlobalConfig = self.loadGlobalConfig();
    /*
    *End of assignment
    */
    
    /************************************
     * Making the lib folder content available global
     */
    GLOBAL.Lib = self.loadLib(self.fileStructure.LIB);
    /*
    *End of assignment
    */

    var config = self.loadResifyConfig(self.fileStructure.RESTIFY_CONFIG);
    
    var userMiddleware = self.loadUserMiddleWare(self.fileStructure.USER_MIDDLE_WARE);
    var userFilters = self.loadUserFilters(self.fileStructure.USER_FILTERS);
    var routes = self.loadUserRoutes(
      util.format("%s/%s", self.fileStructure.MY_DEPTH_FROM_ROOT, self.fileStructure.ROUTES),
      {
        UserFilters : userFilters,
        userMiddleWare: userMiddleware,
        log: util.log
      }
    );
    util.log("Starting ever...");
    util.log("------------------------------");
    server.startServer({
      Config : config,
      User : {
        Middleware: userMiddleware,
        Filters : userFilters,
        Routes: routes
      },
      PackageJson : self.packageJson,
      Logger : util.log
    });
  }

  return pub;
}

module.exports = kernel();