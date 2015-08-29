'use strict'
var _ = require("lodash");
var fs = require("fs");
var path = require("path");
var util = require("util");
var rimraf = require("rimraf");

var banner = require("./Banner");
var server = require("./Server");

var kernel = function() {
  var self = {};
  var pub = {};

  //Folder structure
  self.fileStructure = {
    MY_DEPTH_FROM_ROOT : "..",
    LIB : "lib",
    USER_MIDDLE_WARE : "middleware",
    ROUTES : "routes/Routes.js",
    USER_FILTERS : "filters",
    RESTIFY_CONFIG : "configuration/RestifyConfig.js",
    GLOBAL_CONFIG : "configuration/global",
    COMMONG_CONFIG_FILE_NAME : "common.json",
    COMMONG_CONFIG_FILE_KEY : "Common",
    BUILD_CONFIG_FOLDER_PATH : "config"
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
    return {
      RestifyConfig : require(configPath)
    }
  }

 //Global Config Reader
  self.loadGlobalConfig = function(configPath) {
    util.log("------------------------------");
    util.log("Loading Global Configs...");
    self.mergeConfigFiles(configPath, self.fileExtensions.JSON);
    return require('config');
  }
      
  //Load Database handlers
  self.dbHandlers = function(dep) {
    util.log("------------------------------");
    util.log("Loading DB hanlders");
    util.log("checking for configuration settings");
    
    if(GlobalConfig.Common.db_handlers) {
      var handlerSet = {};
      util.log("Loading DB handlers");
      _.forEach(GlobalConfig.Common.db_handlers, function(handlerConfig, handlerName) {
          util.log("Checking handler : "+handlerName);
          if(handlerConfig.enable == true) {
            util.log("Handler is enabled");
            util.log("Loading corresponding library");
            util.log("Library ->" + handlerConfig.libPath);
            handlerSet[handlerName] = require(handlerConfig.libPath);
            handlerSet[handlerName].init(dep);
          } else {
            util.log("Handler is disabled");
          }
      });
      return handlerSet;
    } else {
      util.log("DB handlers are not defined");
      return null;
    }

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
  
  self.mergeConfigFiles = function(configPath, fileExtension) {
    /*
    Cleaing the old config folder
    */
    self.cleanConfigFolder(self.fileStructure.BUILD_CONFIG_FOLDER_PATH);
    /*
    Building a config folder
    */
    self.buildConfigFolder(self.fileStructure.BUILD_CONFIG_FOLDER_PATH);
    
    /*
    Reading the commong json file
    */
    var commonJsonFilePath  = path.join(
      configPath, self.fileStructure.COMMONG_CONFIG_FILE_NAME
    );
    var commongJsonFile =  fs.readFileSync(commonJsonFilePath);
    var commonJson = JSON.parse(commongJsonFile);
    
    /*
    End of Reading commong json
    */
    
    var fileList = fs.readdirSync(path.resolve(configPath));
    _.forEach(fileList, function(file) {
      if(
          path.extname(file).toLowerCase() == fileExtension && 
          file != self.fileStructure.COMMONG_CONFIG_FILE_NAME
        ) {
          var fileContent = fs.readFileSync(path.join(
              configPath, file
          ));
          var jsonContent = JSON.parse(fileContent);
          jsonContent[self.fileStructure.COMMONG_CONFIG_FILE_KEY] = commonJson;
          self.writeJson(path.join(path.resolve(self.fileStructure.BUILD_CONFIG_FOLDER_PATH), file), 
            JSON.stringify(jsonContent));
      }
    });
    
  }
  
  self.cleanConfigFolder = function(buildConfigPath) {
    util.log("------------------------------");
    util.log("Cleaning Global Configs...");
    rimraf.sync(buildConfigPath);
  }

  self.buildConfigFolder = function(buildConfigPath) {
    util.log("------------------------------");
    util.log("Build Global Configs...");
    fs.mkdirSync(buildConfigPath);
  }
  
  self.writeJson = function(filePath, fileContent) {
    fs.writeFileSync(filePath, fileContent);
  }
  
  pub.start = function() {
    util.log(banner.display(self.packageJson));
    /************************************
    * Favourite Utility module assigning to Global Object
    */
     GLOBAL._ = _;
    /*
    *End of assignment
    */    
    
    /************************************
     * Making the global config folder content available globally
     */
    GLOBAL.GlobalConfig = self.loadGlobalConfig(self.fileStructure.GLOBAL_CONFIG);
    /*
    *End of assignment
    */
    
    /************************************
     * Making the Database handlers available globally
     */
    GLOBAL.Dbh = self.dbHandlers({
      Logger : util
    });
    /*
    *End of assignment
    */
    
    
    /************************************
     * Making the lib folder content available globally
     */
    GLOBAL.Lib = self.loadLib(self.fileStructure.LIB);
    /*
    *End of assignment
    */

    var config = self.loadResifyConfig(
      util.format("%s/%s", self.fileStructure.MY_DEPTH_FROM_ROOT, self.fileStructure.RESTIFY_CONFIG)
    );
    
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