/**
 * Created by ruwang on 7/8/15.
 */
var fs = require("fs");
var path = require("path");
var util = require("util");
var _ = require("lodash");

var banner = require("./Banner");
var server = require("./Server");

var fileStructure = {
    MY_DEPTH_FROM_ROOT : "..",
    LIB : "lib",
    CONFIG : "config",
    USER_MIDDLE_WARE : "middleware",
    ROUTES : "routes"
};

var packageJson = require(util.format("%s/package.json",fileStructure.MY_DEPTH_FROM_ROOT ));

//Lib loader
var loadLib = function(libPath) {
    util.log("Loading Libraries...");
    return buildStructureFromFileSet(loadFiles(libPath));
}

//User Middleware loader
var loadUserMiddleWare = function(userMiddlewarePath) {
  util.log("Loading User middleware...");
  return buildStructureFromFileSet(loadFiles(userMiddlewarePath));
}

//User Routes loader
var loadUserRoutes = function(routesFolderPath) {
  util.log("Loading User routes...");
  return buildStructureFromFileSet(loadFiles(routesFolderPath));
}

//Config Loader
var loadConfig = function(configPath) {
  util.log("Loading Configs...");
  return buildStructureFromFileSet(loadFiles(configPath));
}

var buildStructureFromFileSet = function(fileSet) {
  var structure = {};
  if(!_.isEmpty(fileSet)) {
    _.forEach(fileSet, function (modulePath, varName) {
      structure[varName] = require(modulePath);
    });
  }
  return structure;
}
var loadFiles = function(relativePathFromKernal) {
    var fileList = fs.readdirSync(path.resolve(relativePathFromKernal));
    var fileSet = {};
    _.forEach(fileList, function(file){
        if(path.extname(file).toLowerCase() == ".js") {
          fileSet[path.basename(file, '.js')] =
                util.format("%s%s%s", fileStructure.MY_DEPTH_FROM_ROOT,path.sep, path.join(relativePathFromKernal, path.basename(file, '.js') ));
        }
    });
    return fileSet;
}



var kernel = function() {
    var pub = {};
    pub.start = function() {
        util.log(banner.display(packageJson.ev));
        var completeDependencies = {
          Lib  :  loadLib(fileStructure.LIB),
          Config : loadConfig(fileStructure.CONFIG),
          User : {
            Middleware: loadUserMiddleWare(fileStructure.USER_MIDDLE_WARE),
            Routes: loadUserRoutes(fileStructure.ROUTES)
          },
          PackageJson : packageJson,
          Logger : util.log
        }
        util.log("Starting ever...");
        server.startServer(completeDependencies);
    };
    return pub;
}

module.exports = kernel();